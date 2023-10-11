import React, { useEffect, useState } from "react";
import BookModel from "../models/BookModel";
import SpinLoading from "../layouts/Utils/SpinLoading";
import StarsReview from "../layouts/Utils/StarsReview";
import CheckoutAndReviewBox from "./CheckoutAndReviewBox";
import ReviewModel from "../models/ReviewModel";
import LastestReviews from "./LastestReviews";

const BookCheckoutPage = () => {
  const [book, setBook] = useState<BookModel>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [httpError, setHttpError] = useState(null);
  const bookId = window.location.pathname.split("/")[2];

  // Review State
  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [totalStars, setTotalStars] = useState<number>(0);
  const [isLoadingReview, setIsLoadingReview] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const baseUrl = `http://localhost:8080/api/books/${bookId}`;
      const response = await fetch(baseUrl);

      if (!response.ok) {
        throw new Error("Something went wrong !!!");
      }

      const responseJson = await response.json();

      const loadedBooks: BookModel = {
        id: responseJson.id,
        title: responseJson.title,
        author: responseJson.author,
        description: responseJson.description,
        copies: responseJson.copies,
        copiesAvailable: responseJson.copiesAvailable,
        category: responseJson.category,
        img: responseJson.img,
      };

      setBook(loadedBooks);
      setIsLoading(false);
    };
    fetchData().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
  }, []);

  // useEffect review
  useEffect(() => {
    const fetchData = async () => {
      const baseUrl = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}`;
      const response = await fetch(baseUrl);

      if (!response.ok) {
        throw new Error("Something went wrong !!!");
      }

      const responseJson = await response.json();
      const reponseData = responseJson._embedded.reviews;

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

      if (loadedReviews) {
        const round = (Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2).toFixed(1);
        setTotalStars(Number(round));
      }

      setReviews(loadedReviews);
      setIsLoadingReview(false);
    };
    fetchData().catch((error: any) => {
      setIsLoadingReview(false);
      setHttpError(error.message)
    });
  }, [book]);

  if (isLoading || isLoadingReview) {
    return <SpinLoading />;
  }

  if (httpError) {
    <div className="container m-5">
      <p>{httpError}</p>
    </div>;
  }

  return (
    <div>
      <div className="container d-none d-lg-block">
        <div className="row mt-5">
          <div className="col-sm-2 col-md-2">
            {book?.img ? (
              <img src={book?.img} width="226" height="349" alt="Book" />
            ) : (
              <img
                src={require("./../../src/Images/BooksImages/book-luv2code-1000.png")}
                width="226"
                height="349"
                alt="Book"
              />
            )}
          </div>
          <div className="col-4 col-md-4 container">
            <div className="ml-2">
              <h2>{book?.title}</h2>
              <h5 className="text-primary">{book?.author}</h5>
              <p className="lead">{book?.description}</p>
              <StarsReview rating={3} size={32} />
            </div>
          </div>
          <CheckoutAndReviewBox book={book} mobile={false} />
        </div>
        <hr />
        <LastestReviews bookId={Number(bookId)} mobile={false} reviews={reviews} key={bookId}/>
      </div>
      <div className="container d-lg-none mt-5">
        <div className="d-flex justify-content-center alighn-items-center">
          {book?.img ? (
            <img src={book?.img} width="226" height="349" alt="Book" />
          ) : (
            <img
              src={require("./../../src/Images/BooksImages/book-luv2code-1000.png")}
              width="226"
              height="349"
              alt="Book"
            />
          )}
        </div>
        <div className="mt-4">
          <div className="ml-2">
            <h2>{book?.title}</h2>
            <h5 className="text-primary">{book?.author}</h5>
            <p className="lead">{book?.description}</p>
            <StarsReview rating={4.5} size={32} />
          </div>
        </div>
        <CheckoutAndReviewBox book={book} mobile={true} />
        <hr />
        <LastestReviews bookId={Number(bookId)} mobile={true} reviews={reviews} key={bookId}/>
      </div>
    </div>
  );
};

export default BookCheckoutPage;
