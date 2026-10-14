// Vercel Serverless Function: /api/coach
// 학생의 문장완성 답안을 받아 AI 코치 피드백을 돌려줍니다.
// 환경변수 ANTHROPIC_API_KEY 필요 (Vercel > Settings > Environment Variables)

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST 요청만 가능합니다." });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "서버에 ANTHROPIC_API_KEY가 설정되지 않았습니다." });
  }

  const { prompt, answer, level } = req.body || {};
  if (!prompt || !answer) {
    return res.status(400).json({ error: "문제(prompt)와 답안(answer)이 필요합니다." });
  }
  if (String(answer).length > 500) {
    return res.status(400).json({ error: "답안은 500자 이내로 입력하세요." });
  }

  const system = `You are a friendly English writing coach for Korean high school students.
The student completes an unfinished English sentence. Evaluate it and reply ONLY in JSON:
{"score": 1-5, "grammar": "문법 피드백 (한국어)", "naturalness": "자연스러움 피드백 (한국어)", "better": "a more natural English version", "tip": "한 줄 학습 팁 (한국어)"}
Be encouraging. Level: ${level || "intermediate"}.`;

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-5-5",
        max_tokens: 600,
        system,
        messages: [
          {
            role: "user",
            content: `Unfinished sentence: "${prompt}"\nStudent's completed sentence: "${answer}"`,
          },
        ],
      }),
    });

    if (!r.ok) {
      const detail = await r.text();
      return res.status(502).json({ error: "AI 서버 오류", detail });
    }

    const data = await r.json();
    const text = (data.content?.[0]?.text || "").trim();
    const match = text.match(/\{[\s\S]*\}/);
    const feedback = match ? JSON.parse(match[0]) : { tip: text };

    return res.status(200).json(feedback);
  } catch (err) {
    return res.status(500).json({ error: "피드백 생성 중 오류가 발생했습니다.", detail: String(err) });
  }
}
