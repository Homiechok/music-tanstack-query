import { useQuery } from "@tanstack/react-query";
import { playlistsKeys } from "../../../../shared/api/playlists-keys-factory.ts";
import { client } from "../../../../shared/api/client.ts";

export const usePlaylistQurery = (playlistId: string | null) => {
  return useQuery({
    queryKey: playlistsKeys.detail(playlistId),
    queryFn: async () => {
      const response = await client.GET("/playlists/{playlistId}", {
        params: { path: { playlistId: playlistId! } },
      });
      return response.data;
    },
    enabled: !!playlistId,
  });
}