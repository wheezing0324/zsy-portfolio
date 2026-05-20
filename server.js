const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT || 4173);
const host =
  process.env.HOST ||
  (process.env.RENDER || process.env.RAILWAY_ENVIRONMENT ? "0.0.0.0" : "127.0.0.1");

const homepage = {
  views: 0,
  contacts: [],
  profile: {
    zh: {
      name: "郑舒予",
      role: "B端产品经理实习 / SaaS产品方向",
      status: "产品经理实习 / 杭州 / 可立即到岗",
      availability: "可到岗",
      contact: "杭州 / 可立即到岗"
    },
    en: {
      name: "Shuyu Zheng",
      role: "B2B Product Manager Intern / SaaS Product",
      status: "Product Manager Intern / Hangzhou / Available now",
      availability: "Available",
      contact: "Hangzhou / Available now"
    }
  },
  metrics: {
    solutionProjects: 3,
    documents: 12,
    works: 3
  },
  workStatus: [
    { id: "requirement-workbench", title: "客户需求到 PRD 工作台", api: "/api/prd", backend: true },
    { id: "saas-dashboard", title: "SaaS 运营数据看板原型", api: "/api/dashboard", backend: true },
    { id: "acceptance-tracker", title: "测试验收与反馈闭环工具", api: "/api/acceptance", backend: true }
  ]
};

const prd = {
  feedback: [
    {
      role: "运营负责人",
      text: "客户续费前想看到各门店使用活跃度和异常账号，最好能按行业和客户等级筛选。"
    },
    {
      role: "客户成功",
      text: "每次导出数据都要找研发，内部同学需要一个固定口径的报表入口。"
    },
    {
      role: "测试同学",
      text: "筛选条件和导出字段需要提前确定，否则验收时很容易反复。"
    }
  ],
  tags: ["角色：运营 / CS / 测试", "场景：续费分析", "目标：减少人工取数"],
  sections: {
    scope: {
      title: "功能范围",
      body: "首版提供客户活跃度看板、异常账号提醒、客户等级筛选、固定字段导出。暂不做自定义指标配置，避免首版范围失控。",
      tags: ["P0：活跃度", "P0：导出", "P1：异常提醒"]
    },
    flow: {
      title: "流程设计",
      body: "运营进入看板后选择客户等级和时间范围，查看趋势与异常列表；确认数据后导出标准报表；客户成功基于报表准备续费沟通材料。",
      tags: ["入口：运营看板", "动作：筛选 / 查看 / 导出", "产出：续费沟通材料"]
    },
    acceptance: {
      title: "验收标准",
      items: [
        { id: "filters-refresh", text: "筛选条件改变后，指标卡和异常列表同步刷新。", done: true },
        { id: "export-fields", text: "导出文件包含客户名称、等级、活跃账号、异常原因和最近访问时间。", done: true },
        { id: "empty-state", text: "异常提醒空状态显示解释文案，不出现空白页面。", done: false }
      ]
    }
  }
};

const dashboard = {
  all: {
    metrics: { active: "12,480", renewal: "86%", risk: "18", sla: "2.4h" },
    trend: [72, 78, 65, 83, 74],
    customers: [
      ["华东零售 A", "活跃下降", "续费访谈"],
      ["交通集团 B", "工单超时", "升级处理"],
      ["金融机构 C", "稳定使用", "案例沉淀"]
    ],
    insight: "风险客户应优先看“近 7 日活跃下降 + 工单响应超时”的组合信号，而不是只看单一登录次数。"
  },
  enterprise: {
    metrics: { active: "8,920", renewal: "91%", risk: "7", sla: "1.8h" },
    trend: [82, 86, 79, 88, 84],
    customers: [
      ["金融机构 C", "稳定使用", "案例沉淀"],
      ["制造集团 D", "新增团队", "引导扩容"],
      ["政务客户 E", "权限咨询", "补充培训"]
    ],
    insight: "企业客户更关注权限、稳定性和培训材料，产品说明需要减少术语并提供标准操作路径。"
  },
  risk: {
    metrics: { active: "1,140", renewal: "62%", risk: "18", sla: "4.6h" },
    trend: [48, 42, 39, 44, 36],
    customers: [
      ["华东零售 A", "活跃下降", "续费访谈"],
      ["交通集团 B", "工单超时", "升级处理"],
      ["教育客户 F", "导出失败", "本轮修复"]
    ],
    insight: "风险客户需要把“异常原因、影响范围、下一步动作”放到同一屏，方便客户成功快速跟进。"
  }
};

