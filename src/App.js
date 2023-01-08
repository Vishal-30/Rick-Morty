import React, { useState, useEffect } from "react";
import Search from "./Components/Search";
import Card from "./Components/Card";
import Navbar from "./Components/Navbar";
import Pagination from "./Components/Pagination";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Favourites from "./Favourites";
import "./App.css";

function App() {
  const [favArray, setFavArray] = useState(() => {
    const savedFavourites = localStorage.getItem("favourites");

    if (savedFavourites) {
      return JSON.parse(savedFavourites);
    }

    return [];
  });

  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favArray));
  }, [favArray]);

  return (
    <Router>
      <div className="App">
        <Navbar favCount={favArray.length} />
      </div>
      <Routes>
        <Route
          path="/"
          element={<Home favArray={favArray} setFavArray={setFavArray} />}
        />
        <Route path="/favourites" element={<Favourites favArray={favArray} setFavArray={setFavArray} />} />
      </Routes>
    </Router>
  );
}

const Home = ({ favArray, setFavArray }) => {
  let [pageNumber, updatePageNumber] = useState(1);
  let [fetchedData, updateFetchedData] = useState([]);
  let [search, setSearch] = useState("");
  let [status, setStatus] = useState("");
  let [gender, setGender] = useState("");
  let [sort, setSort] = useState("");
  let [loading, setLoading] = useState(true);
  let [error, setError] = useState("");
  let { info, results } = fetchedData;

  let api = `https://rickandmortyapi.com/api/character/?page=${pageNumber}&name=${search}&status=${status}&gender=${gender}`;

  useEffect(() => {
    (async function () {
      setLoading(true);
      setError("");

      try {
        let data = await fetch(api).then((res) => res.json());
        updateFetchedData(data);

        if (data.error) {
          setError(data.error);
        }
      } catch (err) {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, [api]);

  let sortedResults = results ? [...results] : [];

  if (sort === "name-asc") {
    sortedResults.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (sort === "name-desc") {
    sortedResults.sort((a, b) => b.name.localeCompare(a.name));
  }

  const clearFilters = () => {
    setStatus("");
    setGender("");
    setSort("");
    setSearch("");
    updatePageNumber(1);
  };

  return (
    <div className="App">
      <h1 className="App-header">Rick & Morty Characters</h1>
      <Search search={search} setSearch={setSearch} updatePageNumber={updatePageNumber} />
      <div className="filter-bar">
        <select
          className="filter-select"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            updatePageNumber(1);
          }}
        >
          <option value="">All Status</option>
          <option value="alive">Alive</option>
          <option value="dead">Dead</option>
          <option value="unknown">Unknown</option>
        </select>

        <select
          className="filter-select"
          value={gender}
          onChange={(e) => {
            setGender(e.target.value);
            updatePageNumber(1);
          }}
        >
          <option value="">All Gender</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="genderless">Genderless</option>
          <option value="unknown">Unknown</option>
        </select>

        <select
          className="filter-select"
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
          }}
        >
          <option value="">Sort Characters</option>
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
        </select>

        <button className="search-btn search-btn-clear" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>
      {!loading && !error && sortedResults && (
        <p className="results-count">Showing {sortedResults.length} characters</p>
      )}
      <div className="App--container">
        {loading && <p>Loading characters...</p>}
        {!loading && error && <p>{error}</p>}
        {!loading && !error && (
          <Card favArray={favArray} setFavArray={setFavArray} results={sortedResults} />
        )}
      </div>
      {!error && (
        <Pagination
          info={info}
          pageNumber={pageNumber}
          updatePageNumber={updatePageNumber}
        />
      )}
    </div>
  );
};

export default App;
