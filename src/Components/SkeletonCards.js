import React from "react";

const SkeletonCards = () => {
  const skeletonArray = Array.from({ length: 8 });

  return (
    <>
      {skeletonArray.map((_, index) => (
        <div key={index} className="col-12 col-sm-6 col-lg-4 col-xl-3 d-flex">
          <div className="card skeleton-card w-100">
            <div className="skeleton-image"></div>
            <div className="skeleton-badge"></div>
            <div className="skeleton-name"></div>
            <div className="skeleton-meta-row">
              <div className="skeleton-pill"></div>
              <div className="skeleton-pill"></div>
            </div>
            <div className="skeleton-origin"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-button"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export default SkeletonCards;
