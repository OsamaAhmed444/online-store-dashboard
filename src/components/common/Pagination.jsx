import React from "react";

function Pagination(props) {
  const currentPage = props.currentPage;
  const totalPages = props.totalPages;
  const onPageChange = props.onPageChange;

  if (totalPages <= 1) {
    return null;
  }

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded border text-sm bg-white text-gray-700"
      >
        Previous
      </button>

      {pages.map((page) => (
        <button
          type="button"
          key={page}
          onClick={() => onPageChange(page)}
          className={
            currentPage === page
              ? "px-3 py-1 rounded border text-sm bg-blue-600 text-white"
              : "px-3 py-1 rounded border text-sm bg-white text-gray-700"
          }
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded border text-sm bg-white text-gray-700"
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
