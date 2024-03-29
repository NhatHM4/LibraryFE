import React from "react";
import ReturnBook from "./ReturnBook";
import { useState, useEffect } from "react";
import BookModel from "../../../models/BookModel";
import { error } from "console";
import SpinLoading from "../../Utils/SpinLoading";
import {Link} from 'react-router-dom'

const Carousel = () => {
  const [books, setBooks] = useState<BookModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [httpError, setHttpError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const baseUrl = `${process.env.REACT_APP_API}/books`;
      const url = `${baseUrl}?page=0&size=5`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Something went wrong !!!");
      }

      const responseJson = await response.json();

      const reponseData = responseJson._embedded.books;

      const loadedBooks: BookModel[] = [];

      for (const key in reponseData) {
        loadedBooks.push({
          id: reponseData[key].id,
          title: reponseData[key].title,
          author: reponseData[key].author,
          description: reponseData[key].description,
          copies: reponseData[key].copies,
          copiesAvailable: reponseData[key].copiesAvailable,
          category: reponseData[key].category,
          img: reponseData[key].img,
        });
      }
      setBooks(loadedBooks);
      setIsLoading(false);
    };
    fetchData().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
  }, []);


  if (isLoading) {
    return (
      <SpinLoading/>
    );
  }

  if (httpError) {
    <div className="container m-5">
      <p>{httpError}</p>
    </div>;
  }

  return (
    <div className="container mt-5" style={{ height: 550 }}>
      <div className="homepage-carousel-title">
        <h3>Find your text "I stayed up to late reading" book</h3>
      </div>
      <div
        id="carouselExampleControls"
        className="carousel carousel-dark slide mt-5 d-none d-lg-block"
        data-bs-interval="false"
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div className="row d-lex justify-content-center align-items-center">
              {
                books.slice(0,2).map((book)=>{
                  return (
                    <ReturnBook book={book} key={book.id}/>
                  )
                })
              }

            </div>
          </div>
          <div className="carousel-item">
            <div className="row d-lex justify-content-center align-items-center">
            {
                books.slice(2,4).map((book)=>{
                  return (
                    <ReturnBook book={book} key={book.id}/>
                  )
                })
              }
            </div>
          </div>
          <div className="carousel-item">
            <div className="row d-lex justify-content-center align-items-center">
            {
                books.slice(3,6).map((book)=>{
                  return (
                    <ReturnBook book={book} key={book.id}/>
                  )
                })
              }
            </div>
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleControls"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleControls"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      <div className="d-lg-none mt-3">
        <div className="row d-lex justify-content-center align-items-center">
        <ReturnBook book={books[1]} key={books[1]?.id}/>
        </div>
      </div>

      <div className="homepage-carousel-title mt-3">
        <Link to="/search" className="btn btn-outline-secondary btn-lg">
          View More
        </Link>
      </div>
    </div>
  );
};

export default Carousel;
