import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../../../shared/api/client.ts";
import { authKeys } from "../../../shared/api/auth-keys-factory.ts";
import { localstorageKeys } from "../../../shared/config/localstorage-keys.ts";

export const callbackUrl = "http://localhost:5173/oauth/callback";

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (code: string) => {
      const response = await client.POST("/auth/login", {
        body: {
          code: code,
          accessTokenTTL: "10m",
          rememberMe: true,
          redirectUri: callbackUrl,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem(localstorageKeys.musicAccessToken, data.accessToken);
      localStorage.setItem(localstorageKeys.musicRefreshToken, data.refreshToken);
      queryClient.invalidateQueries({
        queryKey: authKeys.me(),
      });
    },
  });
};
