import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "./Components/Card";
import Pagination from "./Components/Pagination";
import Search from "./Components/Search";

const Favourites = ({ favArray, setFavArray, setToastMessage }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const charactersPerPage = 20;
  const [pageNumber, setPageNumber] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("");
  const [firstCompareId, setFirstCompareId] = useState(() => {
    return localStorage.getItem("firstCompareId") || "";
  });
  const [secondCompareId, setSecondCompareId] = useState(() => {
    return localStorage.getItem("secondCompareId") || "";
  });

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

  if (speciesFilter) {
    filteredChars = filteredChars.filter((character) =>
      character.species.toLowerCase().includes(speciesFilter.toLowerCase())
    );
  }

  if (sort === "name-asc") {
    filteredChars = [...filteredChars].sort((a, b) => a.name.localeCompare(b.name));
  }

  if (sort === "name-desc") {
    filteredChars = [...filteredChars].sort((a, b) => b.name.localeCompare(a.name));
  }

  useEffect(() => {
    setPageNumber(1);
  }, [search, sort, statusFilter, speciesFilter]);

  useEffect(() => {
    localStorage.setItem("firstCompareId", firstCompareId);
    localStorage.setItem("secondCompareId", secondCompareId);
  }, [firstCompareId, secondCompareId]);

  useEffect(() => {
    if (!location.state?.resetFavourites) {
      return;
    }

    setPageNumber(1);
    setSearch("");
    setSort("");
    setStatusFilter("");
    setSpeciesFilter("");
    setFirstCompareId("");
    setSecondCompareId("");
    navigate("/favourites", { replace: true, state: null });
  }, [location.state, navigate]);

  const startIndex = (pageNumber - 1) * charactersPerPage;
  const endIndex = startIndex + charactersPerPage;
  const paginatedChars = filteredChars.slice(startIndex, endIndex);
  const paginationInfo = {
    count: filteredChars.length,
    pages: Math.max(1, Math.ceil(filteredChars.length / charactersPerPage)),
  };

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

    if (setToastMessage) {
      setToastMessage(`${uniqueChars.length} favourites exported`);
    }
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
          if (setToastMessage) {
            setToastMessage("Please import a valid favourites JSON file");
          }
          return;
        }

        const mergedFavourites = [...favArray, ...importedData];
        const uniqueMergedFavourites = Array.from(
          new Map(mergedFavourites.map((item) => [item.id, item])).values()
        );
        const addedCount = uniqueMergedFavourites.length - favArray.length;

        setFavArray(uniqueMergedFavourites);

        if (setToastMessage) {
          setToastMessage(
            addedCount > 0
              ? `${addedCount} favourites imported successfully`
              : "No new favourites were added"
          );
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

  const handleFirstCompareChange = (value) => {
    if (value && value === secondCompareId) {
      setSecondCompareId("");

      if (setToastMessage) {
        setToastMessage("Choose two different favourites to compare");
      }
    }

    setFirstCompareId(value);
  };

  const handleSecondCompareChange = (value) => {
    if (value && value === firstCompareId) {
      setFirstCompareId("");

      if (setToastMessage) {
        setToastMessage("Choose two different favourites to compare");
      }
    }

    setSecondCompareId(value);
  };

  const clearFavouriteFilters = () => {
    setSearch("");
    setSort("");
    setStatusFilter("");
    setSpeciesFilter("");
    setPageNumber(1);
  };

  const resetCompare = () => {
    setFirstCompareId("");
    setSecondCompareId("");
    localStorage.removeItem("firstCompareId");
    localStorage.removeItem("secondCompareId");
  };

  const activeSummary = [];

  if (search) {
    activeSummary.push(`Search: ${search}`);
  }

  if (statusFilter) {
    activeSummary.push(`Status: ${statusFilter}`);
  }

  if (speciesFilter) {
    activeSummary.push(`Species: ${speciesFilter}`);
  }

  if (sort === "name-asc") {
    activeSummary.push("Sort: Name A-Z");
  }

  if (sort === "name-desc") {
    activeSummary.push("Sort: Name Z-A");
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

        <input
          className="filter-select"
          type="text"
          placeholder="Filter by species"
          value={speciesFilter}
          onChange={(e) => {
            setSpeciesFilter(e.target.value);
          }}
        />

        <button className="clear-favourites-btn" onClick={clearFavouriteFilters}>
          Clear Filters
        </button>
      </div>
      <p className="results-count">Showing {filteredChars.length} favourite characters</p>
      <p className="results-summary">
        {activeSummary.length > 0 ? activeSummary.join(" • ") : "All favourites are shown"}
      </p>
      {uniqueChars.length >= 2 && (
        <div className="compare-section">
          <h2 className="compare-title">Compare Favourite Characters</h2>
          <div className="compare-actions">
            <button
              className="clear-favourites-btn compare-reset-btn"
              onClick={resetCompare}
            >
              Reset Compare
            </button>
          </div>
          <div className="filter-bar">
            <select
              className="filter-select"
              value={firstCompareId}
              onChange={(e) => {
                handleFirstCompareChange(e.target.value);
              }}
            >
              <option value="">Select first character</option>
              {uniqueChars.map((character) => (
                <option
                  key={character.id}
                  value={character.id}
                  disabled={String(character.id) === secondCompareId && secondCompareId !== ""}
                >
                  {character.name}
                </option>
              ))}
            </select>

            <select
              className="filter-select"
              value={secondCompareId}
              onChange={(e) => {
                handleSecondCompareChange(e.target.value);
              }}
            >
              <option value="">Select second character</option>
              {uniqueChars.map((character) => (
                <option
                  key={character.id}
                  value={character.id}
                  disabled={String(character.id) === firstCompareId && firstCompareId !== ""}
                >
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
        {paginatedChars.length > 0 ? (
          <Card
            results={paginatedChars}
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
                  ? "Try changing your search, status, or species filters to see more favourites."
                  : "Add some favourite characters to build your own collection, compare them, and export them anytime."}
              </p>
            </div>
          </div>
        )}
      </div>
      {filteredChars.length > 0 && (
        <>
          <p className="pagination-info">
            Page {pageNumber} of {paginationInfo.pages}
          </p>
          <Pagination
            info={paginationInfo}
            pageNumber={pageNumber}
            updatePageNumber={setPageNumber}
          />
        </>
      )}
      </div>
    </div>
  );
};

export default Favourites;
