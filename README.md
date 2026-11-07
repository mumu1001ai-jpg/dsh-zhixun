# 职寻 · dsh-zhixun

A DeepSeek Harness job-search plugin. Search public job listings by role and city, filter by freshness, save a resume locally, and rank jobs with the DSH model configured by the person using the plugin.

> 职寻是一个 DeepSeek Harness 求职插件：按岗位和城市聚合公开职位，按近一周 / 一月 / 三月筛选，简历只保存在本机浏览器，AI 匹配使用使用者自己的 DSH 模型。

## Features

- Search by role + city across multiple public sources.
- Freshness selector: **past week / past month / past 3 months**.
- Source switches with per-source status: OK, empty, blocked, unsupported, error.
- Resume and requirements auto-saved in browser `localStorage`.
- AI matching returns score, reason and a short summary.
- Save jobs, recent searches, city and source preferences locally.
- Chinese / English UI.
- Optional 前程无忧 source rendered through a local headless Chrome/Edge public page.
- Per-source rate limiting and a 3-minute result cache.

## Install

From npm:

```sh
dsh plugin --profile web add dsh-zhixun
```

For a desktop profile:

```sh
dsh plugin --profile desktop add dsh-zhixun
```

From a local tarball:

```sh
dsh plugin --profile web add ./dsh-zhixun-1.5.1.tgz
```

Restart DSH or reload the page after installation.

## AI matching and API keys

The plugin does **not** contain an API key and does **not** call a model API directly.

It uses the host LLM service and `agentDefaultModel.currentSelection()`:

```text
plugin -> DSH host llm service -> the model configured by the current DSH user
```

Each user configures their own provider/model or DSH account. If no model is available, the match button reports an error; normal job search still works.

The resume and a compact job summary are sent to that user's configured model provider when AI matching is used. Do not put ID numbers, bank-card numbers or other sensitive data in the resume box.

## Data sources

| Source | Access | Notes |
|---|---|---|
| 猎聘 | public JSON search API | 40 per page |
| 智联招聘 | search page `__INITIAL_STATE__` | 20 per page |
| 脉脉 | `jsononly=1` search API | up to 3 pages |
| BOSS直聘 | public search API | may require browser verification; no bypass |
| 国聘 | public JSON search API | 20 per page |
| 职友集 | server-rendered aggregator page | about 20 per page |
| 前程无忧 | optional local Chrome/Edge rendering of a public search page | off by default; stops on verification pages |

### What this plugin does not do

- It does not bypass login, captcha, slider verification, `__zp_stoken__`, IP restrictions or any other authentication mechanism.
- BOSS search pages disallow query/city parameters in `robots.txt`; the plugin leaves BOSS in a “verification required” state and provides a manual search link.
- LinkedIn, 鱼泡直聘 and other restricted sources are manual links only.
- It does not import or store browser session cookies.
- A site that requires login cannot be turned into public data by browser automation.

## Time range

The source bar offers:

```text
past week  -> 7 days
past month -> 30 days
past 3 months -> 90 days (default)
```

Listings older than the selected window, or with an unknown date, are hidden. The selection is stored in `localStorage`.

## Local storage

These keys belong to the current browser profile and are never uploaded by the plugin:

```text
dsh.job-search.resume.v1
dsh.job-search.saved.v1
dsh.job-search.history.v1
dsh.job-search.city.v1
dsh.job-search.sources.v1
dsh.job-search.freshness.v1
```

Installing the plugin on another machine does not carry a resume or saved jobs.

## Development

No runtime dependencies are required beyond DSH and React provided by the host.

```sh
npm run check
```

The check validates the package manifest, required files and the absence of a bundled API key.

## Repository layout

```text
.
├── index.js                 # host half: sources, filtering, cache, match route
├── client.js                # browser half: search UI, resume, match results
├── cordis.patch.yml         # DSH bundle insert
├── locale/                  # market metadata
├── icon.svg
├── scripts/validate.mjs     # repository/package validation
├── submission/              # awesome-dsh-plugin YAML submission
└── .github/workflows/ci.yml
```

## License

MIT. See [LICENSE](LICENSE).
