import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { client } from "../../shared/api/client.ts";
import classNames from "classnames";
import s from "./playlists.module.scss";
import { Pagination } from "../../shared/ui/paginataion/paginataion.tsx";
import { useState } from "react";

export const Playlists = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const query = useQuery({
    queryKey: ["playlists", { page, search }],
    queryFn: async ({ signal }) => {
      const response = await client.GET("/playlists", {
        params: {
          query: {
            pageNumber: page,
            search,
          },
        },
        signal,
      });
      if (response.error) {
        throw (response as unknown as { error: Error }).error;
      }
      return response.data;
    },
    placeholderData: keepPreviousData,
  });

  if (query.isPending) return <div>Loading...</div>;
  if (query.isError) return <div>{JSON.stringify(query.error.message)}</div>;

  const classFetching = query.isFetching ? s.fetching : "";

  return (
    <div>
      <div>
        <input
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          placeholder="Search"
        />
      </div>
      <hr/>
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
