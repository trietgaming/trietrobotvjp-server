import S from "fluent-json-schema";
import { availableProvidersAsSStringArray } from "../_availableProviders";

const baseParamsSchema = S.object().prop(
  "provider",
  S.string()
    .required()
    .oneOf([...availableProvidersAsSStringArray])
);

export default baseParamsSchema;
