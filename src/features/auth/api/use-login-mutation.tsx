import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client, musicAccessToken, musicRefreshToken } from "../../../shared/api/client.ts";

export const callbackUrl = "http://localhost:5173/oauth/callback";

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (code: string) => {
      const response = await client.POST("/auth/login", {
        body: {
          code: code,
          accessTokenTTL: "10s",
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
      localStorage.setItem(musicAccessToken, data.accessToken);
      localStorage.setItem(musicRefreshToken, data.refreshToken);
      queryClient.invalidateQueries({
        queryKey: ["auth", "me"],
      });
    },
  });
};
