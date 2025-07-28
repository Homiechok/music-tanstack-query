import createClient, { Middleware } from "openapi-fetch";
import type { paths } from "./schema";

const authMiddleware: Middleware = {
  onRequest({ request }) {
    const accessToken = localStorage.getItem("music-access-token");
    if (accessToken) {
      request.headers.set("Authorization", "Bearer " + accessToken);
    }
    return request;
  },
  onResponse({ response }) {
    if (!response.ok) {
      throw new Error(
        `${response.url}: ${response.status} ${response.statusText}`,
      );
    }
  },
};

export const client = createClient<paths>({
  baseUrl: "https://musicfun.it-incubator.app/api/1.0/",
  headers: {
    "api-key": "8485416e-fdda-4d27-9b54-f2bd62b66715",
  },
});

client.use(authMiddleware);
