import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../../../shared/api/client.ts";

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await client.POST("/auth/logout", {
        body: {
          refreshToken: localStorage.getItem("music-refresh-token")!,
        },
      });

      return response.data;
    },
    onSuccess: () => {
      localStorage.removeItem("music-access-token");
      localStorage.removeItem("music-refresh-token");
      queryClient.resetQueries({
        queryKey: ["auth", "me"],
      });
    },
  });
};
