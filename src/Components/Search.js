import React from "react";

const Search = ({ setSearch, updatePageNumber }) => {
  let searchBtn = (e) => {
    e.preventDefault();
  };
  return (
    <form
      className="search-form"
    >
      <input
        onChange={(e) => {
          updatePageNumber(1);
          setSearch(e.target.value);
        }}
        placeholder="Search for characters"
        type="text"
        className="search-input"
      />
      <button
        onClick={searchBtn}
        className="search-btn"
      >
        Search
      </button>
    </form>
  );
};

export default Search;