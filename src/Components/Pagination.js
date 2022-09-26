import React from 'react';

const Pagination = (props) => {
  let pageChange = (event) => {
    props.updatePageNumber(event);
  };

  const pageNumbers = [];
  for (let i = 1; i <= props.info?.pages ; i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <ul className='pagination'>
        {pageNumbers.map(number => (
          <li key={number} className='page-item'>
            <button onClick={() => pageChange(number)} className='page-link'>
              {number}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Pagination;