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
 *     group:  "work" | "personal",     // which section it lands in
 *     tag:    "Short label"            // small eyebrow tag (optional)
 *   }
 * The page renders automatically — no other file needs editing.
 */
window.SITES = [
  {
    name: "Culture Economy · Qianhai / Mawan",
    nameZh: "文化趋势研究 · 妈湾",
    desc: "Cultural-trend research for Qianhai / Mawan.",
    descZh: "妈湾文化趋势研究。",
    url: "https://culture-trends-qianhai.vercel.app/",
    group: "work",
    tag: "Research · 研究"
  },
  {
    name: "Catchment Analysis · Isochrones & Population",
    nameZh: "服务区分析 · 等时圈与人口（OVAL Advance）",
    desc: "Isochrone and population catchment analysis (OVAL Advance).",
    descZh: "等时圈与人口覆盖分析（OVAL Advance）。",
    url: "https://ovaladvance-isochrone.vercel.app/",
    group: "work",
    tag: "OVAL Advance"
  },
  {
    name: "Resort Trends · S01",
    nameZh: "度假酒店趋势研究 · S01",
    desc: "Resort / hospitality trend research (S01).",
    descZh: "度假酒店趋势研究（S01）。",
    url: "https://s01-resort-trends.vercel.app/",
    group: "work",
    tag: "Research · 研究"
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

/* Section metadata — labels are bilingual (English first, Chinese second). */
window.GROUPS = {
  work:     { label: "Work",     labelZh: "工作" },
  personal: { label: "Personal", labelZh: "私人" }
};
