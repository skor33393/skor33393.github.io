(() => {
  'use strict';
  // No analytics provider is installed. Events stay in this page unless a provider is connected.
  const track = (name, props = {}) => {
    const detail = {name, props: {page: document.body.dataset.page || 'home', ...props}};
    window.dispatchEvent(new CustomEvent('pelvic:analytics', {detail}));
    if (typeof window.plausible === 'function') window.plausible(name, {props: detail.props});
    // GA4 integration must explicitly set this flag after analytics consent.
    if (window.pelvicAnalyticsConsent === true && typeof window.gtag === 'function') window.gtag('event', name, detail.props);
  };
  document.addEventListener('click', event => {
    const cta = event.target.closest('[data-app-cta]');
    if (cta) track('app_store_click', {placement: cta.dataset.appCta});
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
      if (!sent && visible >= .75) { track('article_read_75'); sent = true; }
      ticking = false;
    };
    addEventListener('scroll', () => { if (!ticking) {requestAnimationFrame(update);ticking = true;} }, {passive:true});
    addEventListener('resize', update);
    update();
  }
})();
