import React, { useEffect, useState } from 'react'
import SpinLoading from '../../Utils/SpinLoading';
import ShelfCurrentLoans from '../../../models/ShelfCurrentLoans';
import BookModel from '../../../models/BookModel';
import BookLoans from '../../Utils/BookLoans';
import { useOktaAuth } from '@okta/okta-react';
import { Link } from 'react-router-dom';


const Loans = () => {
    const [isLoadingShelf, setIsLoadingShelf] = useState(true);
    const [httpError, setHttpError] = useState("");
    const [shelfCurrentLoans, setShelfCurrentLoans] = useState<ShelfCurrentLoans[]>([]);
    const {authState} = useOktaAuth();
    const [isReturn, setIsReturn] = useState(false)
    const [isRenew, setIsRenew] = useState(false)
  
    // useEffect review
    useEffect(() => {
      const fetchData = async () => {
        if (authState && authState.isAuthenticated){
            const baseUrl = `${process.env.REACT_APP_API}/books/secure/currentloans`;
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
              const daysleft = responseJson[key].daysLeft;
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
                  book: bookGet,
                  daysLeft: daysleft
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
      window.scrollTo(0,0)
    }, [authState, isReturn, isRenew]);

  
  
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
                  <BookLoans shelfCurrentLoans={eachShelf} key={eachShelf.book.id} setIsReturn={setIsReturn} isReturn={isRenew} setIsRenew={setIsRenew} isRenew={isRenew}/>
                ))}
              </>
            ) : (
              <>
                  <h3 className='mt-3'>
                      Currently no loans
                  </h3>
                  <Link className='btn btn-primary' to={`search`}>
                      Search for a new book
                  </Link>
              </>
            )}
           
          </div>
          
        </div>
      );
}

export default Loans