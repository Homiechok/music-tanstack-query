import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { client } from "../../../shared/api/client.ts";
import { playlistsKeys } from "../../../shared/api/playlists-keys-factory.ts";
import { SchemaGetPlaylistsRequestPayload } from "../../../shared/api/schema.ts";

type PropsType = {
  userId: string| undefined,
  filters: Partial<SchemaGetPlaylistsRequestPayload>
}

export const usePlaylistsQuery = (props: PropsType) => {
  const {userId, filters} = props;

  const key = userId
    ? playlistsKeys.myList()
    : playlistsKeys.list(filters);
  const queryParams = userId
    ? { userId }
    : filters;

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: key,
    queryFn: async ({ signal }) => {
      const response = await client.GET("/playlists", {
        params: {
          query: queryParams,
        },
        signal,
      });
      if (response.error) {
        throw (response as unknown as { error: Error }).error;
      }
      return response.data;
    },
    placeholderData: keepPreviousData,
  });
}