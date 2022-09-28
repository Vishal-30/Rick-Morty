import React, { useState } from "react";
import CardModal from "./CardModal";
import FavCard from "./favCard";

export default function Card(props) {

  const [modalInfo, setModalInfo] = useState({});
  const [modal, setModal] = useState(false);


  const toggleModal = (modalInfo) => {
    setModal(!modal);
    setModalInfo(modalInfo)
  };

  let display;
  if (props.results) {
    display = props.results.map((card, index) => {

      let { image, name } = card; 
      let newCard = {
        ...card,
        favourite: false
      }


      return ( 
        
       <div key={index}  className="card">
          <div>
            <img className="card--image" onClick={() => toggleModal(card)} src={image} alt="" />
            <div>
              <div className="card--name card--center">{name}</div>
           </div>
          </div>
          <FavCard card={newCard} favArray={props.favArray} />
        </div>
    
      );
    });
  } else {
    display = "No Characters Found";
  }

  return (
    <>
      {display}
      {modal && <CardModal card={modalInfo} results={props.results} />}
    </>);
};

