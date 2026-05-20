import { acceptanceState, getAcceptanceSummary, json } from "./_data.js";

export const onRequestGet = () =>
  json({
    summary: getAcceptanceSummary(),
    checks: acceptanceState.checks,
    feedback: acceptanceState.feedback
  });
