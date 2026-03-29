import React from "react";
import { NavLink, Link } from "react-router-dom";

const Navbar = ({ favCount, theme, toggleTheme }) => {
  const goToCharacters = (event) => {
    event.preventDefault();
    window.location.assign("/");
  };

  const goToFavourites = (event) => {
    event.preventDefault();
    window.location.assign("/favourites");
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand" onClick={goToCharacters}> Rick & Morty </Link>
          <div className="navbar-links">
            <NavLink end to="/" onClick={goToCharacters} className={({ isActive }) => isActive ? "nav-link nav-link-active" : "nav-link"}>CHARACTERS</NavLink>
            <NavLink to="/favourites" onClick={goToFavourites} className={({ isActive }) => isActive ? "nav-link nav-link-active" : "nav-link"}>FAVOURITES ({favCount})</NavLink>
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            >
              <i className={theme === "light" ? "fa-solid fa-moon" : "fa-solid fa-sun"}></i>
            </button>
          </div>
        </div>
    </nav>
  );
};

export default Navbar;
