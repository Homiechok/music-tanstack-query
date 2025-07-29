import createClient, { Middleware } from "openapi-fetch";
import type { paths } from "./schema";

export const baseUrl = "https://musicfun.it-incubator.app/api/1.0/";
export const apiKey = "8485416e-fdda-4d27-9b54-f2bd62b66715";
export const musicAccessToken = "music-access-token";
export const musicRefreshToken = "music-refresh-token";

let refreshPromise: Promise<void> | null = null;

function makeRefreshToken() {
  if (!refreshPromise) {
    refreshPromise = (async (): Promise<void> => {
      const refreshToken = localStorage.getItem(musicRefreshToken);
      if (!refreshToken) throw new Error("No refresh token");

      const response = await fetch(baseUrl + "auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "API-KEY": apiKey,
        },
        body: JSON.stringify({
          refreshToken: refreshToken,
        }),
      });

      if (!response.ok) {
        localStorage.removeItem(musicAccessToken);
        localStorage.removeItem(musicRefreshToken);
        throw new Error("Refresh token failed");
      }
      const data = await response.json();
      localStorage.setItem(musicAccessToken, data.accessToken);
      localStorage.setItem(musicRefreshToken, data.refreshToken);
    })();

    refreshPromise.finally(() => {
      refreshPromise = null;
    });

    return refreshPromise;
  }
}

const authMiddleware: Middleware = {
  onRequest({ request }) {
    const accessToken = localStorage.getItem(musicAccessToken);
    if (accessToken) {
      request.headers.set("Authorization", "Bearer " + accessToken);
    }

    // @ts-ignore
    request.__retryRequest = request.clone();

    return request;
  },
  async onResponse({ request, response }) {
    if (response.ok) return response;
    if (response.status !== 401) {
      throw new Error(
        `${response.url}: ${response.status} ${response.statusText}`,
      );
    }

    try {
      await makeRefreshToken();
      // @ts-ignore
      const originalRequest: Request = request.__retryRequest;
      const retryRequest = new Request(originalRequest, {
        headers: new Headers(originalRequest.headers),
      });
      retryRequest.headers.set(
        "Authorization",
        "Bearer " + localStorage.getItem(musicAccessToken),
      );
      return fetch(retryRequest);
    } catch {
      return response;
    }
  },
};

export const client = createClient<paths>({
  baseUrl,
  headers: {
    "api-key": apiKey,
  },
});

client.use(authMiddleware);
