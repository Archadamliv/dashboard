/* ============================================================
   Adam Dashboard — runtime
   1. Theme toggle (persisted, prefers-color-scheme default)
   2. Live clock (Asia/Hong_Kong, ticks every second)
   3. Live weather (Open-Meteo, no API key) — 15-min auto-refresh
   4. Render site cards from data.js
   5. Pull-to-refresh (touch): re-fetches live data on release
   ============================================================ */
(function () {
  'use strict';

  var HK_TZ = 'Asia/Hong_Kong';
  var THEME_KEY = 'dashboard-theme';

  /* ---------- 1. Theme ---------- */
  var root = document.documentElement;
  var toggle = document.getElementById('theme-toggle');
  var ttIcon = toggle ? toggle.querySelector('.tt-icon') : null;
  var ttLabel = toggle ? toggle.querySelector('.tt-label') : null;

  function currentTheme() { return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark'; }

  function paintTheme(theme) {
    var isLight = theme === 'light';
    if (ttIcon) ttIcon.textContent = isLight ? '☀️' : '🌙';
    if (ttLabel) ttLabel.textContent = isLight ? 'Light' : 'Dark';
    if (toggle) toggle.setAttribute('aria-pressed', String(isLight));
  }

  paintTheme(currentTheme());

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
      paintTheme(next);
    });
  }

  /* ---------- 2. Live clock ---------- */
  var clockTime = document.getElementById('clock-time');
  var clockDate = document.getElementById('clock-date');
  var timeFmt, dateFmt;

  try {
    timeFmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: HK_TZ, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    });
    dateFmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: HK_TZ, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  } catch (e) {
    timeFmt = null; dateFmt = null;
  }

  function tick() {
    var now = new Date();
    if (clockTime && timeFmt) clockTime.textContent = timeFmt.format(now);
    if (clockDate) {
      var d = dateFmt ? dateFmt.format(now) : now.toDateString();
      clockDate.innerHTML = d + ' <span class="clock-zone">· HKT UTC+8</span>';
    }
  }
  tick();
  setInterval(tick, 1000);

  /* ---------- 3. Weather (Open-Meteo, keyless) ---------- */
  var WEATHER_URL =
    'https://api.open-meteo.com/v1/forecast' +
    '?latitude=22.3193&longitude=114.1694' +
    '&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m' +
    '&daily=temperature_2m_max,temperature_2m_min' +
    '&timezone=Asia%2FHong_Kong';

  /* WMO weather codes → icon + bilingual text. */
  var WMO = {
    0:  ['☀️', 'Clear sky', '晴朗'],
    1:  ['🌤️', 'Mainly clear', '大致晴朗'],
    2:  ['⛅', 'Partly cloudy', '晴间多云'],
    3:  ['☁️', 'Overcast', '阴天'],
    45: ['🌫️', 'Fog', '有雾'],
    48: ['🌫️', 'Depositing rime fog', '雾凇'],
    51: ['🌦️', 'Light drizzle', '小毛毛雨'],
    53: ['🌦️', 'Drizzle', '毛毛雨'],
    55: ['🌧️', 'Dense drizzle', '密集毛毛雨'],
    56: ['🌧️', 'Light freezing drizzle', '小冻毛毛雨'],
    57: ['🌧️', 'Freezing drizzle', '冻毛毛雨'],
    61: ['🌦️', 'Slight rain', '小雨'],
    63: ['🌧️', 'Rain', '中雨'],
    65: ['🌧️', 'Heavy rain', '大雨'],
    66: ['🌧️', 'Light freezing rain', '小冻雨'],
    67: ['🌧️', 'Freezing rain', '冻雨'],
    71: ['🌨️', 'Slight snow', '小雪'],
    73: ['🌨️', 'Snow', '中雪'],
    75: ['❄️', 'Heavy snow', '大雪'],
    77: ['🌨️', 'Snow grains', '米雪'],
    80: ['🌦️', 'Slight rain showers', '小阵雨'],
    81: ['🌧️', 'Rain showers', '阵雨'],
    82: ['⛈️', 'Violent rain showers', '强阵雨'],
    85: ['🌨️', 'Slight snow showers', '小阵雪'],
    86: ['❄️', 'Snow showers', '阵雪'],
    95: ['⛈️', 'Thunderstorm', '雷暴'],
    96: ['⛈️', 'Thunderstorm with slight hail', '雷暴伴小冰雹'],
    99: ['⛈️', 'Thunderstorm with hail', '雷暴伴冰雹']
  };

  var WIDGET_FAIL = ['🌐', 'Weather unavailable', '天气暂不可用'];

  function describe(code) { return WMO[code] || ['🌡️', 'Unknown', '未知']; }

  var wWidget = document.querySelector('.weather-widget');
  var wIcon = document.getElementById('w-icon');
  var wTemp = document.getElementById('w-temp');
  var wCond = document.getElementById('w-cond');
  var wHilo = document.getElementById('w-hilo');
  var wHum = document.getElementById('w-humidity');
  var wWind = document.getElementById('w-wind');

  function setWeather(data) {
    if (!data || !data.current) { failWeather(); return; }
    var c = data.current;
    var d = (data.daily && data.daily.temperature_2m_max) ? data.daily : null;
    var desc = describe(c.weather_code);
    if (wIcon) wIcon.textContent = desc[0];
    if (wTemp) wTemp.innerHTML = Math.round(c.temperature_2m) + '<span class="unit">°C</span>';
    if (wCond) wCond.textContent = desc[1] + ' · ' + desc[2];
    if (wHilo && d) {
      wHilo.textContent = 'H ' + Math.round(d.temperature_2m_max[0]) + '° / L ' +
        Math.round(d.temperature_2m_min[0]) + '°';
    }
    if (wHum) wHum.textContent = '💧 ' + Math.round(c.relative_humidity_2m) + '%';
    if (wWind) wWind.textContent = '🌬 ' + Math.round(c.wind_speed_10m) + ' km/h';
    if (wWidget) wWidget.classList.remove('is-error');
  }

  function failWeather() {
    if (wIcon) wIcon.textContent = WIDGET_FAIL[0];
    if (wTemp) wTemp.innerHTML = '--<span class="unit">°C</span>';
    if (wCond) wCond.textContent = WIDGET_FAIL[1] + ' · ' + WIDGET_FAIL[2];
    if (wHilo) wHilo.textContent = 'H --° / L --°';
    if (wHum) wHum.textContent = '💧 --%';
    if (wWind) wWind.textContent = '🌬 -- km/h';
    if (wWidget) wWidget.classList.add('is-error');
  }

  function loadWeather() {
    return fetch(WEATHER_URL, { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(setWeather)
      .catch(function (err) {
        console.warn('Weather fetch failed:', err && err.message);
        failWeather();
      });
  }
  loadWeather();
  setInterval(loadWeather, 15 * 60 * 1000); /* refresh every 15 min */

  /* Re-fetch live data (used by pull-to-refresh). */
  function refreshLive() {
    tick();
    return loadWeather();
  }

  /* Hard refresh: clear Cache Storage, then reload fresh (cache-busting).
     This is the "refresh cache" behaviour Adam asked for. */
  var _reloadDone = false;
  function doReload() {
    if (_reloadDone) return;
    _reloadDone = true;
    var u = new URL(window.location.href);
    u.searchParams.set('_r', Date.now().toString(36));
    window.location.replace(u.toString());
  }
  function hardRefresh() {
    try {
      if (window.caches && caches.keys) {
        caches.keys()
          .then(function (keys) { return Promise.all(keys.map(function (k) { return caches.delete(k); })); })
          .catch(function () {})
          .then(doReload);
        setTimeout(doReload, 1500); /* fallback if Cache Storage hangs */
        return;
      }
    } catch (e) { /* fall through */ }
    doReload();
  }

  /* ---------- 4. Render site cards ---------- */
  var sites = (window.SITES || []);
  var GROUPS = window.GROUPS || {};
  var order = Object.keys(GROUPS);
  if (!order.length) order = ['default'];

  var buckets = {};
  order.forEach(function (k) { buckets[k] = []; });
  sites.forEach(function (s) {
    var g = GROUPS[s.group] ? s.group : order[0];
    if (!buckets[g]) buckets[g] = [];
    buckets[g].push(s);
  });

  /* Saved card order (persisted per group; user can drag to reorder). */
  var ORDER_KEY = 'dash-order';
  var savedOrder = {};
  try { savedOrder = JSON.parse(localStorage.getItem(ORDER_KEY) || '{}') || {}; } catch (e) { savedOrder = {}; }
  order.forEach(function (g) {
    var saved = savedOrder[g];
    if (saved && saved.length) {
      buckets[g].sort(function (a, b) {
        var ia = saved.indexOf(a.url), ib = saved.indexOf(b.url);
        if (ia < 0 && ib < 0) return 0;
        if (ia < 0) return 1;
        if (ib < 0) return -1;
        return ia - ib;
      });
    }
  });

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function makeCard(s) {
    var a = el('a', 'site-card reveal');
    a.href = s.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.setAttribute('data-group', s.group);
    a.setAttribute('data-url', s.url);
    a.setAttribute('aria-label', s.name + ' — ' + (s.nameZh || '') + ' (opens in a new tab)');

    var top = el('div', 'card-top');
    var meta = GROUPS[s.group];
    var fb = meta ? (meta.label + (meta.labelZh && meta.labelZh !== meta.label ? ' · ' + meta.labelZh : '')) : '';
    if (s.tag) top.appendChild(el('span', 'tag', s.tag));
    else if (fb) top.appendChild(el('span', 'tag', fb));

    var right = el('div', 'card-top-right');
    var handle = el('button', 'drag-handle');
    handle.type = 'button';
    handle.setAttribute('aria-label', 'Drag to reorder · 拖动排序');
    handle.appendChild(el('span', 'grip', '⠿'));
    handle.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); });
    right.appendChild(handle);
    var arrow = el('span', 'arrow', '↗');
    arrow.setAttribute('aria-hidden', 'true');
    right.appendChild(arrow);
    top.appendChild(right);
    a.appendChild(top);

    a.appendChild(el('h3', 'site-name', s.name));
    if (s.nameZh) a.appendChild(el('p', 'site-name-zh', s.nameZh));

    /* One-line intro only: English, with the Chinese as a lighter tail. */
    if (s.desc || s.descZh) {
      var desc = el('p', 'site-desc', s.desc || '');
      if (s.desc && s.descZh) desc.appendChild(el('span', 'desc-zh', ' · ' + s.descZh));
      else if (s.descZh) desc.appendChild(el('span', 'desc-zh', s.descZh));
      a.appendChild(desc);
    }

    return a;
  }

  /* Collapse state (persisted) */
  var COLLAPSE_KEY = 'dash-collapsed';
  var collapsed = {};
  try { collapsed = JSON.parse(localStorage.getItem(COLLAPSE_KEY) || '{}') || {}; } catch (e) { collapsed = {}; }
  function saveCollapsed() { try { localStorage.setItem(COLLAPSE_KEY, JSON.stringify(collapsed)); } catch (e) {} }

  /* Drag-to-reorder within a group (pointer events: mouse + touch). */
  function saveOrder() {
    var map = {};
    order.forEach(function (g) {
      var grid = document.getElementById('grid-' + g);
      if (!grid) return;
      map[g] = Array.prototype.map.call(grid.querySelectorAll('.site-card'), function (c) {
        return c.getAttribute('data-url');
      });
    });
    try { localStorage.setItem(ORDER_KEY, JSON.stringify(map)); } catch (e) {}
  }

  function enableDrag(grid) {
    var dragging = null;
    grid.addEventListener('pointerdown', function (e) {
      var handle = e.target && e.target.closest ? e.target.closest('.drag-handle') : null;
      if (!handle) return;
      var card = handle.closest('.site-card');
      if (!card) return;
      dragging = card;
      card.classList.add('is-dragging');
      if (handle.setPointerCapture) { try { handle.setPointerCapture(e.pointerId); } catch (err) {} }
      e.preventDefault();
    });
    grid.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      dragging.style.pointerEvents = 'none';
      var under = document.elementFromPoint(e.clientX, e.clientY);
      dragging.style.pointerEvents = '';
      var over = under && under.closest ? under.closest('.site-card') : null;
      if (!over || over === dragging || over.parentNode !== grid) return;
      var r = over.getBoundingClientRect();
      var after = (e.clientX - r.left) > r.width / 2;
      if (after) grid.insertBefore(dragging, over.nextSibling);
      else grid.insertBefore(dragging, over);
    });
    function endDrag() {
      if (!dragging) return;
      dragging.classList.remove('is-dragging');
      dragging.style.pointerEvents = '';
      dragging = null;
      saveOrder();
    }
    grid.addEventListener('pointerup', endDrag);
    grid.addEventListener('pointercancel', endDrag);
  }

  var host = document.getElementById('groups');
  order.forEach(function (g, gi) {
    var meta = GROUPS[g] || { label: g, labelZh: '' };
    var list = buckets[g] || [];

    var section = el('section', 'group');
    section.setAttribute('data-group', g);

    var grid = el('div', 'grid');
    grid.id = 'grid-' + g;
    if (!list.length) {
      grid.appendChild(el('p', 'group-empty', 'Coming soon · 待加入'));
    } else {
      list.forEach(function (s, i) {
        var card = makeCard(s);
        card.style.animationDelay = ((gi + i) * 60) + 'ms';
        grid.appendChild(card);
      });
      enableDrag(grid);
    }

    var head = el('div', 'group-head');
    var h2 = el('h2', null, meta.label);
    if (meta.labelZh && meta.labelZh !== meta.label) {
      h2.appendChild(document.createTextNode(' '));
      h2.appendChild(el('span', 'zh', meta.labelZh));
    }
    head.appendChild(h2);
    if (meta.badge) head.appendChild(el('span', 'group-badge', meta.badge));
    if (list.length) head.appendChild(el('span', 'group-count', list.length + (list.length === 1 ? ' item' : ' items')));

    var startCollapsed = Object.prototype.hasOwnProperty.call(collapsed, g) ? collapsed[g] : true;
    var toggle = el('button', 'collapse-btn');
    toggle.type = 'button';
    toggle.setAttribute('aria-controls', grid.id);
    toggle.setAttribute('aria-expanded', String(!startCollapsed));
    toggle.setAttribute('aria-label', 'Collapse or expand section · 收起 / 展开');
    toggle.appendChild(el('span', 'chev', '▾'));
    toggle.addEventListener('click', function () {
      var isCollapsed = section.classList.toggle('is-collapsed');
      toggle.setAttribute('aria-expanded', String(!isCollapsed));
      collapsed[g] = isCollapsed;
      saveCollapsed();
    });
    head.appendChild(toggle);

    if (startCollapsed) section.classList.add('is-collapsed');

    section.appendChild(head);
    section.appendChild(grid);

    if (host) host.appendChild(section);
  });

  var empty = document.getElementById('empty-note');
  if (empty && sites.length === 0) empty.hidden = false;

  /* ---------- 5. Pull-to-refresh (touch devices) ---------- */
  (function initPullToRefresh() {
    var ptr = document.getElementById('ptr');
    var ptrText = document.getElementById('ptr-text');
    if (!ptr) return;

    var THRESHOLD = 68;     /* drag distance that arms the refresh */
    var MAX = 110;          /* visual ceiling */
    var dragging = false;
    var startY = 0;
    var pull = 0;
    var busy = false;

    function atTop() {
      return (window.pageYOffset || document.documentElement.scrollTop || 0) <= 0;
    }
    function setHeight(h) { ptr.style.height = Math.max(0, h) + 'px'; }
    function label(t) { if (ptrText) ptrText.textContent = t; }

    function onStart(e) {
      if (busy || !atTop() || e.touches.length !== 1) { dragging = false; return; }
      dragging = true;
      startY = e.touches[0].clientY;
      pull = 0;
      ptr.classList.add('ptr-dragging');
    }

    function onMove(e) {
      if (!dragging) return;
      var dy = e.touches[0].clientY - startY;
      if (dy <= 0) { setHeight(0); ptr.classList.remove('is-ready'); pull = 0; return; }
      pull = Math.min(dy * 0.5, MAX);
      setHeight(pull);
      if (pull >= THRESHOLD) { ptr.classList.add('is-ready'); label('Release to refresh · 松手刷新'); }
      else { ptr.classList.remove('is-ready'); label('Pull to refresh · 下拉刷新'); }
    }

    function finish() {
      if (!dragging) return;
      dragging = false;
      ptr.classList.remove('ptr-dragging');
      if (pull >= THRESHOLD) { run(); }
      else { setHeight(0); ptr.classList.remove('is-ready'); }
      pull = 0;
    }

    function run() {
      busy = true;
      ptr.classList.add('is-loading', 'is-ready');
      setHeight(44);
      label('Refreshing cache… · 刷新缓存…');
      hardRefresh(); /* clears cache + hard reload */
      /* Fallback if navigation is blocked: just update live data. */
      setTimeout(function () {
        if (_reloadDone) return;
        Promise.resolve().then(refreshLive).then(function () {
          label('Updated · 已更新');
          setTimeout(function () {
            busy = false;
            ptr.classList.remove('is-loading', 'is-ready');
            setHeight(0);
            label('Pull to refresh · 下拉刷新');
          }, 800);
        });
      }, 1700);
    }

    document.addEventListener('touchstart', onStart, { passive: true });
    document.addEventListener('touchmove', onMove, { passive: true });
    document.addEventListener('touchend', finish, { passive: true });
    document.addEventListener('touchcancel', function () {
      if (!dragging) return;
      dragging = false;
      ptr.classList.remove('ptr-dragging');
      setHeight(0); ptr.classList.remove('is-ready');
      pull = 0;
    }, { passive: true });

    /* Expose for headless tests. */
    window.__ptr = { run: run, threshold: THRESHOLD };
  })();

  /* Header refresh button (mouse + touch) — same cache-clearing refresh. */
  var refreshBtn = document.getElementById('refresh-btn');
  if (refreshBtn) refreshBtn.addEventListener('click', function () { hardRefresh(); });

  /* Simplified static mirror (e.g., GitHub Pages): drop server-dependent bits. */
  var STATIC_MIRROR = /\.github\.io$/i.test(location.hostname) || location.protocol === 'file:';
  if (STATIC_MIRROR) {
    var dbEntry = document.querySelector('.db-entry');
    if (dbEntry && dbEntry.parentNode) dbEntry.parentNode.removeChild(dbEntry);
  }

  /* Expose a tiny hook for tests / console. */
  window.__dashboard = { currentTheme: currentTheme, sites: sites, refresh: refreshLive, hardRefresh: hardRefresh };
})();
