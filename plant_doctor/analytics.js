(() => {
  'use strict';
  const q=new URLSearchParams(location.search), cfg=window.PLANT_ANALYTICS_CONFIG||{};
  const variant=document.body.dataset.variant,problem=document.body.dataset.problem;
  const local=['localhost','127.0.0.1'].includes(location.hostname);
  const dry=local&&q.get('analytics_test')==='1';
  const prod=location.hostname==='bestme.mobi'&&['/plant_doctor/','/plant_ai/'].some(path=>location.pathname.startsWith(path));
  const preview=q.get('preview')==='1'||window.top!==window.self;
  const api=window.plantAnalytics={status:'disabled',events:[],track:()=>{}};
  let optedOut=false;try{optedOut=localStorage.getItem('plant_analytics_opt_out')==='1'}catch(_){}
  if(!variant||preview||optedOut||navigator.globalPrivacyControl===true||(!prod&&!dry))return;
  const debug=q.get('analytics_debug')==='1';
  if(!dry&&!/^G-[A-Z0-9]+$/.test(cfg.measurementId||'')){api.status='unconfigured';return;}
  const safeURL=new URL('https://bestme.mobi'+location.pathname);
  for(const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','utm_id']){
    const value=q.get(key);if(value&&/^[\w .~+\/-]{1,100}$/.test(value))safeURL.searchParams.set(key,value);
  }
  let referrer='';try{referrer=new URL(document.referrer).origin+'/'}catch(_){}
  const ua=navigator.userAgent;
  const base={landing_variant:variant,problem,landing_version:cfg.version,
    browser_context:/TikTok|musical_ly|Bytedance/i.test(ua)?'tiktok':/Instagram/i.test(ua)?'instagram':/FBAN|FBAV/i.test(ua)?'facebook':'browser',
    page_location:safeURL.href,page_referrer:referrer,page_title:document.title,...(debug?{debug_mode:true,traffic_type:'developer'}:{})};
  window.dataLayer=window.dataLayer||[];
  window.gtag=window.gtag||function(){dataLayer.push(arguments)};
  if(!dry){
    gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    gtag('set','ads_data_redaction',true);gtag('js',new Date());
    gtag('config',cfg.measurementId,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,page_location:safeURL.href,page_referrer:referrer,cookie_flags:'SameSite=Lax;Secure'});
    const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(cfg.measurementId);
    script.onload=()=>api.status='ready';script.onerror=()=>api.status='blocked';document.head.appendChild(script);api.status='loading';
  }else api.status='test';
  function event(name,params={}){
    const payload={...base,...params};
    if(dry)api.events.push({name,params:payload});else gtag('event',name,payload);
  }
  api.track=event;
  const milestones=new Set(),engagement=new Set();let active=!document.hidden,last=performance.now(),visibleMs=0,maxDepth=0,clicks=0,timer=null;
  const cards=[...document.querySelectorAll('[data-feature]')].map(el=>({el,feature:el.dataset.feature,entered:null,seen:false,visibleMs:0,flushedMs:0}));
  function depth(){const max=document.documentElement.scrollHeight-innerHeight;return max<=0?100:Math.min(100,Math.max(0,Math.round(scrollY/max*100)))}
  function flush(card,now){
    if(card.entered!==null){card.visibleMs+=now-card.entered;card.entered=null}
    const delta=Math.round(card.visibleMs-card.flushedMs);
    if(card.seen&&delta>=100){event('plant_feature_time',{feature:card.feature,feature_visible_ms:delta});card.flushedMs=card.visibleMs}
  }
  function tick(){
    const now=performance.now();if(active)visibleMs+=now-last;last=now;
    if(!active||document.hidden)return;
    const current=depth();maxDepth=Math.max(maxDepth,current);
    for(const percent of [25,50,75,90,100])if(current>=percent&&!milestones.has(percent)){milestones.add(percent);event('plant_scroll',{scroll_percent:percent})}
    const dock=document.querySelector('.download-dock');const bottom=Math.min(innerHeight,dock?dock.getBoundingClientRect().top:innerHeight);
    for(const card of cards){
      const r=card.el.getBoundingClientRect();const overlap=Math.max(0,Math.min(r.bottom,bottom)-Math.max(r.top,0));
      const show=overlap>=Math.min(r.height*.5,bottom*.5)&&r.right>0&&r.left<innerWidth&&!document.querySelector('dialog[open]');
      if(show){if(card.entered===null)card.entered=now;if(!card.seen&&now-card.entered>=1000){card.seen=true;event('plant_feature_view',{feature:card.feature,scroll_percent:current})}}
      else flush(card,now);
    }
    for(const sec of [10,30,60,120])if(visibleMs>=sec*1000&&!engagement.has(sec)){engagement.add(sec);event('plant_engaged',{engaged_seconds:sec})}
  }
  let intent=false;
  document.addEventListener('click',e=>{
    if(!(e.target instanceof Element))return;tick();
    const card=e.target.closest('[data-feature]'),button=e.target.closest('[data-download]');
    if(card)event('plant_feature_tap',{feature:card.dataset.feature,tap_target:button?'download_button':e.target.closest('.feature-art')?'image':'card'});
    if(button){
      clicks++;
      const store=button.dataset.store||'not_selected';
      const params={store,placement:button.dataset.placement,feature:card?.dataset.feature||cards.find(c=>c.entered!==null)?.feature||'hero',scroll_percent:depth(),visible_ms:Math.round(visibleMs),features_seen:cards.filter(c=>c.seen).length,destination:'coming_soon',transport_type:'beacon'};
      event('plant_cta_click',params);
      if(store!=='not_selected'){event('plant_store_click',params);if(!intent){intent=true;event('plant_download_intent',params)}}
      else event('plant_care_plan_intent',params);
    }
  },{capture:true});
  function pause(){
    if(!active)return;tick();active=false;const now=performance.now();cards.forEach(c=>flush(c,now));clearInterval(timer);timer=null;
    event('plant_session_summary',{visible_ms:Math.round(visibleMs),scroll_percent:maxDepth,features_seen:cards.filter(c=>c.seen).length,store_clicks:clicks,transport_type:'beacon'});
  }
  function resume(){active=true;last=performance.now();if(!timer)timer=setInterval(tick,250);tick()}
  document.addEventListener('visibilitychange',()=>document.hidden?pause():resume());
  window.addEventListener('pagehide',pause);window.addEventListener('pageshow',e=>{if(e.persisted&&!document.hidden)resume()});
  event('page_view');event('plant_landing_view');if(!document.hidden)resume();
})();
