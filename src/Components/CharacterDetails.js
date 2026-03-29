import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Episodes from "./Episode";

const characterCache = {};
const characterRequests = {};

const CharacterDetails = ({ setToastMessage }) => {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    (async function () {
      setLoading(true);
      setError("");
      setCharacter(null);

      if (characterCache[id]) {
        if (isMounted) {
          setCharacter(characterCache[id]);
          setLoading(false);
        }
        return;
      }

      try {
        if (!characterRequests[id]) {
          characterRequests[id] = fetch(`https://rickandmortyapi.com/api/character/${id}`).then(
            async (res) => {
              const data = await res.json();

              if (!res.ok) {
                const requestError = new Error(
                  data.error || "Something went wrong. Please try again."
                );
                requestError.status = res.status;
                throw requestError;
              }

              return data;
            }
          );
        }

        let data = await characterRequests[id];
        characterCache[id] = data;

        if (isMounted) {
          setCharacter(data);
        }
      } catch (err) {
        if (!isMounted) {
          return;
        }

        if (err.status === 429) {
          setError("Too many requests right now. Please wait a few seconds and try again.");
        } else if (err.message) {
          setError(err.message);
        } else {
          setError("Something went wrong. Please try again.");
        }
      } finally {
        delete characterRequests[id];

        if (isMounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const copyCharacterLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);

      if (setToastMessage) {
        setToastMessage("Character link copied");
      }
    } catch (err) {
      if (setToastMessage) {
        setToastMessage("Could not copy link");
      }
    }
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="details-page details-fade-in">
          <div className="details-header">
            <div className="details-link-btn details-skeleton-btn"></div>
          </div>
          <div className="modal-layout details-layout">
            <div className="modal-left">
              <div className="details-skeleton-image"></div>
            </div>
            <div className="modal-right">
              <div className="details-skeleton-title"></div>
              <div className="details-skeleton-line"></div>
              <div className="details-skeleton-line"></div>
              <div className="details-skeleton-line"></div>
              <div className="details-skeleton-line"></div>
              <div className="details-skeleton-line"></div>
              <div className="details-skeleton-line"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="container py-4">
        <p>{error || "Character not found."}</p>
        <Link to="/" className="details-link-btn">
          Back to Characters
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="details-page details-fade-in">
        <div className="details-header">
          <Link to="/" className="details-link-btn">
            Back to Characters
          </Link>
          <button className="details-link-btn details-copy-btn" onClick={copyCharacterLink}>
            <i className="fa-solid fa-link"></i>
            <span>Copy Link</span>
          </button>
        </div>
        <div className="modal-layout details-layout">
          <div className="modal-left">
            <img className="card--image modal-image" src={character.image} alt={character.name} />
          </div>
          <div className="modal-right">
            <h1 className="details-title">{character.name}</h1>
            <div className="details-chips">
              <span className="details-chip">{character.status}</span>
              <span className="details-chip">{character.species}</span>
              <span className="details-chip">{character.gender}</span>
            </div>
            <div className="card--name">
              <span>Id:</span>{character.id}
            </div>
            <div className="card--name">
              <span>Gender:</span>{character.gender}
            </div>
            <div className="card--name">
              <span>Status:</span>{character.status}
            </div>
            <div className="card--name">
              <span>Species:</span>{character.species}
            </div>
            <div className="card--name">
              <span>Origin:</span>{character.origin.name}
            </div>
            <div className="card--name">
              <span>Location:</span>{character.location.name}
            </div>

            <div className="card--episodes">
              <span>Episodes Appeared:</span>
              {character.episode.map((episodeUrl, index) => (
                <Episodes
                  key={index}
                  idNum={episodeUrl.substring(episodeUrl.lastIndexOf("/") + 1)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterDetails;
