import { dashboard, dashboardFollowups, json, readJson } from "../_data.js";

export const onRequestPost = async ({ request }) => {
  const body = await readJson(request);
  const segment = String(body.segment || "all").trim();
  const customer = String(body.customer || "").trim().slice(0, 40);
  const action = String(body.action || "创建跟进任务").trim().slice(0, 40);

  if (!customer) {
    return json({ error: "Customer is required" }, 400);
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
  return json({
    ...data,
    followups: dashboardFollowups.filter((item) => item.segment === segment),
    latestFollowup: followup
  }, 201);
};
