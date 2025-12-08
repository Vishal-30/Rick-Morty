import React, { useState } from "react";
import Card from "./Components/Card";
import Search from "./Components/Search";

const Favourites = ({ favArray, setFavArray, setToastMessage }) => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [firstCompareId, setFirstCompareId] = useState("");
  const [secondCompareId, setSecondCompareId] = useState("");

  let uniqueChars = Array.from(new Set(favArray.map((a) => a.id))).map((id) => {
    return favArray.find((a) => a.id === id);
  });

  let filteredChars = uniqueChars.filter((character) =>
    character.name.toLowerCase().includes(search.toLowerCase())
  );

  if (statusFilter) {
    filteredChars = filteredChars.filter(
      (character) => character.status.toLowerCase() === statusFilter.toLowerCase()
    );
  }

  if (sort === "name-asc") {
    filteredChars = [...filteredChars].sort((a, b) => a.name.localeCompare(b.name));
  }

  if (sort === "name-desc") {
    filteredChars = [...filteredChars].sort((a, b) => b.name.localeCompare(a.name));
  }

  const firstCharacter = uniqueChars.find((character) => String(character.id) === firstCompareId);
  const secondCharacter = uniqueChars.find((character) => String(character.id) === secondCompareId);
  const statusDifferent = firstCharacter && secondCharacter && firstCharacter.status !== secondCharacter.status;
  const genderDifferent = firstCharacter && secondCharacter && firstCharacter.gender !== secondCharacter.gender;
  const speciesDifferent = firstCharacter && secondCharacter && firstCharacter.species !== secondCharacter.species;
  const originDifferent =
    firstCharacter &&
    secondCharacter &&
    firstCharacter.origin.name !== secondCharacter.origin.name;
  const locationDifferent =
    firstCharacter &&
    secondCharacter &&
    firstCharacter.location.name !== secondCharacter.location.name;

  const exportFavourites = () => {
    const dataStr = JSON.stringify(uniqueChars, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "favourites.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const importFavourites = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);

        if (!Array.isArray(importedData)) {
          return;
        }

        const mergedFavourites = [...favArray, ...importedData];
        const uniqueMergedFavourites = Array.from(
          new Map(mergedFavourites.map((item) => [item.id, item])).values()
        );

        setFavArray(uniqueMergedFavourites);

        if (setToastMessage) {
          setToastMessage("Favourites imported successfully");
        }
      } catch (error) {
        if (setToastMessage) {
          setToastMessage("Invalid favourites file");
        }
      }
    };

    reader.readAsText(file);
    event.target.value = "";
  };

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

        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
          }}
        >
          <option value="">All Favourite Status</option>
          <option value="alive">Alive</option>
          <option value="dead">Dead</option>
          <option value="unknown">Unknown</option>
        </select>
      </div>
      {uniqueChars.length >= 2 && (
        <div className="compare-section">
          <h2 className="compare-title">Compare Favourite Characters</h2>
          <div className="compare-actions">
            <button
              className="clear-favourites-btn compare-reset-btn"
              onClick={() => {
                setFirstCompareId("");
                setSecondCompareId("");
              }}
            >
              Reset Compare
            </button>
          </div>
          <div className="filter-bar">
            <select
              className="filter-select"
              value={firstCompareId}
              onChange={(e) => {
                setFirstCompareId(e.target.value);
              }}
            >
              <option value="">Select first character</option>
              {uniqueChars.map((character) => (
                <option key={character.id} value={character.id}>
                  {character.name}
                </option>
              ))}
            </select>

            <select
              className="filter-select"
              value={secondCompareId}
              onChange={(e) => {
                setSecondCompareId(e.target.value);
              }}
            >
              <option value="">Select second character</option>
              {uniqueChars.map((character) => (
                <option key={character.id} value={character.id}>
                  {character.name}
                </option>
              ))}
            </select>
          </div>

          {firstCharacter && secondCharacter && (
            <div className="row g-4 mt-1">
              <div className="col-12 col-md-6 d-flex">
                <div className="compare-card w-100">
                  <img
                    className="card--image compare-image"
                    src={firstCharacter.image}
                    alt={firstCharacter.name}
                  />
                  <h3 className="compare-card-title">{firstCharacter.name}</h3>
                  <div className={statusDifferent ? "card--name compare-different" : "card--name"}>
                    <span>Status:</span>{firstCharacter.status}
                  </div>
                  <div className={genderDifferent ? "card--name compare-different" : "card--name"}>
                    <span>Gender:</span>{firstCharacter.gender}
                  </div>
                  <div className={speciesDifferent ? "card--name compare-different" : "card--name"}>
                    <span>Species:</span>{firstCharacter.species}
                  </div>
                  <div className={originDifferent ? "card--name compare-different" : "card--name"}>
                    <span>Origin:</span>{firstCharacter.origin.name}
                  </div>
                  <div className={locationDifferent ? "card--name compare-different" : "card--name"}>
                    <span>Location:</span>{firstCharacter.location.name}
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6 d-flex">
                <div className="compare-card w-100">
                  <img
                    className="card--image compare-image"
                    src={secondCharacter.image}
                    alt={secondCharacter.name}
                  />
                  <h3 className="compare-card-title">{secondCharacter.name}</h3>
                  <div className={statusDifferent ? "card--name compare-different" : "card--name"}>
                    <span>Status:</span>{secondCharacter.status}
                  </div>
                  <div className={genderDifferent ? "card--name compare-different" : "card--name"}>
                    <span>Gender:</span>{secondCharacter.gender}
                  </div>
                  <div className={speciesDifferent ? "card--name compare-different" : "card--name"}>
                    <span>Species:</span>{secondCharacter.species}
                  </div>
                  <div className={originDifferent ? "card--name compare-different" : "card--name"}>
                    <span>Origin:</span>{secondCharacter.origin.name}
                  </div>
                  <div className={locationDifferent ? "card--name compare-different" : "card--name"}>
                    <span>Location:</span>{secondCharacter.location.name}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      <p className="results-count">Showing {filteredChars.length} favourite characters</p>
      {uniqueChars.length > 0 && (
        <div className="favourites-actions">
          <label className="clear-favourites-btn import-favourites-btn">
            Import Favourites
            <input type="file" accept=".json" onChange={importFavourites} hidden />
          </label>
          <button className="clear-favourites-btn" onClick={exportFavourites}>
            Export Favourites
          </button>
          <button className="clear-favourites-btn" onClick={() => setFavArray([])}>
            Clear All Favourites
          </button>
        </div>
      )}
      <div className="row g-4 justify-content-center App--container">
        {filteredChars.length > 0 ? (
          <Card
            results={filteredChars}
            favArray={favArray}
            setFavArray={setFavArray}
            setToastMessage={setToastMessage}
          />
        ) : (
          <div className="col-12">
            <div className="empty-state-box">
              <h3>{uniqueChars.length > 0 ? "No favourite characters found" : "No favourite characters yet"}</h3>
              <p>
                {uniqueChars.length > 0
                  ? `No favourites matched "${search}". Try a different name.`
                  : "Add some favourite characters to compare and explore them here."}
              </p>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default Favourites;
