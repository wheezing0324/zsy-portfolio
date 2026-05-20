import { getHomepagePayload, homepage, json } from "./_data.js";

export const onRequestGet = () => {
  homepage.views += 1;
  return json(getHomepagePayload());
};
