import React from "react";

const Pagination = (props) => {
  let pageChange = (event) => {
    props.updatePageNumber(event);
  };

  const pageNumbers = [];
  for (let i = 1; i <= props.info?.pages; i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <ul className="pagination">
        <li className="page-item">
          <button
            onClick={() => pageChange(props.pageNumber - 1)}
            className="page-link"
            disabled={props.pageNumber === 1}
          >
            Prev
          </button>
        </li>

        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <button
              onClick={() => pageChange(number)}
              className={props.pageNumber === number ? "page-link active-page" : "page-link"}
            >
              {number}
            </button>
          </li>
        ))}

        <li className="page-item">
          <button
            onClick={() => pageChange(props.pageNumber + 1)}
            className="page-link"
            disabled={props.pageNumber === props.info?.pages}
          >
            Next
          </button>
        </li>
      </ul>
    </>
  );
};

export default Pagination;
