# Adam Dashboard · 个人聚合首页

A single always-accessible homepage that aggregates Adam's web pages and tools,
split into **Work (工作)** and **Personal (私人)**.

一个常驻可访问的聚合首页，把 Adam 的网页 / 工具集中起来，分为 **Work（工作）** 与 **Personal（私人）** 两个板块。

- **Live:** https://adam-dashboard.vercel.app
- **Stack:** plain HTML / CSS / JS — no build step, served directly by Vercel.
- **Theme:** dark / light toggle, persisted in `localStorage`, defaults to `prefers-color-scheme`.
- **Widgets:** live clock (Asia/Hong_Kong, ticks every second) and live Hong Kong weather
  (Open-Meteo, no API key). Widgets fail gracefully if the network is unavailable.
- **Bilingual:** English first, Chinese second.

## Adding a new entry · 新增条目

Edit **`data.js`** only — append an object to `SITES`:

```js
{
  name:   "English title",
  nameZh: "中文标题",
  desc:   "English description",
  descZh: "中文描述",
  url:    "https://example.com/",
  group:  "work",        // or "personal"
  tag:    "Short label"
}
```

The card renders automatically into the matching section; open-in-new-tab is applied for you.

## Adding a new widget · 新增实时组件

In `index.html` add a `<article class="card widget …">` inside `<section class="widgets">`,
then wire its data in `app.js`. Existing widgets (clock, weather) are independent blocks.

## Deploy · 部署

Static site — Vercel serves the folder as-is:

```bash
vercel --prod --yes
```
