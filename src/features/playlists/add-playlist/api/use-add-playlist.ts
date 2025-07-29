import { useForm } from "react-hook-form";
import { SchemaCreatePlaylistRequestPayload, SchemaGetPlaylistsOutput } from "../../../../shared/api/schema.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../../../../shared/api/client.ts";

export const useAddPlaylist = () => {
  const { register, handleSubmit, reset } =
    useForm<SchemaCreatePlaylistRequestPayload>();

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async (data: SchemaCreatePlaylistRequestPayload) => {
      const response = await client.POST("/playlists", {
        body: data,
      });
      return response.data;
    },
    onSuccess: (newPlaylist) => {
      queryClient.setQueriesData({queryKey: ["playlists"]}, (oldData: SchemaGetPlaylistsOutput) => {
        return {
          ...oldData,
          data: [newPlaylist?.data, ...oldData.data, ]
        };
      })
      // queryClient.invalidateQueries({
      //   queryKey: ["playlists"],
      //   refetchType: "all",
      // });
    },
  });

  const onSubmit = (data: SchemaCreatePlaylistRequestPayload) => {
    mutate(data);
    reset();
  };

  return {
    register,
    handleSubmit,
    onSubmit,
  }
}