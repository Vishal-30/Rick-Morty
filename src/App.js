import React, { useState, useEffect, useRef } from "react";
import Search from "./Components/Search";
import Card from "./Components/Card";
import Navbar from "./Components/Navbar";
import Pagination from "./Components/Pagination";
import SkeletonCards from "./Components/SkeletonCards";
import Footer from "./Components/Footer";
import CharacterDetails from "./Components/CharacterDetails";
import BackToTop from "./Components/BackToTop";
import NotFound from "./Components/NotFound";
import ToastMessage from "./Components/ToastMessage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import Favourites from "./Favourites";
import "./App.css";

function App() {
  const [toastMessage, setToastMessage] = useState("");
  const hasMountedFavourites = useRef(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  const [favArray, setFavArray] = useState(() => {
    const savedFavourites = localStorage.getItem("favourites");

    if (savedFavourites) {
      return JSON.parse(savedFavourites);
    }

    return [];
  });

  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favArray));

    if (!hasMountedFavourites.current) {
      hasMountedFavourites.current = true;
      return;
    }

    if (!toastMessage) {
      setToastMessage("Favourites updated");
    }
  }, [favArray]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setToastMessage("");
    }, 2200);

    return () => clearTimeout(timer);
  }, [toastMessage]);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const nextTheme = prevTheme === "light" ? "dark" : "light";
      setToastMessage(`${nextTheme === "dark" ? "Dark" : "Light"} mode updated`);
      return nextTheme;
    });
  };

  return (
    <Router>
      <div className="App">
        <Navbar favCount={favArray.length} theme={theme} toggleTheme={toggleTheme} />
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              favArray={favArray}
              setFavArray={setFavArray}
              setToastMessage={setToastMessage}
            />
          }
        />
        <Route
          path="/character/:id"
          element={<CharacterDetails setToastMessage={setToastMessage} />}
        />
        <Route
          path="/favourites"
          element={
            <Favourites
              favArray={favArray}
              setFavArray={setFavArray}
              setToastMessage={setToastMessage}
            />
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastMessage message={toastMessage} />
      <BackToTop />
      <Footer />
    </Router>
  );
}

