import { useOktaAuth } from '@okta/okta-react';
import React, { useEffect, useState } from 'react'
import MessageModel from '../../../models/MessageModel';
import SpinLoading from '../../Utils/SpinLoading';
import Pagination from '../../Utils/Pagination';
import AdminMessage from './AdminMessage';
import AdminMessageRequest from '../../../models/AdminMessageRequest';

const AdminMessages = () => {

    const { authState } = useOktaAuth();

    // Normal Loading Pieces
    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // Messages endpoint State
    const [messages, setMessages] = useState<MessageModel[]>([]);
    const [messagesPerPage] = useState(3);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    // Recall useEffect
    const [btnSubmit, setBtnSubmit] = useState(false);

  // useEffect review
  useEffect(() => {
    const fetchData = async () => {
      if (authState && authState.isAuthenticated){
          const baseUrl = `${process.env.REACT_APP_API}/messages/search/findByClosed?closed=false&page=${currentPage-1}&size=${messagesPerPage}`
          const requestOptions = {
              method: 'GET'
          };
          const response = await fetch(baseUrl, requestOptions);

          if (!response.ok) {
              throw new Error("Something went wrong !!!");
          }

          const responseJson = await response.json();

          setMessages(responseJson._embedded.messages);
          setTotalPages(responseJson.page.totalPages)
        };
        setIsLoadingMessages(false);
  }
    fetchData().catch((error: any) => {
        setIsLoadingMessages(false);
      setHttpError(error.message);
    });
    window.scrollTo(0,0)
  }, [authState, currentPage, btnSubmit]);

  if (isLoadingMessages) {
    return <SpinLoading />;
  }

  if (httpError) {
    return (
        <div className='container m-5'>
            <p>{httpError}</p>
        </div>
    );
}

const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

const handleSubmitRespose= async (id: number, response : string)=>{

      if (authState && authState.isAuthenticated){
        const message : AdminMessageRequest = new AdminMessageRequest(id, response);
        const url = `${process.env.REACT_APP_API}/messages/secure/add/message`;
        const requestOptions = {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(message)
        };

        const checkedOutResponse = await fetch(url, requestOptions)
        if (!checkedOutResponse.ok){
          throw new Error(' Something went wrong !!!')
        }
      }
    setBtnSubmit(!btnSubmit)
  }

  return (
    <div className='mt-3'>
        {messages.length > 0 ? 
                <>
                    <h5>Pending Q/A: </h5>
                    {messages.map(message => (
                       <AdminMessage message={message} key={message.id} handleSubmitRespose={handleSubmitRespose}/>
                    ))}
                </>
                :
                <h5>No pending Q/A</h5>
            }
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>}
    </div>
  )
}


export default AdminMessages