import React from "react";
import Card from "./Components/Card";

const Favourites = ({ favArray }) => {
  
  let uniqueChars = Array.from(new Set(favArray.map(a => a.id)))
  .map(id => {
    return favArray.find(a => a.id === id)
  })

  return (
    <div className="App">
      <h1 className="App-header">Favourite Characters</h1>
      <div className="App--container">
        <Card results={uniqueChars} />
      </div>

    </div>
  );
}

export default Favourites