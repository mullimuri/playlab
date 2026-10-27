/* 화면과 분리한 문자열 치환 함수. */
(function(root){
  'use strict';
  function generatePrompt(config,values){
    const fields=new Map(config.fields.map(field=>[field.key,field]));
    for(const field of config.fields){
      if(field.required && !String(values[field.key] || '').trim()) throw new Error(field.label+'을(를) 입력해 주세요.');
    }
    // 콜백으로 치환: 사용자 입력의 특수문자는 재해석하지 않습니다.
    return config.template.replace(/\{\{([A-Z_0-9]+)\}\}/g,(_,key)=>{
      const field=fields.get(key);
      if(!field) throw new Error('설정에서 정의되지 않은 입력 항목: '+key);
      return String(values[key] || '').trim() || field.fallback || '';
    }).trim();
  }
  root.PlaylabPrompt={generatePrompt};
})(typeof window==='undefined' ? globalThis : window);
