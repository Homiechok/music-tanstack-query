import classNames from "classnames";
import s from "./playlists.module.scss";
import { Pagination } from "../../../shared/ui/paginataion/paginataion.tsx";
import { useState } from "react";
import { DeletePlaylistButton } from "../../../features/playlists/delete-playlist/ui/delete-playlist-button.tsx";
import { usePlaylistsQuery } from "../api/use-playlists-query.ts";

type PropsType = {
  userId?: string;
  onPlaylistSelected?: (playlistId: string) => void;
  onPlaylistDeleted?: (playlistId: string) => void;
  isSearchActive?: boolean;
};

export const Playlists = (props: PropsType) => {
  const { userId, onPlaylistSelected, onPlaylistDeleted, isSearchActive } = props;

  const [pageNumber, setPageNumber] = useState(1);
  const [search, setSearch] = useState("");

  const query = usePlaylistsQuery({
    userId,
    filters: { pageNumber, search },
  });

  if (query.isPending) return <div>Loading...</div>;
  if (query.isError) return <div>{JSON.stringify(query.error.message)}</div>;

  const classFetching = query.isFetching ? s.fetching : "";

  const handleSelectPlaylist = (playlistId: string) => {
    onPlaylistSelected?.(playlistId);
  };

  const handleDeletePlaylistClick = (playlistId: string) => {
    onPlaylistDeleted?.(playlistId);
  };

  return (
    <div>
      {isSearchActive && (
        <>
          <div>
            <input
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              placeholder="Search"
            />
          </div>
          <hr />
        </>
      )}
      <Pagination
        currentPage={pageNumber}
        pagesCount={query.data.meta.pagesCount}
        onPageNumberChange={setPageNumber}
        isFetching={query.isFetching}
      />
      <ul className={classNames(classFetching)}>
        {query.data?.data.map((playlist) => (
          <li key={playlist.id}>
            <span onClick={() => handleSelectPlaylist(playlist.id)}>
              {playlist.attributes.title}
            </span>
            <DeletePlaylistButton playlistId={playlist.id} onDeleted={handleDeletePlaylistClick} />
          </li>
        ))}
      </ul>
    </div>
  );
};
