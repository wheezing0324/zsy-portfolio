import { json, prd, readJson } from "../_data.js";

export const onRequestPost = async ({ request }) => {
  const body = await readJson(request);
  const role = String(body.role || "").trim().slice(0, 24);
  const text = String(body.text || "").trim().slice(0, 180);

  if (!role || !text) {
    return json({ error: "Role and feedback text are required" }, 400);
  }

  prd.feedback.unshift({ role, text });
  prd.tags = ["后端已写入新反馈", ...prd.tags.filter((tag) => tag !== "后端已写入新反馈")].slice(0, 4);
  return json(prd, 201);
};
