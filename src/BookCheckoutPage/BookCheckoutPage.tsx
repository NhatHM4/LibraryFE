import React, { useEffect, useState } from "react";
import BookModel from "../models/BookModel";
import SpinLoading from "../layouts/Utils/SpinLoading";
import StarsReview from "../layouts/Utils/StarsReview";
import CheckoutAndReviewBox from "./CheckoutAndReviewBox";
import ReviewModel from "../models/ReviewModel";
import LastestReviews from "./LastestReviews";
import { useOktaAuth } from "@okta/okta-react";
import ReviewRequestModel from "../models/ReviewRequestModel";

const BookCheckoutPage = () => {

  const {authState} = useOktaAuth();
  const [book, setBook] = useState<BookModel>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [httpError, setHttpError] = useState(null);
  const bookId = window.location.pathname.split("/")[2];

  // Review State
  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [totalStars, setTotalStars] = useState<number>(0);
  const [isLoadingReview, setIsLoadingReview] = useState(true);

// Review Left
const [isReviewLeft, setIsReviewLeft] = useState(false);
const [isLoadingUserReview, setIsLoadingUserReview] = useState(true)


 // Loans count state
 const [currentLoansCount, setCurrentLoansCount] = useState(0);
 const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] = useState(true);

 // Is Book Checkout ?
 const [isCheckedOut, setIsCheckout] = useState(false)
 const [isLoadingBookCheckedOut, setIsLoadingBookCheckedOut] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const baseUrl = `${process.env.REACT_APP_API}/books/${bookId}`;
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
  }, [isCheckedOut, isReviewLeft]);

  // useEffect review
  useEffect(() => {
    const fetchData = async () => {
      const baseUrl = `${process.env.REACT_APP_API}/reviews/search/findByBookId?bookId=${bookId}`;
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
  }, [book, isReviewLeft]);

  useEffect(()=>{
    const fetchUserCurrentLoansCount = async () =>{
      if (authState && authState.isAuthenticated){
        const url = `${process.env.REACT_APP_API}/books/secure/currentloans/count`;
        const requestOptions = {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            'Content-Type': 'application/json'
          }
        };
        const currentLoansCountResponse = await fetch(url, requestOptions)
        if (!currentLoansCountResponse.ok){
          throw new Error(' Something went wrong !!!')
        }
        const currentLoansCountResponseJson = await currentLoansCountResponse.json();
        setCurrentLoansCount(currentLoansCountResponseJson)
      }
      setIsLoadingCurrentLoansCount(false)
    }
    fetchUserCurrentLoansCount().catch((error : any)=>{
      setIsLoadingCurrentLoansCount(false)
      setHttpError(error.message)
    })
  },[authState,isCheckedOut])

  useEffect(()=>{
    const fetchUserCheckedOutbook = async ()=>{
      if (authState && authState.isAuthenticated){
        const url = `${process.env.REACT_APP_API}/books/secure/ischeckedout/byuser?bookId=${bookId}`;
        const requestOptions = {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            'Content-Type': 'application/json'
          }
        };
        const checkedOutResponse = await fetch(url, requestOptions)
        if (!checkedOutResponse.ok){
          throw new Error(' Something went wrong !!!')
        }
        const checkedOutResponseJson = await checkedOutResponse.json();
        setIsCheckout(checkedOutResponseJson)
      }
      setIsLoadingBookCheckedOut(false)
    }
    fetchUserCheckedOutbook().catch((error: any)=>{
      setIsLoadingBookCheckedOut(false)
      setHttpError(error.message)
    })
  },[authState,isCheckedOut])

  useEffect(()=>{
    const fetchUserReviewBook = async ()=>{
      if (authState && authState.isAuthenticated){
        const url = `${process.env.REACT_APP_API}/reviews/secure/user/book?bookId=${bookId}`;
        const requestOptions = {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            'Content-Type': 'application/json'
          }
        };
        const isReviewLeftResponse = await fetch(url, requestOptions)
        if (!isReviewLeftResponse.ok){
          throw new Error(' Something went wrong !!!')
        }
        const isReviewLeftJson = await isReviewLeftResponse.json();
        setIsReviewLeft(isReviewLeftJson)
      }
      setIsLoadingUserReview(false)
    }
    
    fetchUserReviewBook().catch((error: any)=>{
      setIsLoadingUserReview(false)
      setHttpError(error.message)
    })
  },[authState])

  if (isLoading || isLoadingReview || isLoadingCurrentLoansCount || isLoadingBookCheckedOut || isLoadingUserReview) {
    return <SpinLoading />;
  }

  if (httpError) {
    <div className="container m-5">
      <p>{httpError}</p>
    </div>;
  }


  const handleCheckout = ()=>{
    const putUserCheckedOutbook = async ()=>{
      if (authState && authState.isAuthenticated){
        const url = `${process.env.REACT_APP_API}/books/secure/checkout?bookId=${bookId}`;
        const requestOptions = {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            'Content-Type': 'application/json'
          }
        };
        const checkedOutResponse = await fetch(url, requestOptions)
        if (!checkedOutResponse.ok){
          throw new Error(' Something went wrong !!!')
        }
        setIsCheckout(true)
      }
    }
    putUserCheckedOutbook().catch((error: any)=>{
      setHttpError(error.message)
    })
  }

  const handleSubmitReview = (bookId: number, rating: number, reviewDecription: string)=>{
    const postReviewBook = async ()=>{
      if (authState && authState.isAuthenticated){
        const reviewRqModel = new ReviewRequestModel(rating, bookId,reviewDecription);
        const url = `${process.env.REACT_APP_API}/reviews/secure`;
        const requestOptions = {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(reviewRqModel)
        };
        const checkedOutResponse = await fetch(url, requestOptions)
        if (!checkedOutResponse.ok){
          throw new Error(' Something went wrong !!!')
        }
        setIsReviewLeft(true)
      }
    }
    postReviewBook().catch((error: any)=>{
      setHttpError(error.message)
    })
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
              <StarsReview rating={totalStars} size={32} />
            </div>
          </div>
          <CheckoutAndReviewBox handleCheckout = {handleCheckout} book={book} mobile={false} currentLoansCount={currentLoansCount} 
          isAuthenticated={authState?.isAuthenticated} isCheckedOut={isCheckedOut} isReviewLeft={isReviewLeft} handleSubmitReview={handleSubmitReview} />
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
            <StarsReview rating={totalStars} size={32} />
          </div>
        </div>
        <CheckoutAndReviewBox handleCheckout = {handleCheckout} book={book} mobile={true}  currentLoansCount={currentLoansCount}
          isAuthenticated={authState?.isAuthenticated} isCheckedOut={isCheckedOut}   isReviewLeft={isReviewLeft} handleSubmitReview={handleSubmitReview} />
        <hr />
        <LastestReviews bookId={Number(bookId)} mobile={true} reviews={reviews} key={bookId}/>
      </div>
    </div>
  );
};

export default BookCheckoutPage;
