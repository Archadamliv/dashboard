/*
 * data.js — the single place to add a new site.
 * ------------------------------------------------------------------
 * To add an entry, append an object to SITES below:
 *   {
 *     name:   "English title",        // shown large (English first)
 *     nameZh: "中文标题",              // shown under the title
 *     desc:   "English description",   // one line, English
 *     descZh: "中文描述",              // one line, Chinese
 *     url:    "https://…",             // opens in a new tab
 *     group:  "work" | "personal" | "research",  // category key (see GROUPS)
 *     tag:    "Short eyebrow label"    // optional
 *   }
 * The page renders automatically and groups entries by category —
 * no other file needs editing. Section order = GROUPS key order.
 *
 * NOTE (2026-10-14): Cloudflare-only. All Vercel URLs were retired; every
 * entry below points at a *.pages.dev Cloudflare Pages site.
 */
window.SITES = [
  /* ---- Work ---- */
  {
    name: "Culture Economy · Qianhai / Mawan",
    nameZh: "文化趋势研究 · 妈湾",
    desc: "Cultural-trend map for Qianhai / Mawan.",
    descZh: "妈湾文化趋势地图。",
    url: "https://culture-trends-qianhai.pages.dev/",
    group: "work",
    tag: "Trend Study · 趋势研究"
  },
  {
    name: "Resort Trends · S01",
    nameZh: "度假酒店趋势研究 · S01",
    desc: "Resort & hospitality trends (S01).",
    descZh: "度假酒店趋势总览（S01）。",
    url: "https://s01-resort-trends.pages.dev/",
    group: "work",
    tag: "Trend Study · 趋势研究"
  },
  {
    name: "Catchment Analysis · Isochrones & Population",
    nameZh: "服务区分析 · 等时圈与人口",
    desc: "Isochrone and population catchment analysis.",
    descZh: "等时圈与人口覆盖分析。",
    url: "https://ovaladvance-isochrone.pages.dev/",
    group: "work",
    tag: "OVAL Advance"
  },
  {
    name: "CRL Sandbox v1",
    nameZh: "CRL 沙盒 v1",
    desc: "CRL sandbox app (v1).",
    descZh: "CRL 沙盒应用（v1）。",
    url: "https://crl-sandbox-v1.pages.dev/",
    group: "work",
    tag: "Sandbox · 沙盒"
  },

  /* ---- Personal ---- */
  {
    name: "Household Guide",
    nameZh: "家庭指南",
    desc: "Our home guide for you (password-gated).",
    descZh: "家庭指南（带口令门）。",
    url: "https://household-guide.pages.dev/",
    group: "personal",
    tag: "Guide · 手册"
  },
  {
    name: "Story of Our DAYs",
    nameZh: "我们的日子 · 日记",
    desc: "A personal journal of days.",
    descZh: "记录日常的生活日记。",
    url: "https://story-of-days.pages.dev/",
    group: "personal",
    tag: "Journal · 日记"
  },

  /* ---- Ongoing Research ---- */
  {
    name: "Catchment Study · T0-1 · Dayun Tiandi",
    nameZh: "服务区研究 · T0-1 · 大运天地",
    desc: "Travel-time catchments and the population inside them (Longgang).",
    descZh: "通勤等时圈与其覆盖人口研究（龙岗大运天地）。",
    url: "https://t0-1-catchment-web.pages.dev/",
    group: "research",
    tag: "Internal Research · 内部研究"
  },
  {
    name: "Catchment Study · P1 · Yangma Island",
    nameZh: "服务区研究 · P1 · 养马岛",
    desc: "Travel-time catchments and the population inside them (Yangma Island).",
    descZh: "通勤等时圈与其覆盖人口研究（养马岛）。",
    url: "https://p1-yangma-catchment-web.pages.dev/",
    group: "research",
    tag: "Internal Research · 内部研究"
  },
  {
    name: "One Quarter · Tavern Map",
    nameZh: "小酒馆地图",
    desc: "Map exploration of taverns / bars.",
    descZh: "小酒馆 / 酒吧地图探索。",
    url: "https://tavern-map.pages.dev/",
    group: "research",
    tag: "Ongoing · 进行中"
  }
];

/* Category metadata — labels are bilingual (English first, Chinese second).
   Object order defines the on-page section order.
   Order: Work → Personal → Ongoing Research (research is deliberately last, kept
   separate from work; it is the "Development" track that later feeds results). */
window.GROUPS = {
  work:     { label: "Work",             labelZh: "工作" },
  personal: { label: "Personal",         labelZh: "私人" },
  research: { label: "Ongoing Research", labelZh: "发展中", badge: "Development" }
};
