import React from "react";
import Card from "./Components/Card";

const Favourites = ({ favArray, setFavArray }) => {
  let uniqueChars = Array.from(new Set(favArray.map((a) => a.id))).map((id) => {
    return favArray.find((a) => a.id === id);
  });

  return (
    <div className="App">
      <h1 className="App-header">Favourite Characters</h1>
      {uniqueChars.length > 0 && (
        <button className="clear-favourites-btn" onClick={() => setFavArray([])}>
          Clear All Favourites
        </button>
      )}
      <div className="App--container">
        {uniqueChars.length > 0 ? (
          <Card results={uniqueChars} favArray={favArray} setFavArray={setFavArray} />
        ) : (
          <p>No favourite characters added yet.</p>
        )}
      </div>
    </div>
  );
};

export default Favourites;
