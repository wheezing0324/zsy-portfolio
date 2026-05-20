import { json, readJson } from "./_data.js";

const contentKey = "homepage-copy-overrides";

const sanitizeContent = (value) => {
  const output = {};
  ["zh", "en"].forEach((lang) => {
    if (!value?.[lang] || typeof value[lang] !== "object") {
      return;
    }
    output[lang] = {};
    Object.entries(value[lang]).forEach(([key, text]) => {
      if (typeof key === "string" && typeof text === "string") {
        output[lang][key.slice(0, 80)] = text.trim().slice(0, 1200);
      }
    });
  });
  return output;
};

const getStore = (env) => env.PORTFOLIO_CONTENT;

export const onRequestGet = async ({ env }) => {
  const store = getStore(env);
  if (!store?.get) {
    return json({ content: {}, writable: false, storage: "not-configured" });
  }

  const saved = await store.get(contentKey, "json");
  return json({
    content: sanitizeContent(saved || {}),
    writable: Boolean(env.CONTENT_ADMIN_PIN),
    storage: "kv"
  });
};

export const onRequestPost = async ({ request, env }) => {
  const store = getStore(env);
  if (!store?.put) {
    return json({ error: "Cloudflare KV binding PORTFOLIO_CONTENT is not configured" }, 501);
  }
  if (!env.CONTENT_ADMIN_PIN) {
    return json({ error: "CONTENT_ADMIN_PIN is not configured" }, 501);
  }

  const body = await readJson(request);
  if (String(body.pin || "") !== String(env.CONTENT_ADMIN_PIN)) {
    return json({ error: "Invalid edit password" }, 401);
  }

  const content = sanitizeContent(body.content || {});
  await store.put(contentKey, JSON.stringify(content));
  return json({ ok: true, content, storage: "kv" });
};
