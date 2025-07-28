import { useForm } from "react-hook-form";
import { SchemaUpdatePlaylistRequestPayload } from "../../../../shared/api/schema.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "../../../../shared/api/client.ts";

export const useEditPlaylist = (playlistId: string) => {
  const { register, handleSubmit, reset } =
    useForm<SchemaUpdatePlaylistRequestPayload>();

  const queryClient = useQueryClient();
  const { data, isPending } = useQuery({
    queryKey: ["playlists", playlistId],
    queryFn: async () => {
      const response = await client.GET("/playlists/{playlistId}", {params: {path: {playlistId}}})
      return response.data;
    }
  })

  const { mutate } = useMutation({
    mutationFn: async (data: SchemaUpdatePlaylistRequestPayload) => {
      const response = await client.PUT("/playlists/{playlistId}", {
        params: { path: { playlistId } },
        body: { ...data, tagIds: [] },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["playlists"],
        refetchType: "all",
      });
    },
  });

  const onEdit = (data: SchemaUpdatePlaylistRequestPayload) => {
    mutate(data);
    reset();
  };

  return {
    register,
    handleSubmit,
    onEdit,
    isPending,
    data,
  };
};
