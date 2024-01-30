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

  let display;
  if (props.results && props.results.length > 0) {
    display = props.results.map((card) => {
      let { image, name, status } = card; 
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
                <Link to={`/character/${card.id}`} className="details-link-btn card-link-btn">
                  View Details
                </Link>
              </div>
            </div>
            <FavCard card={newCard} favArray={props.favArray} setFavArray={props.setFavArray} />
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

