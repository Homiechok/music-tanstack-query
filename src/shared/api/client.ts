import createClient from "openapi-fetch";
import type { paths } from "./schema";

export const client = createClient<paths>({ baseUrl: "https://musicfun.it-incubator.app/api/1.0/", headers: {
  "api-key": "8485416e-fdda-4d27-9b54-f2bd62b66715",
  } });