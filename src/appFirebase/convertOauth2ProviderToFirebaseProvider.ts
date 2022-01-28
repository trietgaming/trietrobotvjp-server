import { AvailableProviders } from "../types/index";
export default (provider: AvailableProviders) => {
  switch (provider) {
    case "discord":
      return "twitter.com";
    case "facebook":
      return "facebook.com";
    default:
      throw "unexpected provider";
  }
};
