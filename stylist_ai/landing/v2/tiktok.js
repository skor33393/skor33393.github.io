(() => {
  'use strict';
  const cfg = window.STYLIST_TIKTOK_CONFIG;
  const query = new URLSearchParams(location.search);
  const test = ['localhost', '127.0.0.1'].includes(location.hostname) && query.get('analytics_test') === '1';
  const production = location.hostname === 'bestme.mobi' && /^\/stylist_ai\/(?:index\.html)?$/.test(location.pathname);
  if ((!production && !test) || window.top !== self || !cfg || !/^[A-Z0-9]{20}$/.test(cfg.pixelId) || window.stylistTikTok) return;
  const optedOut = () => {
    try { return navigator.globalPrivacyControl === true || localStorage.getItem('stylist_analytics_opt_out') === '1'; }
    catch (_) { return navigator.globalPrivacyControl === true; }
  };
  if (optedOut()) return;
  // Debug visits must not send real TikTok ad signals; use local mocks for browser QA.
  if (!test && query.get('analytics_debug') === '1') return;
  const names = {
    page_view: 'Pageview', landing_view: 'ViewContent', landing_store_click: 'AppStoreClick',
    landing_feature_view: 'FeatureView', landing_feature_tap: 'FeatureTap',
    landing_palette_select: 'PaletteSelect', landing_scroll: 'ScrollDepth', landing_engaged: 'EngagedVisit'
  };
  const api = window.stylistTikTok = {pixel: 'queued', server: cfg.endpoint ? 'enabled' : 'not_configured'};
  const samples = [];
  if (test) api.events = samples;
  let clickId = query.get('ttclid') || '';
  if (!/^[A-Za-z0-9._~-]{1,1024}$/.test(clickId)) clickId = '';
  try {
    if (clickId) sessionStorage.setItem('stylist_ttclid', clickId);
    else clickId = sessionStorage.getItem('stylist_ttclid') || '';
  } catch (_) {}
  if (!/^[A-Za-z0-9._~-]{1,1024}$/.test(clickId)) clickId = '';
  function cookieId() {
    try {
      const value = decodeURIComponent((document.cookie.match(/(?:^|;\s*)_ttp=([^;]+)/) || [])[1] || '');
      return /^[A-Za-z0-9._~-]{1,256}$/.test(value) ? value : '';
    } catch (_) { return ''; }
  }
  function eventId() {
    if (crypto.randomUUID) return crypto.randomUUID();
    return Array.from(crypto.getRandomValues(new Uint8Array(16)), n => n.toString(16).padStart(2, '0')).join('');
  }
  function track(detail) {
    const name = names[detail?.name];
    if (!name || optedOut()) return;
    const source = detail.params || {}, properties = {};
    for (const key of ['feature', 'placement', 'tap_target', 'season', 'previous_season', 'landing_variant', 'browser_context']) {
      if (typeof source[key] === 'string' && /^[a-z0-9_-]{1,50}$/.test(source[key])) properties[key] = source[key];
    }
    for (const key of ['scroll_percent', 'features_seen', 'engaged_seconds']) {
      if (Number.isInteger(source[key]) && source[key] >= 0 && source[key] <= 1000) properties[key] = source[key];
    }
    const event = {
      event: name, event_id: eventId(), event_time: Math.floor(Date.now() / 1000),
      page: {url: source.page_location || 'https://bestme.mobi/stylist_ai/', referrer: source.page_referrer || ''},
      properties, match: {ttclid: clickId, ttp: cookieId()}
    };
    if (test) { samples.push(event); return; }
    try { window.ttq.track(name, properties, {event_id: event.event_id}); } catch (_) {}
    if (!cfg.endpoint) return;
    const body = JSON.stringify(event);
    // Keepalive allows store navigation immediately; retries keep the same deduplication ID.
    const deliver = attempt => fetch(cfg.endpoint, {
      method: 'POST', mode: 'cors', credentials: 'omit', keepalive: true,
      headers: {'Content-Type': 'text/plain;charset=UTF-8'}, body
    }).then(response => {
      if ((response.status === 429 || response.status >= 500) && attempt === 0) throw new Error('retry');
      api.server = response.ok ? 'accepted' : 'error';
    }).catch(() => {
      api.server = 'unavailable';
      if (attempt === 0 && !document.hidden) setTimeout(() => { if (!optedOut()) deliver(1); }, 800);
    });
    deliver(0);
  }
  // Install the provided official Pixel bootstrap, with tracking events emitted centrally below.
  if (!test) {
    window.TiktokAnalyticsObject = 'ttq';
    const ttq = window.ttq = window.ttq || [];
    ttq.methods = ['page','track','identify','instances','debug','on','off','once','ready','alias','group','enableCookie','disableCookie','holdConsent','revokeConsent','grantConsent'];
    ttq.setAndDefer = (target, method) => { target[method] = function () { target.push([method].concat(Array.from(arguments))); }; };
    ttq.methods.forEach(method => ttq.setAndDefer(ttq, method));
    ttq.instance = id => {
      const instance = ttq._i[id] || [];
      ttq.methods.forEach(method => ttq.setAndDefer(instance, method));
      return instance;
    };
    ttq.load = (id, options = {}) => {
      const url = 'https://analytics.tiktok.com/i18n/pixel/events.js';
      ttq._i = ttq._i || {}; ttq._i[id] = []; ttq._i[id]._u = url;
      ttq._t = ttq._t || {}; ttq._t[id] = Date.now();
      ttq._o = ttq._o || {}; ttq._o[id] = options;
      const script = document.createElement('script'); script.async = true;
      script.src = url + '?sdkid=' + encodeURIComponent(id) + '&lib=ttq';
      script.onload = () => { api.pixel = 'loaded'; };
      script.onerror = () => { api.pixel = 'unavailable'; };
      document.head.appendChild(script);
    };
    ttq.load(cfg.pixelId);
  }
  window.addEventListener('stylist:analytics', e => track(e.detail));
})();
