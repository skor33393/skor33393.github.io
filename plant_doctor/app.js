(() => {
  'use strict';
  const dialog=document.querySelector('.interest-dialog');
  let trigger=null;
  document.querySelectorAll('[data-download]').forEach(button=>button.addEventListener('click',()=>{
    trigger=button;
    if(dialog && !dialog.open){
      dialog.showModal();
      dialog.dispatchEvent(new CustomEvent('waitlist:open',{detail:{placement:button.dataset.placement,store:button.dataset.store||'not_selected',feature:button.closest('[data-feature]')?.dataset.feature||'hero'}}));
      window.plantAnalytics?.track('plant_coming_soon_view',{placement:button.dataset.placement,store:button.dataset.store||'not_selected'});
    }
  }));
  document.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>dialog.close()));
  dialog?.addEventListener('close',()=>trigger?.focus({preventScroll:true}));
  dialog?.addEventListener('click',event=>{
    if(event.target!==dialog)return;
    const r=dialog.getBoundingClientRect();
    if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();
  });
  // Result is already visible. This silent clip adds a demonstration, never a fake scan wait.
  const video=document.querySelector('[data-scan-video]');
  if(video && !matchMedia('(prefers-reduced-motion: reduce)').matches && !navigator.connection?.saveData){
    let started=false;
    const observer=new IntersectionObserver(entries=>{
      for(const item of entries){
        if(item.isIntersecting && !document.hidden){
          if(!video.src)video.src=video.dataset.src;
          video.play().then(()=>{
            video.classList.add('playing');
            if(!started){started=true;window.plantAnalytics?.track('plant_demo_play',{feature:'hero'});}
          }).catch(()=>{});
        }else video.pause();
      }
    },{threshold:.2});
    observer.observe(video);
    document.addEventListener('visibilitychange',()=>{
      if(document.hidden)video.pause();
      else if(video.getBoundingClientRect().bottom>0)video.play().catch(()=>{});
    });
  }
})();
