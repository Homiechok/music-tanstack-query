import s from "./paginataion.module.scss";
import { PaginationNav } from "./pagination-nav/pagination-nav.tsx";

type Props = {
  currentPage: number;
  pagesCount: number;
  onPageNumberChange: (page: number) => void;
  isFetching: boolean;
};

export const Pagination = ({
  currentPage,
  pagesCount,
  onPageNumberChange,
  isFetching,
}: Props) => {
  return (
    <div className={s.container}>
      <PaginationNav
        current={currentPage}
        pagesCount={pagesCount}
        onChange={onPageNumberChange}
      />
      {isFetching && "..."}
    </div>
  );
};
