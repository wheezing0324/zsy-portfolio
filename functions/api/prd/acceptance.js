import { json, prd, readJson } from "../_data.js";

export const onRequestPatch = async ({ request }) => {
  const body = await readJson(request);
  const item = prd.sections.acceptance.items.find((entry) => entry.id === body.id);
  if (!item) {
    return json({ error: "Acceptance item not found" }, 404);
  }

  item.done = Boolean(body.done);
  return json(prd.sections.acceptance);
};
