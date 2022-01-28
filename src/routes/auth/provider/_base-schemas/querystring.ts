import S from "fluent-json-schema";
const baseQuerystringSchema = S.object()
  .prop("code", S.string().required())
  .prop("error", S.string());
export default baseQuerystringSchema;
