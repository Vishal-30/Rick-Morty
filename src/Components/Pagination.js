import React from "react";

const Pagination = (props) => {
  let pageChange = (event) => {
    props.updatePageNumber(event);
  };

  const totalPages = props.info?.pages || 0;
  const pageNumbers = [];
  let startPage = Math.max(1, props.pageNumber - 2);
  let endPage = Math.min(totalPages, props.pageNumber + 2);

  if (props.pageNumber <= 3) {
    endPage = Math.min(totalPages, 5);
  }

  if (props.pageNumber >= totalPages - 2) {
    startPage = Math.max(1, totalPages - 4);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="d-flex justify-content-center mt-4" aria-label="Character pagination">
      <ul className="pagination pagination-md flex-wrap">
        <li className={props.pageNumber === 1 ? "page-item disabled" : "page-item"}>
          <button onClick={() => pageChange(1)} className="page-link">
            {"<<"}
          </button>
        </li>

        <li className={props.pageNumber === 1 ? "page-item disabled" : "page-item"}>
          <button onClick={() => pageChange(Math.max(1, props.pageNumber - 5))} className="page-link">
            {"<"}
          </button>
        </li>

        <li className={props.pageNumber === 1 ? "page-item disabled" : "page-item"}>
          <button onClick={() => pageChange(props.pageNumber - 1)} className="page-link">
            Previous
          </button>
        </li>

        {pageNumbers.map((number) => (
          <li
            key={number}
            className={props.pageNumber === number ? "page-item active" : "page-item"}
          >
            <button onClick={() => pageChange(number)} className="page-link">
              {number}
            </button>
          </li>
        ))}

        <li className={props.pageNumber === totalPages ? "page-item disabled" : "page-item"}>
          <button onClick={() => pageChange(props.pageNumber + 1)} className="page-link">
            Next
          </button>
        </li>

        <li className={props.pageNumber === totalPages ? "page-item disabled" : "page-item"}>
          <button onClick={() => pageChange(Math.min(totalPages, props.pageNumber + 5))} className="page-link">
            {">"}
          </button>
        </li>

        <li className={props.pageNumber === totalPages ? "page-item disabled" : "page-item"}>
          <button onClick={() => pageChange(totalPages)} className="page-link">
            {">>"}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
