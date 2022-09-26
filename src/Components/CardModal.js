import React, { useState } from 'react'
import Episodes from './Episode';

const CardModal = (props) => {
  let { id, image, name, status, gender, location, episode } = props.card;
  const [modal, setModal] = useState(true);


  const toggleButton = () => {
    setModal(false);
  };
  return (
    <>
      {modal &&
        (<div className="modal">
          <div onClick={toggleButton} className="overlay"></div>
          <div className="modal-content">
            <img className={`card--image`} src={image} alt="" />
            <div className="card--name">
              <span>Id:</span>{id}</div>
            <div className="card--name">
              <span>Name:</span>{name}</div>
            <div className="card--name">
              <span>Gender:</span>{gender}</div>
            <div className="card--name">
              <span>Status:</span>{status}</div>
            <div className="card--name">
            <span>Location:</span>{location.name}</div>
          
            <div className="card--episodes">
            <span>Episodes Appeared:</span>

            {episode.map(e => `${e.substring(e.lastIndexOf('/') + 1)}|`).map((x, index) => <Episodes key={index} idNum={x.slice(0, -1)} />)}

            </div>
            <button className="close-modal" onClick={toggleButton}>
              X
            </button>
          </div>
        </div>
        )}
    </>
  );
}

export default CardModal