const acceptanceState = {
  checks: [
    { id: "filter-sync", text: "客户等级筛选会同步刷新指标、列表和导出字段。", done: true },
    { id: "risk-sort", text: "异常客户列表支持按风险原因排序。", done: true },
    { id: "empty-state", text: "空状态提供解释文案和下一步操作。", done: true },
    { id: "export-retry", text: "导出任务失败时提供重试入口和错误提示。", done: false },
    { id: "release-note", text: "版本发布说明覆盖影响范围、使用方式和回滚方案。", done: false }
  ],
  feedback: [
    {
      title: "运营：希望导出字段可保存为常用模板",
      note: "产品判断：高频但非首版阻塞，进入 P1 迭代。",
      status: "P1 / 下一版"
    },
    {
      title: "测试：风险原因枚举与接口返回不一致",
      note: "产品判断：影响验收口径，需本轮修复并同步字段说明。",
      status: "P0 / 本轮修复"
    },
    {
      title: "客户成功：需要一页使用说明给一线同学",
      note: "产品判断：补充版本发布文档和培训话术。",
      status: "文档补充"
    }
  ]
};

const dashboardFollowups = [];
const baseFeedbackCount = 9;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml; charset=utf-8"
};

const sendJson = (response, statusCode, payload) => {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(payload));
};

const readBody = (request) =>
  new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1e6) {
        request.destroy();
        reject(new Error("Request body too large"));
      }
    });
    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
  });

const getAcceptanceSummary = () => {
  const done = acceptanceState.checks.filter((item) => item.done).length;
  return {
    done,
    total: acceptanceState.checks.length,
    openIssues: acceptanceState.feedback.length + acceptanceState.checks.filter((item) => !item.done).length,
    feedback: baseFeedbackCount + acceptanceState.feedback.length
  };
};

const getHomepagePayload = () => ({
  profile: homepage.profile,
  metrics: homepage.metrics,
  workStatus: homepage.workStatus,
  stats: {
    views: homepage.views,
    contacts: homepage.contacts.length,
    latestContact: homepage.contacts.at(-1) || null,
    backend: "Node.js local API"
  }
});

