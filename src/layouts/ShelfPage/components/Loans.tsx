import React, { useEffect, useState } from 'react'
import SpinLoading from '../../Utils/SpinLoading';
import ShelfCurrentLoans from '../../../models/ShelfCurrentLoans';
import BookModel from '../../../models/BookModel';
import BookLoans from '../../Utils/BookLoans';
import { useOktaAuth } from '@okta/okta-react';


const Loans = () => {
    const [isLoadingShelf, setIsLoadingShelf] = useState(true);
    const [httpError, setHttpError] = useState("");
    const [shelfCurrentLoans, setShelfCurrentLoans] = useState<ShelfCurrentLoans[]>([]);
    const {authState} = useOktaAuth();
  
    // useEffect review
    useEffect(() => {
      const fetchData = async () => {
        const baseUrl = `http://localhost:8080/api/books/secure/currentloans`;
        if (authState && authState.isAuthenticated){
            const baseUrl = `http://localhost:8080/api/books/secure/currentloans`;
            const requestOptions = {
                method: 'GET',
                headers: {
                Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
                }
            };
            const response = await fetch(baseUrl, requestOptions);

            if (!response.ok) {
                throw new Error("Something went wrong !!!");
            }

            const responseJson = await response.json();

            const loadedShelf: ShelfCurrentLoans[] = [];


            for (const key in responseJson) {
                const bookGet : BookModel = {
                    id: responseJson[key].book.id,
                    title: responseJson[key].book.title,
                    author: responseJson[key].book.author,
                    description: responseJson[key].book.description,
                    copies: responseJson[key].book.copies,
                    copiesAvailable: responseJson[key].book.copiesAvailable,
                    category: responseJson[key].book.category,
                    img: responseJson[key].book.img,
                }
                loadedShelf.push({
                    book : bookGet, 
                    daysLeft : responseJson[key].daysLeft
                });
            }
            setShelfCurrentLoans(loadedShelf);
            setIsLoadingShelf(false);
            };
    }
      fetchData().catch((error: any) => {
        setIsLoadingShelf(false);
        setHttpError(error.message);
      });
    }, []);

    console.log(shelfCurrentLoans)
  
  
    if (isLoadingShelf) {
      return <SpinLoading />;
    }
  
    if (httpError) {
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    }
    return (
        <div className={"row mt-1"}>
          <h4 className='m-2'> Current Loans : </h4>
          <div className="col-sm-1 col-md-1"></div>
          <div className="col-sm-12 col-md-10">
            {shelfCurrentLoans.length > 0 ? (
              <>
                {shelfCurrentLoans.map((eachShelf) => (
                  <BookLoans shelfCurrentLoans={eachShelf} key={eachShelf.book.id}/>
                ))}
              </>
            ) : (
              <div className="m-3">
                <p className="lead">Currently there are no reviews for this book</p>
              </div>
            )}
           
          </div>
          
        </div>
      );
}

export default Loans