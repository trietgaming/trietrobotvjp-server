import S from "fluent-json-schema";

export default S.object()
  .prop("ok", S.boolean().required())
  .additionalProperties(false);
