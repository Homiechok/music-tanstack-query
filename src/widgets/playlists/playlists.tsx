import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { client } from "../../shared/api/client.ts";
import classNames from "classnames";
import s from "./playlists.module.scss";
import { Pagination } from "../../shared/ui/paginataion/paginataion.tsx";
import { useState } from "react";
import { DeletePlaylistButton } from "../../features/playlists/delete-playlist/ui/delete-playlist-button.tsx";

export const Playlists = ({
  userId,
  onPlaylistSelected,
}: {
  userId?: string;
  onPlaylistSelected?: (playlistId: string) => void;
}) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const query = useQuery({
    queryKey: ["playlists", { page, search, userId }],
    queryFn: async ({ signal }) => {
      const response = await client.GET("/playlists", {
        params: {
          query: {
            pageNumber: page,
            search,
            userId,
          },
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

  if (query.isPending) return <div>Loading...</div>;
  if (query.isError) return <div>{JSON.stringify(query.error.message)}</div>;

  const classFetching = query.isFetching ? s.fetching : "";

  const handleSelectPlaylist = (playlistId: string) => {
    onPlaylistSelected?.(playlistId);
  };

  return (
    <div>
      <div>
        <input
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          placeholder="Search"
        />
      </div>
      <hr />
      <Pagination
        currentPage={page}
        pagesCount={query.data.meta.pagesCount}
        onPageNumberChange={setPage}
        isFetching={query.isFetching}
      />
      <ul className={classNames(classFetching)}>
        {query.data?.data.map((playlist) => (
          <li
            key={playlist.id}
            onClick={() => handleSelectPlaylist(playlist.id)}
          >
            {playlist.attributes.title}
            <DeletePlaylistButton playlistId={playlist.id} />
          </li>
        ))}
      </ul>
    </div>
  );
};
