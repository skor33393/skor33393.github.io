(() => {
  'use strict';
  const examples = {
    spring: {name:'Bright Spring',traits:['Warm','Bright','Clear'],colors:['#FFD53F','#F68291','#E74A7A','#E7006B','#A7C836','#2AAE67','#00B8C8','#3B4E8C']},
    summer: {name:'Soft Summer',traits:['Cool','Soft','Muted'],colors:['#E0B8B3','#D6A9AA','#B9898B','#9D6A6F','#83A98B','#6F917C','#B6C5D2','#5AA1A6']},
    autumn: {name:'Soft Autumn',traits:['Warm','Soft','Muted'],colors:['#E5A690','#DA8678','#D5938A','#C4776E','#8A9B73','#7D8B6C','#87B3B8','#43735E']},
    winter: {name:'True Winter',traits:['Cool','Clear','High contrast'],colors:['#F25A8D','#9C1F50','#7F3C7D','#4E1C60','#17A59D','#3AB3D1','#3C55A5','#003A6E']}
  };
  document.querySelectorAll('[data-season]').forEach(button=>button.addEventListener('click',()=>{
    const demo=examples[button.dataset.season];
    document.querySelector('[data-season-result]').textContent=demo.name;
    document.querySelector('[data-season-result]').setAttribute('aria-live','polite');
    document.querySelectorAll('.hero .traits span').forEach((el,i)=>el.textContent=demo.traits[i]);
    document.querySelectorAll('.hero-palette .color').forEach((el,i)=>{el.style.setProperty('--color',demo.colors[i]);el.title=demo.name+' example shade '+(i+1)});
    document.querySelector('.hero-palette').setAttribute('aria-label',demo.name+' sample palette');
    const step=360/demo.colors.length;
    document.querySelector('.color-halo').style.background='conic-gradient('+demo.colors.map((c,i)=>`${c} ${i*step}deg ${(i+1)*step}deg`).join(',')+')';
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
