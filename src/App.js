import React, { useState, useEffect } from "react";
import Search from "./Components/Search";
import Card from "./Components/Card";
import Navbar from "./Components/Navbar";
import Pagination from "./Components/Pagination";
import SkeletonCards from "./Components/SkeletonCards";
import Footer from "./Components/Footer";
import CharacterDetails from "./Components/CharacterDetails";
import BackToTop from "./Components/BackToTop";
import NotFound from "./Components/NotFound";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
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
        <Route path="/character/:id" element={<CharacterDetails />} />
        <Route path="/favourites" element={<Favourites favArray={favArray} setFavArray={setFavArray} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <BackToTop />
      <Footer />
    </Router>
  );
}

const Home = ({ favArray, setFavArray }) => {
  const navigate = useNavigate();
  const charactersPerPage = 20;
  let [pageNumber, updatePageNumber] = useState(1);
  let [fetchedData, updateFetchedData] = useState([]);
  let [allCharacters, setAllCharacters] = useState([]);
  let [search, setSearch] = useState("");
  let [status, setStatus] = useState("");
  let [gender, setGender] = useState("");
  let [species, setSpecies] = useState("");
  let [origin, setOrigin] = useState("");
  let [sort, setSort] = useState("");
  let [loading, setLoading] = useState(true);
  let [error, setError] = useState("");
  let { info, results } = fetchedData;

  const params = new URLSearchParams();
  if (search) {
    params.set("name", search);
  }
  if (status) {
    params.set("status", status);
  }
  if (gender) {
    params.set("gender", gender);
  }
  if (species) {
    params.set("species", species);
  }

  let baseApi = `https://rickandmortyapi.com/api/character/?${params.toString()}`;
  let api = `${baseApi}${params.toString() ? "&" : ""}page=${pageNumber}`;

  const fetchJson = async (url) => {
    let response = await fetch(url);
    let data = await response.json();

    if (!response.ok) {
      return data;
    }

    return data;
  };

  useEffect(() => {
    (async function () {
      if (sort || origin) {
        return;
      }

      setLoading(true);
      setError("");

      try {
        let data = await fetchJson(api);
        setAllCharacters([]);
        updateFetchedData(data);

        if (data.error) {
          setError(data.error);
        }
      } catch (err) {
        setError("Something went wrong. Please try again.");
        updateFetchedData([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [api, sort, origin]);

  useEffect(() => {
    (async function () {
      if (!sort && !origin) {
        return;
      }

      setLoading(true);
      setError("");

      try {
        let firstPageUrl = `${baseApi}${params.toString() ? "&" : ""}page=1`;
        let firstPageData = await fetchJson(firstPageUrl);

        if (firstPageData.error) {
          updateFetchedData(firstPageData);
          setAllCharacters([]);
          setError(firstPageData.error);
          return;
        }

        let allResults = firstPageData.results ? [...firstPageData.results] : [];

        if (firstPageData.info?.pages > 1) {
          const remainingRequests = [];

          for (let i = 2; i <= firstPageData.info.pages; i++) {
            remainingRequests.push(
              fetchJson(`${baseApi}${params.toString() ? "&" : ""}page=${i}`)
            );
          }

          const remainingPages = await Promise.all(remainingRequests);

          remainingPages.forEach((page) => {
            allResults = [...allResults, ...page.results];
          });
        }

        if (origin) {
          allResults = allResults.filter((character) =>
            character.origin.name.toLowerCase().includes(origin.toLowerCase())
          );
        }

        setAllCharacters(allResults);
      } catch (err) {
        setError("Something went wrong. Please try again.");
        setAllCharacters([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [baseApi, sort, origin]);

  useEffect(() => {
    updatePageNumber(1);
  }, [search, status, gender, species, origin, sort]);

  let displayedResults = results ? [...results] : [];
  let currentInfo = info;

  if ((sort || origin) && allCharacters.length >= 0) {
    let sortedCharacters = [...allCharacters];

    if (sort === "name-asc") {
      sortedCharacters.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sort === "name-desc") {
      sortedCharacters.sort((a, b) => b.name.localeCompare(a.name));
    }

    let startIndex = (pageNumber - 1) * charactersPerPage;
    let endIndex = startIndex + charactersPerPage;

    displayedResults = sortedCharacters.slice(startIndex, endIndex);
    currentInfo = {
      count: sortedCharacters.length,
      pages: Math.ceil(sortedCharacters.length / charactersPerPage),
    };
  }

  const clearFilters = () => {
    setStatus("");
    setGender("");
    setSpecies("");
    setOrigin("");
    setSort("");
    setSearch("");
    updatePageNumber(1);
  };

  const goToRandomCharacter = () => {
    const randomId = Math.floor(Math.random() * 826) + 1;
    navigate(`/character/${randomId}`);
  };

  return (
    <div className="App">
      <div className="container py-4">
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

        <input
          className="filter-select"
          type="text"
          placeholder="Filter by species"
          value={species}
          onChange={(e) => {
            setSpecies(e.target.value);
            updatePageNumber(1);
          }}
        />

        <input
          className="filter-select"
          type="text"
          placeholder="Filter by origin"
          value={origin}
          onChange={(e) => {
            setOrigin(e.target.value);
            updatePageNumber(1);
          }}
        />

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
            updatePageNumber(1);
          }}
        >
          <option value="">Sort Characters</option>
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
        </select>

        <button className="search-btn search-btn-clear" onClick={clearFilters}>
          Clear Filters
        </button>

        <button className="search-btn random-btn" onClick={goToRandomCharacter}>
          Random Character
        </button>
      </div>
      {!loading && !error && currentInfo && (
        <p className="results-count">Showing {currentInfo.count} characters</p>
      )}
      <div className="row g-4 justify-content-center App--container">
        {loading && <SkeletonCards />}
        {!loading && error && <div className="col-12"><p>{error}</p></div>}
        {!loading && !error && (
          <Card favArray={favArray} setFavArray={setFavArray} results={displayedResults} />
        )}
      </div>
      {!error && currentInfo && (
        <Pagination
          info={currentInfo}
          pageNumber={pageNumber}
          updatePageNumber={updatePageNumber}
        />
      )}
      </div>
    </div>
  );
};

export default App;
