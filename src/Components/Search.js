import React, { useEffect, useState } from "react";

const Search = ({ setSearch, updatePageNumber }) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      updatePageNumber(1);
      setSearch(query);
    }, 400);

    return () => clearTimeout(timer);
  }, [query, setSearch, updatePageNumber]);

  let searchBtn = (e) => {
    e.preventDefault();
  };

  const clearSearch = () => {
    setQuery("");
    updatePageNumber(1);
    setSearch("");
  };

  return (
    <form className="search-form">
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        placeholder="Search for characters"
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
