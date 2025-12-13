import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Episodes from "./Episode";

const CharacterDetails = ({ setToastMessage }) => {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async function () {
      setLoading(true);
      setError("");

      try {
        let data = await fetch(`https://rickandmortyapi.com/api/character/${id}`).then((res) =>
          res.json()
        );

        if (data.error) {
          setError(data.error);
        } else {
          setCharacter(data);
        }
      } catch (err) {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
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
