import { acceptanceState, getAcceptanceSummary, json, readJson } from "../_data.js";

export const onRequestPatch = async ({ request }) => {
  const body = await readJson(request);
  const item = acceptanceState.checks.find((entry) => entry.id === body.id);
  if (!item) {
    return json({ error: "Checklist item not found" }, 404);
  }

  item.done = Boolean(body.done);
  return json({
    summary: getAcceptanceSummary(),
    checks: acceptanceState.checks
  });
};
