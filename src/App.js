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

  return (
    <div className="App">
      <h1 className="App-header">Rick & Morty Characters</h1>
      <Search setSearch={setSearch} updatePageNumber={updatePageNumber} />
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
      </div>
      <div className="App--container">
        {loading && <p>Loading characters...</p>}
        {!loading && error && <p>{error}</p>}
        {!loading && !error && (
          <Card favArray={favArray} setFavArray={setFavArray} results={results} />
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
