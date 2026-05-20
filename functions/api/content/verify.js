import { json, readJson } from "../_data.js";

const defaultAdminPin = "zsy2026";

export const onRequestPost = async ({ request, env }) => {
  const body = await readJson(request);
  const adminPin = String(env.CONTENT_ADMIN_PIN || defaultAdminPin);

  if (String(body.pin || "") !== adminPin) {
    return json({ ok: false, error: "Invalid edit password" }, 401);
  }

  return json({ ok: true });
};
