(() => {
  'use strict';
  // Only send events after the visitor has allowed Analytics.
  const track = (name, props = {}) => {
    const detail = {name, props: {article_slug: document.body.dataset.page || 'home', ...props}};
    window.dispatchEvent(new CustomEvent('pelvic:analytics', {detail}));
    if (window.pelvicAnalyticsConsent === true && typeof window.gtag === 'function') { window.gtag('event', name, detail.props); return true; }
    return false;
  };
  document.addEventListener('click', event => {
    const cta = event.target.closest('[data-app-cta]');
    if (cta) track('app_store_click', {cta_placement: cta.dataset.appCta});
    const print = event.target.closest('[data-print]');
    if (print) window.print();
  });
  const cards = [...document.querySelectorAll('[data-article-card]')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  const search = document.querySelector('#article-search');
  let selected = 'all';
  function filterArticles() {
    const query = search ? search.value.trim().toLowerCase() : '';
    let count = 0;
    cards.forEach(card => {
      card.hidden = !((selected === 'all' || selected === card.dataset.category) && (!query || card.textContent.toLowerCase().includes(query)));
      if (!card.hidden) count++;
    });
    const empty = document.querySelector('#no-results');
    const status = document.querySelector('#results-count');
    if (empty) empty.hidden = count > 0;
    if (status) status.textContent = `${count} ${count === 1 ? 'guide' : 'guides'} shown`;
  }
  filters.forEach(btn => btn.addEventListener('click', () => {
    selected = btn.dataset.filter;
    filters.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
    filterArticles();
  }));
  if (search) search.addEventListener('input', filterArticles);
  const article = document.querySelector('.article-body');
  const progress = document.querySelector('.reading-progress');
  if (article && progress) {
    let sent = false, ticking = false;
    const update = () => {
      const rect = article.getBoundingClientRect();
      const visible = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / rect.height));
      progress.style.width = `${visible * 100}%`;
      if (!sent && visible >= .75) { sent = track('article_read_75'); }
      ticking = false;
    };
    addEventListener('scroll', () => { if (!ticking) {requestAnimationFrame(update);ticking = true;} }, {passive:true});
    addEventListener('resize', update);
    addEventListener('pelvic:consent', update);
    update();
  }
})();
