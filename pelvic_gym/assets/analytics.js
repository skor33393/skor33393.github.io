(() => {
  'use strict';
  const id = 'G-GYLTHF349T';
  const key = 'pelvic_journal_analytics_v1';
  const lifetime = 180 * 24 * 60 * 60 * 1000;
  const panel = document.querySelector('[data-consent-panel]');
  const status = document.querySelector('[data-consent-status]');
  const production = location.hostname === 'bestme.mobi' || location.hostname === 'www.bestme.mobi';
  let started = false;
  let returnFocus = null;
  window.pelvicAnalyticsConsent = false;
  window['ga-disable-' + id] = true;

  function savedChoice() {
    try {
      const saved = JSON.parse(localStorage.getItem(key));
      if (saved && ['granted', 'denied'].includes(saved.choice) && saved.expires > Date.now()) return saved.choice;
    } catch (_) { /* Storage can be unavailable in private browsing. */ }
    return null;
  }

  function cleanReferrer() {
    try {
      const url = new URL(document.referrer);
      return url.origin + (url.origin === location.origin ? url.pathname : '/');
    } catch (_) { return ''; }
  }

  function start() {
    if (started || !production) return;
    started = true;
    window['ga-disable-' + id] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: 'denied', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied'
    });
    window.gtag('consent', 'update', {analytics_storage: 'granted'});
    window.gtag('set', 'ads_data_redaction', true);
    window.gtag('js', new Date());
    const config = {
      page_location: location.origin + location.pathname,
      page_referrer: cleanReferrer(),
      page_title: document.title,
      cookie_prefix: 'pgj', cookie_path: '/pelvic_gym/',
      cookie_domain: 'bestme.mobi', cookie_expires: lifetime / 1000,
      cookie_update: false, cookie_flags: 'SameSite=Lax;Secure',
      allow_google_signals: false, allow_ad_personalization_signals: false
    };
    // Only explicit campaign labels; never forward arbitrary URL parameters or search terms.
    const query = new URLSearchParams(location.search);
    for (const [param, field] of [['utm_source', 'campaign_source'], ['utm_medium', 'campaign_medium'], ['utm_campaign', 'campaign_name']]) {
      const value = query.get(param);
      if (value && /^[a-zA-Z0-9_. -]{1,100}$/.test(value)) config[field] = value;
    }
    window.gtag('config', id, config);
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    script.dataset.pelvicGoogleTag = '';
    document.head.appendChild(script);
  }

  function removeCookies() {
    for (const item of document.cookie.split(';')) {
      const name = item.split('=')[0].trim();
      if (!name.startsWith('pgj')) continue;
      for (const domain of ['', '; Domain=bestme.mobi', '; Domain=.bestme.mobi']) {
        for (const path of ['/pelvic_gym/', '/']) {
          document.cookie = name + '=; Max-Age=0; Path=' + path + domain + '; SameSite=Lax; Secure';
        }
      }
    }
  }

  function apply(choice) {
    window.pelvicAnalyticsConsent = choice === 'granted';
    if (choice === 'granted') start();
    else {
      window['ga-disable-' + id] = true;
      if (typeof window.gtag === 'function') window.gtag('consent', 'update', {analytics_storage: 'denied'});
      removeCookies();
    }
    if (status) status.textContent = choice === 'granted' ? 'Analytics is allowed in this browser.' : 'Optional analytics is off in this browser.';
    window.dispatchEvent(new CustomEvent('pelvic:consent', {detail: {granted: choice === 'granted'}}));
  }

  function choose(choice) {
    try { localStorage.setItem(key, JSON.stringify({choice, expires: Date.now() + lifetime})); } catch (_) { /* Honor this choice for the current page anyway. */ }
    const reload = started && choice === 'denied';
    apply(choice);
    if (panel) panel.hidden = true;
    if (returnFocus) returnFocus.focus();
    // Remove the already-loaded Google code after a withdrawal.
    if (reload) location.reload();
  }

  document.querySelectorAll('[data-consent-choice]').forEach(button => {
    button.addEventListener('click', () => choose(button.dataset.consentChoice));
  });
  document.querySelectorAll('[data-privacy-choices]').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => {
      returnFocus = button;
      if (panel) {
        panel.hidden = false;
        panel.querySelector('button').focus();
      }
    });
  });
  window.addEventListener('storage', event => {
    if (event.key !== key) return;
    const choice = savedChoice();
    const reload = started && choice !== 'granted';
    apply(choice || 'denied');
    if (panel) panel.hidden = Boolean(choice);
    if (reload) location.reload();
  });
  const choice = savedChoice();
  if (choice) apply(choice);
  else removeCookies();
  if (panel) panel.hidden = Boolean(choice);
})();
