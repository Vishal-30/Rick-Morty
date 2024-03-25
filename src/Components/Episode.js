import React, { useEffect, useState } from "react";

const Episodes = (props) => {
  let [info, setInfo] = useState([]);
  let [loading, setLoading] = useState(true);
  let { name, episode } = info;
  let [id] = useState(props.idNum);

  let api = `https://rickandmortyapi.com/api/episode/${id}`;
  useEffect(() => {
    (async function () {
      setLoading(true);
      let data = await fetch(api).then((res) => res.json());
      setInfo(data);
      setLoading(false);
    })();
  }, [api]);

  return (
    <div className="episode--item">
      <span className="episode--code">{episode || `Episode ${id}`}</span>
      <span className="episode--separator">-</span>
      <span className="episode--name">{loading ? "Loading..." : name || "Unknown"}</span>
    </div>
  );
};

export default Episodes;
