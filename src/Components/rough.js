// import React, {
//   useState
// } from "react";


// export default function Card({
//   page,
//   results
// }) {
//   const [modal, setModal] = useState(false);
//   const toggleModal = () => {
//     setModal(!modal);
//   };

//   if (modal) {
//     document.body.classList.add('active-modal')
//   } else {
//     document.body.classList.remove('active-modal')
//   }

//   let display;

//   if (results) {
//     display = results.map((x) => {
//       let {
//         id,
//         image,
//         name,
//         status,
//         gender,
//         location,
//         episode
//       } = x;


//       return ( <
//         div className = {
//           `card`
//         } >
//         <
//         div key = {
//           id
//         }
//         onClick = {
//           toggleModal
//         } >
//         <
//         img className = {
//           `card--image`
//         }
//         src = {
//           image
//         }
//         alt = "" / >
//         <
//         div className = {
//           ``
//         } >
//         <
//         div className = "card--name" > {
//           name
//         } < /div> <
//         /div>

//         {
//           modal && ( <
//             div className = "modal" >
//             <
//             div onClick = {
//               toggleModal
//             }
//             className = "overlay" > < /div> <
//             div className = "modal-content" >
//             <
//             img className = {
//               `card--image`
//             }
//             src = {
//               image
//             }
//             alt = "" / >
//             <
//             div className = "card--name" >
//             <
//             span > Id: < /span>{id}</div >
//             <
//             div className = "card--name" >
//             <
//             span > Name: < /span>{name}</div >
//             <
//             div className = "card--name" >
//             <
//             span > Gender: < /span>{gender}</div >
//             <
//             div className = "card--name" >
//             <
//             span > Status: < /span>{status}</div >
//             <
//             div className = "card--name" >
//             <
//             span > Location: < /span>{location.name}</div >
//             <
//             div className = "card--name" >
//             <
//             span > Episodes appeared: < /span> {
//               episode.map(e => e.charAt(e.length - 1))
//             }

//             <
//             /div>


//             <
//             button className = "close-modal"
//             onClick = {
//               toggleModal
//             } >
//             x <
//             /button> <
//             /div> <
//             /div>
//           )
//         } <
//         /div>


//         <
//         /div>



//       );
//     });
//   } else {
//     display = "No Characters Found :/";
//   }

//   return < > {
//     display
//   } < />;
// };