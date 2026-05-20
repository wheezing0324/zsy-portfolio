import { getHomepagePayload, homepage, json, readJson } from "./_data.js";

export const onRequestPost = async ({ request }) => {
  const body = await readJson(request);
  const intent = String(body.intent || "").trim().slice(0, 40);
  const name = String(body.name || "").trim().slice(0, 40);
  const message = String(body.message || "").trim().slice(0, 240);

  if (!intent || !message) {
    return json({ error: "Intent and message are required" }, 400);
  }

  const contact = {
    id: `lead-${Date.now()}`,
    intent,
    name: name || "未填写",
    message,
    createdAt: new Date().toISOString()
  };
  homepage.contacts.push(contact);
  return json({ ok: true, contact, stats: getHomepagePayload().stats }, 201);
};
