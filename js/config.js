/* 교사용 설정. {{KEY}}는 fields의 key와 연결됩니다.
 * template의 백틱 사이를 수업용 프롬프트로 교체하세요. */
window.PLAYLAB_CONFIG = {
  fields: [
    {key:'GAME_NAME', id:'game-name', label:'만들고 싶은 게임', required:true, rows:2, maxLength:300,
      placeholder:'예: 장애물을 피하며 별을 모으는 우주선 게임', hint:'어떤 게임인지 한두 문장으로 자유롭게 적어 주세요.',
      examples:['우주선 장애물 피하기','미로 탈출 게임','발판 점프 게임','물리 퍼즐 게임']},
    {key:'GAME_FEATURES', id:'game-features', label:'게임의 특징 및 추가 요구사항', required:false, rows:5, maxLength:3000,
      placeholder:'예: 화면을 터치해서 조작하고 싶어요.\n시간이 지날수록 어려워지면 좋겠어요.\n귀여운 도트 그래픽을 사용해 주세요.', hint:'조작 방법, 그래픽, 난이도 등 떠오르는 것을 적어 주세요.',
      fallback:'추가 요구사항은 없습니다. 게임에 어울리는 간단한 기본 규칙을 제안해 주세요.'}
  ],
  // 임시 기본 프롬프트 — 교사가 추후 수정할 부분입니다.
  template:`너는 프로그래밍을 처음 배우는 고등학생을 돕는 웹 게임 제작 도우미야.
아래 아이디어를 바탕으로 스마트폰과 태블릿에서 즐길 수 있는 웹 게임을 만들어 줘.

내가 만들고 싶은 게임:
{{GAME_NAME}}

게임의 특징 및 추가 요구사항:
{{GAME_FEATURES}}

제작 조건:
1. HTML, CSS, JavaScript로 작성하고, 하나의 HTML 파일에 모든 코드를 포함해 줘.
2. 유료 API, 서버, 데이터베이스, 외부 라이브러리 없이 브라우저에서 실행되게 해 줘.
3. 스마트폰과 태블릿을 우선 고려해 줘. 키보드 없이도 터치 버튼으로 조작할 수 있고, 가로·세로 화면에 맞춰 화면 크기가 조정되게 해 줘.
4. 게임 방법, 시작 버튼, 점수 또는 진행 상황, 게임 종료와 다시 시작 기능을 넣어 줘.
5. 화면 밖으로 내용이 넘치지 않게 하고, 터치 버튼과 안내 글씨를 충분히 크게 만들어 줘.
6. 외부 이미지나 음원 다운로드 없이 CSS, SVG 또는 Canvas로 그래픽을 표현해 줘.
7. 오류 없이 실행할 수 있는 완전한 코드를 제공하고, 초보자도 바꿀 수 있도록 필요한 주석을 달아 줘.

먼저 게임 규칙과 조작법을 짧게 설명하고 완성된 코드를 제공해 줘.
사용 중인 AI 서비스에서 미리보기나 파일 저장이 가능한 경우 그 방법을 설명해 줘. 해당 기능이 없다면 현재 사용하는 기기에서 HTML을 실행할 수 있는 방법을 안내해 줘. 기능을 사용할 수 있다고 단정하지 마.
수정이 필요하면 내가 원하는 변화를 말할 수 있도록 쉬운 한국어로 안내해 줘.`,
  services:[
    {name:'ChatGPT',mark:'◎',color:'mint',url:'https://chatgpt.com/'},
    {name:'Google Gemini',mark:'✦',color:'blue',url:'https://gemini.google.com/'},
    {name:'Claude',mark:'✳',color:'peach',url:'https://claude.ai/'}
  ]
};
