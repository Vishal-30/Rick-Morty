import React, { useEffect, useState } from "react";

const Episodes = (props) => {
  let [info, setInfo] = useState([]);
  let {name } = info;
  console.log(props.idNum)
  
  let [id]= useState(props.idNum)

  let api = `https://rickandmortyapi.com/api/episode/${id}`;
  useEffect(() => {
    (async function () {
      let data = await fetch(api).then((res) => res.json());
      setInfo(data);
    })();
  }, [api]);

  return (
    <div> 
      <span className="card--name"><b>{name === "" ? "Unknown" : name},  </b></span>
    </div>
  );
};

export default Episodes;
