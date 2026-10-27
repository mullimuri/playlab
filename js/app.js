(function(){
'use strict';
const config=window.PLAYLAB_CONFIG, $=id=>document.getElementById(id), controls=new Map();
let generatedValues='',copyAttempt=0;
const values=()=>Object.fromEntries([...controls].map(([key,control])=>[key,control.value]));
const snapshot=()=>JSON.stringify(values());
// 항목 추가 시 config.fields만 확장합니다. 입력값은 HTML로 해석하지 않습니다.
config.fields.forEach(field=>{
 const group=document.createElement('div');group.className='field';
 const label=document.createElement('label');label.htmlFor=field.id;label.textContent=field.label;
 const tag=document.createElement('span');tag.className=field.required?'required':'optional';tag.textContent=field.required?'필수':'선택';label.append(tag);
 const control=document.createElement('textarea');
 control.id=field.id;control.name=field.key;control.rows=field.rows||3;control.required=Boolean(field.required);control.maxLength=field.maxLength||3000;
 control.placeholder=field.placeholder||'';control.setAttribute('aria-describedby',field.id+'-hint');
 const hint=document.createElement('p');hint.id=field.id+'-hint';hint.className='field-hint';hint.textContent=field.hint||'';
 group.append(label,control,hint);
 if(field.examples){
  const examples=document.createElement('div');examples.className='examples';
  field.examples.forEach(example=>{
   const button=document.createElement('button');button.type='button';button.textContent=example;
   button.addEventListener('click',()=>{control.value=example;control.dispatchEvent(new Event('input',{bubbles:true}));control.focus();});examples.append(button);
  });group.append(examples);
 }
 controls.set(field.key,control);$('fields').append(group);
 control.addEventListener('input',()=>{
  control.removeAttribute('aria-invalid');$('form-error').hidden=true;
  if(generatedValues){
   copyAttempt++;
   const stale=snapshot()!==generatedValues;
   $('stale-message').hidden=!stale;$('copy-button').disabled=stale;$('result-badge').textContent=stale?'수정됨':'생성 완료';
   $('copy-status').textContent=stale?'수정한 내용으로 프롬프트를 다시 생성해 주세요.':'전체 프롬프트를 복사할 수 있어요.';$('manual-copy').hidden=true;
  }
 });
});
$('prompt-form').addEventListener('submit',event=>{
 event.preventDefault();
 const invalid=config.fields.find(field=>field.required&&!controls.get(field.key).value.trim());
 if(invalid){
  $('form-error').textContent=invalid.label+'을(를) 입력해 주세요.';$('form-error').hidden=false;
  controls.get(invalid.key).setAttribute('aria-invalid','true');controls.get(invalid.key).focus();return;
 }
 try{
  const prompt=window.PlaylabPrompt.generatePrompt(config,values());
  copyAttempt++;$('prompt-output').value=prompt;generatedValues=snapshot();
  $('empty-state').hidden=true;$('result-content').hidden=false;$('form-error').hidden=true;$('stale-message').hidden=true;$('manual-copy').hidden=true;
  $('copy-button').disabled=false;$('result-badge').textContent='생성 완료';$('character-count').textContent=prompt.length.toLocaleString('ko-KR')+'자';
  $('copy-status').textContent='프롬프트가 완성됐어요! 복사해서 AI에게 건네 보세요.';
  $('prompt-output').focus({preventScroll:true});
  $('output-title').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
 }catch(error){$('form-error').textContent='프롬프트 설정을 확인해 주세요. '+error.message;$('form-error').hidden=false;}
});
$('copy-button').addEventListener('click',async()=>{
 const attempt=++copyAttempt;
 try{
  if(!navigator.clipboard||!window.isSecureContext)throw new Error('unavailable');
  await navigator.clipboard.writeText($('prompt-output').value);
  if(attempt!==copyAttempt)return;
  $('copy-status').textContent='복사 완료! 아래에서 원하는 AI를 열어 붙여넣으세요.';$('manual-copy').hidden=true;
 }catch(_){if(attempt!==copyAttempt)return;$('copy-status').textContent='수동 복사를 이용해 주세요.';$('manual-copy').hidden=false;}
});
$('select-button').addEventListener('click',()=>{
 const output=$('prompt-output');output.focus();output.select();output.setSelectionRange(0,output.value.length);
 $('copy-status').textContent='전체 선택했어요. 선택 영역을 길게 누르거나 Ctrl+C / ⌘C로 복사하세요.';
});
config.services.forEach(service=>{
 const link=document.createElement('a');link.href=service.url;link.target='_blank';link.rel='noopener noreferrer';link.className='ai-link';link.setAttribute('aria-label',service.name+' 열기 (새 탭)');
 const mark=document.createElement('span');mark.className='ai-mark '+service.color;mark.textContent=service.mark;mark.setAttribute('aria-hidden','true');
 const name=document.createElement('strong');name.textContent=service.name;
 const arrow=document.createElement('span');arrow.className='link-arrow';arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');
 link.append(mark,name,arrow);$('ai-links').append(link);
});
})();
