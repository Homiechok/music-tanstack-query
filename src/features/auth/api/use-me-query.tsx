import { useQuery } from "@tanstack/react-query";
import { client } from "../../../shared/api/client.ts";
import { authKeys } from "../../../shared/api/auth-keys-factory.ts";

export const useMeQuery = () => {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: async () => {
      const response = await client.GET("/auth/me");
      return response.data;
    },
    retry: false,
  });
};
