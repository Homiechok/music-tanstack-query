import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client, musicAccessToken, musicRefreshToken } from "../../../shared/api/client.ts";

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await client.POST("/auth/logout", {
        body: {
          refreshToken: localStorage.getItem(musicRefreshToken)!,
        },
      });

      return response.data;
    },
    onSuccess: () => {
      localStorage.removeItem(musicAccessToken);
      localStorage.removeItem(musicRefreshToken);
      queryClient.resetQueries({
        queryKey: ["auth", "me"],
      });
    },
  });
};
