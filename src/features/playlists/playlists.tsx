import { useQuery } from "@tanstack/react-query";
import { client } from "../../shared/api/client.ts";
import classNames from "classnames";
import s from "./playlists.module.scss";

export const Playlists = () => {
  const query = useQuery({
    queryKey: ["playlists"],
    queryFn: async () => {
      const response = await client.GET("/playlists");
      if (response.error) {
        throw (response as unknown as { error: Error }).error;
      }
      return response.data;
    },
  });

  console.log("status:" + query.status);
  console.log("fetchStatus:" + query.fetchStatus);

  if (query.isPending) return <div>Loading...</div>;
  if (query.isError) return <div>{JSON.stringify(query.error.message)}</div>;

  const classFetching = query.isFetching ? s.fetching : "";

  return (
    <ul className={classNames(classFetching)}>
      {query.data?.data.map((playlist) => (
        <li key={playlist.id}>{playlist.attributes.title}</li>
      ))}
    </ul>
  );
};
