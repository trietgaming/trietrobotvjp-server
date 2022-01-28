import { AvailableProviders } from "./../../../types/index";
import S from "fluent-json-schema";

const availableProviders: AvailableProviders[] = ["facebook", "discord"];

export default availableProviders;
export const availableProvidersAsSStringArray = availableProviders.map(
  (provider) => S.string().const(provider)
);