const serveStatic = (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const decodedPath = decodeURIComponent(url.pathname);
  const relativePath = decodedPath === "/" ? "index.html" : decodedPath.replace(/^\/+/, "");
  const filePath = path.normalize(path.join(root, relativePath));

  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream"
    });
    response.end(content);
  });
};

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);

  try {
    if (request.method === "GET" && url.pathname === "/api/profile") {
      homepage.views += 1;
      sendJson(response, 200, getHomepagePayload());
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/contact") {
      const body = await readBody(request);
      const intent = String(body.intent || "").trim().slice(0, 40);
      const name = String(body.name || "").trim().slice(0, 40);
      const message = String(body.message || "").trim().slice(0, 240);

      if (!intent || !message) {
        sendJson(response, 400, { error: "Intent and message are required" });
        return;
      }

      const contact = {
        id: `lead-${Date.now()}`,
        intent,
        name: name || "未填写",
        message,
        createdAt: new Date().toISOString()
      };
      homepage.contacts.push(contact);
      sendJson(response, 201, {
        ok: true,
        contact,
        stats: getHomepagePayload().stats
      });
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/prd") {
      sendJson(response, 200, prd);
      return;
    }

    if (request.method === "PATCH" && url.pathname === "/api/prd/acceptance") {
      const body = await readBody(request);
      const item = prd.sections.acceptance.items.find((entry) => entry.id === body.id);
      if (!item) {
        sendJson(response, 404, { error: "Acceptance item not found" });
        return;
      }
      item.done = Boolean(body.done);
      sendJson(response, 200, prd.sections.acceptance);
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/prd/feedback") {
      const body = await readBody(request);
      const role = String(body.role || "").trim().slice(0, 24);
      const text = String(body.text || "").trim().slice(0, 180);
      const scenario = String(body.scenario || "续费分析").trim().slice(0, 40);
      const value = Math.max(1, Math.min(5, Number(body.value || 4)));
      const urgency = Math.max(1, Math.min(5, Number(body.urgency || 4)));
      const complexity = Math.max(1, Math.min(5, Number(body.complexity || 2)));

      if (!role || !text) {
        sendJson(response, 400, { error: "Role and feedback text are required" });
        return;
      }

      prd.feedback.unshift({ role, text, scenario, value, urgency, complexity });
      prd.tags = ["后端已写入新反馈", ...prd.tags.filter((tag) => tag !== "后端已写入新反馈")].slice(0, 4);
      sendJson(response, 201, prd);
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/dashboard") {
      const segment = url.searchParams.get("segment") || "all";
      const data = dashboard[segment] || dashboard.all;
      sendJson(response, 200, {
        ...data,
        followups: dashboardFollowups.filter((item) => item.segment === segment)
      });
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/dashboard/followup") {
      const body = await readBody(request);
      const segment = String(body.segment || "all").trim();
      const customer = String(body.customer || "").trim().slice(0, 40);
      const action = String(body.action || "创建跟进任务").trim().slice(0, 40);

      if (!customer) {
        sendJson(response, 400, { error: "Customer is required" });
        return;
      }

      const followup = {
        id: `followup-${Date.now()}`,
        segment,
        customer,
        action,
        createdAt: new Date().toISOString()
      };
      dashboardFollowups.unshift(followup);
      const data = dashboard[segment] || dashboard.all;
      sendJson(response, 201, {
        ...data,
        followups: dashboardFollowups.filter((item) => item.segment === segment),
        latestFollowup: followup
      });
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/acceptance") {
      sendJson(response, 200, {
        summary: getAcceptanceSummary(),
        checks: acceptanceState.checks,
        feedback: acceptanceState.feedback
      });
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/acceptance/feedback") {
      const body = await readBody(request);
      const title = String(body.title || "").trim().slice(0, 60);
      const note = String(body.note || "").trim().slice(0, 180);
      const status = String(body.status || "待评估").trim().slice(0, 24);

      if (!title || !note) {
        sendJson(response, 400, { error: "Feedback title and note are required" });
        return;
      }

      acceptanceState.feedback.unshift({ title, note, status });
      sendJson(response, 201, {
        summary: getAcceptanceSummary(),
        checks: acceptanceState.checks,
        feedback: acceptanceState.feedback
      });
      return;
    }

    if (request.method === "PATCH" && url.pathname === "/api/acceptance/check") {
      const body = await readBody(request);
      const item = acceptanceState.checks.find((entry) => entry.id === body.id);
      if (!item) {
        sendJson(response, 404, { error: "Checklist item not found" });
        return;
      }
      item.done = Boolean(body.done);
      sendJson(response, 200, {
        summary: getAcceptanceSummary(),
        checks: acceptanceState.checks
      });
      return;
    }

    if (request.method === "GET") {
      serveStatic(request, response);
      return;
    }

    sendJson(response, 405, { error: "Method not allowed" });
  } catch (error) {
    sendJson(response, 400, { error: error.message });
  }
});

server.listen(port, host, () => {
  console.log(`Portfolio server running at http://${host}:${port}`);
});
