import { dashboard, dashboardFollowups, json } from "./_data.js";

export const onRequestGet = ({ request }) => {
  const url = new URL(request.url);
  const segment = url.searchParams.get("segment") || "all";
  const data = dashboard[segment] || dashboard.all;
  return json({
    ...data,
    followups: dashboardFollowups.filter((item) => item.segment === segment)
  });
};
