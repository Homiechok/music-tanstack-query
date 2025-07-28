import { useEditPlaylist } from "../api/use-edit-playlist.ts";

type PropsType = {
  playlistId: string;
};

export const EditPlaylistForm = (props: PropsType) => {
  const { playlistId } = props

  const { handleSubmit, onEdit, register, data, isPending } =
    useEditPlaylist(playlistId);

  if (isPending) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit(onEdit)}>
      <h2>Edit playlist</h2>
      <p>
        <input
          {...register("title")}
          defaultValue={data?.data.attributes.title ?? ""}
        />
      </p>
      <p>
        <textarea
          {...register("description")}
          defaultValue={data?.data.attributes.description ?? ""}
        />
      </p>
      <button type="submit">Edit</button>
    </form>
  );
};
