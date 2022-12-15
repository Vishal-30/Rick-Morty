import React, { useEffect, useState } from "react";

const Episodes = (props) => {
  let [info, setInfo] = useState([]);
  let { name, episode } = info;
  let [id] = useState(props.idNum);

  let api = `https://rickandmortyapi.com/api/episode/${id}`;
  useEffect(() => {
    (async function () {
      let data = await fetch(api).then((res) => res.json());
      setInfo(data);
    })();
  }, [api]);

  return (
    <div className="episode--item">
      <span className="episode--code">{episode || `Episode ${id}`}</span>
      <span className="episode--name">{name || "Unknown"}</span>
    </div>
  );
};

export default Episodes;
