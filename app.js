/* ============================================================
   Adam Dashboard — runtime
   1. Theme toggle (persisted, prefers-color-scheme default)
   2. Live clock (Asia/Hong_Kong, ticks every second)
   3. Live weather (Open-Meteo, no API key)
   4. Render site cards from data.js
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
    fetch(WEATHER_URL, { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(setWeather)
      .catch(function (err) {
        console.warn('Weather fetch failed:', err && err.message);
        failWeather();
      });
  }
  loadWeather();
  setInterval(loadWeather, 15 * 60 * 1000); /* refresh every 15 min */

  /* ---------- 4. Render site cards ---------- */
  var sites = (window.SITES || []);
  var buckets = { work: [], personal: [] };

  sites.forEach(function (s) {
    var g = (s.group === 'personal') ? 'personal' : 'work';
    buckets[g].push(s);
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
    a.setAttribute('data-group', s.group === 'personal' ? 'personal' : 'work');
    a.setAttribute('aria-label', s.name + ' — ' + (s.nameZh || '') + ' (opens in a new tab)');

    var top = el('div', 'card-top');
    if (s.tag) top.appendChild(el('span', 'tag', s.tag));
    else top.appendChild(el('span', 'tag', s.group === 'personal' ? 'Personal · 私人' : 'Work · 工作'));
    var arrow = el('span', 'arrow', '↗');
    arrow.setAttribute('aria-hidden', 'true');
    top.appendChild(arrow);
    a.appendChild(top);

    a.appendChild(el('h3', 'site-name', s.name));
    if (s.nameZh) a.appendChild(el('p', 'site-name-zh', s.nameZh));
    if (s.desc) a.appendChild(el('p', 'site-desc', s.desc));
    if (s.descZh) a.appendChild(el('p', 'site-desc', s.descZh));

    var host = '';
    try { host = new URL(s.url).host; } catch (e) { host = s.url; }
    var url = el('p', 'site-url', host);
    url.title = s.url;
    a.appendChild(url);

    return a;
  }

  Object.keys(buckets).forEach(function (g) {
    var grid = document.getElementById('grid-' + g);
    var count = document.getElementById('count-' + g);
    var list = buckets[g];
    if (grid) {
      list.forEach(function (s, i) {
        var card = makeCard(s);
        card.style.animationDelay = (i * 60) + 'ms';
        grid.appendChild(card);
      });
    }
    if (count) count.textContent = list.length + (list.length === 1 ? ' item' : ' items');
  });

  var empty = document.getElementById('empty-note');
  if (empty && sites.length === 0) empty.hidden = false;

  /* Expose a tiny hook for tests / console. */
  window.__dashboard = { currentTheme: currentTheme, sites: sites };
})();
