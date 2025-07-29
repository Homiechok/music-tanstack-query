import createClient, { Middleware } from "openapi-fetch";
import type { paths } from "./schema";
import { apiKey, baseUrl } from "../config/api-config.ts";
import { localstorageKeys } from "../config/localstorage-keys.ts";

let refreshPromise: Promise<void> | null = null;

function makeRefreshToken() {
  if (!refreshPromise) {
    refreshPromise = (async (): Promise<void> => {
      const refreshToken = localStorage.getItem(localstorageKeys.musicRefreshToken);
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
        localStorage.removeItem(localstorageKeys.musicAccessToken);
        localStorage.removeItem(localstorageKeys.musicRefreshToken);
        throw new Error("Refresh token failed");
      }
      const data = await response.json();
      localStorage.setItem(localstorageKeys.musicAccessToken, data.accessToken);
      localStorage.setItem(localstorageKeys.musicRefreshToken, data.refreshToken);
    })();

    refreshPromise.finally(() => {
      refreshPromise = null;
    });

    return refreshPromise;
  }
}

const authMiddleware: Middleware = {
  onRequest({ request }) {
    const accessToken = localStorage.getItem(localstorageKeys.musicAccessToken);
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
        "Bearer " + localStorage.getItem(localstorageKeys.musicAccessToken),
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
