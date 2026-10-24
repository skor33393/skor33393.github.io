(() => {
  'use strict';
  const beauty = {
    makeup: { image: 'makeup', alt: 'Example rosy makeup look', label: 'Makeup mood: rosy' },
    hair: { image: 'hair', alt: 'Example hair color inspiration', label: 'Hair mood: a fresh direction' },
    nails: { image: 'nails', alt: 'Example muted rose manicure', label: 'Nail mood: muted rose' }
  };
  document.querySelectorAll('[data-beauty]').forEach(button => button.addEventListener('click', () => {
    const selection = beauty[button.dataset.beauty];
    const photo = document.querySelector('.beauty-active');
    photo.src = '../assets/' + selection.image + '.webp'; photo.alt = selection.alt;
    document.querySelector('[data-beauty-label]').textContent = selection.label;
    document.querySelectorAll('[data-beauty]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  }));
  const palettes = {
    spring: { name: 'Bright Spring', colors: ['#f18b78','#edb662','#8eb995','#6dabad','#b85d71'] },
    summer: { name: 'Soft Summer', colors: ['#b08da6','#a5a8bd','#a9c7cb','#81988e','#cfa6b4'] },
    autumn: { name: 'Soft Autumn', colors: ['#834b52','#c28568','#d0ad7a','#8a926d','#b7c4c1'] },
    winter: { name: 'Bright Winter', colors: ['#a82753','#624675','#225d72','#164b44','#c7d3e2'] }
  };
  document.querySelectorAll('[data-season]').forEach(button => button.addEventListener('click', () => {
    const palette = palettes[button.dataset.season];
    document.querySelector('[data-season-title]').textContent = palette.name;
    document.querySelectorAll('.season-swatches i').forEach((el, index) => el.style.setProperty('--swatch', palette.colors[index]));
    document.querySelector('.season-halo').style.background = 'conic-gradient(' + palette.colors.map((color,index) => `${color} ${index * 72}deg ${(index + 1) * 72}deg`).join(',') + ')';
    document.querySelectorAll('[data-season]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  }));
  // Only pass an explicitly supplied App Store Connect provider token. Never
  // invent a provider ID or forward TikTok/ad identifiers to Apple.
  const params = new URLSearchParams(location.search);
  const provider = params.get('pt');
  if (provider && /^\d{1,20}$/.test(provider)) {
    document.querySelectorAll('[data-download]').forEach(link => {
      const url = new URL(link.href);
      url.searchParams.set('pt', provider);
      url.searchParams.set('ct', 'stylist_' + document.body.dataset.variant);
      url.searchParams.set('mt', '8');
      link.href = url.toString();
    });
  }
  document.querySelectorAll('[data-download]').forEach(link => link.addEventListener('click', () => {
    // An integration hook, not an installed analytics service. No visitor data is sent.
    window.dispatchEvent(new CustomEvent('stylist:download', { detail: {
      variant: document.body.dataset.variant,
      placement: link.dataset.placement
    } }));
  }));
})();
