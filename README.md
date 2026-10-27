# 플레이랩 · 교사용 수정 및 배포 안내

고등학생이 게임 아이디어를 입력해 AI에게 붙여넣을 프롬프트를 만드는 정적 웹사이트입니다.
현재 기본 프롬프트는 임시 문구입니다. 수업 전에 js/config.js에서 교체하세요.

## 파일 구성

- index.html: 학생 화면과 안내 문구
- css/styles.css: 색상, 글자 크기, 모바일·태블릿 배치
- js/config.js: 입력 항목, 임시 기본 프롬프트, AI 공식 링크
- js/prompt.js: 입력 검증과 문자열 치환
- js/app.js: 화면 표시, 재생성, 복사, 수동 선택
- assets/favicon.svg: 사이트 아이콘
- .nojekyll: GitHub Pages에서 정적 파일을 그대로 제공하는 표시
- QA.md: 확인 결과와 수업 전 점검 사항

설치와 빌드 과정이 없습니다. index.html을 브라우저로 열어 내용을 확인할 수 있습니다.
파일을 직접 열었을 때 자동 복사가 막히면 전체 선택 후 수동 복사를 사용하세요.
배포한 HTTPS 사이트에서는 클립보드 API를 사용하며, 브라우저에서 거부하면 수동 복사 안내가 나타납니다.
입력은 메모리에서만 처리합니다. 새로고침하거나 페이지를 닫으면 사라집니다.
AI 공식 링크를 열 때 입력 내용이나 프롬프트가 자동 전송되지 않습니다.
학생이 직접 AI에 붙여넣은 내용에는 해당 AI 서비스 정책이 적용됩니다.

## 기본 프롬프트 교체

1. js/config.js를 엽니다.
2. template: 뒤의 백틱 두 개 사이에 있는 문구를 교체합니다.
3. {{GAME_NAME}}과 {{GAME_FEATURES}}를 원하는 위치에 유지합니다.
4. 저장하고 게임 이름만 넣은 경우와 특징도 넣은 경우를 각각 확인합니다.

백틱 문자 자체는 역슬래시로 이스케이프해야 합니다. 달러 기호와 여는 중괄호가 연달아 나오는 문구도 JavaScript 템플릿 문법으로 해석되지 않게 이스케이프해야 합니다.
문법 수정이 어렵다면 GPT에게 “현재 config.js 구조와 두 치환 표시는 유지하고 template 문구만 다음 내용으로 바꿔 줘”라고 요청하세요.

선택 입력이 비면 fields의 fallback 문구를 사용합니다.
현재 입력 길이는 게임 설명 300자, 특징 3,000자입니다. fields의 maxLength로 변경합니다.

## 안내 문구와 디자인 수정

- 화면 제목, 이용 순서, 수업 팁: index.html
- 입력창 제목, 예시, 도움말: js/config.js의 fields
- 복사 성공·오류 안내: js/app.js
- 대표 색상: css/styles.css 맨 위의 --primary와 --primary-dark
- 배경: --page / 본문 색: --ink / 최대 가로 폭: --width

외부 폰트나 이미지 요청 없이 시스템 글꼴과 자체 SVG·CSS 그래픽을 사용합니다.
입력 글자는 16px이며 주요 버튼은 높이 52px, 예시 버튼은 최소 44px입니다.
700px 이하에서 입력과 결과를 위아래로 배치합니다.

## 입력 항목 추가

config.js의 fields 배열에 아래처럼 새 항목을 추가하고 template에 {{GAME_STYLE}}를 넣습니다.

    {
      key: 'GAME_STYLE',
      id: 'game-style',
      label: '원하는 분위기',
      required: false,
      rows: 3,
      maxLength: 500,
      placeholder: '예: 밝고 귀여운 우주',
      hint: '색감과 분위기를 적어 주세요.',
      fallback: '게임에 어울리는 분위기로 제안해 주세요.'
    }

key는 영문 대문자·숫자·밑줄을 사용하고, key와 id는 기존 항목과 겹치지 않게 합니다.
현재처럼 텍스트 입력 항목은 화면 코드 변경 없이 자동으로 추가됩니다.
템플릿에 없는 key를 쓰면 교사가 설정을 확인할 수 있도록 오류를 표시합니다.

## GitHub Pages 무료 배포

GitHub Free로 무료 배포하려면 공개(Public) 저장소를 사용합니다.
배포할 것은 이 폴더의 내용입니다. 압축파일 자체를 저장소에 올리지 마세요.

1. 교사 GitHub 계정으로 로그인하고 새 Public 저장소를 만듭니다. 이름 예: vibe-game-lab.
2. 압축을 풀고 index.html, css, js, assets, .nojekyll, 안내서 파일을 저장소 최상위에 업로드합니다.
   index.html이 vibe-game-lab이라는 하위 폴더 안에 한 번 더 들어가지 않도록 주의하세요.
3. Commit changes로 저장합니다.
4. 저장소 Settings → Pages → Build and deployment에서 Source를 Deploy from a branch로 선택합니다.
5. Branch를 main, 폴더를 /(root)로 선택한 뒤 Save를 누릅니다.
6. Pages에 표시된 HTTPS 주소로 접속합니다. 보통 https://계정명.github.io/저장소이름/ 형태입니다.
7. Actions 또는 Pages에서 배포 완료를 확인합니다. 변경 반영에는 최대 10분가량 걸릴 수 있습니다.
8. 스마트폰·태블릿에서 접속해 생성·복사·AI 링크를 확인한 뒤 학생에게 주소를 공유합니다.

동일 저장소의 파일을 수정하고 Commit하면 같은 주소에 업데이트됩니다.
주소를 유지하려면 계정명과 저장소 이름을 유지하세요. 이전 버전은 GitHub 커밋 기록에서 되돌릴 수 있습니다.
화면이 이전 상태라면 새로고침하거나 브라우저 캐시를 지운 뒤 확인하세요.
404가 나오면 배포 브랜치·폴더와 최상위 index.html 위치를 확인하세요.
이 프로젝트는 상대 경로를 사용하므로 저장소 이름이 붙는 주소에서도 동작합니다.

공식 안내: https://docs.github.com/en/pages/quickstart
배포 원본 설정: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## 향후 확장

프롬프트 생성 함수와 화면 코드를 분리했습니다. 갤러리·추천·관리자 화면은 별도 모듈로 추가할 수 있습니다.
현재 로그인, API 키, 백엔드, 데이터베이스, 갤러리, 업로드 기능은 없습니다.
여러 학생이 공유하는 등록·추천 데이터를 운영하려면 향후 별도 저장 방식과 관리 권한을 결정해야 합니다.
GitHub Pages만으로 서버 측 비밀 키나 관리자 인증을 안전하게 운영할 수 있다고 가정하지 마세요.

## 수업 전 확인

필수 입력 누락 안내, 특징 생략 시 문구, 재생성, 복사 후 AI에 붙여넣기, 복사 거부 시 수동 선택을 확인하세요.
각 AI의 계정·무료 이용 범위·미리보기·파일 실행 가능 여부는 수업 당일 학교 환경에서 확인하세요.

