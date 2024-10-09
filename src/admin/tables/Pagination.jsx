/* eslint-disable react/prop-types */


const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const visiblePages = Array.from({ length: Math.min(totalPages, 7) });

  return (
    <div className="flex justify-center items-center ">
      <h2>paginação</h2>
      <ul className="flex list-none  ">
        {visiblePages.map((_, index) => {
          const pageNumber = index + 1;
          return (
            <li
              key={index}
              className={`mx-1 px-2 ${currentPage === pageNumber
                  ? 'text-[#8B8B8B] cursor-pointer'
                  : 'text-gray-700 cursor-pointer'
                }`}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </li>
          );
        })}
        {totalPages > 3 && (
          <li
            className={`mx-1 px-2 ${currentPage === 8
                ? 'text-[#8B8B8B] cursor-pointer'
                : 'text-gray-700 cursor-pointer'
              }`}
            onClick={() => onPageChange(8)}
          >
            Proximo
          </li>
        )}
      </ul>
    </div>

  );
};

export default Pagination;
