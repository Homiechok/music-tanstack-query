import { useForm } from "react-hook-form";
import {
  SchemaGetPlaylistsOutput,
  SchemaUpdatePlaylistRequestPayload,
} from "../../../../shared/api/schema.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "../../../../shared/api/client.ts";
import { useMeQuery } from "../../../auth/api/use-me-query.tsx";

export const useEditPlaylist = (playlistId: string | null) => {
  const { register, handleSubmit, reset } =
    useForm<SchemaUpdatePlaylistRequestPayload>();

  const { data: meData } = useMeQuery();
  const queryClient = useQueryClient();
  const { data, isPending } = useQuery({
    queryKey: ["playlists", playlistId],
    queryFn: async () => {
      const response = await client.GET("/playlists/{playlistId}", {
        params: { path: { playlistId: playlistId! } },
      });
      return response.data;
    },
    enabled: !!playlistId,
  });

  const key = ["playlists", "my", meData?.userId];

  const { mutate } = useMutation({
    mutationFn: async (data: SchemaUpdatePlaylistRequestPayload) => {
      const response = await client.PUT("/playlists/{playlistId}", {
        params: { path: { playlistId: playlistId! } },
        body: { ...data, tagIds: [] },
      });
      return response.data;
    },
    onMutate: async (data: SchemaUpdatePlaylistRequestPayload) => {
      await queryClient.cancelQueries({ queryKey: ["playlists"] });

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
      // queryClient.setQueriesData(
      //   { queryKey: ["playlists"] },
      //   (oldData: SchemaGetPlaylistsOutput) => {
      //     return oldData;
      //   },
      // );
      queryClient.invalidateQueries({
        queryKey: ["playlists"],
        refetchType: "all",
      });
    },
  });

  const onEdit = (data: SchemaUpdatePlaylistRequestPayload) => {
    mutate(data);
  };

  return {
    register,
    handleSubmit,
    onEdit,
    isPending,
    data,
    reset,
  };
};
