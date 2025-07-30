import { useAddPlaylist } from "../api/use-add-playlist.ts";

export const AddPlaylistForm = () => {
  const { handleSubmit, onSubmit, register, errors } = useAddPlaylist();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Add playlist</h2>
      <p>
        <input {...register("title")} />
      </p>
      {errors.title && <p>{errors.title.message}</p>}
      <p>
        <textarea {...register("description")} />
      </p>
      {errors.description && <p>{errors.description.message}</p>}
      <button type="submit">Add</button>
      {errors.root?.server && <p>{errors.root?.server.message}</p>}
    </form>
  );
};
