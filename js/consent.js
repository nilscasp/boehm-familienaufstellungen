/* ========================================
   Bertram Böhm — Einwilligung + Meta-Pixel
   Pixel lädt nur nach "Akzeptieren". Ohne PIXEL_ID passiert nichts.
   ======================================== */

(function () {
  var PIXEL_ID = '1423137399255863'; // Datensatz boehm-familienaufstellungen.de, Portfolio "Bertram Böhm"
  var KEY = 'bbConsent'; // 'granted' | 'denied'

  if (!PIXEL_ID) return;

  function read() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function write(v) {
    try { localStorage.setItem(KEY, v); } catch (e) { /* privat/blockiert: Banner kommt beim nächsten Aufruf wieder */ }
  }

  var loaded = false;
  function loadPixel() {
    if (loaded) return;
    loaded = true;
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  // Wird von main.js nach erfolgreich gesendetem Formular aufgerufen
  window.bbTrackLead = function (details) {
    if (loaded && window.fbq) window.fbq('track', 'Lead', details || {});
  };

  function hideBanner() {
    var el = document.getElementById('consent-banner');
    if (el) el.remove();
  }

  function showBanner() {
    if (document.getElementById('consent-banner')) return;
    var el = document.createElement('div');
    el.id = 'consent-banner';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Cookie-Einstellungen');
    el.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:9999;background:var(--color-accent-dark,#2c3e50);color:rgba(255,255,255,0.92);padding:1rem 1.25rem;font-size:0.9rem;box-shadow:0 -4px 16px rgba(0,0,0,0.15);';
    el.innerHTML =
      '<div style="max-width:1200px;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;gap:0.75rem 1.25rem;">' +
        '<p style="margin:0;flex:1 1 320px;">Mit Ihrer Einwilligung nutze ich das Meta-Pixel, um zu messen, ob meine Anzeigen auf Facebook und Instagram zu Anmeldungen führen. Dabei werden Daten an Meta übermittelt, auch in die USA. Sie können die Einwilligung jederzeit unter „Cookie-Einstellungen“ im Seitenfuß widerrufen. <a href="datenschutz.html#meta-pixel" style="color:var(--color-accent-warm-light,#e8c9a0);text-decoration:underline;">Mehr erfahren</a></p>' +
        '<div style="display:flex;gap:0.6rem;flex:0 0 auto;">' +
          '<button type="button" data-consent="denied" class="btn btn--secondary" style="padding:0.5rem 1.25rem;font-size:0.85rem;background:transparent;color:#fff;border-color:rgba(255,255,255,0.7);">Ablehnen</button>' +
          '<button type="button" data-consent="granted" class="btn btn--secondary" style="padding:0.5rem 1.25rem;font-size:0.85rem;background:transparent;color:#fff;border-color:rgba(255,255,255,0.7);">Akzeptieren</button>' +
        '</div>' +
      '</div>';
    el.addEventListener('click', function (ev) {
      var choice = ev.target && ev.target.getAttribute('data-consent');
      if (!choice) return;
      write(choice);
      hideBanner();
      if (choice === 'granted') loadPixel();
    });
    document.body.appendChild(el);
  }

  // "Cookie-Einstellungen" im Seitenfuß neben dem Datenschutz-Link
  window.bbOpenConsent = function () {
    try { localStorage.removeItem(KEY); } catch (e) { /* ignorieren */ }
    if (loaded) { location.reload(); return; } // geladenes Pixel lässt sich nur per Neuladen entfernen
    showBanner();
  };

  function addFooterLink() {
    var dsLink = document.querySelector('.footer__bottom a[href="datenschutz.html"]');
    if (!dsLink || document.getElementById('consent-footer-link')) return;
    var a = document.createElement('a');
    a.id = 'consent-footer-link';
    a.href = '#';
    a.textContent = 'Cookie-Einstellungen';
    a.addEventListener('click', function (ev) { ev.preventDefault(); window.bbOpenConsent(); });
    dsLink.parentNode.insertBefore(a, dsLink.nextSibling);
  }

  function init() {
    var old = document.getElementById('cookie-notice');
    if (old) old.remove();
    addFooterLink();
    var state = read();
    if (state === 'granted') loadPixel();
    else if (state !== 'denied') showBanner();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
