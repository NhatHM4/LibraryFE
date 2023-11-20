import React, { useEffect, useState } from 'react'
import BookModel from '../../../models/BookModel';
import SpinLoading from '../../Utils/SpinLoading';
import Pagination from '../../Utils/Pagination';
import ChangeQuantityOfBook from './ChangeQuantityOfBook';

const ChangeQuantityOfBooks = () => {
    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState<number>(0);
    const [booksPerPage] = useState(3)
    const [deletebook,setDeleteBook] = useState(false)

    const deleteBookf = () => setDeleteBook(!deletebook)

    useEffect(() => {
        const fetchData = async () => {
          const baseUrl = `http://localhost:8080/api/books?page=${currentPage-1}&size=${booksPerPage}`;

          const response = await fetch(baseUrl);
      
          if (!response.ok) {
            throw new Error("Something went wrong !!!");
          }
      
          const responseJson = await response.json();
      
          setTotalPages(responseJson.page.totalPages);
          setTotalAmountOfBooks(responseJson.page.totalElements);
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

      }, [currentPage, deletebook]);
  
      const indexOfLastBook: number = currentPage * booksPerPage;
      const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
      let lastItem = booksPerPage * currentPage <= totalAmountOfBooks ?
          booksPerPage * currentPage : totalAmountOfBooks;
  
      const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
        <div className='container mt-5'>
        {totalAmountOfBooks > 0 ?
            <>
                <div className='mt-3'>
                    <h3>Number of results: ({totalAmountOfBooks})</h3>
                </div>
                <p>
                    {indexOfFirstBook + 1} to {lastItem} of {totalAmountOfBooks} items: 
                </p>
                {
                    books.map( book =>{
                        return (
                            <ChangeQuantityOfBook book={book} key={book.id} deleteBookf ={deleteBookf} setCurrentPage={setCurrentPage}/>
                        )
                    })
                }
            </>
            :
            <h5>Add a book before changing quantity</h5>
    
        }
        {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>}
        </div>
    </div>
  )
}

export default ChangeQuantityOfBooks