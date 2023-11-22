import { useOktaAuth } from '@okta/okta-react';
import React, { useEffect, useState } from 'react'
import HistoryModel from '../../../models/HistoryModel';
import SpinLoading from '../../Utils/SpinLoading';
import { Link } from 'react-router-dom';
import Pagination from '../../Utils/Pagination';

const HistoryPage = () => {
  const {authState} = useOktaAuth();
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [histories, setHistories] = useState<HistoryModel[]>([])
  const [httpError, setHttpError] = useState('')
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [size] = useState(3)


   // useEffect review
   useEffect(() => {
    const fetchData = async () => {
      if (authState && authState.isAuthenticated){
          const baseUrl = `${process.env.REACT_APP_API}/histories/search/findBooksByUserEmail?userEmail=${authState.accessToken?.claims.sub}&page=${currentPage-1}&size=${size}`;
          const requestOptions = {
              method: 'GET'
          };
          const response = await fetch(baseUrl, requestOptions);

          if (!response.ok) {
              throw new Error("Something went wrong !!!");
          }

          const responseJson = await response.json();

          setHistories(responseJson._embedded.histories);
          setTotalPages(responseJson.page.totalPages)
        };
        setIsLoadingHistory(false);
  }
    fetchData().catch((error: any) => {
      setIsLoadingHistory(false);
      setHttpError(error.message);
    });
    window.scrollTo(0,0)
  }, [authState, currentPage]);


  if (isLoadingHistory) {
    return <SpinLoading />;
  }

  if (httpError) {
    return (
        <div className='container m-5'>
            <p>{httpError}</p>
        </div>
    );
}

const paginate = (id: number) => {
  setCurrentPage(id);
};

  return(
    <div className='mt-2'>
        {histories.length > 0 ? 
        <>
            <h5>Recent History:</h5>

            {histories.map(history => (
                <div key={history.id}>
                    <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>
                        <div className='row g-0'>
                            <div className='col-md-2'>
                                <div className='d-none d-lg-block'>
                                    {history.img ? 
                                        <img src={history.img} width='123' height='196' alt='Book' />
                                        :
                                        <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')} 
                                            width='123' height='196' alt='Default'/>
                                    }
                                </div>
                                <div className='d-lg-none d-flex justify-content-center align-items-center'>
                                    {history.img ? 
                                        <img src={history.img} width='123' height='196' alt='Book' />
                                        :
                                        <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')} 
                                            width='123' height='196' alt='Default'/>
                                    }
                                </div>
                            </div>
                            <div className='col'>
                                    <div className='card-body'>
                                        <h5 className='card-title'> {history.author} </h5>
                                        <h4>{history.title}</h4>
                                        <p className='card-text'>{history.description}</p>
                                        <hr/>
                                        <p className='card-text'> Checked out on: {history.checkoutDate}</p>
                                        <p className='card-text'> Returned on: {history.returnDate}</p>
                                    </div>
                            </div>
                        </div>
                    </div>
                    <hr/>
                </div>
            ))}
        </>
        :
        <>
            <h3 className='mt-3'>Currently no history: </h3>
            <Link className='btn btn-primary' to={'search'}>
                Search for new book
            </Link>
        </>
        
    }
          {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
        ></Pagination>
      )}
    </div>
)
}

export default HistoryPage