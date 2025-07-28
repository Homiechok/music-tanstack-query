import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../../../shared/api/client.ts";

export const callbackUrl = "http://localhost:5173/oauth/callback";

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (code: string) => {
      const response = await client.POST("/auth/login", {
        body: {
          code: code,
          accessTokenTTL: "1d",
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
      localStorage.setItem("music-access-token", data.accessToken);
      localStorage.setItem("music-refresh-token", data.refreshToken);
      queryClient.invalidateQueries({
        queryKey: ["auth", "me"],
      });
    },
  });
};
