/* 실행 문서 구성과 입력 검증. iframe에는 allow-scripts만 부여합니다.
 * allow-same-origin을 추가하면 학생 코드가 부모 사이트에 접근할 수 있으므로 추가하지 마세요. */
(function(root){
  'use strict';
  const MAX_BYTES = 2 * 1024 * 1024;
  const POLICY = "default-src 'none'; script-src 'unsafe-inline' blob:; style-src 'unsafe-inline'; img-src data: blob:; media-src data: blob:; font-src data:; connect-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; worker-src blob:; manifest-src 'none'";
  function cleanCode(source){
    let code=String(source || '').replace(/^\uFEFF/,'').trim();
    const fenced=code.match(/^\x60{3}(?:html|htm)?[ \t]*\r?\n([\s\S]*?)\r?\n\x60{3}$/i);
    if(fenced)code=fenced[1].trim();
    if(!code)throw new Error('HTML 코드를 붙여넣거나 파일을 선택해 주세요.');
    if(new Blob([code]).size>MAX_BYTES)throw new Error('코드가 너무 커요. 2MB 이하의 HTML을 사용해 주세요.');
    return code;
  }
  function buildDocument(source,token){
    const doc=new DOMParser().parseFromString(cleanCode(source),'text/html');
    // 상대 경로로 부모 사이트 파일을 참조하거나 자동으로 다른 주소를 열지 않게 합니다.
    doc.querySelectorAll('base, meta[http-equiv]').forEach(node=>{
      if(node.tagName.toLowerCase()==='base'||(node.getAttribute('http-equiv')||'').toLowerCase()==='refresh')node.remove();
    });
    const charset=doc.createElement('meta');charset.setAttribute('charset','utf-8');
    const policy=doc.createElement('meta');policy.httpEquiv='Content-Security-Policy';policy.content=POLICY;
    const additions=[charset,policy];
    if(!doc.querySelector('meta[name="viewport"]')){
      const viewport=doc.createElement('meta');viewport.name='viewport';viewport.content='width=device-width, initial-scale=1';additions.push(viewport);
    }
    const bridge=doc.createElement('script');
    // 토큰은 부모에서 생성합니다. 학생 HTML은 srcdoc에만 전달합니다.
    bridge.textContent='('+function(channel){
      let sent=0;
      function send(type,message){
        if(sent>=12)return;sent++;
        parent.postMessage({channel:channel,type:type,message:String(message).slice(0,800)},'*');
      }
      addEventListener('error',function(event){
        if(event.message)send('error',event.message+(event.lineno?' (줄 '+event.lineno+')':''));
        else if(event.target&&event.target!==window)send('resource','필요한 파일을 불러오지 못했어요. 외부 파일 없는 HTML인지 확인해 주세요.');
      },true);
      addEventListener('unhandledrejection',function(event){
        const reason=event.reason;
        send('error',reason&&reason.message?reason.message:String(reason||'비동기 작업 오류'));
      });
      addEventListener('securitypolicyviolation',function(){
        send('resource','외부 연결 또는 허용되지 않은 기능이 차단됐어요. 외부 파일·라이브러리가 없는 단일 HTML로 수정해 주세요.');
      });
      // 링크·폼으로 게임 바깥 사이트를 여는 일반적인 동작을 막습니다.
      addEventListener('click',function(event){
        const link=event.target&&event.target.closest?event.target.closest('a'):null;
        if(link&&link.getAttribute('href')&&!link.getAttribute('href').startsWith('#')){
          event.preventDefault();send('resource','이 실행기에서는 외부 링크 이동을 제한해요.');
        }
      },true);
      addEventListener('submit',function(event){event.preventDefault();},true);
    }.toString()+')('+JSON.stringify(token).replace(/</g,'\\u003c')+');';
    additions.push(bridge);doc.head.prepend(...additions);
    if(!doc.documentElement.lang)doc.documentElement.lang='ko';
    return '<!doctype html>\n'+doc.documentElement.outerHTML;
  }
  root.PlaylabRunner={MAX_BYTES,POLICY,cleanCode,buildDocument};
})(typeof window==='undefined'?globalThis:window);

