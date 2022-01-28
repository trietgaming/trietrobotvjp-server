import S from "fluent-json-schema";

export default S.object().prop(
  "headers",
  S.object().prop("authorization", S.string().required())
);
