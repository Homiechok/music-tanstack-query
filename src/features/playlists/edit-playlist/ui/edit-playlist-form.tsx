import { useEditPlaylist } from "../api/use-edit-playlist.ts";
import { useEffect } from "react";

type PropsType = {
  playlistId: string | null;
  onFormCanceled?: () => void;
};

export const EditPlaylistForm = (props: PropsType) => {
  const { playlistId, onFormCanceled } = props;

  const { handleSubmit, onEdit, register, data, isPending, reset } =
    useEditPlaylist(playlistId, {
      onSuccess: () => {
        onFormCanceled?.();
      },
    });

  useEffect(() => {
    reset();
  }, [playlistId]);

  const handleCancelClick = () => {
    onFormCanceled?.();
  };

  if (!playlistId) return <></>;
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
      <div>
        <button type="submit">Edit</button>
        <button type="reset" onClick={handleCancelClick}>
          Cancel
        </button>
      </div>
    </form>
  );
};
