import React, { useEffect, useState } from "react";

const Episodes = ({ episodeName }) => {
  let [info, setInfo] = useState([]);
  let {name } = info;

  let [id] = useState(episodeName.map(x => x.slice(0, -1)));

  let api = `https://rickandmortyapi.com/api/episode/${id}`;
  useEffect(() => {
    (async function () {
      let data = await fetch(api).then((res) => res.json());
      setInfo(data);
    })();
  }, [api]);

  return (
    <div> 
      <span className="text-primary">{name === "" ? "Unknown" : name}</span>
    </div>
  );
};

export default Episodes;