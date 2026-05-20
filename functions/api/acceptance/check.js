import { acceptanceState, getAcceptanceSummary, json, readJson } from "../_data.js";

const getPayload = () => ({
  summary: getAcceptanceSummary(),
  checks: acceptanceState.checks
});

export const onRequestPost = async ({ request }) => {
  const body = await readJson(request);
  const text = String(body.text || "").trim().slice(0, 120);
  if (!text) {
    return json({ error: "Checklist text is required" }, 400);
  }

  const item = {
    id: `check-${Date.now()}`,
    text,
    done: Boolean(body.done)
  };
  acceptanceState.checks.push(item);
  return json(getPayload(), 201);
};

export const onRequestPatch = async ({ request }) => {
  const body = await readJson(request);
  const item = acceptanceState.checks.find((entry) => entry.id === body.id);
  if (!item) {
    return json({ error: "Checklist item not found" }, 404);
  }

  if (typeof body.done !== "undefined") {
    item.done = Boolean(body.done);
  }
  if (typeof body.text === "string") {
    const text = body.text.trim().slice(0, 120);
    if (!text) {
      return json({ error: "Checklist text cannot be empty" }, 400);
    }
    item.text = text;
  }

  return json(getPayload());
};

export const onRequestDelete = async ({ request }) => {
  const body = await readJson(request);
  const index = acceptanceState.checks.findIndex((entry) => entry.id === body.id);
  if (index === -1) {
    return json({ error: "Checklist item not found" }, 404);
  }

  acceptanceState.checks.splice(index, 1);
  return json(getPayload());
};
