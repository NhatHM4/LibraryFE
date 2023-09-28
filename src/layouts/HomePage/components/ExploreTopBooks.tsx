import React from "react";

const ExploreTopBooks = () => {
  return (
    <div className="p-5 mb-4 bg-drak header">
      <div
        className="container-fluid py-5 text-white 
      d-flex justify-content-center align-items-center"
      >
        <div>
          <h1 className="display-5 fw-bold">Find your next adventure</h1>
          <p className="col-md-8 fs-4">Where would you like go to next</p>
          <a
            type="button"
            className="btn main-color btn-lg text-white"
            href="#"
          >Explore top book</a>
        </div>
      </div>
    </div>
  );
};

export default ExploreTopBooks;
