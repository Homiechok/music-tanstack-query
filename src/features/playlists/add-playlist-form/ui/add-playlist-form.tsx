import { useAddPlaylist } from "../api/use-add-playlist.ts";

export const AddPlaylistForm = () => {
const {handleSubmit, onSubmit, register} = useAddPlaylist();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Add playlist</h2>
      <p>
        <input {...register("title")} />
      </p>
      <p>
        <textarea {...register("description")} />
      </p>
      <button type="submit">Add</button>
    </form>
  );
};
