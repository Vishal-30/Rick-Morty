import React from "react";
import { NavLink, Link } from "react-router-dom";

const Navbar = ({ favCount, theme, toggleTheme }) => {
  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand"> Rick & Morty </Link>
          <div className="navbar-links">
            <NavLink to="/" className="nav-link">CHARACTERS</NavLink>
            <NavLink to="/favourites" className="nav-link">FAVOURITES ({favCount})</NavLink>
            <button className="theme-toggle-btn" onClick={toggleTheme}>
              <i className={theme === "light" ? "fa-solid fa-moon" : "fa-solid fa-sun"}></i>
            </button>
          </div>
        </div>
    </nav>
  );
};

export default Navbar;
