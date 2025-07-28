import { useDeletePlaylist } from "../api/use-delete-playlist.ts";

export const DeletePlaylistButton = ({playlistId}: {playlistId: string}) => {
const {handleDelete} = useDeletePlaylist(playlistId);

  return (
    <button onClick={handleDelete}>X</button>
  );
};
