import React, { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import SpinLoading from "../Utils/SpinLoading";
import SearchBook from "./components/SearchBook";

const SearchBooksPage = () => {
  const [books, setBooks] = useState<BookModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [httpError, setHttpError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const baseUrl = "http://localhost:8080/api/books";
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
    return <SpinLoading />;
  }

  if (httpError) {
    <div className="container m-5">
      <p>{httpError}</p>
    </div>;
  }

  return (
    <div>
      <div className="container">
        <div>
          <div className="row mt-5">
            <div className="col-6">
              <div className="d-flex">
                <input
                  type="search"
                  className="form-control me-2"
                  placeholder="Search"
                  aria-aria-labelledby="Search"
                />
                <button className="btn btn-outline-success">Search</button>
              </div>
            </div>
            <div className="col-4">
              <div className="dropdown">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Category
                </button>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton1"
                >
                  <li>
                    <a className="dropdown-item" href="#">
                      All
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      FrontEnd
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      BackEnd
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Data
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Devops
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <h5>Number of results: 5</h5>
          </div>
          <p>1 to 2 of 22 items</p>
          {books.map((book) => {
            return (
              <SearchBook book={book} key = {book.id}/>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default SearchBooksPage;
