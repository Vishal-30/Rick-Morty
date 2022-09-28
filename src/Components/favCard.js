import React,{useState} from 'react'
import favstar from "../Images/fav.webp"
import emptystar from "../Images/star.jpg"

const FavCard = (props) => {
  const [favourite, setFavourite] = useState(false)
  const starIcon = props.card.favourite ? favstar : emptystar

  const toggleFavourite = () =>{
    setFavourite(!favourite)
    props.card["favourite"] = !props.card["favourite"]
    if (props.card["favourite"] === true) {
      let updatedCard = {
        ...props.card,
        favourite: true
      }
      props.favArray.push(updatedCard)
    } else {
       props.favArray.filter(e => e !== (props.card))
    }
  }

  return (
    <div>
      <img src={starIcon} alt="star" onClick={toggleFavourite} className="star" />
    </div>
  )
}

export default FavCard
