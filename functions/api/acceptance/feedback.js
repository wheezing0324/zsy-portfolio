import { acceptanceState, getAcceptanceSummary, json, readJson } from "../_data.js";

export const onRequestPost = async ({ request }) => {
  const body = await readJson(request);
  const title = String(body.title || "").trim().slice(0, 60);
  const note = String(body.note || "").trim().slice(0, 180);
  const status = String(body.status || "待评估").trim().slice(0, 24);

  if (!title || !note) {
    return json({ error: "Feedback title and note are required" }, 400);
  }

  acceptanceState.feedback.unshift({ title, note, status });
  return json({
    summary: getAcceptanceSummary(),
    checks: acceptanceState.checks,
    feedback: acceptanceState.feedback
  }, 201);
};