const Home = ({ favArray, setFavArray, setToastMessage }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamsString = searchParams.toString();
  const charactersPerPage = 20;
  const hasInitializedFilters = useRef(false);
  const hasRestoredScroll = useRef(false);
  const isSyncingFromUrl = useRef(false);
  const skipNextUrlWrite = useRef(false);
  const getInitialPage = () => {
    const page = Number(searchParams.get("page"));
    return page > 0 ? page : 1;
  };
  let [pageNumber, updatePageNumber] = useState(getInitialPage);
  let [fetchedData, updateFetchedData] = useState([]);
  let [allCharacters, setAllCharacters] = useState([]);
  let [search, setSearch] = useState(searchParams.get("name") || "");
  let [recentSearches, setRecentSearches] = useState(() => {
    const savedRecentSearches = localStorage.getItem("recentSearches");

    if (savedRecentSearches) {
      return JSON.parse(savedRecentSearches);
    }

    return [];
  });
  let [status, setStatus] = useState(searchParams.get("status") || "");
  let [gender, setGender] = useState(searchParams.get("gender") || "");
  let [species, setSpecies] = useState(searchParams.get("species") || "");
  let [origin, setOrigin] = useState(searchParams.get("origin") || "");
  let [sort, setSort] = useState(searchParams.get("sort") || "");
  let [showOnlyFavourites, setShowOnlyFavourites] = useState(
    searchParams.get("favourites") === "true"
  );
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
    if (!hasInitializedFilters.current) {
      hasInitializedFilters.current = true;
      return;
    }

    if (isSyncingFromUrl.current) {
      isSyncingFromUrl.current = false;
      return;
    }

    updatePageNumber(1);
  }, [search, status, gender, species, origin, sort]);

  useEffect(() => {
    if (!search.trim()) {
      return;
    }

    setRecentSearches((prevSearches) => {
      const updatedSearches = [
        search,
        ...prevSearches.filter((item) => item.toLowerCase() !== search.toLowerCase()),
      ].slice(0, 5);

      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
      return updatedSearches;
    });
  }, [search]);

  useEffect(() => {
    if (skipNextUrlWrite.current) {
      skipNextUrlWrite.current = false;
      return;
    }

    const nextParams = new URLSearchParams();

    if (search) {
      nextParams.set("name", search);
    }
    if (status) {
      nextParams.set("status", status);
    }
    if (gender) {
      nextParams.set("gender", gender);
    }
    if (species) {
      nextParams.set("species", species);
    }
    if (origin) {
      nextParams.set("origin", origin);
    }
    if (sort) {
      nextParams.set("sort", sort);
    }
    if (showOnlyFavourites) {
      nextParams.set("favourites", "true");
    }
    if (pageNumber > 1) {
      nextParams.set("page", pageNumber);
    }

    if (nextParams.toString() !== searchParamsString) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [
    search,
    status,
    gender,
    species,
    origin,
    sort,
    showOnlyFavourites,
    pageNumber,
    searchParamsString,
    setSearchParams,
  ]);

  useEffect(() => {
    const nextSearch = searchParams.get("name") || "";
    const nextStatus = searchParams.get("status") || "";
    const nextGender = searchParams.get("gender") || "";
    const nextSpecies = searchParams.get("species") || "";
    const nextOrigin = searchParams.get("origin") || "";
    const nextSort = searchParams.get("sort") || "";
    const nextFavourites = searchParams.get("favourites") === "true";
    const nextPage = Number(searchParams.get("page")) > 0 ? Number(searchParams.get("page")) : 1;
    let didSyncFromUrl = false;

    if (nextSearch !== search) {
      didSyncFromUrl = true;
      setSearch(nextSearch);
    }
    if (nextStatus !== status) {
      didSyncFromUrl = true;
      setStatus(nextStatus);
    }
    if (nextGender !== gender) {
      didSyncFromUrl = true;
      setGender(nextGender);
    }
    if (nextSpecies !== species) {
      didSyncFromUrl = true;
      setSpecies(nextSpecies);
    }
    if (nextOrigin !== origin) {
      didSyncFromUrl = true;
      setOrigin(nextOrigin);
    }
    if (nextSort !== sort) {
      didSyncFromUrl = true;
      setSort(nextSort);
    }
    if (nextFavourites !== showOnlyFavourites) {
      didSyncFromUrl = true;
      setShowOnlyFavourites(nextFavourites);
    }
    if (nextPage !== pageNumber) {
      didSyncFromUrl = true;
      updatePageNumber(nextPage);
    }

    if (didSyncFromUrl) {
      isSyncingFromUrl.current = true;
      skipNextUrlWrite.current = true;
    }
  }, [searchParamsString]);

  let displayedResults = results ? [...results] : [];
  let currentInfo = info;

  if (showOnlyFavourites) {
    let favouriteResults = [...favArray];

    if (search) {
      favouriteResults = favouriteResults.filter((character) =>
        character.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status) {
      favouriteResults = favouriteResults.filter(
        (character) => character.status.toLowerCase() === status.toLowerCase()
      );
    }

    if (gender) {
      favouriteResults = favouriteResults.filter(
        (character) => character.gender.toLowerCase() === gender.toLowerCase()
      );
    }

    if (species) {
      favouriteResults = favouriteResults.filter((character) =>
        character.species.toLowerCase().includes(species.toLowerCase())
      );
    }

    if (origin) {
      favouriteResults = favouriteResults.filter((character) =>
        character.origin.name.toLowerCase().includes(origin.toLowerCase())
      );
    }

    if (sort === "name-asc") {
      favouriteResults.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sort === "name-desc") {
      favouriteResults.sort((a, b) => b.name.localeCompare(a.name));
    }

    let startIndex = (pageNumber - 1) * charactersPerPage;
    let endIndex = startIndex + charactersPerPage;

    displayedResults = favouriteResults.slice(startIndex, endIndex);
    currentInfo = {
      count: favouriteResults.length,
      pages: Math.max(1, Math.ceil(favouriteResults.length / charactersPerPage)),
    };
  }

  if (!showOnlyFavourites && (sort || origin) && allCharacters.length >= 0) {
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
    setShowOnlyFavourites(false);
    setSearch("");
    updatePageNumber(1);
  };

  const goToRandomCharacter = () => {
    const randomId = Math.floor(Math.random() * 826) + 1;
    navigate(`/character/${randomId}`);
  };

  const removeRecentSearch = (searchItem) => {
    const updatedSearches = recentSearches.filter((item) => item !== searchItem);
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const saveScrollPosition = () => {
    sessionStorage.setItem("homeScrollPosition", String(window.scrollY));
  };

  const reuseRecentSearch = (searchItem) => {
    setSearch(searchItem);
    updatePageNumber(1);

    if (setToastMessage) {
      setToastMessage(`Showing results for "${searchItem}"`);
    }
  };

  const copyCurrentSearch = async () => {
    if (!search.trim()) {
      return;
    }

    try {
      await navigator.clipboard.writeText(search);

      if (setToastMessage) {
        setToastMessage(`Copied "${search}"`);
      }
    } catch (err) {
      if (setToastMessage) {
        setToastMessage("Could not copy search");
      }
    }
  };

  useEffect(() => {
    if (loading || hasRestoredScroll.current) {
      return;
    }

    const savedScroll = sessionStorage.getItem("homeScrollPosition");

    if (savedScroll) {
      window.scrollTo(0, Number(savedScroll));
      sessionStorage.removeItem("homeScrollPosition");
      hasRestoredScroll.current = true;
    }
  }, [loading]);

  const favouriteCountOnPage = displayedResults.filter((character) =>
    favArray.some((item) => item.id === character.id)
  ).length;
  const aliveCount = displayedResults.filter((character) => character.status === "Alive").length;
  const deadCount = displayedResults.filter((character) => character.status === "Dead").length;
  const unknownCount = displayedResults.filter((character) => character.status === "unknown" || character.status === "Unknown").length;
  const hasActiveFilters =
    search || status || gender || species || origin || sort || showOnlyFavourites;

  return (
    <div className="App">
      <div className="container py-4">
      <h1 className="App-header">Rick & Morty Characters</h1>
      <Search search={search} setSearch={setSearch} updatePageNumber={updatePageNumber} />
      {recentSearches.length > 0 && (
        <div className="recent-searches">
          <span>Recent searches:</span>
          {recentSearches.map((item) => (
            <div key={item} className="recent-search-pill">
              <button
                className="recent-search-btn"
                onClick={() => reuseRecentSearch(item)}
                title={`Search again for ${item}`}
              >
                {item}
              </button>
              <button
                className="recent-search-remove"
                onClick={() => removeRecentSearch(item)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          ))}
          {search && (
            <button className="recent-search-clear" onClick={copyCurrentSearch}>
              Copy Search
            </button>
          )}
          <button className="recent-search-clear" onClick={clearRecentSearches}>
            Clear All
          </button>
        </div>
      )}
      <div className="filter-bar sticky-filter-bar">
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

        <button
          className={showOnlyFavourites ? "search-btn favourite-toggle-btn active-toggle" : "search-btn favourite-toggle-btn"}
          onClick={() => {
            setShowOnlyFavourites(!showOnlyFavourites);
            updatePageNumber(1);
          }}
        >
          Favourites Only
        </button>

        <button className="search-btn search-btn-clear" onClick={clearFilters}>
          Clear Filters
        </button>

        <button className="search-btn random-btn" onClick={goToRandomCharacter}>
          Random Character
        </button>
      </div>
      {!loading && !error && currentInfo && (
        <>
          <p className="results-count">Showing {currentInfo.count} characters</p>
          <p className="results-summary">
            {showOnlyFavourites
              ? "Favourite-only mode is on"
              : `${favouriteCountOnPage} favourites on this page`}
          </p>
          <div className="results-stats">
            <span className="results-stat-pill">Alive: {aliveCount}</span>
            <span className="results-stat-pill">Dead: {deadCount}</span>
            <span className="results-stat-pill">Unknown: {unknownCount}</span>
          </div>
        </>
      )}
      <div className="row g-4 justify-content-center App--container">
        {loading && <SkeletonCards />}
        {!loading && error && (
          <div className="col-12">
            <div className="empty-state-box">
              <div className="empty-state-icon">
                <i className="fa-regular fa-face-frown"></i>
              </div>
              <h3>No characters found</h3>
              <p>
                {showOnlyFavourites
                  ? "No favourite characters matched your current filters. Try turning off favourite-only mode or clearing filters."
                  : search
                  ? `No characters matched "${search}". Try a different search or clear your filters.`
                  : error}
              </p>
              <p className="empty-state-helper">
                {hasActiveFilters
                  ? "You can change the filters above or use a recent search to get back to results faster."
                  : "Try a new search, use the random character button, or browse your favourites."}
              </p>
            </div>
          </div>
        )}
        {!loading && !error && (
          <Card
            favArray={favArray}
            setFavArray={setFavArray}
            setToastMessage={setToastMessage}
            results={displayedResults}
            onViewDetails={saveScrollPosition}
          />
        )}
      </div>
      {!error && currentInfo && (
        <>
          <p className="pagination-info">
            Page {pageNumber} of {currentInfo.pages || 1}
          </p>
          <Pagination
            info={currentInfo}
            pageNumber={pageNumber}
            updatePageNumber={updatePageNumber}
          />
        </>
      )}
      </div>
    </div>
  );
};

export default App;
