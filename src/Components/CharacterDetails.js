import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Episodes from "./Episode";

const CharacterDetails = () => {
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

  if (loading) {
    return (
      <div className="container py-4">
        <p>Loading character details...</p>
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
      <div className="details-page">
        <div className="details-header">
          <Link to="/" className="details-link-btn">
            Back to Characters
          </Link>
        </div>
        <div className="modal-layout details-layout">
          <div className="modal-left">
            <img className="card--image modal-image" src={character.image} alt={character.name} />
          </div>
          <div className="modal-right">
            <h1 className="details-title">{character.name}</h1>
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
