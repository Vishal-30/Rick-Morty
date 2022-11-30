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
    } else {
      let updatedCard = {
        ...props.card,
        favourite: true,
      };
      props.setFavArray([...props.favArray, updatedCard]);
    }
  };

  return (
    <div>
      <img src={starIcon} alt="star" onClick={toggleFavourite} className="star" />
    </div>
  );
};

export default FavCard;
