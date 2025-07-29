import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../../../shared/api/client.ts";
import { authKeys } from "../../../shared/api/auth-keys-factory.ts";
import { localstorageKeys } from "../../../shared/config/localstorage-keys.ts";

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await client.POST("/auth/logout", {
        body: {
          refreshToken: localStorage.getItem(localstorageKeys.musicRefreshToken)!,
        },
      });

      return response.data;
    },
    onSuccess: () => {
      localStorage.removeItem(localstorageKeys.musicAccessToken);
      localStorage.removeItem(localstorageKeys.musicRefreshToken);
      queryClient.resetQueries({
        queryKey: authKeys.me(),
      });
    },
  });
};
