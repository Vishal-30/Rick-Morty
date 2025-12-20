import React, { useState } from "react";
import { Link } from "react-router-dom";
import CardModal from "./CardModal";
import FavCard from "./favCard";

export default function Card(props) {
  const [modalInfo, setModalInfo] = useState({});
  const [modal, setModal] = useState(false);

  const openModal = (modalInfo) => {
    setModalInfo(modalInfo);
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  };

  const shareCharacter = async (event, card) => {
    event.preventDefault();
    event.stopPropagation();

    const shareUrl = `${window.location.origin}/character/${card.id}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: card.name,
          text: `Check out ${card.name}`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
      }

      if (props.setToastMessage) {
        setTimeout(() => {
          props.setToastMessage(`${card.name} link copied`);
        }, 0);
      }
    } catch (err) {
      if (err.name !== "AbortError" && props.setToastMessage) {
        setTimeout(() => {
          props.setToastMessage("Could not share character link");
        }, 0);
      }
    }
  };

  let display;
  if (props.results && props.results.length > 0) {
    display = props.results.map((card) => {
      let { image, name, status, episode, species, gender } = card;
      const isFavourite = props.favArray?.some((fav) => fav.id === card.id);
      let newCard = {
        ...card,
        favourite: isFavourite,
      };
      const statusClass =
        status === "Alive"
          ? "badge-alive"
          : status === "Dead"
          ? "badge-dead"
          : "badge-unknown";

      return (
        <div key={card.id} className="col-12 col-sm-6 col-lg-4 col-xl-3 d-flex">
          <div className="card character-card w-100">
            <div className="card-inner">
              <img className="card--image" onClick={() => openModal(card)} src={image} alt={name} />
              <div className="card-content">
                <div className={`status-badge ${statusClass}`}>{status}</div>
                <div className="card--name card--center">{name}</div>
                <div className="card-meta-row">
                  <span className="card-meta-pill">{species}</span>
                  <span className="card-meta-pill">{gender}</span>
                </div>
                <div className="card-episode-count">Episodes: {episode.length}</div>
                <div className="card-actions-row">
                  <Link
                    to={`/character/${card.id}`}
                    className="details-link-btn card-link-btn"
                    onClick={props.onViewDetails}
                  >
                    View Details
                  </Link>
                  <button
                    className="details-link-btn card-share-btn"
                    onClick={(event) => shareCharacter(event, card)}
                    title="Copy or share character link"
                  >
                    <i className="fa-solid fa-share-nodes"></i>
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
            <FavCard
              card={newCard}
              favArray={props.favArray}
              setFavArray={props.setFavArray}
              setToastMessage={props.setToastMessage}
            />
          </div>
        </div>
      );
    });
  } else {
    display = "No Characters Found";
  }

  return (
    <>
      {display}
      {modal && <CardModal card={modalInfo} closeModal={closeModal} />}
    </>
  );
}

