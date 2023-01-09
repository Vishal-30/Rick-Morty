import React from "react";

const SkeletonCards = () => {
  const skeletonArray = Array.from({ length: 8 });

  return (
    <>
      {skeletonArray.map((_, index) => (
        <div key={index} className="card skeleton-card">
          <div className="skeleton-image"></div>
          <div className="skeleton-badge"></div>
          <div className="skeleton-name"></div>
        </div>
      ))}
    </>
  );
};

export default SkeletonCards;
