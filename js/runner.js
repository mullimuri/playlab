/* 화면 상태와 실행 수명 관리. 파일을 서버에 전송하거나 저장하지 않습니다. */
(function(){
'use strict';
const $=id=>document.getElementById(id),core=window.PlaylabRunner;
const editor=$('html-code'),panel=$('preview-panel');
let frame=null,channel='',lastCode='',expanded=false,scrollPosition=0,importVersion=0,diagnosticCount=0,previousFocus=null;
function status(message,error){$('editor-status').textContent=message;$('editor-status').classList.toggle('is-error',Boolean(error));}
function updateCount(){$('code-count').textContent=editor.value.length.toLocaleString('ko-KR')+'자';}
function changed(){updateCount();if(frame){$('run-state').textContent=editor.value!==lastCode?'수정됨':'실행 중';}}
function expand(value){
 if(value===expanded)return;
 expanded=value;
 if(value){scrollPosition=window.scrollY;previousFocus=document.activeElement;}
 panel.classList.toggle('expanded',value);document.body.classList.toggle('preview-expanded',value);
 $('expand-preview').textContent=value?'화면 축소 ↙':'화면 확대 ↗';
 $('expand-preview').setAttribute('aria-expanded',String(value));
 // 브라우저 전체화면 API 대신 페이지 안에서 확대해 iPhone에서도 사용할 수 있게 합니다.
 if(value){$('expand-preview').focus();}else{window.scrollTo(0,scrollPosition);if(previousFocus&&previousFocus.isConnected)previousFocus.focus({preventScroll:true});}
}
function stop(){
 if(expanded)expand(false);
 if(frame){frame.remove();frame=null;}
 channel='';lastCode='';panel.classList.remove('is-running');
 $('preview-empty').hidden=false;$('stop-code').disabled=true;$('expand-preview').disabled=true;$('run-state').textContent='중지됨';
 $('preview-status').textContent='실행을 중지했어요. 코드와 파일은 입력창에 남아 있어요.';
}
function diagnostic(message){
 if(diagnosticCount>=12)return;diagnosticCount++;
 const item=document.createElement('li');item.textContent=String(message).slice(0,800);
 $('error-list').append(item);$('diagnostics').hidden=false;
 $('preview-status').textContent='실행 중 확인할 메시지가 있어요. 화면 아래의 내용을 확인해 주세요.';
 $('run-state').textContent='확인 필요';
}
function run(){
 let source,doc,nextChannel;
 try{
  source=core.cleanCode(editor.value);
  const random=new Uint32Array(4);crypto.getRandomValues(random);nextChannel=Array.from(random,n=>n.toString(16)).join('-');
  doc=core.buildDocument(source,nextChannel);
 }catch(error){status(error.message,true);editor.focus();return;}
 if(frame)frame.remove();
 channel=nextChannel;
 diagnosticCount=0;$('error-list').replaceChildren();$('diagnostics').hidden=true;
 frame=document.createElement('iframe');
 frame.title='학생 HTML 게임 실행 화면';
 // allow-same-origin, allow-top-navigation, allow-popups 등은 의도적으로 허용하지 않습니다.
 frame.setAttribute('sandbox','allow-scripts');
 frame.setAttribute('allow','autoplay');
 frame.setAttribute('referrerpolicy','no-referrer');
 const current=frame;
 frame.addEventListener('load',()=>{
  if(frame!==current||diagnosticCount)return;
  $('preview-status').textContent='화면을 열었어요. 게임 안의 시작 버튼을 눌러 플레이해 보세요.';
 });
 frame.srcdoc=doc;$('preview-empty').hidden=true;$('frame-container').append(frame);
 lastCode=editor.value;panel.classList.add('is-running');$('run-state').textContent='실행 중';
 $('stop-code').disabled=false;$('expand-preview').disabled=false;
 $('preview-status').textContent='게임 화면을 불러오고 있어요.';
 status('실행했어요. 코드를 고친 뒤에는 실행 버튼을 다시 눌러 주세요.');
 if(!expanded)panel.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
}
window.addEventListener('message',event=>{
 if(!frame||event.source!==frame.contentWindow)return;
 const data=event.data;
 if(!data||data.channel!==channel||!['error','resource'].includes(data.type)||typeof data.message!=='string')return;
 diagnostic(data.message);
});
editor.addEventListener('input',()=>{importVersion++;changed();status('입력한 코드를 실행 버튼으로 확인해 보세요.');});
$('run-code').addEventListener('click',run);
$('stop-code').addEventListener('click',stop);
$('expand-preview').addEventListener('click',()=>expand(!expanded));
document.addEventListener('keydown',event=>{
 if(!expanded)return;
 if(event.key==='Escape'){expand(false);return;}
 // 확대한 화면에서 키보드 포커스가 배경 입력창으로 빠져나가지 않게 합니다.
 if(event.key==='Tab'){
  const items=[...panel.querySelectorAll('button:not(:disabled),iframe')],first=items[0],last=items[items.length-1];
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
 }
});
document.addEventListener('focusin',event=>{if(expanded&&!panel.contains(event.target))$('expand-preview').focus();});
function loadExample(autoRun){
 if(editor.value.trim()&&editor.value!==window.PLAYLAB_RUNNER_EXAMPLE&&!confirm('입력창의 코드를 예시 게임으로 바꿀까요? 필요한 코드는 먼저 복사해 두세요.'))return;
 importVersion++;editor.value=window.PLAYLAB_RUNNER_EXAMPLE;$('html-file').value='';changed();
 status('별 잡기 예시를 불러왔어요. 게임 실행하기를 눌러 보세요.');
 if(autoRun)run();
}
$('load-example').addEventListener('click',()=>loadExample(false));
$('load-example-top').addEventListener('click',()=>loadExample(true));
$('clear-code').addEventListener('click',()=>{
 if(editor.value&&!confirm('입력한 코드를 지울까요? 필요한 코드는 먼저 복사해 두세요.'))return;
 importVersion++;stop();editor.value='';$('html-file').value='';updateCount();$('error-list').replaceChildren();$('diagnostics').hidden=true;status('입력창을 비웠어요. 새 HTML을 가져와 보세요.');editor.focus();
});
$('html-file').addEventListener('change',event=>{
 const file=event.target.files[0];if(!file)return;
 const version=++importVersion;
 if(!/\.html?$/i.test(file.name)){status('.html 또는 .htm 파일을 선택해 주세요.',true);event.target.value='';return;}
 if(file.size>core.MAX_BYTES){status('파일이 너무 커요. 2MB 이하의 HTML을 선택해 주세요.',true);event.target.value='';return;}
 if(editor.value.trim()&&!confirm('입력창의 코드를 선택한 파일로 바꿀까요? 필요한 코드는 먼저 복사해 두세요.')){event.target.value='';return;}
 status('파일을 읽고 있어요…');
 const reader=new FileReader();
 reader.onload=()=>{
  if(version!==importVersion)return;
  try{core.cleanCode(reader.result);editor.value=String(reader.result);changed();status(file.name+' 파일을 읽었어요. 게임 실행하기를 눌러 주세요.');}
  catch(error){status(error.message,true);}
  $('html-file').value='';
 };
 reader.onerror=()=>{if(version===importVersion){status('파일을 읽지 못했어요. 파일을 기기에 다운로드한 뒤 다시 선택하거나 코드를 붙여넣어 주세요.',true);$('html-file').value='';}};
 reader.readAsText(file,'UTF-8');
});
updateCount();
})();

