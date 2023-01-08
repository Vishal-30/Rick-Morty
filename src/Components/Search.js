import React, { useEffect, useState } from "react";

const Search = ({
  search,
  setSearch,
  updatePageNumber,
  placeholder = "Search for characters",
}) => {
  const [query, setQuery] = useState(search || "");

  useEffect(() => {
    setQuery(search || "");
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(query);
      if (updatePageNumber) {
        updatePageNumber(1);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, setSearch, updatePageNumber]);

  let searchBtn = (e) => {
    e.preventDefault();
  };

  const clearSearch = () => {
    if (updatePageNumber) {
      updatePageNumber(1);
    }
    setSearch("");
  };

  return (
    <form className="search-form">
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        placeholder={placeholder}
        type="text"
        className="search-input"
      />
      <button onClick={searchBtn} className="search-btn">
        Search
      </button>
      <button type="button" onClick={clearSearch} className="search-btn search-btn-clear">
        Clear
      </button>
    </form>
  );
};

export default Search;
