(() => {
  'use strict';
  if(window.plantTikTok)return;
  const api=window.plantTikTok={status:'disabled',track:()=>{}};
  const query=new URLSearchParams(location.search),cfg=window.PLANT_ANALYTICS_CONFIG||{};
  const local=['localhost','127.0.0.1'].includes(location.hostname);
  const dry=local&&query.get('analytics_test')==='1';
  const prod=location.hostname==='bestme.mobi'&&/^\/(plant_ai\/|plant_doctor\/0[1-5]-[^/]+\/)$/.test(location.pathname);
  const preview=query.get('preview')==='1'||window.top!==window.self;
  const qa=query.get('analytics_debug')==='1';
  let optedOut=false;try{optedOut=localStorage.getItem('plant_analytics_opt_out')==='1'}catch(_){}
  if(!document.body.dataset.variant||preview||optedOut||navigator.globalPrivacyControl===true||(!prod&&!dry)||(qa&&query.get('tiktok_test')!=='1'))return;
  const pixel=cfg.tiktokPixelId;
  if(!/^[A-Z0-9]{20}$/.test(pixel||'')){api.status='unconfigured';return;}
  // Public Pixel ID only. Events API access tokens never belong in browser code.
  if(!dry){
    window.TiktokAnalyticsObject='ttq';
    const ttq=window.ttq=window.ttq||[];
    ttq.methods=['page','track','identify','instances','debug','on','off','once','ready','alias','group','enableCookie','disableCookie','holdConsent','revokeConsent','grantConsent'];
    ttq.setAndDefer=(target,method)=>{target[method]=function(){target.push([method].concat(Array.prototype.slice.call(arguments)))}};
    for(const method of ttq.methods)ttq.setAndDefer(ttq,method);
    ttq.instance=id=>{const instance=ttq._i[id]||[];for(const method of ttq.methods)ttq.setAndDefer(instance,method);return instance};
    ttq.load=(id,options)=>{
      const url='https://analytics.tiktok.com/i18n/pixel/events.js';
      ttq._i=ttq._i||{};ttq._i[id]=[];ttq._i[id]._u=url;
      ttq._t=ttq._t||{};ttq._t[id]=+new Date;
      ttq._o=ttq._o||{};ttq._o[id]=options||{};
      const script=document.createElement('script');script.async=true;script.src=url+'?sdkid='+id+'&lib=ttq';
      script.onload=()=>api.status='loaded';script.onerror=()=>api.status='blocked';
      document.head.appendChild(script);
    };
    api.status='loading';ttq.load(pixel);ttq.page();
  }else{api.status='test';api.events=[{event:'PageView',properties:{}}]}
  const sent=new Set();
  const mapping={plant_landing_view:'ViewContent',plant_download_intent:'DownloadIntent',plant_waitlist_success:'Lead'};
  api.track=(name,context={})=>{
    const event=mapping[name];if(!event||sent.has(event))return;
    const properties={content_name:event==='Lead'?'Plant Doctor AI launch waitlist':'Plant Doctor AI',landing_variant:document.body.dataset.variant};
    for(const key of ['store','placement','feature']){
      const value=context[key];if(typeof value==='string'&&/^[a-z0-9_]{1,40}$/.test(value))properties[key]=value;
    }
    const version=query.get('utm_content');
    if(version&&/^[A-Za-z0-9_ .~+\/-]{1,100}$/.test(version))properties.ad_version=version;
    if(qa)properties.qa_test=true;
    // No email, identify call, price or revenue. Lead follows confirmed database success only.
    try{
      if(dry)api.events.push({event,properties});else window.ttq.track(event,properties);
      sent.add(event);
    }catch(_){api.status='error'}
  };
})();
