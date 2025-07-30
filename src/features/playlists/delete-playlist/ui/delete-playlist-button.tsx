import { useDeletePlaylist } from "../api/use-delete-playlist.ts";

type PropsType = {
  playlistId: string;
  onDeleted: (playlistId: string) => void;
};

export const DeletePlaylistButton = (props: PropsType) => {
  const { playlistId, onDeleted } = props;

  const { handleDelete } = useDeletePlaylist(playlistId);
  const handleDeletePlaylist = () => {
    handleDelete();
    onDeleted?.(playlistId);
  };

  return <button onClick={handleDeletePlaylist}>X</button>;
};
