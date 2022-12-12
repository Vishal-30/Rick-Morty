import React, { useState } from "react";
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
  if (props.results) {
    display = props.results.map((card) => {
      let { image, name } = card; 
      const isFavourite = props.favArray?.some((fav) => fav.id === card.id);
      let newCard = {
        ...card,
        favourite: isFavourite,
      };

      return (
        <div key={card.id} className="card">
          <div>
            <img className="card--image" onClick={() => openModal(card)} src={image} alt={name} />
            <div>
              <div className="card--name card--center">{name}</div>
            </div>
          </div>
          <FavCard card={newCard} favArray={props.favArray} setFavArray={props.setFavArray} />
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

