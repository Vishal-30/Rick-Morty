import React, { useState } from "react";
import Card from "./Components/Card";
import Search from "./Components/Search";

const Favourites = ({ favArray, setFavArray }) => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  let uniqueChars = Array.from(new Set(favArray.map((a) => a.id))).map((id) => {
    return favArray.find((a) => a.id === id);
  });

  let filteredChars = uniqueChars.filter((character) =>
    character.name.toLowerCase().includes(search.toLowerCase())
  );

  if (sort === "name-asc") {
    filteredChars = [...filteredChars].sort((a, b) => a.name.localeCompare(b.name));
  }

  if (sort === "name-desc") {
    filteredChars = [...filteredChars].sort((a, b) => b.name.localeCompare(a.name));
  }

  return (
    <div className="App">
      <div className="container py-4">
      <h1 className="App-header">Favourite Characters</h1>
      <Search
        search={search}
        setSearch={setSearch}
        placeholder="Search favourites"
      />
      <div className="filter-bar">
        <select
          className="filter-select"
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
          }}
        >
          <option value="">Sort Favourites</option>
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
        </select>
      </div>
      <p className="results-count">Showing {filteredChars.length} favourite characters</p>
      {uniqueChars.length > 0 && (
        <button className="clear-favourites-btn" onClick={() => setFavArray([])}>
          Clear All Favourites
        </button>
      )}
      <div className="row g-4 justify-content-center App--container">
        {filteredChars.length > 0 ? (
          <Card results={filteredChars} favArray={favArray} setFavArray={setFavArray} />
        ) : (
          <div className="col-12">
            <p>{uniqueChars.length > 0 ? "No favourite characters found." : "No favourite characters added yet."}</p>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default Favourites;
