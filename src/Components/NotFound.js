import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="container py-5">
      <div className="not-found-page">
        <h1>404</h1>
        <p>Page not found.</p>
        <Link to="/" className="details-link-btn">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
