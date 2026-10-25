(() => {
  'use strict';
  const form=document.querySelector('[data-waitlist-form]');
  if(!form)return;
  const dialog=form.closest('dialog'),email=form.querySelector('[name="email"]');
  const submit=form.querySelector('[type="submit"]'),error=form.querySelector('[data-form-error]');
  const intro=dialog.querySelector('[data-waitlist-intro]'),success=dialog.querySelector('[data-waitlist-success]');
  const cfg=window.PLANT_WAITLIST_CONFIG||{},query=new URLSearchParams(location.search);
  const local=['localhost','127.0.0.1'].includes(location.hostname);
  const preview=query.get('preview')==='1'||(local&&query.get('waitlist_test')!=='1');
  const qa=query.get('analytics_debug')==='1'||local;
  const rememberedKey='plant_waitlist_joined_v1';
  let started=false,busy=false,completed=false,context={},draft=null;
  function track(name,extra={}){window.plantAnalytics?.track(name,{...context,...extra})}
  function showError(message,kind){
    error.textContent=message;email.setAttribute('aria-invalid',kind==='invalid_email'?'true':'false');
    track('plant_waitlist_error',{error_type:kind});
  }
  function showSuccess(isPreview=false){
    intro.hidden=true;form.hidden=true;success.hidden=false;
    const title=success.querySelector('h2');
    title.textContent=isPreview?'Preview complete.':'You’re on the list.';
    success.querySelector('p').textContent=isPreview?'No email was saved in preview mode. Live visitors can join the launch list.':'We’ll email you when Plant Doctor AI is ready. A little help for your plants is on its way.';
    dialog.setAttribute('aria-labelledby','waitlist-success-title');
    title.focus({preventScroll:true});
  }
  if(preview)dialog.querySelector('[data-preview-note]').hidden=false;
  dialog.addEventListener('waitlist:open',event=>{
    context={store:event.detail.store||'not_selected',placement:event.detail.placement||'hero',feature:event.detail.feature||'hero'};
    started=false;
    try{completed=!preview&&localStorage.getItem(rememberedKey)==='1'}catch(_){}
    track('plant_waitlist_view');
    if(completed){showSuccess();return;}
    intro.hidden=false;form.hidden=false;success.hidden=true;
    dialog.setAttribute('aria-labelledby','interest-title');
    error.textContent='';email.removeAttribute('aria-invalid');
  });
  email.addEventListener('input',()=>{
    email.removeAttribute('aria-invalid');error.textContent='';
    if(!started){started=true;track('plant_waitlist_start')}
  });
  dialog.addEventListener('close',()=>{
    if(!completed)track('plant_waitlist_dismiss',{form_started:started?1:0,submission_pending:busy?1:0});
  });
  function campaign(){
    const data={};
    for(const [queryKey,key] of [['utm_source','utmSource'],['utm_medium','utmMedium'],['utm_campaign','utmCampaign'],['utm_content','utmContent'],['utm_term','utmTerm'],['utm_id','utmId']]){
      const v=query.get(queryKey)||'';data[key]=/^[A-Za-z0-9_ .~+\/-]{0,100}$/.test(v)?v:'';
    }
    return data;
  }
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(busy||completed)return;
    const value=email.value.trim().toLowerCase();email.value=value;
    if(value.length>254||!email.validity.valid||!/^\S+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(value)){
      showError('Enter a valid email address, like you@example.com.','invalid_email');email.focus();return;
    }
    if(form.elements.website.value){return;}
    track('plant_waitlist_submit');
    if(preview){showSuccess(true);return;}
    busy=true;submit.disabled=true;submit.textContent='Joining…';email.readOnly=true;error.textContent='';
    form.setAttribute('aria-busy','true');
    const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),15000);
    try{
      if(!cfg.databaseURL||location.hostname!=='bestme.mobi'&&!local)throw new Error('configuration');
      // A fresh random key contains no email. Drafts stay in memory only.
      if(!draft||draft.email!==value)draft={email:value,id:crypto.randomUUID().replaceAll('-','')};
      const payload={email:value,createdAt:{'.sv':'timestamp'},product:'plant_doctor_ai',
        landingVariant:document.body.dataset.variant,landingPath:local?'/plant_ai/':location.pathname,
        ...context,...campaign(),consent:true,consentVersion:cfg.consentVersion,qa};
      const response=await fetch(cfg.databaseURL+'/'+(qa?cfg.qaCollection:cfg.collection)+'/'+draft.id+'.json?print=silent',{
        method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:controller.signal,credentials:'omit',referrerPolicy:'no-referrer'
      });
      if(!response.ok){draft=null;throw new Error(response.status===401||response.status===403?'unavailable':'server')}
      completed=true;email.value='';draft=null;
      if(!qa)try{localStorage.setItem(rememberedKey,'1')}catch(_){}
      track('plant_waitlist_success');showSuccess();
    }catch(e){
      // An unknown network result must never be reported as a confirmed signup.
      draft=null;
      const type=e.name==='AbortError'?'timeout':['configuration','unavailable','server'].includes(e.message)?e.message:'network';
      showError(type==='network'||type==='timeout'?'We couldn’t connect. Check your connection and try again. Your email is still here.':'We couldn’t save your email just now. Please try again.',''+type);
    }finally{
      clearTimeout(timeout);busy=false;submit.disabled=false;submit.textContent='Notify me at launch';email.readOnly=false;form.removeAttribute('aria-busy');
    }
  });
  // Never enable native submission before all email-handling listeners are installed.
  submit.disabled=false;
})();
