import { useForm } from "react-hook-form";
import {
  SchemaGetPlaylistsOutput,
  SchemaUpdatePlaylistRequestPayload,
} from "../../../../shared/api/schema.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../../../../shared/api/client.ts";
import { playlistsKeys } from "../../../../shared/api/playlists-keys-factory.ts";
import { usePlaylistQuery } from "./use-playlist-query.ts";

export const useEditPlaylist = (playlistId: string | null) => {
  const { data, isPending } = usePlaylistQuery(playlistId);

  const { register, handleSubmit, reset } =
    useForm<SchemaUpdatePlaylistRequestPayload>({
      defaultValues: {
        title: data?.data.attributes.title,
        description: data?.data.attributes.description,
        tagIds: [],
      },
    });

  const queryClient = useQueryClient();
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
        queryKey: playlistsKeys.all,
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
