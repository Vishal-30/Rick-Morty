import React from "react";
import { NavLink, Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand"> Rick & Morty </Link>
          <div className="navbar-links">
            <NavLink to="/" className="nav-link">CHARACTERS</NavLink>
            <NavLink to="/favourites" className="nav-link">FAVOURITES</NavLink>
          </div>
        </div>
    </nav>
  );
};

export default Navbar;