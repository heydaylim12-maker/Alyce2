# english-sentence-completion

영어 미완성 문장을 학생이 완성하면 AI 코치가 문법·자연스러움·더 나은 표현을 한국어로 피드백하는 웹앱입니다.

## 폴더 구조

```
english-sentence-completion/
├── api/
│   └── coach.js      # Vercel 서버리스 함수 (/api/coach)
├── index.html        # 화면
├── vercel.json       # 함수 설정 (최대 30초)
├── package.json
└── .gitignore
```

> `api` 폴더와 `vercel.json`은 반드시 저장소 **최상위**에 있어야 합니다.

## 배포 방법

1. GitHub에 새 저장소 `english-sentence-completion`을 만들고 이 파일들을 그대로 올립니다.
2. Vercel → Add New → Project → 저장소 선택 → Framework Preset: **Other**, Root Directory: 비워 둠(`./`).
3. Settings → Environment Variables에 추가합니다.
   - Name: `ANTHROPIC_API_KEY`
   - Value: 본인 API 키 (https://console.anthropic.com 에서 발급)
4. Deploy를 누릅니다. 환경변수를 나중에 추가했다면 **Redeploy**해야 적용됩니다.

## 문제 수정

`index.html`의 `PROMPTS` 목록에서 난이도별 문장을 바꾸거나 추가하면 됩니다.
