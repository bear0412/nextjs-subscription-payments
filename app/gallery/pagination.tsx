import { useCallback, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface Props2 {
  content: any,
  active: any,
  disabled: any,
  onClick: () => void,
}

function Button2(props: Props2) {
  const { content, active, disabled, onClick } = props;
  return (
    <button
      className={`flex flex-col items-center justify-center w-9 h-9 text-sm font-normal transition-colors rounded-lg
      ${active && "bg-blue-500 text-white"}
      ${!disabled
          ? "text-blue-500 cursor-pointer bg-[rgb(59 130 246 / var(--tw-bg-opacity))] hover:bg-blue-500 hover:text-white"
          : "text-gray-500 cursor-not-allowed"
        }
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
}


interface Props3 {
  gotoPage: any,
  canPreviousPage: any,
  canNextPage: any,
  pageCount: any,
  pageIndex: any
};


function PaginationNav1(props: Props3) {
  const {
    gotoPage,
    canPreviousPage,
    canNextPage,
    pageCount,
    pageIndex,
  } = props;
  const renderPageLinks = useCallback(() => {
    if (pageCount === 0) return null;
    const visiblePageButtonCount = 3;
    let numberOfButtons =
      pageCount < visiblePageButtonCount ? pageCount : visiblePageButtonCount;
    const pageIndices = [pageIndex];
    numberOfButtons--;
    [...Array(numberOfButtons)].forEach((_item, itemIndex) => {
      const pageNumberBefore = pageIndices[0] - 1;
      const pageNumberAfter = pageIndices[pageIndices.length - 1] + 1;
      if (
        pageNumberBefore >= 0 &&
        (itemIndex < numberOfButtons / 2 || pageNumberAfter > pageCount - 1)
      ) {
        pageIndices.unshift(pageNumberBefore);
      } else {
        pageIndices.push(pageNumberAfter);
      }
    });
    return pageIndices.map((pageIndexToMap) => (
      <li key={pageIndexToMap}>
        <Button2
          content={pageIndexToMap + 1}
          onClick={() => gotoPage(pageIndexToMap)}
          active={pageIndex === pageIndexToMap}
          disabled={false}
        />
      </li>
    ));
  }, [pageCount, pageIndex]);

  return (
    <ul className="flex gap-2">
      <li>
        <Button2
          content={
            <div className="flex ml-1">
              <FaChevronLeft size="0.6rem" />
              <FaChevronLeft size="0.6rem" className="-translate-x-1/2" />
            </div>
          }
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
          active={false}
        />
      </li>
      <li>
        <Button2
          content={
            <div className="flex ml-1">
              <FaChevronLeft size="0.6rem" />
            </div>
          }
          onClick={() => gotoPage(pageIndex - 1)}
          disabled={!canPreviousPage}
          active={false}
        />
      </li>
      {renderPageLinks()}
      <li>
        <Button2
          content={
            <div className="flex ml-1">
              <FaChevronRight size="0.6rem" />
            </div>
          }
          onClick={() => gotoPage(pageIndex + 1)}
          disabled={!canNextPage}
          active={false}
        />
      </li>
      <li>
        <Button2
          content={
            <div className="flex ml-1">
              <FaChevronRight size="0.6rem" />
              <FaChevronRight size="0.6rem" className="-translate-x-1/2" />
            </div>
          }
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
          active={false}
        />
      </li>
    </ul>
  );
}

interface Props {
  postsPerPage: number,
  totalPosts: number,
  currentPage: number,
  paginate: (pageNumber: number) => void,
}

function PaginationNav1Presentation(props: Props) {
  const { postsPerPage, totalPosts, currentPage, paginate } = props
  const pageCount = totalPosts / postsPerPage + 1;
  return (
    <div className="flex gap-3 flex-wrap p-6 py-12">
      <PaginationNav1
        gotoPage={paginate}
        canPreviousPage={currentPage > 0}
        canNextPage={currentPage < pageCount - 1}
        pageCount={pageCount}
        pageIndex={currentPage}
      />
    </div>
  );
}

export { PaginationNav1Presentation };