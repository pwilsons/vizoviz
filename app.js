(function () {
  'use strict';
  var METRICA_ID = 110626651;   // Yandex Metrica counter; 0 = no analytics, banner stays hidden
  var KEY = 'cookie_consent', loaded = false;

  // Year in the footer
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // Email address assembled in the browser (not present in the page source as plain text)
  document.querySelectorAll('a[data-mail]').forEach(function (a) {
    var addr = a.getAttribute('data-u') + '@' + a.getAttribute('data-d');
    a.href = 'mailto:' + addr;
    a.textContent = addr;
  });

  // Intro video block: shown only if the video file exists on the hosting
  var vsec = document.getElementById('video');
  if (vsec) {
    var src = vsec.querySelector('source');
    if (src && window.fetch) {
      fetch(src.getAttribute('src'), { method: 'HEAD' })
        .then(function (r) { if (r.ok) vsec.hidden = false; })
        .catch(function () {});
    }
  }

  // Cookie notice + Yandex Metrica (loaded only after "Accept")
  var box = document.getElementById('cookie');
  if (!METRICA_ID || !box) return;

  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function loadMetrica() {
    if (loaded) return; loaded = true;
    (function (m, e, t, r, i, k, a) {
      m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
      m[i].l = 1 * new Date(); k = e.createElement(t); a = e.getElementsByTagName(t)[0];
      k.async = 1; k.src = r; a.parentNode.insertBefore(k, a);
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');
    ym(METRICA_ID, 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: false });
    document.addEventListener('click', function (ev) {
      var el = ev.target.closest('[data-goal]');
      if (el) ym(METRICA_ID, 'reachGoal', el.getAttribute('data-goal'));
    });
  }

  function clearMetrica() {
    try {
      document.cookie.split(';').forEach(function (c) {
        var n = c.split('=')[0].trim();
        if (/^_ym/.test(n) || n === 'yabs-sid' || n === 'yandexuid' || n === 'i' || n === 'ymex') {
          document.cookie = n + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        }
      });
    } catch (e) {}
  }

  var s = get();
  if (s === 'yes') loadMetrica(); else if (s !== 'no') box.hidden = false;

  document.getElementById('cookie-yes').onclick = function () { set('yes'); box.hidden = true; loadMetrica(); };
  document.getElementById('cookie-no').onclick = function () { set('no'); box.hidden = true; clearMetrica(); };
  document.getElementById('cookie-settings').onclick = function () { box.hidden = false; };
})();
