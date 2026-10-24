(() => {
  'use strict';
  const examples = {
    spring: {name:'Bright Spring',traits:['Warm','Bright','Clear'],colors:['#ED8175','#EAB75D','#A9BD62','#57AA94','#4B97A8','#C16493']},
    summer: {name:'Soft Summer',traits:['Cool','Soft','Muted'],colors:['#B9809D','#A4A1BE','#98B6C8','#89A8A1','#C89BA7','#8A799E']},
    autumn: {name:'Soft Autumn',traits:['Warm','Soft','Muted'],colors:['#B26A78','#CB8863','#CCAF61','#81946B','#538381','#796179']},
    winter: {name:'Bright Winter',traits:['Cool','Bright','Clear'],colors:['#C0336C','#783D98','#385FB1','#2E8878','#C94654','#808AA2']}
  };
  document.querySelectorAll('[data-season]').forEach(button=>button.addEventListener('click',()=>{
    const demo=examples[button.dataset.season];
    document.querySelector('[data-season-result]').textContent=demo.name;
    document.querySelector('[data-season-result]').setAttribute('aria-live','polite');
    document.querySelectorAll('.hero .traits span').forEach((el,i)=>el.textContent=demo.traits[i]);
    document.querySelectorAll('.hero-palette .color').forEach((el,i)=>{el.style.setProperty('--color',demo.colors[i]);el.title=demo.name+' example shade '+(i+1)});
    document.querySelector('.hero-palette').setAttribute('aria-label',demo.name+' sample palette');
    document.querySelector('.color-halo').style.background='conic-gradient('+demo.colors.map((c,i)=>`${c} ${i*60}deg ${(i+1)*60}deg`).join(',')+')';
    document.querySelectorAll('[data-season]').forEach(el=>el.setAttribute('aria-pressed',String(el===button)));
  }));
  const provider = new URLSearchParams(location.search).get('pt');
  document.querySelectorAll('[data-download]').forEach(link=>{
    if(provider && /^\d{1,20}$/.test(provider)){
      const url=new URL(link.href);url.searchParams.set('pt',provider);url.searchParams.set('ct','stylist_v2_'+document.body.dataset.variant);url.searchParams.set('mt','8');link.href=url.toString();
    }
    link.addEventListener('click',()=>window.dispatchEvent(new CustomEvent('stylist:download',{detail:{variant:document.body.dataset.variant,placement:link.dataset.placement}})));
  });
})();
