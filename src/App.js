import React, { useState, useEffect } from "react";
import Search from "./Components/Search";
import Card from "./Components/Card";
import Navbar from "./Components/Navbar";
import Pagination from "./Components/Pagination";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Favourites from "./Favourites";
import "./App.css";

function App() {
  const [favArray, setFavArray] = useState([]);

  return (
    <Router>
      <div className="App">
        <Navbar />
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
  let [loading, setLoading] = useState(true);
  let [error, setError] = useState("");
  let { info, results } = fetchedData;

  let api = `https://rickandmortyapi.com/api/character/?page=${pageNumber}&name=${search}`;

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
