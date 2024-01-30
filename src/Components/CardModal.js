import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Episodes from "./Episode";

const CardModal = (props) => {
  let { id, image, name, status, gender, location, origin, species, episode } = props.card;

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        props.closeModal();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [props.closeModal]);

  return (
    <div className="modal">
      <div onClick={props.closeModal} className="overlay"></div>
      <div className="modal-content">
        <div className="modal-layout">
          <div className="modal-left">
            <img className="card--image modal-image" src={image} alt={name} />
          </div>
          <div className="modal-right">
            <div className="card--name">
              <span>Id:</span>{id}
            </div>
            <div className="card--name">
              <span>Name:</span>{name}
            </div>
            <div className="card--name">
              <span>Gender:</span>{gender}
            </div>
            <div className="card--name">
              <span>Status:</span>{status}
            </div>
            <div className="card--name">
              <span>Species:</span>{species}
            </div>
            <div className="card--name">
              <span>Origin:</span>{origin.name}
            </div>
            <div className="card--name">
              <span>Location:</span>{location.name}
            </div>

            <div className="card--episodes">
              <span>Episodes Appeared:</span>

              {episode.map((e, index) => (
                <Episodes key={index} idNum={e.substring(e.lastIndexOf("/") + 1)} />
              ))}
            </div>
            <Link to={`/character/${id}`} className="details-link-btn" onClick={props.closeModal}>
              Open Full Details
            </Link>
          </div>
        </div>
        <button className="close-modal" onClick={props.closeModal}>
          X
        </button>
      </div>
    </div>
  );
};

export default CardModal;
