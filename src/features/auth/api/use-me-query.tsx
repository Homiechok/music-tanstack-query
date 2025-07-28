import { useQuery } from "@tanstack/react-query";
import { client } from "../../../shared/api/client.ts";

export const useMeQuery = () => {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const response = await client.GET("/auth/me");
      return response.data;
    },
    retry: false,
  });
};
