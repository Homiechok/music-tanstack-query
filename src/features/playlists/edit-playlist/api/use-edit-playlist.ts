import { useForm } from "react-hook-form";
import {
  SchemaGetPlaylistsOutput,
  SchemaUpdatePlaylistRequestPayload,
} from "../../../../shared/api/schema.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../../../../shared/api/client.ts";
import { playlistsKeys } from "../../../../shared/api/playlists-keys-factory.ts";
import { usePlaylistQurery } from "./use-playlist-qurery.ts";

export const useEditPlaylist = (playlistId: string | null) => {
  const { register, handleSubmit, reset } =
    useForm<SchemaUpdatePlaylistRequestPayload>();

  const queryClient = useQueryClient();
  const { data, isPending } = usePlaylistQurery(playlistId)

  const key = playlistsKeys.myList();

  const { mutate } = useMutation({
    mutationFn: async (data: SchemaUpdatePlaylistRequestPayload) => {
      const response = await client.PUT("/playlists/{playlistId}", {
        params: { path: { playlistId: playlistId! } },
        body: { ...data, tagIds: [] },
      });
      return response.data;
    },
    onMutate: async (data: SchemaUpdatePlaylistRequestPayload) => {
      await queryClient.cancelQueries({ queryKey: playlistsKeys.all });

      const previousMyPlaylists = queryClient.getQueryData(key);

      queryClient.setQueryData(key, (oldData: SchemaGetPlaylistsOutput) => {
        return {
          ...oldData,
          data: oldData.data.map((p) => {
            if (p.id === playlistId)
              return {
                ...p,
                attributes: {
                  ...p.attributes,
                  description: data.description,
                  title: data.title,
                },
              };
            else return p;
          }),
        };
      });

      return { previousMyPlaylists };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(key, context?.previousMyPlaylists);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: playlistsKeys.lists(),
        refetchType: "all",
      });
    },
  });

  const onEdit = (data: SchemaUpdatePlaylistRequestPayload) => mutate(data);

  return {
    register,
    handleSubmit,
    onEdit,
    isPending,
    data,
    reset,
  };
};
