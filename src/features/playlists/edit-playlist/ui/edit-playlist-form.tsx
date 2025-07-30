import { useEditPlaylist } from "../api/use-edit-playlist.ts";
import { useEffect } from "react";
import { queryErrorHandlerForRHFFactory } from "../../../../shared/ui/util/query-error-handler-for-rhf-factory.ts";
import { JsonApiErrorDocument } from "../../../../shared/utils/json-api-error.ts";

type PropsType = {
  playlistId: string | null;
  onFormCanceled?: () => void;
};

export const EditPlaylistForm = (props: PropsType) => {
  const { playlistId, onFormCanceled } = props;

  const {
    handleSubmit,
    onEdit,
    register,
    data,
    isPending,
    reset,
    errors,
    setError,
  } = useEditPlaylist(
    playlistId,
    {
      onSuccess: () => {
        onFormCanceled?.();
      },
    },
    {
      onError: (error) => {
        queryErrorHandlerForRHFFactory({ setError })(
          error as unknown as JsonApiErrorDocument,
        );
      },
    },
  );

  useEffect(() => {
    reset();
  }, [playlistId, reset]);

  const handleCancelClick = () => {
    onFormCanceled?.();
  };

  if (!playlistId) return <></>;
  if (isPending || !data) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit(onEdit)}>
      <h2>Edit playlist</h2>
      <p>
        <input
          {...register("title")}
          defaultValue={data?.data.attributes.title ?? ""}
        />
      </p>
      {errors.title && <p>{errors.title.message}</p>}
      <p>
        <textarea
          {...register("description")}
          defaultValue={data?.data.attributes.description ?? ""}
        />
      </p>
      {errors.description && <p>{errors.description.message}</p>}
      <div>
        <button type="submit">Edit</button>
        <button type="reset" onClick={handleCancelClick}>
          Cancel
        </button>
      </div>
      {errors.root?.server && <p>{errors.root?.server.message}</p>}
    </form>
  );
};
