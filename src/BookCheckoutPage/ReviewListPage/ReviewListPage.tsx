import React, { useEffect, useState } from "react";
import ReviewModel from "../../models/ReviewModel";
import Review from "../../layouts/Utils/Review";
import { Link } from "react-router-dom";
import Pagination from "../../layouts/Utils/Pagination";
import SpinLoading from "../../layouts/Utils/SpinLoading";

const ReviewListPage = () => {
  const [isLoadingReview, setIsLoadingReview] = useState(false);
  const [httpError, setHttpError] = useState("");
  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(1);
  const [size] = useState(3);
  const bookId = window.location.pathname.split("/")[2];

  // useEffect review
  useEffect(() => {
    const fetchData = async () => {
      const baseUrl = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}&page=${
        currentPage - 1
      }&size=${size}`;
      const response = await fetch(baseUrl);

      if (!response.ok) {
        throw new Error("Something went wrong !!!");
      }

      const responseJson = await response.json();
      const reponseData = responseJson._embedded.reviews;
      setTotalPages(responseJson.page.totalPages);
      setTotalElements(responseJson.page.totalElements);

      const loadedReviews: ReviewModel[] = [];

      let weightedStarReviews: number = 0;

      for (const key in reponseData) {
        loadedReviews.push({
          id: reponseData[key].id,
          userEmail: reponseData[key].userEmail,
          date: reponseData[key].date,
          rating: reponseData[key].rating,
          book_id: reponseData[key].book_id,
          reviewDecription: reponseData[key].reviewDecription,
        });
        weightedStarReviews = weightedStarReviews + reponseData[key].rating;
      }

      setReviews(loadedReviews);
      setIsLoadingReview(false);
    };
    fetchData().catch((error: any) => {
      setIsLoadingReview(false);
      setHttpError(error.message);
    });
  }, [bookId, currentPage]);

  const paginate = (id: number) => {
    setCurrentPage(id);
  };

  if (isLoadingReview) {
    return <SpinLoading />;
  }

  if (httpError) {
    <div className="container m-5">
      <p>{httpError}</p>
    </div>;
  }
  

  return (
    <div className={"row mt-5"}>
      <div className={"col-sm-2 col-md-2"}>
        
      </div>
      <div className="col-sm-10 col-md-10">
      <h2> Comment: ({totalElements}) </h2>
      <p>{(currentPage-1)*size + 1} to { size * currentPage <= totalElements ? size * currentPage : totalElements} of {totalElements} items:</p>
        {reviews.length > 0 ? (
          <>
            {reviews.slice(0, size).map((eachReview) => (
              <Review review={eachReview} key={eachReview.id}></Review>
            ))}
          </>
        ) : (
          <div className="m-3">
            <p className="lead">Currently there are no reviews for this book</p>
          </div>
        )}
        {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
        ></Pagination>
      )}
      </div>
      
    </div>
  );
};

export default ReviewListPage;
