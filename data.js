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
    tag: "T"
  },
  {
    name: "Resort Trends · S01",
    nameZh: "度假酒店趋势研究 · S01",
    desc: "Resort & hospitality trends (S01).",
    descZh: "度假酒店趋势总览（S01）。",
    url: "https://s01-resort-trends.pages.dev/",
    group: "work",
    tag: "T"
  },
  {
    name: "Catchment Analysis · Isochrones & Population",
    nameZh: "服务区分析 · 等时圈与人口",
    desc: "Isochrone and population catchment analysis.",
    descZh: "等时圈与人口覆盖分析。",
    url: "https://ovaladvance-isochrone.pages.dev/",
    group: "research",
    tag: "R"
  },
  {
    name: "CRL Sandbox v1",
    nameZh: "CRL 沙盒 v1",
    desc: "CRL sandbox app (v1).",
    descZh: "CRL 沙盒应用（v1）。",
    url: "https://crl-sandbox-v1.pages.dev/",
    group: "work",
    tag: "S"
  },

  /* ---- Personal ---- */
  {
    name: "Household Guide",
    nameZh: "家庭指南",
    desc: "Our home guide for you (password-gated).",
    descZh: "家庭指南（带口令门）。",
    url: "https://household-guide.pages.dev/",
    group: "personal",
    tag: "G"
  },
  {
    name: "Story of Our DAYs",
    nameZh: "我们的日子 · 日记",
    desc: "A personal journal of days.",
    descZh: "记录日常的生活日记。",
    url: "https://story-of-days.pages.dev/",
    group: "personal",
    tag: "J"
  },

  /* ---- Ongoing Research ---- */
  {
    name: "Catchment Study · T0-1 · Dayun Tiandi",
    nameZh: "服务区研究 · T0-1 · 大运天地",
    desc: "Travel-time catchments and the population inside them (Longgang).",
    descZh: "通勤等时圈与其覆盖人口研究（龙岗大运天地）。",
    url: "https://t0-1-catchment-web.pages.dev/",
    group: "research",
    tag: "R"
  },
  {
    name: "Catchment Study · P1 · Yangma Island",
    nameZh: "服务区研究 · P1 · 养马岛",
    desc: "Travel-time catchments and the population inside them (Yangma Island).",
    descZh: "通勤等时圈与其覆盖人口研究（养马岛）。",
    url: "https://p1-yangma-catchment-web.pages.dev/",
    group: "research",
    tag: "R"
  },
  {
    name: "One Quarter · Tavern Map",
    nameZh: "小酒馆地图",
    desc: "Map exploration of taverns / bars.",
    descZh: "小酒馆 / 酒吧地图探索。",
    url: "https://tavern-map.pages.dev/",
    group: "research",
    tag: "R"
  },

  /* ---- Library / 库 ----
   * New pages land here FIRST; Adam re-files them into Work / Personal /
   * Ongoing Research from the card menu (Move · 归类).
   * status: "temp"  → shows a TEMP chip with days left (from `expires`)
   * status: "stable"→ shows a STABLE chip (no expiry)   */
  {
    name: "Catchment & POI Study · P1 · Yangma Island",
    nameZh: "养马岛 · 前期分析（可达 + POI）",
    desc: "Travel-time catchments, population and POI composition (P1).",
    descZh: "等时圈、人口与 POI 构成（P1 养马岛）。",
    url: "https://oval-share.archadamliv.workers.dev/p1-yangma-catchment-oval/",
    group: "library",
    status: "temp",
    expires: "2026-10-23",
    src: "oval-share"
  },
  {
    name: "Catchment Study · T0-1 · Dayun Tiandi",
    nameZh: "T0-1 大运天地 · 可达研究",
    desc: "Catchment study for Dayun Tiandi (T0-1).",
    descZh: "大运天地可达性研究（T0-1）。",
    url: "https://oval-share.archadamliv.workers.dev/t0-1-catchment-brand/",
    group: "library",
    status: "temp",
    expires: "2026-10-23",
    src: "oval-share"
  },
  {
    name: "T0-1 Dayun Tiandi · Catchment & POI (Phase 1)",
    nameZh: "T0-1 大运天地 · 阶段一（可达 + POI）",
    desc: "Catchment and POI study, phase 1.",
    descZh: "等时圈与 POI 构成研究（阶段一）。",
    url: "https://oval-share.archadamliv.workers.dev/t0-1-dayun-tiandi-phase1/",
    group: "library",
    status: "temp",
    expires: "2026-10-30",
    src: "oval-share"
  },
  {
    name: "Resort Trends · S01 (OVAL template)",
    nameZh: "度假酒店趋势研究 · S01",
    desc: "Resort & hospitality trends, rebuilt on the OVAL template.",
    descZh: "度假酒店趋势研究（OVAL 标准模板版）。",
    url: "https://oval-share.archadamliv.workers.dev/s01-resort-trends-oval/",
    group: "library",
    status: "temp",
    expires: "2026-10-30",
    src: "oval-share"
  },
  {
    name: "S02 Case Study Base · Shenzhen MixC World",
    nameZh: "S02 案例库 · 深圳万象天地",
    desc: "Case-study base for Shenzhen MixC World (S02).",
    descZh: "深圳万象天地案例库（S02）。",
    url: "https://oval-share.archadamliv.workers.dev/s02-mixc-world-base/",
    group: "library",
    status: "temp",
    expires: "2026-10-30",
    src: "oval-share"
  },
  {
    name: "Culture Economy · Mawan (OVAL template)",
    nameZh: "文化经济 · 妈湾",
    desc: "Culture-economy trend study for Mawan, on the OVAL template.",
    descZh: "妈湾文化经济趋势研究（OVAL 标准模板版）。",
    url: "https://oval-share.archadamliv.workers.dev/culture-trends-qianhai-oval/",
    group: "library",
    status: "temp",
    expires: "2026-10-30",
    src: "oval-share"
  },
  {
    name: "City Brand · Six-City Commerce & POI",
    nameZh: "城市品牌 · 六城商业与 POI 聚合",
    desc: "Commerce and POI aggregation across six cities.",
    descZh: "六城商业与 POI 聚合状态。",
    url: "https://oval-share.archadamliv.workers.dev/city-brand/",
    group: "library",
    status: "temp",
    expires: "2026-10-23",
    src: "oval-share"
  },
  {
    name: "OVAL 16:9 Layout Demo (InDesign format)",
    nameZh: "OVAL 16:9 标准版式 demo",
    desc: "Reference demo of the OVAL 16:9 standard layout.",
    descZh: "OVAL 标准 16:9 版式参考 demo。",
    url: "https://oval-share.archadamliv.workers.dev/indd-format-demo/",
    group: "library",
    status: "temp",
    expires: "2026-10-30",
    src: "oval-share"
  },
  {
    name: "The Institutionalization Playbook · Convivial",
    nameZh: "制度化手册 · Convivial",
    desc: "Convivial institutionalization playbook (share endpoint).",
    descZh: "Convivial 制度化手册（分享端点）。",
    url: "https://convivial-share.archadamliv.workers.dev/convivial-playbook/",
    group: "library",
    status: "temp",
    expires: "2026-10-21",
    src: "convivial-share"
  },
  {
    name: "Walkable Catchment · Oval Advance v1.1.0",
    nameZh: "步行可达范围 · Oval Advance v1.1.0",
    desc: "Walk / jog / scooter / drive catchments over the OSM network.",
    descZh: "步行 / 慢跑 / 滑板车 / 驾车可达范围（OSM 路网）。",
    url: "https://ovaladvance-walkable-catchment.pages.dev/",
    group: "library",
    status: "stable"
  }
];

/* Category metadata — labels are bilingual (English first, Chinese second).
   Object order defines the on-page section order.
   Order: Work → Personal → Ongoing Research (research is deliberately last, kept
   separate from work; it is the "Development" track that later feeds results). */
window.GROUPS = {
  work:     { label: "Work",             labelZh: "工作" },
  personal: { label: "Personal",         labelZh: "私人" },
  research: { label: "Ongoing Research", labelZh: "发展中" },
  library:  { label: "Library",          labelZh: "库" }
};
