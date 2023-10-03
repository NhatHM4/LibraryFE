import React, { useEffect, useRef, useState } from "react";
import BookModel from "../../models/BookModel";
import SpinLoading from "../Utils/SpinLoading";
import SearchBook from "./components/SearchBook";
import Pagination from "../Utils/Pagination";

const SearchBooksPage = () => {
  const [books, setBooks] = useState<BookModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [httpError, setHttpError] = useState(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [size] = useState(4)
  const [searchUrl, setSearchUrl] = useState<string>('')
  const [search,setSearch] = useState<string>('')


  const paginate = (id: number) => {
    setCurrentPage(id);
  };

  const handleSubmitSearch = ()=>{
    console.log('vo')
    if (search !== '') {
      setSearchUrl(`search/findByTitleContaining?title=${search}`)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const baseUrl = "http://localhost:8080/api/books";
      let url : string = ''
      if (searchUrl === '') {
        url = `${baseUrl}?page=${currentPage-1}&size=${size}`;
      } else {
        url = `${baseUrl}/${searchUrl}&page=${currentPage-1}&size=${size}`
      }
      console.log(url)
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error("Something went wrong !!!");
      }
  
      const responseJson = await response.json();
  
      setTotalPages(responseJson.page.totalPages);
      setTotalElements(responseJson.page.totalElements);
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
  }, [currentPage,searchUrl]);

  if (isLoading) {
    return <SpinLoading />;
  }

  if (httpError) {
    <div className="container m-5">
      <p>{httpError}</p>
    </div>;
  }
  
  let calculate = size < (totalElements % currentPage) ? (totalElements % currentPage) : size;
  console.log(calculate)
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
                  aria-labelledby="Search"
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="btn btn-outline-success" onClick={()=> handleSubmitSearch()}>Search</button>
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
            <h5>Number of results: {totalElements}</h5>
          </div>
          
          <p>{(currentPage-1)*size + 1} to {(currentPage-1)*size + size } of {totalElements} items</p>
          {books.map((book) => {
            return <SearchBook book={book} key={book.id} />;
          })}
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        paginate={paginate}
      ></Pagination>
    </div>
  );
};

export default SearchBooksPage;
