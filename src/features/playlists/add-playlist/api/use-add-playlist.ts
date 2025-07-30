import { useForm } from "react-hook-form";
import {SchemaCreatePlaylistRequestPayload, SchemaGetPlaylistsOutput} from "../../../../shared/api/schema.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../../../../shared/api/client.ts";
import { playlistsKeys } from "../../../../shared/api/playlists-keys-factory.ts";

export const useAddPlaylist = () => {
  const { register, handleSubmit, reset } =
    useForm<SchemaCreatePlaylistRequestPayload>();

  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: async (data: SchemaCreatePlaylistRequestPayload) => {
      const response = await client.POST("/playlists", {
        body: data,
      });
      return response.data;
    },
    onSuccess: (newPlaylist) => {
      queryClient.setQueriesData({queryKey: playlistsKeys.lists()}, (oldData: SchemaGetPlaylistsOutput) => {
        return {
          ...oldData,
          data: [newPlaylist?.data, ...oldData.data, ]
        };
      })
      // queryClient.invalidateQueries({
      //   queryKey: playlistsKeys.lists(),
      //   refetchType: "all",
      // });
    },
  });

  const onSubmit = async (data: SchemaCreatePlaylistRequestPayload) => {
    await mutateAsync(data);
    reset();
  };

  return {
    register,
    handleSubmit,
    onSubmit,
  };
};
