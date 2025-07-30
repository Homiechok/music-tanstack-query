import { useForm } from "react-hook-form";
import {
  SchemaCreatePlaylistRequestPayload,
  SchemaGetPlaylistsOutput,
} from "../../../../shared/api/schema.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../../../../shared/api/client.ts";
import { playlistsKeys } from "../../../../shared/api/playlists-keys-factory.ts";
import { JsonApiErrorDocument } from "../../../../shared/utils/json-api-error.ts";
import { queryErrorHandlerForRHFFactory } from "../../../../shared/ui/util/query-error-handler-for-rhf-factory.ts";

export const useAddPlaylist = () => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<SchemaCreatePlaylistRequestPayload>();

  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: async (data: SchemaCreatePlaylistRequestPayload) => {
      const response = await client.POST("/playlists", {
        body: data,
      });
      return response.data;
    },
    onSuccess: (newPlaylist) => {
      queryClient.setQueriesData(
        { queryKey: playlistsKeys.lists() },
        (oldData: SchemaGetPlaylistsOutput) => {
          return {
            ...oldData,
            data: [newPlaylist?.data, ...oldData.data],
          };
        },
      );
      // queryClient.invalidateQueries({
      //   queryKey: playlistsKeys.lists(),
      //   refetchType: "all",
      // });
    },
  });

  const onSubmit = async (data: SchemaCreatePlaylistRequestPayload) => {
    try {
      await mutateAsync(data);
      reset();
    } catch (error) {
      queryErrorHandlerForRHFFactory({ setError })(
        error as unknown as JsonApiErrorDocument,
      );
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
  };
};
