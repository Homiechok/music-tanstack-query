import { useQuery } from "@tanstack/react-query";
import { client } from "../../shared/api/client.ts";
import classNames from "classnames";
import s from "./playlists.module.scss";
import { Pagination } from "../../shared/ui/paginataion/paginataion.tsx";
import { useState } from "react";

export const Playlists = () => {
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: ["playlists", page],
    queryFn: async () => {
      const response = await client.GET("/playlists", {
        params: {
          query: {
            pageNumber: page,
          },
        },
      });
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
    <div>
      <Pagination
        currentPage={page}
        pagesCount={query.data.meta.pagesCount}
        onPageNumberChange={setPage}
        isFetching={query.isFetching}
      />
      <ul className={classNames(classFetching)}>
        {query.data?.data.map((playlist) => (
          <li key={playlist.id}>{playlist.attributes.title}</li>
        ))}
      </ul>
    </div>
  );
};
