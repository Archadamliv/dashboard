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
 *     group:  "trend" | "oval" | "personal",  // category key (see GROUPS)
 *     tag:    "Short label"            // small eyebrow tag (optional)
 *   }
 * The page renders automatically and groups entries by category —
 * no other file needs editing. Section order = GROUPS key order.
 */
window.SITES = [
  {
    name: "Culture Economy · Qianhai / Mawan",
    nameZh: "文化趋势研究 · 妈湾",
    desc: "Cultural-trend map for Qianhai / Mawan.",
    descZh: "妈湾文化趋势地图。",
    url: "https://culture-trends-qianhai.vercel.app/",
    group: "trend",
    tag: "文化趋势 · Culture"
  },
  {
    name: "Resort Trends · S01",
    nameZh: "度假酒店趋势研究 · S01",
    desc: "Resort & hospitality trends (S01).",
    descZh: "度假酒店趋势总览（S01）。",
    url: "https://s01-resort-trends.vercel.app/",
    group: "trend",
    tag: "度假酒店 · Resort"
  },
  {
    name: "Catchment Analysis · Isochrones & Population",
    nameZh: "服务区分析 · 等时圈与人口",
    desc: "Isochrone and population catchment analysis.",
    descZh: "等时圈与人口覆盖分析。",
    url: "https://ovaladvance-isochrone.vercel.app/",
    group: "oval",
    tag: "Isochrone · 等时圈"
  },
  {
    name: "Household Guide",
    nameZh: "家务手册",
    desc: "Mobile-first multi-page guide for running the household.",
    descZh: "移动优先的家庭事务多页指南。",
    url: "https://household-guide-ten.vercel.app/",
    group: "personal",
    tag: "Guide · 手册"
  }
];

/* Category metadata — labels are bilingual (English first, Chinese second).
   Object order defines the on-page section order. */
window.GROUPS = {
  trend:    { label: "Trend Study",  labelZh: "趋势研究" },
  oval:     { label: "OVAL Advance", labelZh: "OVAL Advance" },
  personal: { label: "Personal",     labelZh: "私人" }
};
