import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../../../../shared/api/client.ts";
import { SchemaGetPlaylistsOutput } from "../../../../shared/api/schema.ts";
import { playlistsKeys } from "../../../../shared/api/playlists-keys-factory.ts";

export const useDeletePlaylist = (playlistId: string) => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async () => {
      const response = await client.DELETE("/playlists/{playlistId}", {
        params: { path: { playlistId } },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.setQueriesData(
        { queryKey: playlistsKeys.lists() },
        (oldData: SchemaGetPlaylistsOutput) => {
          return {
            ...oldData,
            data: oldData.data.filter((p) => p.id !== playlistId),
          };
        },
      );
      queryClient.removeQueries({ queryKey: playlistsKeys.detail(playlistId) });
      // queryClient.invalidateQueries({
      //   queryKey: ["playlists"],
      //   refetchType: "all",
      // });
    },
  });

  const handleDelete = () => mutate();

  return {
    handleDelete,
  };
};
