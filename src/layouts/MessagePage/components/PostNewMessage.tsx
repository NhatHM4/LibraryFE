import { useOktaAuth } from '@okta/okta-react';
import React, { useState } from 'react'
import MessageModel from '../../../models/MessageModel';

const PostNewMessage = () => {

    const {authState} = useOktaAuth();
    const [title, setTitle] = useState('')
    const [question, setQuestion] = useState('')
    const [displayWarning, setDisplayWarning] = useState(false)
    const [displaySuccess, setDisplaySuccess] = useState(false)

    const handleSubmitMessage = ()=>{
        setDisplayWarning(false)
        setDisplaySuccess(false)
        const postNewMessage = async ()=>{

          if (authState && authState.isAuthenticated){
            if (title === '' || question  === '' ){
                setDisplayWarning(true)
                return;
            }
            const message : MessageModel = new MessageModel(title, question);
            const url = `${process.env.REACT_APP_API}/messages/secure/add/message`;
            const requestOptions = {
              method: 'POST',
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
            setDisplaySuccess(true)
            setTitle('')
            setQuestion('')
          }
        }
        postNewMessage().catch((error: any)=>{
       
        })
      }

  return (
    <div className='card mt-3'>
        <div className='card-header'>
                Ask question to Luv 2 Read Admin
        </div>
        <div className='card-body'>
            <form method='POST'>
                {displayWarning && 
                    <div className='alert alert-danger' role='alert'>
                        All fields must be filled out
                    </div>
                }
                {displaySuccess && 
                    <div className='alert alert-success' role='alert'>
                        Question added successfully
                    </div>
                }
                <div className='mb-3'>
                    <label className='form-label'>
                        Title
                    </label>
                    <input type='text' className='form-control' id='exampleFormControlInput1' 
                        placeholder='Title' onChange={e => setTitle(e.target.value)} value={title}/>
                </div>
                <div className='mb-3'>
                    <label className='form-label'>
                        Question
                    </label>
                    <textarea className='form-control' id='exampleFormControlTextarea1' 
                        rows={3} onChange={e => setQuestion(e.target.value)} value={question}>
                    </textarea>
                </div>
                <div>
                        <button type='button' className='btn btn-primary mt-3' onClick={handleSubmitMessage}>
                            Submit Question
                        </button>
                    </div>
            </form>
        </div>
    </div>
  )
}

export default PostNewMessage