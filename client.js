window.__ModuleLoader__.load({
  id: 'dsh-zhixun',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const { useEffect, useMemo, useRef, useState } = React;

    const NS = 'job-search';
    const HISTORY_KEY = 'dsh.job-search.history.v1';
    const SAVED_KEY = 'dsh.job-search.saved.v1';
    const CITY_KEY = 'dsh.job-search.city.v1';
    const MAX_HISTORY = 8;
    const MAX_SAVED = 80;
    const REQUEST_TIMEOUT_MS = 25_000;

    const CITIES = [
      '北京', '上海', '深圳', '杭州', '广州', '成都',
      '南京', '武汉', '天津', '重庆', '合肥', '福州', '大连', '全国',
      '苏州', '西安', '长沙', '郑州', '青岛', '厦门', '宁波',
    ];

    const HOT_KEYWORDS = ['前端开发', 'Java', '产品经理', '数据分析', 'UI设计', '算法工程师'];
    const SOURCE_KEY = 'dsh.job-search.sources.v1';
    const RESUME_KEY = 'dsh.job-search.resume.v1';
    const FRESHNESS_KEY = 'dsh.job-search.freshness.v1';
    const FRESHNESS_OPTIONS = [
      { days: 7, label: 'lastWeek' },
      { days: 30, label: 'lastMonth' },
      { days: 90, label: 'lastQuarter' },
    ];
    const SOURCE_DEFS = [
      { id: 'liepin', label: '猎聘' },
      { id: 'zhaopin', label: '智联招聘' },
      { id: 'maimai', label: '脉脉' },
      { id: 'boss', label: 'BOSS直聘' },
      { id: 'iguopin', label: '国聘' },
      { id: 'jobui', label: '职友集' },
      { id: 'qiancheng', label: '前程无忧', optional: true },
    ];
    const SOURCE_LABELS = Object.fromEntries(SOURCE_DEFS.map((source) => [source.id, source.label]));
    const MORE_SOURCES = [
      { id: 'lagou', label: '拉勾网', url: (q, city) => `https://www.lagou.com/wn/jobs?kd=${encodeURIComponent(q)}&city=${encodeURIComponent(city)}` },
      { id: 'yupao', label: '鱼泡直聘', url: (q, city) => `https://www.yupao.com/topic/0/?keywords=${encodeURIComponent(q)}` },
      { id: 'yingjiesheng', label: '应届生求职网', url: (q, city) => `https://q.yingjiesheng.com/jobs/search/${encodeURIComponent(q)}?jobarea=${encodeURIComponent(city)}` },
      { id: 'linkedin', label: '领英', url: (q, city) => `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(q)}&location=${encodeURIComponent(city)}` },
      { id: 'boss', label: 'BOSS直聘', url: (q, city) => `https://www.zhipin.com/web/geek/job?query=${encodeURIComponent(q)}` },
    ];

    const ZH = {
      nav: '职寻',
      title: '职寻',
      subtitle: '按岗位与城市，找到正在招人的机会',
      eyebrow: '求职雷达',
      queryLabel: '岗位',
      queryPlaceholder: '例如：前端开发、产品经理',
      cityLabel: '城市',
      cityPlaceholder: '例如：北京',
      search: '搜索职位',
      searching: '搜索中…',
      hot: '热门',
      recent: '最近搜索',
      results: '搜索结果',
      saved: '收藏',
      sources: '来源',
      sourceCount: '{n} 个来源',
      multiSource: '多源职位',
      sourceRequired: '至少选择一个来源。',
      needsVerification: '需验证',
      openSource: '打开来源',
      freshOnly: '仅显示所选时间范围',
      timeRange: '时间范围',
      lastWeek: '近一周',
      lastMonth: '近一月',
      lastQuarter: '近三月',
      resumeTitle: '简历与求职要求',
      resumePlaceholder: '粘贴简历，或填写技能、经验、期望薪资、行业、地点等要求…',
      resumeSaved: '已自动保存',
      resumeSaving: '保存中…',
      resumeCount: '{n}/4000',
      resumeExpand: '展开',
      resumeCollapse: '收起',
      matchButton: 'AI 匹配岗位',
      matching: '分析中…',
      matchHint: 'AI 会结合简历与当前结果给出匹配度；内容会发送给当前模型。',
      matchSummary: 'AI 匹配结论',
      matchScore: '匹配',
      matchError: 'AI 匹配失败',
      resumeRequired: '请先填写简历或求职要求。',
      resumeNeedSearch: '请先搜索职位，再进行 AI 匹配。',
      sortMatch: '匹配度',
      noMatch: '没有达到 60 分的职位，可以调整简历或搜索条件。',
      sourceOk: '正常',
      sourceEmpty: '暂无结果',
      sourceBlocked: '需验证',
      sourceUnsupported: '该城市不支持',
      sourceError: '请求失败',
      expandResults: '放大结果',
      normalResults: '显示摘要',
      savedCount: '已收藏 {n} 个',
      sortLatest: '最新',
      sortSalary: '薪资',
      sortRecommended: '推荐',
      refresh: '刷新',
      updated: '更新于 {time}',
      sourcePrefix: '数据源',
      sourceLiepin: '猎聘',
      sourceJobui: '职友集',
      sourceZhaopin: '智联招聘',
      sourceMaimai: '脉脉',
      sourceBoss: 'BOSS直聘',
      sourceIguopin: '国聘',
      moreSources: '更多来源',
      moreSourcesHint: '以下来源需要登录或浏览器验证，插件不绕过限制；点击可直接打开搜索。',
      jobsThisPage: '本页 {n} 个职位',
      loadedJobs: '已加载 {n} 个职位',
      jobsTotal: '约 {n} 个职位',
      hiddenOld: '已隐藏 {n} 个超过 {days} 天的职位',
      noResultsTitle: '没有找到符合时间范围的职位',
      noResultsBody: '换个岗位名、城市或时间范围试试；超过所选时间范围的职位已自动隐藏。',
      emptyTitle: '输入岗位和城市，开始找工作',
      emptyBody: '例如「前端开发 · 北京」，我们会整理职位、薪资、公司和要求。',
      viewSource: '查看来源',
      loadMore: '加载更多',
      loadingMore: '加载中…',
      allLoaded: '已显示全部结果',
      retry: '重试',
      errorTitle: '职位加载失败',
      timeout: '请求超时，请稍后再试。',
      rateLimited: '查询过于频繁，请等一会儿再试。',
      networkError: '网络请求失败，请检查连接。',
      queryRequired: '请输入岗位名称。',
      cityRequired: '请输入城市。',
      save: '收藏',
      unsave: '取消收藏',
      savedEmptyTitle: '还没有收藏职位',
      savedEmptyBody: '在搜索结果里点 ☆ 收藏感兴趣的职位，之后可以在这里集中查看。',
      removeSaved: '移除收藏',
      salaryNegotiable: '面议',
      salaryRange: '薪资区间',
      salaryMedian: '中位',
      salaryCount: '有薪资',
      headhunterCount: '猎头职位',
      industryTitle: '行业分布',
      searchSummary: '本次搜索',
      noIndustry: '暂无行业数据',
      noticeFallback: '已切换备用职位源',
      noticeCityTitle: '聚合搜索',
      noticeCity: '该城市通过职友集聚合搜索，每页约 20 条结果。',
      disclaimer: '数据来自猎聘 / 职友集的公开职位页面，仅供个人求职参考；请以来源网站的最新信息为准。',
      headhunter: '猎头',
      today: '今天',
      yesterday: '昨天',
      daysAgo: '{n} 天前',
      monthsAgo: '{n} 个月前',
      unknownDate: '日期未知',
      cityHint: '支持主要城市精准搜索，其他城市自动使用聚合来源。',
      sourceNote: '公开职位',
      savedOn: '收藏于 {date}',
      viewOnSource: '在来源网站查看',
      queryHint: '输入岗位名，例如「前端开发」',
      cityHintShort: '输入城市，例如「北京」',
      metaSeparator: '·',
      countUnit: '个',
      entries: '条',
      resultFor: '「{q}」在 {city}',
      allCities: '全国',
    };

    const EN = {
      nav: 'Job Search',
      title: 'Job Search',
      subtitle: 'Find open roles by job title and city',
      eyebrow: 'CAREER RADAR',
      queryLabel: 'Role',
      queryPlaceholder: 'e.g. Frontend Developer, Product Manager',
      cityLabel: 'City',
      cityPlaceholder: 'e.g. Beijing',
      search: 'Search jobs',
      searching: 'Searching…',
      hot: 'Popular',
      recent: 'Recent',
      results: 'Results',
      saved: 'Saved',
      sources: 'Sources',
      sourceCount: '{n} sources',
      multiSource: 'Multi-source',
      sourceRequired: 'Select at least one source.',
      needsVerification: 'Verify',
      openSource: 'Open source',
      freshOnly: 'Selected range only',
      timeRange: 'Date range',
      lastWeek: 'Past week',
      lastMonth: 'Past month',
      lastQuarter: 'Past 3 months',
      resumeTitle: 'Resume and requirements',
      resumePlaceholder: 'Paste your resume, or describe skills, experience, expected pay, industry, and location…',
      resumeSaved: 'Saved automatically',
      resumeSaving: 'Saving…',
      resumeCount: '{n}/4000',
      resumeExpand: 'Expand',
      resumeCollapse: 'Collapse',
      matchButton: 'Match with AI',
      matching: 'Analyzing…',
      matchHint: 'AI compares your resume with the current results; content is sent to the configured model.',
      matchSummary: 'AI match summary',
      matchScore: 'Match',
      matchError: 'AI matching failed',
      resumeRequired: 'Enter your resume or requirements first.',
      resumeNeedSearch: 'Search for jobs before matching.',
      sortMatch: 'Match',
      noMatch: 'No job reached 60 points. Adjust your resume or search.',
      sourceOk: 'OK',
      sourceEmpty: 'No results',
      sourceBlocked: 'Needs verification',
      sourceUnsupported: 'City unsupported',
      sourceError: 'Request failed',
      expandResults: 'Expand results',
      normalResults: 'Show summary',
      savedCount: '{n} saved',
      sortLatest: 'Newest',
      sortSalary: 'Salary',
      sortRecommended: 'Relevant',
      refresh: 'Refresh',
      updated: 'Updated {time}',
      sourcePrefix: 'Source',
      sourceLiepin: 'Liepin',
      sourceJobui: 'Jobui',
      sourceZhaopin: 'Zhaopin',
      sourceMaimai: 'Maimai',
      sourceBoss: 'BOSS',
      sourceIguopin: 'Guopin',
      moreSources: 'More sources',
      moreSourcesHint: 'These sites require login or browser verification. The plugin does not bypass it; click to open their search.',
      jobsThisPage: '{n} jobs on this page',
      loadedJobs: '{n} jobs loaded',
      jobsTotal: 'About {n} jobs',
      hiddenOld: '{n} listings older than {days} days are hidden',
      noResultsTitle: 'No jobs in the selected date range',
      noResultsBody: 'Try another role, city, or date range. Listings outside the selected range are hidden.',
      emptyTitle: 'Enter a role and a city to start',
      emptyBody: 'For example “Frontend Developer · Beijing”. We will organize titles, pay, companies, and requirements.',
      viewSource: 'View source',
      loadMore: 'Load more',
      loadingMore: 'Loading…',
      allLoaded: 'All results are shown',
      retry: 'Retry',
      errorTitle: 'Could not load jobs',
      timeout: 'The request timed out. Try again shortly.',
      rateLimited: 'Too many queries. Please wait a moment.',
      networkError: 'Network request failed. Check your connection.',
      queryRequired: 'Enter a role name.',
      cityRequired: 'Enter a city.',
      save: 'Save',
      unsave: 'Unsave',
      savedEmptyTitle: 'No saved jobs yet',
      savedEmptyBody: 'Tap ☆ on a result to keep it here for later.',
      removeSaved: 'Remove from saved',
      salaryNegotiable: 'Negotiable',
      salaryRange: 'Salary range',
      salaryMedian: 'Median',
      salaryCount: 'With pay',
      headhunterCount: 'Headhunter roles',
      industryTitle: 'Industries',
      searchSummary: 'This search',
      noIndustry: 'No industry data',
      noticeFallback: 'Switched to the backup source',
      noticeCityTitle: 'Aggregated search',
      noticeCity: 'This city uses Jobui aggregated results, about 20 per page.',
      disclaimer: 'Public listings from Liepin / Jobui, for personal job hunting only. Always verify on the source site.',
      headhunter: 'Headhunter',
      today: 'Today',
      yesterday: 'Yesterday',
      daysAgo: '{n} days ago',
      monthsAgo: '{n} months ago',
      unknownDate: 'Date unknown',
      cityHint: 'Major cities use precise search; other cities use the aggregated source.',
      sourceNote: 'Public listings',
      savedOn: 'Saved {date}',
      viewOnSource: 'Open on source site',
      queryHint: 'Enter a role, e.g. “Frontend Developer”',
      cityHintShort: 'Enter a city, e.g. “Beijing”',
      metaSeparator: '·',
      countUnit: '',
      entries: '',
      resultFor: '“{q}” in {city}',
      allCities: 'Nationwide',
    };

    const CSS = `
      .js-root {
        height: 100%;
        min-height: 0;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        background: var(--dsw-alias-bg-base);
        color: var(--dsw-alias-label-primary);
        font-family: inherit;
      }
      .js-root *, .js-root *::before, .js-root *::after { box-sizing: border-box; }
      .js-root button, .js-root input { font: inherit; }
      .js-header {
        flex: 0 0 auto;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        padding: 12px 18px 10px;
      }
      .js-heading { min-width: 0; }
      .js-eyebrow {
        display: flex;
        align-items: center;
        gap: 7px;
        font-size: 10.5px;
        line-height: 1;
        letter-spacing: .12em;
        text-transform: uppercase;
        color: var(--dsw-alias-label-secondary);
      }
      .js-eyebrow-dot {
        width: 6px; height: 6px; border-radius: 50%;
        background: var(--dsw-alias-brand-primary);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--dsw-alias-brand-primary) 13%, transparent);
      }
      .js-title {
        margin: 6px 0 0;
        font-size: 21px;
        line-height: 1.15;
        font-weight: 660;
        letter-spacing: -.025em;
      }
      .js-subtitle {
        margin: 3px 0 0;
        font-size: 11.5px;
        line-height: 1.45;
        color: var(--dsw-alias-label-secondary);
      }
      .js-header-side {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        justify-content: flex-end;
        padding-top: 3px;
      }
      .js-status {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        min-height: 29px;
        padding: 0 10px;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 999px;
        background: var(--dsw-alias-bg-layer-1);
        font-size: 10.5px;
        color: var(--dsw-alias-label-secondary);
        white-space: nowrap;
      }
      .js-status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--dsw-alias-state-success-primary); }
      .js-status strong { color: var(--dsw-alias-label-primary); font-weight: 600; }
      .js-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        min-height: 29px;
        padding: 0 11px;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 8px;
        background: var(--dsw-alias-bg-layer-1);
        color: var(--dsw-alias-label-primary);
        font-size: 11.5px;
        cursor: pointer;
        transition: background .15s ease, border-color .15s ease, color .15s ease;
      }
      .js-btn:hover { background: var(--dsw-alias-bg-layer-2); border-color: var(--dsw-alias-border-l2); }
      .js-btn:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 2px; }
      .js-btn:disabled { opacity: .6; cursor: default; }
      .js-btn svg { flex: 0 0 auto; }
      .js-search-wrap {
        flex: 0 0 auto;
        margin: 0 18px;
        padding: 11px;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 13px;
        background:
          radial-gradient(110% 180% at 100% 0%, color-mix(in srgb, var(--dsw-alias-brand-primary) 9%, transparent) 0%, transparent 58%),
          var(--dsw-alias-bg-layer-1);
      }
      .js-search-form {
        display: grid;
        grid-template-columns: minmax(0, 1.35fr) minmax(0, .8fr) auto;
        gap: 9px;
        align-items: end;
      }
      .js-field { min-width: 0; display: flex; flex-direction: column; gap: 5px; }
      .js-field-label {
        display: flex;
        align-items: center;
        gap: 5px;
        padding-left: 2px;
        font-size: 9.5px;
        letter-spacing: .08em;
        text-transform: uppercase;
        color: var(--dsw-alias-label-secondary);
      }
      .js-input-shell {
        display: flex;
        align-items: center;
        gap: 7px;
        min-height: 38px;
        padding: 0 11px;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 9px;
        background: var(--dsw-alias-bg-base);
        color: var(--dsw-alias-label-secondary);
        transition: border-color .15s ease, box-shadow .15s ease;
      }
      .js-input-shell:focus-within {
        border-color: var(--dsw-alias-brand-primary);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--dsw-alias-brand-primary) 12%, transparent);
      }
      .js-input-shell svg { flex: 0 0 auto; opacity: .7; }
      .js-input {
        flex: 1;
        min-width: 0;
        border: 0;
        outline: 0;
        background: transparent;
        color: var(--dsw-alias-label-primary);
        font-size: 12.5px;
        padding: 8px 0;
      }
      .js-input::placeholder { color: var(--dsw-alias-label-secondary); opacity: .74; }
      .js-search-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        min-height: 38px;
        padding: 0 18px;
        border: 0;
        border-radius: 9px;
        background: var(--dsw-alias-brand-primary);
        color: var(--dsw-alias-bg-base);
        font-size: 12px;
        font-weight: 650;
        white-space: nowrap;
        cursor: pointer;
        transition: filter .15s ease, opacity .15s ease;
      }
      .js-search-btn:hover { filter: brightness(1.05); }
      .js-search-btn:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 2px; }
      .js-search-btn:disabled { opacity: .65; cursor: default; }
      .js-quick {
        display: flex;
        align-items: center;
        gap: 7px 8px;
        flex-wrap: wrap;
        margin-top: 11px;
        color: var(--dsw-alias-label-secondary);
        font-size: 10.5px;
      }
      .js-quick-label { letter-spacing: .04em; opacity: .8; }
      .js-chip {
        display: inline-flex;
        align-items: center;
        min-height: 23px;
        padding: 0 8px;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 999px;
        background: var(--dsw-alias-bg-base);
        color: var(--dsw-alias-label-secondary);
        font-size: 10.5px;
        cursor: pointer;
        transition: border-color .15s ease, color .15s ease, background .15s ease;
      }
      .js-chip:hover { border-color: var(--dsw-alias-brand-primary); color: var(--dsw-alias-brand-primary); }
      .js-chip:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 2px; }
      .js-chip.is-on { border-color: var(--dsw-alias-brand-primary); color: var(--dsw-alias-brand-primary); background: color-mix(in srgb, var(--dsw-alias-brand-primary) 8%, transparent); }
      .js-form-error {
        margin-top: 8px;
        padding-left: 2px;
        font-size: 10.5px;
        color: var(--dsw-alias-state-error-primary);
      }
      .js-sourcebar {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
        margin-top: 10px;
        padding-top: 9px;
        border-top: 1px dashed var(--dsw-alias-border-l1);
      }
      .js-sourcebar-label {
        font-size: 9.5px;
        letter-spacing: .06em;
        text-transform: uppercase;
        color: var(--dsw-alias-label-secondary);
        margin-right: 2px;
      }
      .js-source-chip {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        min-height: 23px;
        padding: 0 8px;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 999px;
        background: var(--dsw-alias-bg-base);
        color: var(--dsw-alias-label-secondary);
        font-size: 10px;
        cursor: pointer;
        transition: border-color .15s ease, background .15s ease, color .15s ease, opacity .15s ease;
      }
      .js-source-chip:hover { border-color: var(--dsw-alias-border-l2); color: var(--dsw-alias-label-primary); }
      .js-source-chip.is-on {
        border-color: color-mix(in srgb, var(--dsw-alias-brand-primary) 55%, var(--dsw-alias-border-l1));
        color: var(--dsw-alias-label-primary);
        background: color-mix(in srgb, var(--dsw-alias-brand-primary) 6%, transparent);
      }
      .js-source-chip:not(.is-on) { opacity: .55; }
      .js-source-chip:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 2px; }
      .js-source-dot {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: var(--dsw-alias-label-secondary);
        opacity: .5;
        flex: 0 0 auto;
      }
      .js-source-chip.is-ok .js-source-dot { background: var(--dsw-alias-state-success-primary); opacity: 1; }
      .js-source-chip.is-empty .js-source-dot { background: var(--dsw-alias-state-idle-primary); opacity: 1; }
      .js-source-chip.is-blocked .js-source-dot,
      .js-source-chip.is-unsupported .js-source-dot { background: var(--dsw-alias-state-warn-primary); opacity: 1; }
      .js-source-chip.is-error .js-source-dot { background: var(--dsw-alias-state-error-primary); opacity: 1; }
      .js-source-chip em {
        font-style: normal;
        font-size: 9px;
        font-variant-numeric: tabular-nums;
        color: var(--dsw-alias-label-secondary);
      }
      .js-source-warn { font-size: 8.5px; color: var(--dsw-alias-state-warn-primary); }
      .js-source-links {
        display: flex;
        align-items: center;
        gap: 4px 10px;
        flex-wrap: wrap;
        margin-top: 7px;
        font-size: 9.5px;
        color: var(--dsw-alias-label-secondary);
      }
      .js-source-links a {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        color: var(--dsw-alias-brand-primary);
        text-decoration: none;
      }
      .js-source-links a:hover { text-decoration: underline; }
      .js-fresh-note { margin-left: auto; font-size: 9.5px; color: var(--dsw-alias-label-secondary); white-space: nowrap; }
      .js-freshness {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        margin-left: auto;
        font-size: 9.5px;
        color: var(--dsw-alias-label-secondary);
        white-space: nowrap;
      }
      .js-freshness select {
        min-height: 23px;
        padding: 0 21px 0 7px;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 6px;
        outline: 0;
        background: var(--dsw-alias-bg-base);
        color: var(--dsw-alias-label-primary);
        font: inherit;
        font-size: 9.5px;
        cursor: pointer;
      }
      .js-freshness select:focus { border-color: var(--dsw-alias-brand-primary); box-shadow: 0 0 0 2px color-mix(in srgb, var(--dsw-alias-brand-primary) 10%, transparent); }
      .js-more-btn {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        min-height: 23px;
        padding: 0 7px;
        border: 1px dashed var(--dsw-alias-border-l1);
        border-radius: 999px;
        background: transparent;
        color: var(--dsw-alias-label-secondary);
        font-size: 9.5px;
        cursor: pointer;
      }
      .js-more-btn:hover { border-color: var(--dsw-alias-brand-primary); color: var(--dsw-alias-brand-primary); }
      .js-more-btn:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 2px; }
      .js-more-panel {
        display: flex;
        flex-direction: column;
        gap: 5px;
        margin-top: 8px;
        padding: 9px;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 8px;
        background: var(--dsw-alias-bg-base);
      }
      .js-more-panel-head { font-size: 9px; color: var(--dsw-alias-label-secondary); line-height: 1.5; }
      .js-more-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(118px, 1fr)); gap: 5px; }
      .js-more-link {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 4px;
        padding: 5px 7px;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 6px;
        color: var(--dsw-alias-label-primary);
        text-decoration: none;
        font-size: 10px;
        background: var(--dsw-alias-bg-layer-1);
      }
      .js-more-link:hover { border-color: var(--dsw-alias-brand-primary); color: var(--dsw-alias-brand-primary); }
      .js-more-link svg { opacity: .6; }
      .js-resume {
        flex: 0 0 auto;
        margin: 0 18px 8px;
        padding: 9px 11px;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 11px;
        background: var(--dsw-alias-bg-layer-1);
      }
      .js-resume-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }
      .js-resume-title-wrap { min-width: 0; display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }
      .js-resume-title { margin: 0; font-size: 11px; font-weight: 650; letter-spacing: .02em; }
      .js-resume-status { font-size: 9.5px; color: var(--dsw-alias-label-secondary); }
      .js-resume-toggle {
        border: 0;
        background: transparent;
        color: var(--dsw-alias-label-secondary);
        font-size: 10px;
        cursor: pointer;
        padding: 3px 4px;
        border-radius: 4px;
      }
      .js-resume-toggle:hover { color: var(--dsw-alias-label-primary); background: var(--dsw-alias-bg-layer-2); }
      .js-resume-toggle:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 1px; }
      .js-resume-body {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 170px;
        gap: 8px;
        align-items: stretch;
        margin-top: 7px;
      }
      .js-resume-input {
        width: 100%;
        min-height: 54px;
        max-height: 160px;
        resize: vertical;
        padding: 9px 10px;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 8px;
        outline: 0;
        background: var(--dsw-alias-bg-base);
        color: var(--dsw-alias-label-primary);
        font: inherit;
        font-size: 11px;
        line-height: 1.55;
      }
      .js-resume-input:focus { border-color: var(--dsw-alias-brand-primary); box-shadow: 0 0 0 3px color-mix(in srgb, var(--dsw-alias-brand-primary) 10%, transparent); }
      .js-resume-input::placeholder { color: var(--dsw-alias-label-secondary); opacity: .75; }
      .js-resume-side { display: flex; flex-direction: column; gap: 6px; justify-content: space-between; }
      .js-resume-count { font-size: 9px; color: var(--dsw-alias-label-secondary); text-align: right; font-variant-numeric: tabular-nums; }
      .js-match-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        min-height: 31px;
        padding: 0 10px;
        border: 0;
        border-radius: 7px;
        background: var(--dsw-alias-brand-primary);
        color: var(--dsw-alias-bg-base);
        font-size: 10.5px;
        font-weight: 650;
        cursor: pointer;
      }
      .js-match-btn:hover { filter: brightness(1.05); }
      .js-match-btn:disabled { opacity: .6; cursor: default; }
      .js-match-btn:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 2px; }
      .js-resume-hint { font-size: 8.5px; line-height: 1.45; color: var(--dsw-alias-label-secondary); }
      .js-match-error { margin-top: 7px; font-size: 10px; color: var(--dsw-alias-state-error-primary); }
      .js-match-result {
        margin-top: 8px;
        padding: 8px 9px;
        border: 1px solid color-mix(in srgb, var(--dsw-alias-brand-primary) 22%, var(--dsw-alias-border-l1));
        border-radius: 8px;
        background: color-mix(in srgb, var(--dsw-alias-brand-primary) 5%, transparent);
      }
      .js-match-result strong { display: block; font-size: 9px; letter-spacing: .05em; text-transform: uppercase; color: var(--dsw-alias-brand-primary); }
      .js-match-result p { margin: 4px 0 0; font-size: 10.5px; line-height: 1.55; color: var(--dsw-alias-label-secondary); }
      .js-match-badge {
        display: inline-flex;
        align-items: center;
        min-height: 17px;
        padding: 0 6px;
        border-radius: 4px;
        border: 1px solid color-mix(in srgb, var(--dsw-alias-brand-primary) 38%, var(--dsw-alias-border-l1));
        background: color-mix(in srgb, var(--dsw-alias-brand-primary) 9%, transparent);
        color: var(--dsw-alias-brand-primary);
        font-size: 8.5px;
        font-weight: 650;
        line-height: 1;
        white-space: nowrap;
      }
      .js-match-reason {
        margin-top: 6px;
        padding: 5px 7px;
        border-left: 2px solid color-mix(in srgb, var(--dsw-alias-brand-primary) 45%, transparent);
        border-radius: 0 4px 4px 0;
        background: color-mix(in srgb, var(--dsw-alias-brand-primary) 4%, transparent);
        font-size: 9.5px;
        line-height: 1.5;
        color: var(--dsw-alias-label-secondary);
      }
      .js-match-empty { margin-top: 7px; font-size: 10px; color: var(--dsw-alias-label-secondary); }
      .js-body {
        flex: 1;
        min-height: 0;
        display: grid;
        grid-template-columns: 220px minmax(0, 1fr);
        gap: 12px;
        padding: 10px 18px 16px;
        overflow: hidden;
      }
      .js-root.is-wide .js-body {
        grid-template-columns: minmax(0, 1fr);
        gap: 0;
      }
      .js-root.is-wide .js-rail { display: none; }
      .js-rail {
        min-height: 0;
        overflow: auto;
        display: flex;
        flex-direction: column;
        gap: 10px;
        scrollbar-width: thin;
        padding-right: 2px;
      }
      .js-panel {
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 12px;
        background: var(--dsw-alias-bg-layer-1);
        padding: 13px;
      }
      .js-panel-head {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 10px;
      }
      .js-panel-title {
        margin: 0;
        font-size: 9.5px;
        letter-spacing: .09em;
        text-transform: uppercase;
        color: var(--dsw-alias-label-secondary);
        font-weight: 600;
      }
      .js-panel-count { font-size: 10px; color: var(--dsw-alias-label-secondary); font-variant-numeric: tabular-nums; }
      .js-summary-key {
        font-size: 15px;
        font-weight: 650;
        line-height: 1.28;
        letter-spacing: -.015em;
        overflow-wrap: anywhere;
      }
      .js-summary-city {
        margin-top: 3px;
        font-size: 11px;
        color: var(--dsw-alias-label-secondary);
      }
      .js-summary-stats {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 7px;
        margin-top: 12px;
      }
      .js-summary-stat {
        padding: 8px 9px;
        border-radius: 8px;
        background: var(--dsw-alias-bg-layer-2);
        min-width: 0;
      }
      .js-summary-stat span {
        display: block;
        font-size: 9px;
        color: var(--dsw-alias-label-secondary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .js-summary-stat strong {
        display: block;
        margin-top: 3px;
        font-size: 14px;
        font-weight: 650;
        font-variant-numeric: tabular-nums;
      }
      .js-salary-line {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 8px;
        margin-top: 11px;
        padding-top: 10px;
        border-top: 1px dashed var(--dsw-alias-border-l1);
        font-size: 10px;
        color: var(--dsw-alias-label-secondary);
      }
      .js-salary-line strong {
        font-size: 13px;
        color: var(--dsw-alias-label-primary);
        font-variant-numeric: tabular-nums;
        font-weight: 650;
      }
      .js-industry {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .js-industry-row { display: flex; flex-direction: column; gap: 4px; }
      .js-industry-top { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; font-size: 10px; }
      .js-industry-name { color: var(--dsw-alias-label-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .js-industry-n { color: var(--dsw-alias-label-secondary); font-variant-numeric: tabular-nums; flex: 0 0 auto; }
      .js-bar { height: 4px; border-radius: 999px; background: var(--dsw-alias-bg-layer-2); overflow: hidden; }
      .js-bar span { display: block; height: 100%; border-radius: inherit; background: var(--dsw-alias-brand-primary); opacity: .7; }
      .js-history { display: flex; flex-direction: column; gap: 2px; }
      .js-history-item {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 8px;
        width: 100%;
        padding: 6px 5px;
        border: 0;
        border-radius: 6px;
        background: transparent;
        color: var(--dsw-alias-label-primary);
        text-align: left;
        font-size: 10.5px;
        cursor: pointer;
      }
      .js-history-item:hover { background: var(--dsw-alias-bg-layer-2); }
      .js-history-item:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 1px; }
      .js-history-item span:first-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .js-history-item span:last-child { flex: 0 0 auto; color: var(--dsw-alias-label-secondary); font-size: 9.5px; }
      .js-note {
        margin: 0;
        padding: 0 3px;
        font-size: 9.5px;
        line-height: 1.55;
        color: var(--dsw-alias-label-secondary);
      }
      .js-main {
        min-width: 0;
        min-height: 0;
        display: flex;
        flex-direction: column;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 15px;
        background: var(--dsw-alias-bg-layer-1);
        overflow: hidden;
      }
      .js-toolbar {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        flex-wrap: wrap;
        padding: 9px 12px;
        border-bottom: 1px solid var(--dsw-alias-border-l1);
        background: var(--dsw-alias-bg-layer-1);
      }
      .js-tabs { display: flex; align-items: center; gap: 3px; }
      .js-tab {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        min-height: 29px;
        padding: 0 10px;
        border: 1px solid transparent;
        border-radius: 7px;
        background: transparent;
        color: var(--dsw-alias-label-secondary);
        font-size: 11.5px;
        cursor: pointer;
      }
      .js-tab:hover { color: var(--dsw-alias-label-primary); background: var(--dsw-alias-bg-layer-2); }
      .js-tab.is-active {
        color: var(--dsw-alias-label-primary);
        background: var(--dsw-alias-bg-base);
        border-color: var(--dsw-alias-border-l1);
        font-weight: 600;
      }
      .js-tab-n {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 17px;
        height: 17px;
        padding: 0 5px;
        border-radius: 999px;
        background: var(--dsw-alias-bg-layer-2);
        color: var(--dsw-alias-label-secondary);
        font-size: 9.5px;
        font-variant-numeric: tabular-nums;
      }
      .js-tools { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
      .js-sort {
        display: flex;
        align-items: center;
        gap: 1px;
        padding: 2px;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 7px;
        background: var(--dsw-alias-bg-base);
      }
      .js-sort button {
        min-height: 23px;
        padding: 0 8px;
        border: 0;
        border-radius: 5px;
        background: transparent;
        color: var(--dsw-alias-label-secondary);
        font-size: 10px;
        cursor: pointer;
      }
      .js-sort button:hover { color: var(--dsw-alias-label-primary); }
      .js-sort button.is-active {
        background: var(--dsw-alias-bg-layer-2);
        color: var(--dsw-alias-label-primary);
        font-weight: 600;
      }
      .js-sort button:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 1px; }
      .js-resultbar {
        flex: 0 0 auto;
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 10px;
        flex-wrap: wrap;
        padding: 8px 12px 0;
        font-size: 10.5px;
        color: var(--dsw-alias-label-secondary);
      }
      .js-resultbar strong { color: var(--dsw-alias-label-primary); font-weight: 600; }
      .js-resultbar .js-source {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        white-space: nowrap;
      }
      .js-source-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--dsw-alias-brand-primary); }
      .js-source-link {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        margin-left: 9px;
        color: var(--dsw-alias-brand-primary);
        text-decoration: none;
        font-size: 10px;
        white-space: nowrap;
      }
      .js-source-link:hover { text-decoration: underline; }
      .js-source-link:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 2px; border-radius: 3px; }
      .js-list {
        flex: 1;
        min-height: 0;
        overflow: auto;
        display: flex;
        flex-direction: column;
        gap: 7px;
        padding: 8px 10px 12px;
        scrollbar-width: thin;
      }
      .js-notice {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 9px 12px 0;
        padding: 8px 10px;
        border: 1px solid color-mix(in srgb, var(--dsw-alias-state-warn-primary) 35%, var(--dsw-alias-border-l1));
        border-radius: 8px;
        background: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 7%, transparent);
        font-size: 10.5px;
        line-height: 1.45;
        color: var(--dsw-alias-label-secondary);
      }
      .js-notice strong { color: var(--dsw-alias-label-primary); font-weight: 600; }
      .js-job {
        position: relative;
        flex: 0 0 auto;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 11px;
        background: var(--dsw-alias-bg-base);
        transition: border-color .15s ease, background .15s ease, transform .15s ease;
      }
      .js-job:hover {
        border-color: var(--dsw-alias-border-l2);
        background: var(--dsw-alias-bg-layer-2);
        transform: translateY(-1px);
      }
      .js-job-main {
        display: block;
        padding: 11px 40px 10px 12px;
        color: inherit;
        text-decoration: none;
        border-radius: 10px;
      }
      .js-job-main:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 1px; }
      .js-job-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
      .js-job-title-wrap { min-width: 0; display: flex; align-items: center; gap: 7px; flex-wrap: wrap; }
      .js-job-title {
        margin: 0;
        font-size: 13.5px;
        line-height: 1.35;
        font-weight: 650;
        letter-spacing: -.01em;
        overflow-wrap: anywhere;
      }
      .js-badge {
        display: inline-flex;
        align-items: center;
        min-height: 17px;
        padding: 0 5px;
        border-radius: 4px;
        font-size: 8.5px;
        line-height: 1;
        white-space: nowrap;
        border: 1px solid var(--dsw-alias-border-l1);
        color: var(--dsw-alias-label-secondary);
      }
      .js-badge.is-headhunter {
        border-color: color-mix(in srgb, var(--dsw-alias-brand-primary) 35%, var(--dsw-alias-border-l1));
        color: var(--dsw-alias-brand-primary);
        background: color-mix(in srgb, var(--dsw-alias-brand-primary) 7%, transparent);
      }
      .js-salary {
        flex: 0 0 auto;
        font-size: 13px;
        line-height: 1.35;
        font-weight: 650;
        color: var(--dsw-alias-brand-primary);
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
      }
      .js-company-row { display: flex; align-items: center; gap: 6px; min-width: 0; margin-top: 7px; }
      .js-avatar {
        width: 19px;
        height: 19px;
        flex: 0 0 auto;
        border-radius: 5px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 9.5px;
        font-weight: 650;
        line-height: 1;
      }
      .js-company { min-width: 0; font-size: 11px; color: var(--dsw-alias-label-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .js-stage { flex: 0 0 auto; font-size: 9px; color: var(--dsw-alias-label-secondary); border-left: 1px solid var(--dsw-alias-border-l1); padding-left: 6px; }
      .js-meta-row {
        display: flex;
        align-items: center;
        gap: 5px 10px;
        flex-wrap: wrap;
        margin-top: 7px;
        font-size: 10px;
        color: var(--dsw-alias-label-secondary);
      }
      .js-meta-item { display: inline-flex; align-items: center; gap: 3px; min-width: 0; }
      .js-meta-item svg { opacity: .62; flex: 0 0 auto; }
      .js-job-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        flex-wrap: wrap;
        margin-top: 8px;
        padding-top: 7px;
        border-top: 1px dashed var(--dsw-alias-border-l1);
        font-size: 9.5px;
        color: var(--dsw-alias-label-secondary);
      }
      .js-job-footer span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .js-job-footer-left { display: flex; align-items: center; gap: 6px; min-width: 0; }
      .js-job-source { flex: 0 0 auto; font-weight: 600; color: var(--dsw-alias-brand-primary); }
      .js-save {
        position: absolute;
        top: 9px;
        right: 9px;
        width: 25px;
        height: 25px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 0;
        border-radius: 6px;
        background: transparent;
        color: var(--dsw-alias-label-secondary);
        cursor: pointer;
        opacity: .6;
        transition: background .12s ease, color .12s ease, opacity .12s ease;
      }
      .js-save:hover { opacity: 1; background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-brand-primary); }
      .js-save.is-on { opacity: 1; color: var(--dsw-alias-brand-primary); }
      .js-save:focus-visible { opacity: 1; outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 1px; }
      .js-empty {
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 36px 24px;
        text-align: center;
        color: var(--dsw-alias-label-secondary);
      }
      .js-empty-art { opacity: .5; margin-bottom: 3px; }
      .js-empty strong { color: var(--dsw-alias-label-primary); font-size: 14px; font-weight: 650; }
      .js-empty p { margin: 0; max-width: 360px; font-size: 11.5px; line-height: 1.65; }
      .js-empty-actions { display: flex; gap: 7px; flex-wrap: wrap; justify-content: center; margin-top: 4px; }
      .js-load-more {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 12px 13px;
      }
      .js-load-more button { min-width: 160px; }
      .js-all-loaded { font-size: 10px; color: var(--dsw-alias-label-secondary); padding: 2px 0 13px; text-align: center; }
      .js-more-error { padding: 0 12px 10px; font-size: 10px; color: var(--dsw-alias-state-error-primary); text-align: center; }
      .js-skeleton-list { display: flex; flex-direction: column; gap: 8px; padding: 10px 12px; }
      .js-skeleton {
        height: 112px;
        border-radius: 11px;
        border: 1px solid var(--dsw-alias-border-l1);
        background: linear-gradient(90deg, var(--dsw-alias-bg-base), var(--dsw-alias-bg-layer-2), var(--dsw-alias-bg-base));
        background-size: 200% 100%;
        animation: js-shimmer 1.35s infinite linear;
      }
      @keyframes js-shimmer { to { background-position: -200% 0; } }
      .js-spin { animation: js-spin 1s linear infinite; }
      @keyframes js-spin { to { transform: rotate(360deg); } }
      .js-loading-inline {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 18px;
        color: var(--dsw-alias-label-secondary);
        font-size: 11px;
      }
      .js-saved-date { font-size: 9px; color: var(--dsw-alias-label-secondary); }
      @media (max-width: 980px) {
        .js-body { grid-template-columns: 1fr; overflow: auto; }
        .js-rail { display: none; }
        .js-main { min-height: 420px; }
        .js-wide-toggle { display: none; }
      }
      @media (max-width: 680px) {
        .js-header { padding: 16px 16px 12px; }
        .js-search-wrap { margin: 0 16px; }
        .js-resume { margin: 0 16px 12px; }
        .js-resume-body { grid-template-columns: 1fr; }
        .js-resume-side { flex-direction: row; align-items: center; }
        .js-search-form { grid-template-columns: 1fr; }
        .js-search-btn { width: 100%; }
        .js-body { padding: 14px 16px 18px; }
        .js-toolbar { align-items: flex-start; flex-direction: column; }
        .js-job-top { flex-direction: column; gap: 3px; }
        .js-salary { font-size: 14px; }
      }
      @media (prefers-reduced-motion: reduce) {
        .js-job:hover { transform: none; }
        .js-spin, .js-skeleton { animation: none; }
      }
    `;

    function fill(template, vars) {
      return String(template).replace(/\{(\w+)\}/g, (whole, key) =>
        Object.prototype.hasOwnProperty.call(vars, key) ? String(vars[key]) : whole,
      );
    }

    function readStorage(key, fallback) {
      try {
        const raw = window.localStorage.getItem(key);
        if (!raw) return fallback;
        const parsed = JSON.parse(raw);
        return parsed == null ? fallback : parsed;
      } catch {
        return fallback;
      }
    }

    function writeStorage(key, value) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // Storage can be unavailable in a locked-down browser profile; the UI still works.
      }
    }

    function parseSalary(value) {
      const raw = String(value ?? '').replace(/\s+/g, '').replace(/，/g, ',');
      if (!raw || /面议|negotiable|议/i.test(raw)) return null;

      let unit = 1;
      let yearly = false;
      if (/万\s*\/\s*年|万元\s*\/\s*年|万每年/.test(raw)) {
        unit = 10;
        yearly = true;
      } else if (/万\s*\/\s*月|万元\s*\/\s*月|万/.test(raw)) {
        unit = 10;
      } else if (/元\s*\/\s*天|元每天/.test(raw)) {
        unit = 22 / 1000;
      } else if (/元\s*\/\s*时|元每小时/.test(raw)) {
        unit = (8 * 22) / 1000;
      } else if (/元\s*\/\s*月|元每月/.test(raw)) {
        unit = 1 / 1000;
      }

      const range = /(\d+(?:\.\d+)?)\s*[-~—–至]\s*(\d+(?:\.\d+)?)/.exec(raw);
      const single = range ? null : /(\d+(?:\.\d+)?)/.exec(raw);
      if (!range && !single) return null;

      let min = Number(range ? range[1] : single[1]);
      let max = Number(range ? range[2] : single[1]);
      if (!Number.isFinite(min) || !Number.isFinite(max) || max <= 0) return null;
      if (yearly) {
        min /= 12;
        max /= 12;
      }
      min *= unit;
      max *= unit;
      if (min > max) [min, max] = [max, min];
      if (max <= 0) return null;
      return { min, max, mid: (min + max) / 2 };
    }

    function money(value) {
      if (!Number.isFinite(value)) return '—';
      const rounded = Math.round(value * 10) / 10;
      return `${Number.isInteger(rounded) ? rounded : rounded.toFixed(1)}k`;
    }

    function salaryStats(items) {
      const ranges = [];
      for (const item of items) {
        const parsed = parseSalary(item.salary);
        if (parsed) ranges.push(parsed);
      }
      if (ranges.length === 0) return { count: 0, min: null, max: null, median: null, text: '—' };
      const mins = ranges.map((r) => r.min).sort((a, b) => a - b);
      const maxes = ranges.map((r) => r.max).sort((a, b) => a - b);
      const mids = ranges.map((r) => r.mid).sort((a, b) => a - b);
      const median = mids[Math.floor(mids.length / 2)];
      return {
        count: ranges.length,
        min: mins[0],
        max: maxes[maxes.length - 1],
        median,
        text: `${money(mins[0])}–${money(maxes[maxes.length - 1])}`,
      };
    }

    function industryStats(items) {
      const counts = new Map();
      for (const item of items) {
        const name = String(item.industry || '').trim();
        if (!name) continue;
        counts.set(name, (counts.get(name) || 0) + 1);
      }
      const rows = [...counts.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh-CN'))
        .slice(0, 4);
      const max = rows.length > 0 ? rows[0][1] : 0;
      return rows.map(([name, count]) => ({ name, count, pct: max > 0 ? (count / max) * 100 : 0 }));
    }

    function dateLabel(value, t) {
      if (!value) return t('unknownDate');
      const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value));
      if (!match) return t('unknownDate');
      const then = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
      if (Number.isNaN(then.getTime())) return t('unknownDate');
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const diff = Math.round((today.getTime() - then.getTime()) / 86_400_000);
      if (diff === 0) return t('today');
      if (diff === 1) return t('yesterday');
      if (diff > 1 && diff < 30) return fill(t('daysAgo'), { n: diff });
      if (diff >= 30 && diff < 365) return fill(t('monthsAgo'), { n: Math.floor(diff / 30) });
      return `${match[1]}-${match[2]}-${match[3]}`;
    }

    function postedLabel(job, t) {
      if (job && job.dateText) return job.dateText;
      return dateLabel(job && job.date, t);
    }

    function sortJobs(items, mode, matchById) {
      if (mode === 'recommended') return items;
      const copied = items.slice();
      if (mode === 'match') {
        copied.sort((a, b) => {
          const sa = matchById?.get(a.id)?.score;
          const sb = matchById?.get(b.id)?.score;
          if (sa == null && sb == null) return 0;
          if (sa == null) return 1;
          if (sb == null) return -1;
          return sb - sa;
        });
        return copied;
      }
      if (mode === 'salary') {
        copied.sort((a, b) => {
          const sa = parseSalary(a.salary);
          const sb = parseSalary(b.salary);
          if (!sa && !sb) return 0;
          if (!sa) return 1;
          if (!sb) return -1;
          return sb.mid - sa.mid;
        });
        return copied;
      }
      copied.sort((a, b) => {
        if (!a.date && !b.date) return 0;
        if (!a.date) return 1;
        if (!b.date) return -1;
        return b.date.localeCompare(a.date);
      });
      return copied;
    }

    function hueFor(text) {
      let hash = 0;
      for (let index = 0; index < String(text).length; index += 1) {
        hash = (hash * 31 + String(text).charCodeAt(index)) % 360;
      }
      return hash;
    }

    function companyInitial(company) {
      const text = String(company || '').replace(/有限公司|股份有限公司|集团|科技|网络/g, '').trim();
      return (text || String(company || '?'))[0] || '?';
    }

    function timeOf(value) {
      if (!value) return '';
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return '';
      return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
    }

    function mergeJobs(previous, next) {
      const map = new Map();
      for (const item of previous) map.set(item.id, item);
      for (const item of next) map.set(item.id, item);
      return [...map.values()];
    }

    function mergeMeta(previous, next) {
      if (!previous) return next;
      if (!next) return previous;
      const sources = new Map();
      for (const source of previous.sources || []) sources.set(source.id, source);
      for (const source of next.sources || []) {
        const old = sources.get(source.id);
        const count = (Number(old?.count) || 0) + (Number(source.count) || 0);
        sources.set(source.id, {
          ...source,
          count,
          status: source.status === 'empty' && count > 0 ? (old?.status || 'ok') : source.status,
          olderCount: (Number(old?.olderCount) || 0) + (Number(source.olderCount) || 0),
          undatedCount: (Number(old?.undatedCount) || 0) + (Number(source.undatedCount) || 0),
        });
      }
      return {
        ...next,
        sources: [...sources.values()],
        olderCount: (Number(previous.olderCount) || 0) + (Number(next.olderCount) || 0),
        undatedCount: (Number(previous.undatedCount) || 0) + (Number(next.undatedCount) || 0),
      };
    }

    function sourceText(job) {
      const labels = Array.isArray(job.sourceLabels) && job.sourceLabels.length > 0
        ? job.sourceLabels
        : [job.sourceLabel || SOURCE_LABELS[job.source] || job.source || ''];
      return [...new Set(labels.filter(Boolean))].join(' + ');
    }

    function sourceSummary(meta, t) {
      if (!meta) return t('multiSource');
      const usable = (meta.sources || []).filter((source) => source.status === 'ok' || source.status === 'empty');
      if (usable.length === 1) return usable[0].label;
      if (usable.length > 1) return fill(t('sourceCount'), { n: usable.length });
      return t('multiSource');
    }

    function sourceStatusText(source, t) {
      if (!source) return '';
      if (source.status === 'ok') return t('sourceOk');
      if (source.status === 'empty') return t('sourceEmpty');
      if (source.status === 'blocked') return t('sourceBlocked');
      if (source.status === 'unsupported') return t('sourceUnsupported');
      return t('sourceError');
    }

    function errorMessage(error, t) {
      const code = error && error.code ? error.code : '';
      if (code === 'rate_limited') return t('rateLimited');
      if (code === 'timeout') return t('timeout');
      if (code === 'network_error') return t('networkError');
      if (error && error.message) return error.message;
      return t('networkError');
    }

    async function postMatch(payload, signal) {
      return fetch('/plugins/job-search/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        signal,
      });
    }

    function useSaved() {
      const [saved, setSaved] = useState(() => {
        const value = readStorage(SAVED_KEY, []);
        return Array.isArray(value) ? value.filter((item) => item && item.id).slice(0, MAX_SAVED) : [];
      });
      const savedIds = useMemo(() => new Set(saved.map((item) => item.id)), [saved]);

      function toggle(job) {
        setSaved((previous) => {
          const exists = previous.some((item) => item.id === job.id);
          const next = exists
            ? previous.filter((item) => item.id !== job.id)
            : [{ ...job, savedAt: new Date().toISOString() }, ...previous].slice(0, MAX_SAVED);
          writeStorage(SAVED_KEY, next);
          return next;
        });
      }

      return { saved, savedIds, toggle };
    }

    function JobSearchPage({ t }) {
      const initialHistory = useMemo(() => {
        const value = readStorage(HISTORY_KEY, []);
        return Array.isArray(value) ? value.filter((item) => item && item.q && item.city).slice(0, MAX_HISTORY) : [];
      }, []);
      const [query, setQuery] = useState(() => initialHistory[0]?.q || '');
      const [city, setCity] = useState(() => initialHistory[0]?.city || readStorage(CITY_KEY, '北京'));
      const [enabledSources, setEnabledSources] = useState(() => {
        const stored = readStorage(SOURCE_KEY, []);
        const valid = Array.isArray(stored) ? stored.filter((id) => SOURCE_LABELS[id]) : [];
        return valid.length > 0 ? valid : SOURCE_DEFS.filter((source) => !source.optional).map((source) => source.id);
      });
      const [freshDays, setFreshDays] = useState(() => {
        const stored = Number(readStorage(FRESHNESS_KEY, 90));
        return FRESHNESS_OPTIONS.some((option) => option.days === stored) ? stored : 90;
      });
      const [resume, setResume] = useState(() => {
        const stored = readStorage(RESUME_KEY, '');
        return typeof stored === 'string' ? stored.slice(0, 4000) : '';
      });
      const [resumeSaved, setResumeSaved] = useState(true);
      const [resumeOpen, setResumeOpen] = useState(true);
      const [moreOpen, setMoreOpen] = useState(false);
      const [wideResults, setWideResults] = useState(false);
      const [aiMatch, setAiMatch] = useState(null);
      const [matchLoading, setMatchLoading] = useState(false);
      const [matchError, setMatchError] = useState('');
      const [items, setItems] = useState([]);
      const [meta, setMeta] = useState(null);
      const [loading, setLoading] = useState(false);
      const [loadingMore, setLoadingMore] = useState(false);
      const [error, setError] = useState(null);
      const [moreError, setMoreError] = useState('');
      const [formError, setFormError] = useState('');
      const [sort, setSort] = useState('latest');
      const [tab, setTab] = useState('results');
      const [history, setHistory] = useState(initialHistory);
      const { saved, savedIds, toggle } = useSaved();
      const sequence = useRef(0);
      const matchSequence = useRef(0);
      const booted = useRef(false);

      function remember(nextQuery, nextCity) {
        const entry = { q: nextQuery, city: nextCity, at: Date.now() };
        setHistory((previous) => {
          const next = [entry, ...previous.filter((item) => !(item.q === nextQuery && item.city === nextCity))].slice(0, MAX_HISTORY);
          writeStorage(HISTORY_KEY, next);
          return next;
        });
        writeStorage(CITY_KEY, nextCity);
      }

      async function performSearch(nextQuery, nextCity, page, options = {}) {
        const trimmedQuery = String(nextQuery || '').trim();
        const trimmedCity = String(nextCity || '').trim();
        if (!trimmedQuery) {
          setFormError(t('queryRequired'));
          return;
        }
        if (!trimmedCity) {
          setFormError(t('cityRequired'));
          return;
        }

        const append = Boolean(options.append);
        const refresh = Boolean(options.refresh);
        const requestedDays = Number(options.days);
        const selectedDays = FRESHNESS_OPTIONS.some((option) => option.days === requestedDays)
          ? requestedDays
          : freshDays;
        const selectedSources = Array.isArray(options.sources) && options.sources.length > 0
          ? options.sources
          : enabledSources;
        if (selectedSources.length === 0) {
          setFormError(t('sourceRequired'));
          return;
        }
        const seq = sequence.current + 1;
        sequence.current = seq;
        setFormError('');
        setMoreError('');
        setError(null);
        if (append) setLoadingMore(true);
        else setLoading(true);

        const params = new URLSearchParams({
          q: trimmedQuery,
          city: trimmedCity,
          page: String(page || 1),
          sources: selectedSources.join(','),
          days: String(selectedDays),
        });
        if (refresh) params.set('refresh', '1');

        const controller = new AbortController();
        const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

        try {
          const response = await fetch(`/plugins/job-search/search?${params.toString()}`, {
            signal: controller.signal,
            headers: { Accept: 'application/json' },
          });
          let body = null;
          try {
            body = await response.json();
          } catch {
            body = null;
          }
          if (!response.ok) {
            const failure = new Error(body && body.message ? body.message : `HTTP ${response.status}`);
            failure.code = body && body.error ? body.error : 'network_error';
            throw failure;
          }
          if (!body || !Array.isArray(body.items)) {
            throw Object.assign(new Error(t('networkError')), { code: 'network_error' });
          }
          if (seq !== sequence.current) return;

          matchSequence.current += 1;
          setAiMatch(null);
          setMatchError('');
          setMatchLoading(false);
          setMeta((previous) => {
            const next = body.meta || null;
            if (!next) return null;
            if (append && previous) return mergeMeta(previous, next);
            return next;
          });
          setItems((previous) => (append ? mergeJobs(previous, body.items) : body.items));
          setSort((current) => (current === 'match' ? 'latest' : current));
          setFreshDays(selectedDays);
          writeStorage(FRESHNESS_KEY, selectedDays);
          if (!append) {
            setTab('results');
            setEnabledSources(selectedSources);
            writeStorage(SOURCE_KEY, selectedSources);
            remember(trimmedQuery, (body.meta && body.meta.city) || trimmedCity);
          }
        } catch (failure) {
          if (seq !== sequence.current) return;
          if (failure && failure.name === 'AbortError') {
            failure.code = 'timeout';
          }
          if (append) {
            setMoreError(errorMessage(failure, t));
          } else {
            setItems([]);
            setMeta(null);
            setError({ code: failure && failure.code, message: errorMessage(failure, t) });
          }
        } finally {
          window.clearTimeout(timer);
          if (seq === sequence.current) {
            setLoading(false);
            setLoadingMore(false);
          }
        }
      }

      useEffect(() => {
        if (booted.current) return;
        booted.current = true;
        const last = initialHistory[0];
        if (last) {
          void performSearch(last.q, last.city, 1);
        }
      }, []);

      useEffect(() => {
        setMoreError('');
      }, [tab, sort]);

      useEffect(() => {
        setResumeSaved(false);
        const timer = window.setTimeout(() => {
          writeStorage(RESUME_KEY, resume);
          setResumeSaved(true);
        }, 300);
        return () => window.clearTimeout(timer);
      }, [resume]);

      const aiMatchById = useMemo(() => {
        const map = new Map();
        for (const match of aiMatch?.matches || []) map.set(match.id, match);
        return map;
      }, [aiMatch]);
      const sorted = useMemo(() => sortJobs(items, sort, aiMatchById), [items, sort, aiMatchById]);
      const stats = useMemo(() => salaryStats(items), [items]);
      const industries = useMemo(() => industryStats(items), [items]);
      const headhunters = useMemo(() => items.filter((item) => item.headhunter).length, [items]);
      const sourceMap = useMemo(() => {
        const map = new Map();
        for (const source of meta?.sources || []) map.set(source.id, source);
        return map;
      }, [meta]);
      const blockedSources = useMemo(
        () => (meta?.sources || []).filter((source) => (source.status === 'blocked' || source.status === 'unsupported') && source.searchUrl),
        [meta],
      );

      function submit(event) {
        event.preventDefault();
        void performSearch(query, city, 1);
      }

      function applyKeyword(keyword) {
        setQuery(keyword);
        setFormError('');
        void performSearch(keyword, city, 1);
      }

      function applyCity(nextCity) {
        setCity(nextCity);
        setFormError('');
        if (query.trim()) void performSearch(query, nextCity, 1);
      }

      function applyFreshness(days) {
        if (!FRESHNESS_OPTIONS.some((option) => option.days === days)) return;
        setFreshDays(days);
        writeStorage(FRESHNESS_KEY, days);
        if (meta) {
          void performSearch(meta.query, meta.city, 1, { days });
        } else if (query.trim()) {
          void performSearch(query, city, 1, { days });
        }
      }

      function toggleSource(id) {
        const next = enabledSources.includes(id)
          ? enabledSources.filter((source) => source !== id)
          : [...enabledSources, id];
        if (next.length === 0) {
          setFormError(t('sourceRequired'));
          return;
        }
        setFormError('');
        setEnabledSources(next);
        writeStorage(SOURCE_KEY, next);
        if (meta) {
          void performSearch(meta.query, meta.city, 1, { sources: next });
        } else if (query.trim()) {
          void performSearch(query, city, 1, { sources: next });
        }
      }

      function loadMore() {
        if (!meta || !meta.hasMore || loadingMore) return;
        void performSearch(meta.query, meta.city, Number(meta.page || 1) + 1, { append: true });
      }

      function refresh() {
        if (!meta) {
          void performSearch(query, city, 1, { refresh: true });
          return;
        }
        void performSearch(meta.query, meta.city, 1, { refresh: true });
      }

      async function runMatch() {
        const text = resume.trim();
        if (!text) {
          setMatchError(t('resumeRequired'));
          setResumeOpen(true);
          return;
        }
        if (items.length === 0) {
          setMatchError(t('resumeNeedSearch'));
          setResumeOpen(true);
          return;
        }
        setMatchError('');
        setMatchLoading(true);
        const matchSeq = matchSequence.current + 1;
        matchSequence.current = matchSeq;
        const controller = new AbortController();
        const timer = window.setTimeout(() => controller.abort(), 50_000);
        try {
          const response = await postMatch({
            resume: text,
            jobs: items.slice(0, 30).map((job) => ({
              id: job.id,
              title: job.title,
              company: job.company,
              salary: job.salary,
              location: job.location,
              experience: job.experience,
              education: job.education,
              industry: job.industry,
              tags: job.tags,
              sourceLabel: job.sourceLabel,
            })),
          }, controller.signal);
          let body = null;
          try {
            body = await response.json();
          } catch {
            body = null;
          }
          if (!response.ok) {
            const failure = new Error(body && body.message ? body.message : `HTTP ${response.status}`);
            failure.code = body && body.error ? body.error : 'network_error';
            throw failure;
          }
          if (!body || !Array.isArray(body.matches)) {
            throw Object.assign(new Error(t('matchError')), { code: 'llm_error' });
          }
          if (matchSeq !== matchSequence.current) return;
          setAiMatch(body);
          setSort('match');
          setResumeOpen(false);
        } catch (failure) {
          if (matchSeq !== matchSequence.current) return;
          if (failure && failure.name === 'AbortError') failure.code = 'timeout';
          setMatchError(`${t('matchError')}：${errorMessage(failure, t)}`);
        } finally {
          window.clearTimeout(timer);
          if (matchSeq === matchSequence.current) setMatchLoading(false);
        }
      }

      const statusTime = timeOf(meta && meta.fetchedAt);
      const hasSearched = Boolean(meta);
      const source = sourceSummary(meta, t);

      return h('div', { className: `js-root${wideResults ? ' is-wide' : ''}` },
        h('style', { dangerouslySetInnerHTML: { __html: CSS } }),
        h('header', { className: 'js-header' },
          h('div', { className: 'js-heading' },
            h('div', { className: 'js-eyebrow' },
              h('span', { className: 'js-eyebrow-dot' }),
              t('eyebrow'),
            ),
            h('h1', { className: 'js-title' }, t('title')),
            h('p', { className: 'js-subtitle' }, t('subtitle')),
          ),
          h('div', { className: 'js-header-side' },
            h('div', { className: 'js-status' },
              h('span', { className: 'js-status-dot' }),
              h('strong', null, source),
              h('span', { style: { opacity: 0.55 } }, t('metaSeparator')),
              h('span', null, statusTime ? fill(t('updated'), { time: statusTime }) : t('sourceNote')),
            ),
            h('button', {
              type: 'button',
              className: 'js-btn',
              onClick: refresh,
              disabled: loading || loadingMore || (!meta && !query.trim()),
            },
              h(RefreshIcon, { spinning: loading }),
              t('refresh'),
            ),
          ),
        ),
        h('section', { className: 'js-search-wrap' },
          h('form', { className: 'js-search-form', onSubmit: submit },
            h('label', { className: 'js-field' },
              h('span', { className: 'js-field-label' }, t('queryLabel')),
              h('span', { className: 'js-input-shell' },
                h(SearchIcon, { size: 14 }),
                h('input', {
                  className: 'js-input',
                  value: query,
                  onChange: (event) => {
                    setQuery(event.target.value);
                    if (formError) setFormError('');
                  },
                  placeholder: t('queryPlaceholder'),
                  'aria-label': t('queryLabel'),
                  autoComplete: 'off',
                  spellCheck: false,
                }),
              ),
            ),
            h('label', { className: 'js-field' },
              h('span', { className: 'js-field-label' }, t('cityLabel')),
              h('span', { className: 'js-input-shell' },
                h(PinIcon, { size: 14 }),
                h('input', {
                  className: 'js-input',
                  value: city,
                  onChange: (event) => {
                    setCity(event.target.value);
                    if (formError) setFormError('');
                  },
                  placeholder: t('cityPlaceholder'),
                  'aria-label': t('cityLabel'),
                  autoComplete: 'off',
                  spellCheck: false,
                  list: 'js-city-options',
                }),
                h('datalist', { id: 'js-city-options' },
                  CITIES.map((name) => h('option', { key: name, value: name })),
                ),
              ),
            ),
            h('button', {
              type: 'submit',
              className: 'js-search-btn',
              disabled: loading && !loadingMore,
              'aria-busy': loading ? 'true' : 'false',
            },
              loading ? h(Spinner, { size: 14 }) : h(SearchIcon, { size: 14 }),
              loading ? t('searching') : t('search'),
            ),
          ),
          formError ? h('div', { className: 'js-form-error', role: 'alert' }, formError) : null,
          h('div', { className: 'js-quick' },
            h('span', { className: 'js-quick-label' }, t('hot')),
            HOT_KEYWORDS.map((keyword) =>
              h('button', {
                key: keyword,
                type: 'button',
                className: `js-chip${query === keyword ? ' is-on' : ''}`,
                onClick: () => applyKeyword(keyword),
              }, keyword),
            ),
            h('span', { style: { opacity: 0.45, margin: '0 1px' } }, t('metaSeparator')),
            h('span', { className: 'js-quick-label' }, t('cityLabel')),
            CITIES.slice(0, 6).map((name) =>
              h('button', {
                key: name,
                type: 'button',
                className: `js-chip${city === name ? ' is-on' : ''}`,
                onClick: () => applyCity(name),
              }, name),
            ),
          ),
          h('div', { className: 'js-sourcebar' },
            h('span', { className: 'js-sourcebar-label' }, t('sources')),
            SOURCE_DEFS.map((def) => {
              const status = sourceMap.get(def.id);
              const on = enabledSources.includes(def.id);
              const title = status
                ? `${def.label}: ${status.message || sourceStatusText(status, t)}`
                : def.label;
              return h('button', {
                key: def.id,
                type: 'button',
                className: `js-source-chip${on ? ' is-on' : ''}${status ? ` is-${status.status}` : ''}`,
                onClick: () => toggleSource(def.id),
                title,
                'aria-pressed': on ? 'true' : 'false',
              },
                h('span', { className: 'js-source-dot' }),
                def.label,
                status && status.count > 0 ? h('em', null, String(status.count)) : null,
                status && status.status === 'blocked' ? h('span', { className: 'js-source-warn' }, t('needsVerification')) : null,
              );
            }),
            h('label', { className: 'js-freshness', title: t('freshOnly') },
              h('span', null, t('timeRange')),
              h('select', {
                value: String(freshDays),
                onChange: (event) => applyFreshness(Number(event.target.value)),
                'aria-label': t('timeRange'),
              },
                FRESHNESS_OPTIONS.map((option) =>
                  h('option', { key: option.days, value: String(option.days) }, t(option.label)),
                ),
              ),
            ),
            h('button', {
              type: 'button',
              className: 'js-more-btn',
              onClick: () => setMoreOpen((value) => !value),
              'aria-expanded': moreOpen ? 'true' : 'false',
            }, t('moreSources'), '▾'),
          ),
          moreOpen
            ? h('div', { className: 'js-more-panel' },
                h('div', { className: 'js-more-panel-head' }, t('moreSourcesHint')),
                h('div', { className: 'js-more-grid' },
                  MORE_SOURCES.map((source) =>
                    h('a', {
                      key: source.id,
                      className: 'js-more-link',
                      href: source.url(query.trim() || '前端', city.trim() || '全国'),
                      target: '_blank',
                      rel: 'noreferrer noopener',
                    }, source.label, h(ArrowUpRightIcon, { size: 10 })),
                  ),
                ),
              )
            : null,
          blockedSources.length > 0
            ? h('div', { className: 'js-source-links' },
                h('span', null, t('openSource')),
                blockedSources.map((status) =>
                  h('a', {
                    key: status.id,
                    href: status.searchUrl,
                    target: '_blank',
                    rel: 'noreferrer noopener',
                  }, status.label, h(ArrowUpRightIcon, { size: 10 })),
                ),
              )
            : null,
        ),
        h('section', { className: 'js-resume' },
          h('div', { className: 'js-resume-head' },
            h('div', { className: 'js-resume-title-wrap' },
              h('h2', { className: 'js-resume-title' }, t('resumeTitle')),
              h('span', { className: 'js-resume-status' }, resumeSaved ? t('resumeSaved') : t('resumeSaving')),
            ),
            h('button', {
              type: 'button',
              className: 'js-resume-toggle',
              onClick: () => setResumeOpen((value) => !value),
              'aria-expanded': resumeOpen ? 'true' : 'false',
            }, resumeOpen ? t('resumeCollapse') : t('resumeExpand')),
          ),
          resumeOpen
            ? h('div', { className: 'js-resume-body' },
                h('textarea', {
                  className: 'js-resume-input',
                  value: resume,
                  maxLength: 4000,
                  rows: 3,
                  placeholder: t('resumePlaceholder'),
                  'aria-label': t('resumeTitle'),
                  onChange: (event) => {
                    setResume(event.target.value);
                    setResumeSaved(false);
                    setAiMatch(null);
                    matchSequence.current += 1;
                    setMatchLoading(false);
                    if (matchError) setMatchError('');
                  },
                }),
                h('div', { className: 'js-resume-side' },
                  h('span', { className: 'js-resume-count' }, fill(t('resumeCount'), { n: resume.length })),
                  h('button', {
                    type: 'button',
                    className: 'js-match-btn',
                    onClick: runMatch,
                    disabled: matchLoading || items.length === 0,
                  },
                    matchLoading ? h(Spinner, { size: 12 }) : h(SparkIcon, { size: 12 }),
                    matchLoading ? t('matching') : t('matchButton'),
                  ),
                  h('span', { className: 'js-resume-hint' }, t('matchHint')),
                ),
              )
            : null,
          matchError ? h('div', { className: 'js-match-error', role: 'alert' }, matchError) : null,
          aiMatch
            ? h('div', { className: 'js-match-result' },
                h('strong', null, t('matchSummary')),
                h('p', null, aiMatch.summary || (aiMatch.matches?.length ? '' : t('noMatch'))),
              )
            : null,
        ),
        h('div', { className: 'js-body' },
          h('aside', { className: 'js-rail' },
            h('section', { className: 'js-panel' },
              h('div', { className: 'js-panel-head' },
                h('h2', { className: 'js-panel-title' }, t('searchSummary')),
                h('span', { className: 'js-panel-count' }, hasSearched ? fill(t('jobsThisPage'), { n: items.length }) : '—'),
              ),
              h('div', { className: 'js-summary-key' }, meta ? meta.query : (query.trim() || t('queryLabel'))),
              h('div', { className: 'js-summary-city' }, meta ? `${meta.city} ${t('metaSeparator')} ${source}` : t('cityHint')),
              h('div', { className: 'js-summary-stats' },
                h('div', { className: 'js-summary-stat' },
                  h('span', null, t('salaryCount')),
                  h('strong', null, String(stats.count)),
                ),
                h('div', { className: 'js-summary-stat' },
                  h('span', null, t('headhunterCount')),
                  h('strong', null, String(headhunters)),
                ),
              ),
              h('div', { className: 'js-salary-line' },
                h('span', null, t('salaryRange')),
                h('strong', null, stats.text),
              ),
              h('div', { className: 'js-salary-line' },
                h('span', null, t('salaryMedian')),
                h('strong', null, stats.median == null ? '—' : money(stats.median)),
              ),
            ),
            h('section', { className: 'js-panel' },
              h('div', { className: 'js-panel-head' },
                h('h2', { className: 'js-panel-title' }, t('industryTitle')),
              ),
              industries.length === 0
                ? h('div', { className: 'js-panel-count' }, t('noIndustry'))
                : h('div', { className: 'js-industry' },
                    industries.map((row) =>
                      h('div', { key: row.name, className: 'js-industry-row' },
                        h('div', { className: 'js-industry-top' },
                          h('span', { className: 'js-industry-name' }, row.name),
                          h('span', { className: 'js-industry-n' }, String(row.count)),
                        ),
                        h('div', { className: 'js-bar' },
                          h('span', { style: { width: `${Math.max(6, row.pct)}%` } }),
                        ),
                      ),
                    ),
                  ),
            ),
            history.length > 0
              ? h('section', { className: 'js-panel' },
                  h('div', { className: 'js-panel-head' },
                    h('h2', { className: 'js-panel-title' }, t('recent')),
                  ),
                  h('div', { className: 'js-history' },
                    history.slice(0, 6).map((entry) =>
                      h('button', {
                        key: `${entry.q}|${entry.city}|${entry.at}`,
                        type: 'button',
                        className: 'js-history-item',
                        onClick: () => {
                          setQuery(entry.q);
                          setCity(entry.city);
                          void performSearch(entry.q, entry.city, 1);
                        },
                      },
                        h('span', null, entry.q),
                        h('span', null, entry.city),
                      ),
                    ),
                  ),
                )
              : null,
            h('p', { className: 'js-note' }, t('disclaimer')),
          ),
          h('main', { className: 'js-main' },
            h('div', { className: 'js-toolbar' },
              h('div', { className: 'js-tabs' },
                h('button', {
                  type: 'button',
                  className: `js-tab${tab === 'results' ? ' is-active' : ''}`,
                  onClick: () => setTab('results'),
                },
                  t('results'),
                  h('span', { className: 'js-tab-n' }, String(items.length)),
                ),
                h('button', {
                  type: 'button',
                  className: `js-tab${tab === 'saved' ? ' is-active' : ''}`,
                  onClick: () => setTab('saved'),
                },
                  t('saved'),
                  h('span', { className: 'js-tab-n' }, String(saved.length)),
                ),
              ),
              tab === 'results'
                ? h('div', { className: 'js-tools' },
                    h('button', {
                      type: 'button',
                      className: 'js-btn js-wide-toggle',
                      onClick: () => setWideResults((value) => !value),
                      title: wideResults ? t('normalResults') : t('expandResults'),
                      'aria-pressed': wideResults ? 'true' : 'false',
                    },
                      h(ExpandIcon, { size: 12 }),
                      wideResults ? t('normalResults') : t('expandResults'),
                    ),
                    h('div', { className: 'js-sort', role: 'group', 'aria-label': t('results') },
                      h('button', {
                        type: 'button',
                        className: sort === 'latest' ? 'is-active' : '',
                        onClick: () => setSort('latest'),
                      }, t('sortLatest')),
                      h('button', {
                        type: 'button',
                        className: sort === 'salary' ? 'is-active' : '',
                        onClick: () => setSort('salary'),
                      }, t('sortSalary')),
                      h('button', {
                        type: 'button',
                        className: sort === 'recommended' ? 'is-active' : '',
                        onClick: () => setSort('recommended'),
                      }, t('sortRecommended')),
                      aiMatch
                        ? h('button', {
                            type: 'button',
                            className: sort === 'match' ? 'is-active' : '',
                            onClick: () => setSort('match'),
                          }, t('sortMatch'))
                        : null,
                    ),
                  )
                : h('span', { className: 'js-saved-date' }, fill(t('savedCount'), { n: saved.length })),
            ),
            meta && (meta.notice || meta.cityFallback)
              ? h('div', { className: 'js-notice', role: 'status' },
                  h('strong', null, meta.notice ? t('noticeFallback') : t('noticeCityTitle')),
                  h('span', null, meta.notice || t('noticeCity')),
                )
              : null,
            tab === 'saved'
              ? (saved.length === 0
                  ? h(EmptyState, {
                      t,
                      title: t('savedEmptyTitle'),
                      body: t('savedEmptyBody'),
                      kind: 'saved',
                    })
                  : h('div', { className: 'js-list' },
                      saved.map((job) =>
                        h(JobCard, {
                          key: job.id,
                          job,
                          t,
                          match: aiMatchById.get(job.id),
                          saved: true,
                          onToggle: () => toggle(job),
                          savedAt: job.savedAt,
                        }),
                      ),
                    ))
              : loading
                ? h(SkeletonList)
                : error
                  ? h(ErrorState, { t, error, onRetry: () => performSearch(query, city, 1) })
                  : !hasSearched
                    ? h(EmptyState, {
                        t,
                        title: t('emptyTitle'),
                        body: t('emptyBody'),
                        kind: 'search',
                        onKeyword: applyKeyword,
                      })
                    : sorted.length === 0
                      ? h(EmptyState, {
                          t,
                          title: t('noResultsTitle'),
                          body: t('noResultsBody'),
                          kind: 'no-results',
                          sourceUrl: meta && (meta.sources || []).find((source) => source.status === 'ok' || source.status === 'empty')?.searchUrl,
                        })
                      : h(React.Fragment, null,
                          h('div', { className: 'js-resultbar' },
                            h('span', null,
                              h('strong', null, meta ? fill(t('resultFor'), { q: meta.query, city: meta.city }) : ''),
                              h('span', { style: { marginLeft: 8 } },
                                meta && meta.total != null
                                  ? fill(t('jobsTotal'), { n: meta.total.toLocaleString() })
                                  : fill(meta && meta.page > 1 ? t('loadedJobs') : t('jobsThisPage'), { n: sorted.length }),
                              ),
                            ),
                            h('span', { className: 'js-source' },
                              h('span', { className: 'js-source-dot' }),
                              `${t('sourcePrefix')} ${source}`,
                              meta && meta.page > 1 ? ` ${t('metaSeparator')} P${meta.page}` : '',
                              meta && meta.olderCount > 0
                                ? ` ${t('metaSeparator')} ${fill(t('hiddenOld'), {
                                    n: meta.olderCount,
                                    days: meta.maxAgeDays || meta.ageDays || freshDays,
                                  })}`
                                : '',
                              meta && meta.searchUrl
                                ? h('a', {
                                    className: 'js-source-link',
                                    href: meta.searchUrl,
                                    target: '_blank',
                                    rel: 'noreferrer noopener',
                                    title: t('viewOnSource'),
                                  }, t('viewSource'), h(ArrowUpRightIcon, { size: 10 }))
                                : null,
                            ),
                          ),
                          h('div', { className: 'js-list' },
                            sorted.map((job) =>
                              h(JobCard, {
                                key: job.id,
                                job,
                                t,
                                match: aiMatchById.get(job.id),
                                saved: savedIds.has(job.id),
                                onToggle: () => toggle(job),
                              }),
                            ),
                          ),
                          moreError ? h('div', { className: 'js-more-error', role: 'alert' }, moreError) : null,
                          meta && meta.hasMore
                            ? h('div', { className: 'js-load-more' },
                                h('button', {
                                  type: 'button',
                                  className: 'js-btn',
                                  onClick: loadMore,
                                  disabled: loadingMore,
                                },
                                  loadingMore ? h(Spinner, { size: 13 }) : null,
                                  loadingMore ? t('loadingMore') : t('loadMore'),
                                ),
                              )
                            : (sorted.length > 0 ? h('div', { className: 'js-all-loaded' }, t('allLoaded')) : null),
                        ),
          ),
        ),
      );
    }

    function JobCard({ job, t, saved, onToggle, savedAt, match }) {
      const accent = hueFor(job.company || job.title);
      return h('article', { className: 'js-job' },
        h('a', {
          className: 'js-job-main',
          href: job.url,
          target: '_blank',
          rel: 'noreferrer noopener',
          title: t('viewOnSource'),
        },
          h('div', { className: 'js-job-top' },
            h('div', { className: 'js-job-title-wrap' },
              h('h3', { className: 'js-job-title' }, job.title),
              match ? h('span', { className: 'js-match-badge' }, `${t('matchScore')} ${match.score}`) : null,
              job.headhunter ? h('span', { className: 'js-badge is-headhunter' }, t('headhunter')) : null,
            ),
            h('span', { className: 'js-salary' }, job.salary || t('salaryNegotiable')),
          ),
          h('div', { className: 'js-company-row' },
            h('span', {
              className: 'js-avatar',
              style: { background: `hsl(${accent} 42% 38%)` },
              'aria-hidden': 'true',
            }, companyInitial(job.company)),
            h('span', { className: 'js-company' }, job.company),
            job.stage ? h('span', { className: 'js-stage' }, job.stage) : null,
          ),
          h('div', { className: 'js-meta-row' },
            job.location
              ? h('span', { className: 'js-meta-item' }, h(PinIcon, { size: 11 }), job.location)
              : null,
            job.experience
              ? h('span', { className: 'js-meta-item' }, h(BriefcaseIcon, { size: 11 }), job.experience)
              : null,
            job.education
              ? h('span', { className: 'js-meta-item' }, h(GraduationIcon, { size: 11 }), job.education)
              : null,
          ),
          match?.reason ? h('div', { className: 'js-match-reason' }, match.reason) : null,
          h('div', { className: 'js-job-footer' },
            h('div', { className: 'js-job-footer-left' },
              h('span', { className: 'js-job-source' }, sourceText(job)),
              h('span', null,
                [job.industry, job.scale].filter(Boolean).join(` ${t('metaSeparator')} `) || t('sourceNote'),
              ),
            ),
            h('span', null,
              savedAt
                ? fill(t('savedOn'), { date: dateLabel(String(savedAt).slice(0, 10), t) })
                : postedLabel(job, t),
            ),
          ),
        ),
        h('button', {
          type: 'button',
          className: `js-save${saved ? ' is-on' : ''}`,
          onClick: (event) => {
            event.preventDefault();
            event.stopPropagation();
            onToggle();
          },
          title: saved ? t('unsave') : t('save'),
          'aria-label': saved ? t('unsave') : t('save'),
          'aria-pressed': saved ? 'true' : 'false',
        }, h(StarIcon, { size: 15, filled: saved })),
      );
    }

    function EmptyState({ t, title, body, kind, onKeyword, sourceUrl }) {
      return h('div', { className: 'js-empty' },
        h('div', { className: 'js-empty-art' },
          kind === 'saved' ? h(StarIcon, { size: 40, filled: false }) : h(EmptyArt, { kind }),
        ),
        h('strong', null, title),
        h('p', null, body),
        kind === 'search'
          ? h('div', { className: 'js-empty-actions' },
              HOT_KEYWORDS.slice(0, 4).map((keyword) =>
                h('button', {
                  key: keyword,
                  type: 'button',
                  className: 'js-chip',
                  onClick: () => onKeyword(keyword),
                }, keyword),
              ),
            )
          : null,
        kind === 'no-results' && sourceUrl
          ? h('div', { className: 'js-empty-actions' },
              h('a', {
                className: 'js-btn',
                href: sourceUrl,
                target: '_blank',
                rel: 'noreferrer noopener',
              }, t('viewSource'), h(ArrowUpRightIcon, { size: 12 })),
            )
          : null,
      );
    }

    function ErrorState({ t, error, onRetry }) {
      return h('div', { className: 'js-empty' },
        h('div', { className: 'js-empty-art' }, h(EmptyArt, { kind: 'error' })),
        h('strong', null, t('errorTitle')),
        h('p', null, error.message || t('networkError')),
        h('div', { className: 'js-empty-actions' },
          h('button', { type: 'button', className: 'js-btn', onClick: onRetry },
            h(RefreshIcon, { spinning: false }),
            t('retry'),
          ),
        ),
      );
    }

    function SkeletonList() {
      return h('div', { className: 'js-skeleton-list', 'aria-busy': 'true' },
        [0, 1, 2, 3, 4].map((index) => h('div', { key: index, className: 'js-skeleton' })),
      );
    }

    function Spinner({ size = 14 }) {
      return h('svg', {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        className: 'js-spin',
        'aria-hidden': 'true',
      },
        h('circle', { cx: 12, cy: 12, r: 9, stroke: 'currentColor', strokeWidth: 2, opacity: 0.22 }),
        h('path', { d: 'M21 12a9 9 0 0 0-9-9', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' }),
      );
    }

    function SearchIcon({ size = 14 }) {
      return h('svg', {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': 'true',
      },
        h('circle', { cx: 11, cy: 11, r: 6.5 }),
        h('path', { d: 'm16 16 4.2 4.2' }),
      );
    }

    function PinIcon({ size = 12 }) {
      return h('svg', {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.9,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': 'true',
      },
        h('path', { d: 'M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z' }),
        h('circle', { cx: 12, cy: 11, r: 2.3 }),
      );
    }

    function BriefcaseIcon({ size = 12 }) {
      return h('svg', {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.9,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': 'true',
      },
        h('rect', { x: 3, y: 7.5, width: 18, height: 12, rx: 2 }),
        h('path', { d: 'M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5' }),
        h('path', { d: 'M3 12.5h18', opacity: 0.45 }),
      );
    }

    function GraduationIcon({ size = 12 }) {
      return h('svg', {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.9,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': 'true',
      },
        h('path', { d: 'm2.5 9 9.5-5 9.5 5-9.5 5-9.5-5Z' }),
        h('path', { d: 'M6.5 11.2V16c2.8 2 8.2 2 11 0v-4.8' }),
      );
    }

    function RefreshIcon({ spinning = false }) {
      return h('svg', {
        width: 13,
        height: 13,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        className: spinning ? 'js-spin' : null,
        'aria-hidden': 'true',
      },
        h('path', { d: 'M20 11a8 8 0 1 0-2.3 6.3' }),
        h('path', { d: 'M20 4v7h-7' }),
      );
    }

    function ExpandIcon({ size = 12 }) {
      return h('svg', {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.9,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': 'true',
      },
        h('path', { d: 'M8 3H3v5' }),
        h('path', { d: 'M3 3l6 6' }),
        h('path', { d: 'M16 3h5v5' }),
        h('path', { d: 'M21 3l-6 6' }),
        h('path', { d: 'M8 21H3v-5' }),
        h('path', { d: 'M3 21l6-6' }),
        h('path', { d: 'M16 21h5v-5' }),
        h('path', { d: 'M21 21l-6-6' }),
      );
    }

    function ArrowUpRightIcon({ size = 12 }) {      return h('svg', {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': 'true',
      },
        h('path', { d: 'M7 17 17 7' }),
        h('path', { d: 'M8 7h9v9' }),
      );
    }

    function SparkIcon({ size = 12 }) {
      return h('svg', {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.8,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': 'true',
      },
        h('path', { d: 'M12 3.5 13.7 9l5.5 1.7-5.5 1.7L12 18l-1.7-5.6L4.8 10.7 10.3 9 12 3.5Z' }),
        h('path', { d: 'M19 16.5v3M17.5 18h3', opacity: 0.6 }),
      );
    }

    function StarIcon({ size = 15, filled = false }) {      return h('svg', {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: filled ? 'currentColor' : 'none',
        stroke: 'currentColor',
        strokeWidth: 1.8,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': 'true',
      },
        h('path', { d: 'm12 3.6 2.5 5.1 5.6.8-4.1 4 .97 5.6L12 16.5l-4.97 2.6.97-5.6-4.1-4 5.6-.8L12 3.6Z' }),
      );
    }

    function EmptyArt({ kind }) {
      if (kind === 'error') {
        return h('svg', {
          width: 42,
          height: 42,
          viewBox: '0 0 64 64',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 2,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          'aria-hidden': 'true',
        },
          h('circle', { cx: 32, cy: 32, r: 22, opacity: 0.4 }),
          h('path', { d: 'M32 20v15' }),
          h('circle', { cx: 32, cy: 44, r: 1.8, fill: 'currentColor', stroke: 'none' }),
        );
      }
      return h('svg', {
        width: 48,
        height: 48,
        viewBox: '0 0 64 64',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': 'true',
      },
        h('rect', { x: 9, y: 18, width: 46, height: 34, rx: 7, opacity: 0.35 }),
        h('path', { d: 'M23 18v-3a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v3' }),
        h('path', { d: 'M9 31h46', opacity: 0.35 }),
        h('circle', { cx: 39, cy: 39, r: 6.5, opacity: 0.85 }),
        h('path', { d: 'm44 44 5 5', opacity: 0.85 }),
      );
    }

    function SidebarIcon({ size = 20, active = false }) {
      return h('svg', {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.7,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        style: { display: 'block', color: active ? 'var(--dsw-alias-brand-primary)' : 'currentColor' },
        'aria-hidden': true,
        focusable: false,
      },
        h('rect', { x: 3, y: 7.5, width: 18, height: 12.5, rx: 2.2 }),
        h('path', { d: 'M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5' }),
        h('circle', { cx: 15.8, cy: 14.4, r: 2.4 }),
        h('path', { d: 'm17.6 16.2 1.6 1.6' }),
        h('path', { d: 'M3 12h18', opacity: 0.35 }),
      );
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        ctx.effect(() => {
          const zh = ctx.locale.register(NS, 'zh', ZH);
          const en = ctx.locale.register(NS, 'en', EN);
          return () => {
            zh();
            en();
          };
        }, 'job-search: locale dictionaries');

        const t = ctx.locale.bind(NS);

        ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
          name: 'sidebar.panellist',
          id: 'job-search',
          order: 21,
          label: () => t('nav'),
        }, SidebarIcon));

        ctx.slots.inject('main', () => ctx.slots.register({
          name: 'main',
          key: 'job-search',
        }, () => h(JobSearchPage, { t })));
      },
    };
  },
});
