// Tests the consent boundary without loading a browser or contacting Google.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('pelvic_gym/assets/analytics.js', 'utf8');
const key = 'pelvic_journal_analytics_v1';
function harness(options = {}) {
  const handlers = {}, inserted = [], cookies = [], values = new Map();
  if (options.saved) values.set(key, JSON.stringify(options.saved));
  const element = (dataset = {}) => ({dataset, hidden: true, addEventListener(type, cb) {this[type] = cb;}, focus() {this.focused = true;}});
  const decline = element({consentChoice:'denied'}), allow = element({consentChoice:'granted'}), opener = element();
  const panel = element(); panel.querySelector = () => decline;
  const status = {};
  const document = {
    title: 'Pelvic Gym', referrer: 'https://example.com/private?email=person@example.com',
    querySelector: s => s === '[data-consent-panel]' ? panel : status,
    querySelectorAll: s => s === '[data-consent-choice]' ? [decline, allow] : [opener],
    createElement: () => ({dataset:{}}), head: {appendChild: el => inserted.push(el)},
    get cookie() {return 'pgj_ga=123; unrelated_cookie=keep';}, set cookie(value) {cookies.push(value);}
  };
  const location = {hostname: options.local ? '127.0.0.1' : 'bestme.mobi', origin:'https://bestme.mobi', pathname:'/pelvic_gym/', search:'?email=private@example.com&utm_source=newsletter&utm_medium=email&utm_campaign=autumn&search=pain', reload() {this.reloaded = true;}};
  const window = {addEventListener: (type, cb) => {handlers[type] = cb;}, dispatchEvent() {}};
  const localStorage = {
    getItem: k => {if (options.storageBlocked) throw Error('blocked'); return values.get(k);},
    setItem: (k,v) => {if (options.storageBlocked) throw Error('blocked'); values.set(k,v);}
  };
  vm.runInNewContext(source, {window, document, location, localStorage, URL, URLSearchParams, Date, CustomEvent: class {constructor(type, data) {this.type=type;this.detail=data.detail;}}});
  return {window,location,values,handlers,inserted,cookies,panel,status,decline,allow,opener};
}
const fresh = harness();
assert.equal(fresh.inserted.length, 0, 'No Google script before a choice');
assert.equal(fresh.panel.hidden, false);
fresh.decline.click();
assert.equal(fresh.inserted.length, 0, 'Declining never loads Google');
assert.equal(fresh.window.pelvicAnalyticsConsent, false);
fresh.opener.click(); fresh.allow.click();
assert.equal(fresh.inserted.length, 1);
assert.equal(fresh.window.pelvicAnalyticsConsent, true);
const queue = fresh.window.dataLayer.map(item => Array.from(item));
assert.equal(queue[0][2].analytics_storage, 'denied');
assert.equal(queue[0][2].ad_storage, 'denied');
assert.equal(queue[1][2].analytics_storage, 'granted');
const config = queue.find(item => item[0] === 'config')[2];
assert.equal(config.page_location, 'https://bestme.mobi/pelvic_gym/');
assert.equal(config.page_referrer, 'https://example.com/');
assert.equal(config.campaign_source, 'newsletter');
assert.equal(config.allow_google_signals, false);
assert.equal(config.allow_ad_personalization_signals, false);
assert.ok(!JSON.stringify(queue).includes('private@example.com'));
assert.ok(!JSON.stringify(queue).includes('search=pain'));
fresh.allow.click(); assert.equal(fresh.inserted.length, 1, 'No duplicate initialization');
fresh.opener.click(); fresh.decline.click();
assert.equal(fresh.window['ga-disable-G-GYLTHF349T'], true);
assert.equal(fresh.window.pelvicAnalyticsConsent, false);
assert.equal(fresh.location.reloaded, true, 'Withdrawal unloads the tag');
assert.ok(fresh.cookies.every(cookie => !cookie.startsWith('unrelated_cookie')));
const accepted = harness({saved:{choice:'granted',expires:Date.now()+10000}});
assert.equal(accepted.inserted.length, 1);
assert.equal(accepted.panel.hidden, true);
const rejected = harness({saved:{choice:'denied',expires:Date.now()+10000}});
assert.equal(rejected.inserted.length, 0);
assert.equal(rejected.panel.hidden, true);
const expired = harness({saved:{choice:'granted',expires:Date.now()-1}});
assert.equal(expired.inserted.length, 0);
assert.equal(expired.panel.hidden, false);
const blocked = harness({storageBlocked:true}); blocked.allow.click();
assert.equal(blocked.inserted.length, 1, 'Storage failure does not break current-page choice');
const local = harness({local:true}); local.allow.click();
assert.equal(local.inserted.length, 0, 'Local previews do not send Analytics');
accepted.values.set(key, JSON.stringify({choice:'denied',expires:Date.now()+10000}));
accepted.handlers.storage({key});
assert.equal(accepted.window.pelvicAnalyticsConsent, false);
assert.equal(accepted.location.reloaded, true, 'Withdrawal applies across tabs');
console.log('PASS: initial denial, opt-in, opt-out, repeat visits, expiry, storage failure, local preview isolation, query redaction, cookie cleanup and cross-tab withdrawal.');
