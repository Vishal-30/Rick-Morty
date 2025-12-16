import React from "react";
import favstar from "../Images/fav.webp";
import emptystar from "../Images/star.jpg";

const FavCard = (props) => {
  const starIcon = props.card.favourite ? favstar : emptystar;

  const toggleFavourite = () => {
    if (!props.setFavArray) {
      return;
    }

    if (props.card.favourite) {
      props.setFavArray(props.favArray.filter((item) => item.id !== props.card.id));
      if (props.setToastMessage) {
        props.setToastMessage(`${props.card.name} removed from favourites`);
      }
    } else {
      let updatedCard = {
        ...props.card,
        favourite: true,
      };
      props.setFavArray([...props.favArray, updatedCard]);
      if (props.setToastMessage) {
        props.setToastMessage(`${props.card.name} added to favourites`);
      }
    }
  };

  return (
    <div className="fav-badge">
      <img
        src={starIcon}
        alt="star"
        onClick={toggleFavourite}
        className="star"
        title="Toggle favourite"
      />
    </div>
  );
};

export default FavCard;
