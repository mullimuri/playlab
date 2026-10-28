# HTML 실행기 사용·업데이트 안내

## 학생 사용 순서

1. 메인 페이지의 **HTML 실행기**를 엽니다.
2. AI가 만든 전체 HTML 코드를 붙여넣습니다. 또는 **HTML 파일 선택**으로 기기의 파일을 읽습니다.
3. **게임 실행하기**를 누릅니다.
4. 게임 안에 시작 버튼이 있으면 눌러 플레이합니다.
5. 모바일에서는 **화면 확대**를 사용합니다. 위쪽 **화면 축소**로 돌아옵니다.
6. 코드를 수정했다면 다시 실행합니다. **중지**는 실행 화면을 제거합니다.

**예시 불러오기 → 게임 실행하기**로 터치 별 잡기 게임을 확인할 수 있습니다.
examples/star-game.html은 같은 게임을 별도 파일로 제공한 것입니다.
파일은 .html 또는 .htm 확장자, UTF-8, 최대 2MB를 지원합니다.
코드 블록 전체가 세 개의 백틱으로 둘러싸인 경우 그 감싸기 표시는 자동으로 제거합니다.
AI 설명문과 여러 코드 블록이 섞여 있으면 HTML 부분만 복사해 주세요.

## 아이폰 사용

파일 앱의 미리보기로 HTML을 실행하는 방식 대신, 배포된 실행기 주소를 Safari에서 열어 사용합니다.
코드를 붙여넣거나 파일 앱에 저장된 HTML을 선택합니다. iCloud 파일은 기기에 다운로드한 뒤 선택해 보세요.
페이지 내 확대 방식이므로 iPhone의 Fullscreen API 지원에 의존하지 않습니다.
가로·세로 회전 시 실행 화면 크기는 바뀌지만, 게임 자체도 반응형이어야 화면이 맞습니다.
오디오가 있다면 게임 안의 시작 버튼을 먼저 누르고 기기 음량·무음 상태를 확인합니다.
모든 iPhone·iOS 버전에서 동작한다고 보장하지 않습니다. 실제 수업 기기로 배포 주소를 확인하세요.

## 기존 GitHub Pages에 적용

업데이트된 vibe-game-lab 폴더 **안의 내용물**을 기존 저장소 최상위에 올리면 됩니다.
새 폴더를 한 겹 더 만들지 마세요. 저장소 이름과 Pages 설정은 그대로 유지합니다.

추가 파일:
- runner.html
- css/runner.css
- js/runner-core.js
- js/runner-example.js
- js/runner.js
- examples/star-game.html
- HTML-실행기-안내.md
- QA.md

수정 파일:
- index.html: 상단 메뉴와 실행기 이동 카드 추가
- README.md: 실행기 안내 연결

필수 실행 파일은 runner.html과 css/runner.css, js/runner-*.js입니다.
기존 css/styles.css와 assets/favicon.svg도 함께 있어야 합니다.
압축파일을 받았다면 먼저 압축을 푼 다음 파일을 올리세요. ZIP 자체를 올리면 실행되지 않습니다.
코드를 직접 수정한 온라인 버전이 있다면 이 파일들과 비교한 뒤 반영하세요.
공개 사이트에 실제 적용하는 작업은 이번 예시 제작에 포함하지 않았습니다.
배포 후 주소는 기존 사이트 주소 뒤에 runner.html을 붙인 형태입니다.

## 동작과 제한

서버 업로드·로그인·DB·AI API가 없습니다. FileReader로 기기의 파일 내용을 읽고, srcdoc으로 실행 문서를 전달합니다.
입력과 선택한 파일은 실행기에서 저장하지 않습니다. 새로고침하면 사라집니다.
서로 다른 실행은 새 iframe으로 시작하므로 이전 타이머·게임 상태가 유지되지 않습니다.
iframe에는 sandbox="allow-scripts"만 부여하며 allow-same-origin은 사용하지 않습니다.
메인 페이지 접근·팝업·최상위 페이지 이동·폼 제출 등에 대한 권한을 부여하지 않습니다.
실행 문서에 CSP를 앞부분에 넣어 외부 스크립트·이미지·음원·통신 등 일반적인 외부 리소스 로딩을 제한합니다.
data/blob 이미지·음원, 인라인 CSS·JavaScript, Canvas·SVG 등 단일 HTML 게임을 우선 지원합니다.
외부 라이브러리, CDN, 별도 파일, 서버 통신, localStorage 등 동일 출처 권한이 필요한 기능은 작동하지 않을 수 있습니다.
외부 연결 제한을 해제하는 스위치는 이번 예시에 넣지 않았습니다.

일반 JavaScript 오류·처리되지 않은 Promise 오류·일부 리소스 차단을 최대 12개 표시합니다.
부모는 현재 iframe에서 온 메시지만 받아 텍스트로 표시합니다.
오류의 줄 번호는 실행기에 보조 코드가 추가된 문서 기준으로 원본 파일과 다를 수 있습니다.
콘솔 전체, 모든 렌더링 오류, 게임 논리 오류를 자동 진단하는 도구는 아닙니다.

이 구조는 모든 악성 코드에 대한 완전한 격리 서비스가 아닙니다.
iframe 자체의 주소 이동 같은 모든 네트워크 동작을 차단한다고 가정하지 마세요.
무한 반복·과도한 메모리 사용은 탭을 멈추게 할 수 있으며, 그 경우 탭을 닫고 다시 열어야 할 수 있습니다.
직접 만든 코드나 출처를 아는 수업 코드를 사용하는 예시입니다.

## 교사용 수정 위치

- runner.html: 학생 안내 문구
- css/runner.css: 실행기 배치·색상·화면 확대
- js/runner-core.js: 최대 크기·문서 구성·CSP·오류 수집
- js/runner-example.js: 예시 게임 원문
- js/runner.js: 코드 입력·파일 읽기·실행·중지·화면 확대

예시 게임을 바꿀 때는 examples/star-game.html도 함께 맞춰 주세요.
보안 제약은 임의로 완화하지 말고, 특히 allow-scripts와 allow-same-origin을 함께 주지 마세요.

기술 참고:
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe
- https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement/srcdoc
- https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsText

