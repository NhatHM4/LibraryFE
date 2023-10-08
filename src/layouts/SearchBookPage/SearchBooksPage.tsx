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
  const [category, setCategory] = useState<string>('All')


  const paginate = (id: number) => {
    setCurrentPage(id);
  };

  const handleSubmitSearch = ()=>{
    setCurrentPage(1)
    if (search !== '') {
      setSearchUrl(`search/findByTitleContaining?title=${search}&page=<page>&size=${size}`)
    }
  }

  const categoryField = (name : string) => {
    setCurrentPage(1)
    if (
      name.toLowerCase() == 'fe' ||
      name.toLowerCase() == 'be' ||
      name.toLowerCase() == 'data' ||
      name.toLowerCase() == 'do'
    ){
      setSearchUrl(`search/findByCategory?category=${name.toLowerCase()}&page=<page>&size=${size}`)
    } else {
      setSearchUrl('');
    }
    setCategory(name.toUpperCase());
  }

  useEffect(() => {
    const fetchData = async () => {
      const baseUrl = "http://localhost:8080/api/books";
      let url : string = ''
      if (searchUrl === '') {
        url = `${baseUrl}?page=${currentPage-1}&size=${size}`;
      } else {
        url = `${baseUrl}/${searchUrl}`
      }
      url.replace('<page>',`${currentPage-1}`)
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
                  {category}
                </button>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton1"
                >
                  <li onClick={() => categoryField('all')}>
                    <a className="dropdown-item" href="#">
                      All
                    </a>
                  </li>
                  <li onClick={() => categoryField('fe')}>
                    <a className="dropdown-item" href="#">
                      FrontEnd
                    </a>
                  </li>
                  <li onClick={() => categoryField('be')}>
                    <a className="dropdown-item" href="#">
                      BackEnd
                    </a>
                  </li>
                  <li onClick={() => categoryField('data')}>
                    <a className="dropdown-item" href="#">
                      Data
                    </a>
                  </li>
                  <li onClick={() => categoryField('do')}>
                    <a className="dropdown-item" href="#">
                      Devops
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {
            totalElements > 0 ?
            <>
              <div className="mt-3">
                <h5>Number of results: {totalElements}</h5>
              </div>
              <p>{(currentPage-1)*size + 1} to { size * currentPage <= totalElements ? size * currentPage : totalElements} of {totalElements} items</p>
              {books.map((book) => {
                return <SearchBook book={book} key={book.id} />;
              })}
            </>
            :
            <>
              <div className='m-5'>
                  <h3>
                      Can't find what you are looking for?
                  </h3>
                  <a type='button' className='btn main-color btn-md px-4 me-md-2 fw-bold text-white'
                      href='#'>Library Services</a>
              </div>
            </>
          }
          
        </div>
      </div>
      {
        totalPages > 1 && 
        <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        paginate={paginate}
      ></Pagination>
      }
    </div>
  );
};

export default SearchBooksPage;
