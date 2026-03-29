import React, { useEffect, useState } from "react";

const episodeCache = {};
const episodeRequests = {};

const Episodes = (props) => {
  let [info, setInfo] = useState([]);
  let [loading, setLoading] = useState(true);
  let { name, episode } = info;
  let [id] = useState(props.idNum);

  let api = `https://rickandmortyapi.com/api/episode/${id}`;
  useEffect(() => {
    let isMounted = true;

    (async function () {
      if (episodeCache[id]) {
        if (isMounted) {
          setInfo(episodeCache[id]);
          setLoading(false);
        }
        return;
      }

      setLoading(true);

      try {
        if (!episodeRequests[id]) {
          episodeRequests[id] = fetch(api).then(async (res) => {
            const data = await res.json();

            if (!res.ok) {
              throw new Error(data.error || "Episode not found.");
            }

            return data;
          });
        }

        let data = await episodeRequests[id];
        episodeCache[id] = data;

        if (isMounted) {
          setInfo(data);
        }
      } catch (err) {
        if (isMounted) {
          setInfo({});
        }
      } finally {
        delete episodeRequests[id];

        if (isMounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [api, id]);

  return (
    <div className="episode--item">
      <span className="episode--code">{episode || `Episode ${id}`}</span>
      <span className="episode--separator">-</span>
      <span className="episode--name">{loading ? "Loading..." : name || "Unknown"}</span>
    </div>
  );
};

export default Episodes;
