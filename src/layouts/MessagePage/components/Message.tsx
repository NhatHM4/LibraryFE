import { useOktaAuth } from '@okta/okta-react';
import React, { useEffect, useState } from 'react'
import MessageModel from '../../../models/MessageModel';
import SpinLoading from '../../Utils/SpinLoading';
import Pagination from '../../Utils/Pagination';

const Message = () => {
  const {authState} = useOktaAuth();
  const [isLoadingMessage, setIsLoadingMessage] = useState(true)
  const [messages, setMessages] = useState<MessageModel[]>([])
  const [httpError, setHttpError] = useState('')
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [size] = useState(3)


  // useEffect review
  useEffect(() => {
    const fetchData = async () => {
      if (authState && authState.isAuthenticated){
          const baseUrl = `http://localhost:8080/api/messages/search/findByUserEmail?userEmail=${authState.accessToken?.claims.sub}&page=${currentPage-1}&size=${size}`;
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
        setIsLoadingMessage(false);
  }
    fetchData().catch((error: any) => {
        setIsLoadingMessage(false);
      setHttpError(error.message);
    });
    window.scrollTo(0,0)
  }, [authState, currentPage]);

  if (isLoadingMessage) {
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


return (
    <div className='mt-2'>
        {messages.length > 0 ? 
            <>
                <h5>Current Q/A: </h5>
                {messages.map(message => (
                    <div key={message.id}>
                        <div className='card mt-2 shadow p-3 bg-body rounded'>
                            <h5>Case #{message.id}: {message.title}</h5>
                            <h6>{message.userEmail}</h6>
                            <p>{message.question}</p>
                            <hr/>
                            <div>
                                <h5>Response: </h5>
                                {message.response && message.admin_email ? 
                                    <>
                                        <h6>{message.admin_email} (admin)</h6>
                                        <p>{message.response}</p>
                                    </>
                                    :
                                    <p><i>Pending response from administration. Please be patient.</i></p>
                                }
                            </div>
                        </div>
                    </div>
                ))}
            </>
            :
            <h5>All questions you submit will be shown here</h5>
        }
        {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>}
    </div>
);
}


export default Message