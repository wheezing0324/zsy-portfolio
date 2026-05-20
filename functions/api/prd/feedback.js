import { json, prd, readJson } from "../_data.js";

export const onRequestPost = async ({ request }) => {
  const body = await readJson(request);
  const role = String(body.role || "").trim().slice(0, 24);
  const text = String(body.text || "").trim().slice(0, 180);
  const scenario = String(body.scenario || "续费分析").trim().slice(0, 40);
  const value = Math.max(1, Math.min(5, Number(body.value || 4)));
  const urgency = Math.max(1, Math.min(5, Number(body.urgency || 4)));
  const complexity = Math.max(1, Math.min(5, Number(body.complexity || 2)));

  if (!role || !text) {
    return json({ error: "Role and feedback text are required" }, 400);
  }

  prd.feedback.unshift({ role, text, scenario, value, urgency, complexity });
  prd.tags = ["后端已写入新反馈", ...prd.tags.filter((tag) => tag !== "后端已写入新反馈")].slice(0, 4);
  return json(prd, 201);
};
