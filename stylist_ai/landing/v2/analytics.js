/* Landing analytics: only the published main page sends data. See ANALYTICS.md. */
(() => {
  'use strict';
  const query = new URLSearchParams(location.search);
  const local = ['localhost', '127.0.0.1'].includes(location.hostname);
  const dryRun = local && query.get('analytics_test') === '1';
  const production = location.hostname === 'bestme.mobi' && /^\/stylist_ai\/(?:index\.html)?$/.test(location.pathname);
  if ((!production && !dryRun) || window.top !== window.self || window.stylistAnalytics) return;
  // A visitor can explicitly opt out without changing the landing's appearance.
  try { if (localStorage.getItem('stylist_analytics_opt_out') === '1') return; } catch (_) {}
  if (navigator.globalPrivacyControl === true) return;

  const debug = query.get('analytics_debug') === '1';
  const config = {
    apiKey: 'AIzaSyCyc1u8Y6KaIS1c5d1M6lkiF_U6dVipw98',
    projectId: 'stylist-ai-679d4',
    appId: '1:450776145761:web:3baa39866793e42678ef20',
    measurementId: 'G-W5SLGWMJ48'
  };
  const features = {
    passport: 'color_analysis', combos: 'color_combos', 'try-on': 'hair_recolor',
    nails: 'nail_polish', makeup: 'makeup_try_on', shopping: 'live_shopping',
    'rate-look': 'rate_my_look', 'outfit-match': 'outfit_match'
  };
  // Keep campaign attribution; never forward arbitrary query parameters or hashes.
  const pageURL = new URL('https://bestme.mobi/stylist_ai/');
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id']) {
    const value = query.get(key);
    if (value && /^[\w .~+\/-]{1,100}$/.test(value)) pageURL.searchParams.set(key, value);
  }
  let referrer = '';
  try { referrer = new URL(document.referrer).origin + '/'; } catch (_) {}
  const ua = navigator.userAgent;
  const browserContext = /TikTok|musical_ly|Bytedance/i.test(ua) ? 'tiktok' : /Instagram/i.test(ua) ? 'instagram' : /FBAN|FBAV/i.test(ua) ? 'facebook' : 'browser';
  const base = {
    landing_variant: '04-season-spectrum', landing_version: '2026-10-24.1',
    browser_context: browserContext, page_location: pageURL.href, page_referrer: referrer,
    page_title: 'Stylist AI — AI color analysis', ...(debug ? {debug_mode: true} : {})
  };
  const queue = [], recorded = [], milestones = new Set(), engagement = new Set();
  let send = null, stopped = false, lastTick = performance.now(), visibleMs = 0, maxDepth = 0;
  let season = 'winter', storeClicks = 0, summaryNumber = 0, timer;
  const cards = [...document.querySelectorAll('[data-feature]')].map(el => ({
    el, feature: features[el.dataset.feature], entered: null, seen: false, visibleMs: 0, flushedMs: 0
  })).filter(card => card.feature);
  const api = window.stylistAnalytics = {status: dryRun ? 'test' : 'loading'};
  if (dryRun) api.events = recorded;
  function event(name, params = {}) {
    const payload = {...base, ...params};
    // Independent destinations share one definition of each interaction.
    window.dispatchEvent(new CustomEvent('stylist:analytics', {detail: {name, params: payload}}));
    if (stopped) return;
    if (dryRun) { recorded.push({name, params: payload}); return; }
    if (send) send(name, payload);
    else if (queue.length < 150) queue.push([name, payload]);
  }
  function depth() {
    const available = document.documentElement.scrollHeight - innerHeight;
    return available <= 0 ? 100 : Math.max(0, Math.min(100, Math.round(scrollY / available * 100)));
  }
  function flushCard(card, now) {
    if (card.entered !== null) { card.visibleMs += now - card.entered; card.entered = null; }
    const delta = Math.round(card.visibleMs - card.flushedMs);
    // Deltas, never cumulative values, so the metric can be summed in reports.
    if (card.seen && delta >= 100) {
      event('landing_feature_time', {feature: card.feature, feature_visible_ms: delta});
      card.flushedMs = card.visibleMs;
    }
  }
  function tick() {
    const now = performance.now();
    if (!document.hidden) visibleMs += now - lastTick;
    lastTick = now;
    if (document.hidden) return;
    const current = depth();
    maxDepth = Math.max(maxDepth, current);
    for (const percent of [25, 50, 75, 90, 100]) {
      if (current >= percent && !milestones.has(percent)) {
        milestones.add(percent);
        event('landing_scroll', {scroll_percent: percent});
      }
    }
    const dock = document.querySelector('.download-dock');
    const bottom = Math.min(innerHeight, dock ? dock.getBoundingClientRect().top : innerHeight);
    for (const card of cards) {
      const rect = card.el.getBoundingClientRect();
      const overlap = Math.max(0, Math.min(rect.bottom, bottom) - Math.max(rect.top, 0));
      const visible = overlap >= Math.min(rect.height * .5, bottom * .5) && rect.right > 0 && rect.left < innerWidth;
      if (visible) {
        if (card.entered === null) card.entered = now;
        if (!card.seen && now - card.entered >= 1000) {
          card.seen = true;
          event('landing_feature_view', {feature: card.feature, scroll_percent: current});
        }
      } else flushCard(card, now);
    }
    for (const seconds of [10, 30, 60, 120]) {
      if (visibleMs >= seconds * 1000 && !engagement.has(seconds)) {
        engagement.add(seconds);
        event('landing_engaged', {engaged_seconds: seconds});
      }
    }
  }
  function currentFeature() {
    const card = cards.find(item => item.entered !== null);
    return card ? card.feature : (scrollY < innerHeight / 2 ? 'hero' : 'between_features');
  }
  function tap(e) {
    if (e.type === 'auxclick' && e.button !== 1) return;
    if (!(e.target instanceof Element)) return;
    tick();
    const target = e.target, card = target.closest('[data-feature]');
    const feature = card && features[card.dataset.feature];
    const download = target.closest('[data-download]');
    if (feature) event('landing_feature_tap', {
      feature, tap_target: download ? 'download_link' : target.closest('.feature-image,.passport-feature-art') ? 'image' : target.closest('h3') ? 'title' : 'card'
    });
    const palette = target.closest('[data-season]');
    if (palette) {
      const previous = season; season = palette.dataset.season;
      event('landing_palette_select', {season, previous_season: previous});
    }
    if (download) {
      storeClicks++;
      event('landing_store_click', {
        placement: download.dataset.placement === 'sticky' ? 'sticky' : 'feature',
        feature: feature || currentFeature(), scroll_percent: depth(), season,
        visible_ms: Math.round(visibleMs), features_seen: cards.filter(c => c.seen).length,
        destination: 'app_store', transport_type: 'beacon'
      });
    } else {
      const link = target.closest('.legal-links a,.brand,.skip');
      if (link) event('landing_link_click', {link_type: link.matches('.brand') ? 'home' : link.matches('.skip') ? 'skip' : link.textContent.trim().toLowerCase()});
    }
  }
  function suspend() {
    const now = performance.now();
    // Visibility has already changed by the time this event is dispatched.
    visibleMs += now - lastTick; lastTick = now;
    cards.forEach(card => flushCard(card, now));
    if (timer) clearInterval(timer);
    timer = null;
    event('landing_session_summary', {
      summary_number: ++summaryNumber, visible_ms: Math.round(visibleMs),
      scroll_percent: maxDepth, features_seen: cards.filter(c => c.seen).length,
      store_clicks: storeClicks, transport_type: 'beacon'
    });
  }
  function resume() {
    lastTick = performance.now();
    if (!timer) timer = setInterval(tick, 250);
    tick();
  }
  document.addEventListener('click', tap, {capture: true});
  document.addEventListener('auxclick', tap, {capture: true});
  document.addEventListener('visibilitychange', () => document.hidden ? (timer && suspend()) : resume());
  window.addEventListener('pagehide', () => { if (timer) suspend(); });
  window.addEventListener('pageshow', e => { if (e.persisted && !document.hidden) resume(); });
  event('page_view');
  event('landing_view');
  if (!document.hidden) resume();

  if (!dryRun) (async () => {
    try {
      // Establish ad restrictions before Firebase initializes the Google tag.
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
      window.gtag('consent', 'default', {
        analytics_storage: 'granted', ad_storage: 'denied',
        ad_user_data: 'denied', ad_personalization: 'denied'
      });
      window.gtag('set', 'ads_data_redaction', true);
      const [{initializeApp}, sdk] = await Promise.all([
        import('https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js'),
        import('https://www.gstatic.com/firebasejs/13.1.0/firebase-analytics.js')
      ]);
      if (!await sdk.isSupported()) throw new Error('unsupported');
      const analytics = sdk.initializeAnalytics(initializeApp(config), {config: {
        send_page_view: false, page_location: pageURL.href, page_referrer: referrer,
        allow_google_signals: false, allow_ad_personalization_signals: false,
        cookie_flags: 'SameSite=Lax;Secure', ...(debug ? {debug_mode: true} : {})
      }});
      send = (name, params) => sdk.logEvent(analytics, name, params);
      queue.splice(0).forEach(([name, params]) => send(name, params));
      api.status = 'ready';
    } catch (_) {
      // Tracking is optional infrastructure; its failure must never break the page or CTA.
      api.status = 'unavailable'; stopped = true; queue.length = 0;
    }
  })();
})();
