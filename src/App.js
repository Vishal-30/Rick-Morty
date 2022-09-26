import React, { useState, useEffect } from "react";
import Search from "./Components/Search";
import Card from "./Components/Card";
import Navbar from "./Components/Navbar";
import Pagination from "./Components/Pagination";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Favourites from "./Favourites";
import "./App.css"

function App() {
  const [favourite] = useState(false)

  return (
    <Router>
      <div className="App">
      <Navbar />
      </div>
      <Routes>
        <Route path="/" element={<Home />} favourite={favourite} />
        <Route path="/favourites" element={<Favourites favArray={favArray} />} />
      </Routes>
    </Router>
  );
}

const favArray = []


const Home = () => {
  let [pageNumber, updatePageNumber] = useState(1);
  let [fetchedData, updateFetchedData] = useState([]);
  let [search, setSearch] = useState("");
  let { info, results } = fetchedData;

  let api = `https://rickandmortyapi.com/api/character/?page=${pageNumber}&name=${search}`;

  useEffect(() => {
    (async function () {
      let data = await fetch(api).then((res) => res.json());
      updateFetchedData(data);
    })();
  }, [api]);
  return (
    <div className="App">
      <h1 className="App-header">Rick & Morty Characters</h1>
      <Search setSearch={setSearch} updatePageNumber={updatePageNumber} />
      <div className="App--container">
        <Card favArray={favArray} results={results} />
      </div>
      <Pagination
        info={info}
        pageNumber={pageNumber}
        updatePageNumber={updatePageNumber}
      />
    </div>
  );
};

export default App;