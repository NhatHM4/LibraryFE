import React, { useEffect, useState } from 'react'
import BookModel from '../../../models/BookModel'
import { useOktaAuth } from '@okta/okta-react';

const ChangeQuantityOfBook : React.FC<{book: BookModel, deleteBookf : any, setCurrentPage : any}> = (props, key) => {
    const [quantity, setQuantity] = useState<number>(0);
    const [remaining, setRemaining] = useState<number>(0);
    const {authState} = useOktaAuth();

    useEffect(()=>{
        const fectchBookInState = ()=>{
            props.book.copies ? setQuantity(props.book.copies) : setQuantity(0)
            props.book.copiesAvailable ? setRemaining(props.book.copiesAvailable) : setRemaining(0)
        }
        fectchBookInState()
    },[])

    const increaseQuantity = async (bookId : number)=>{
        if (authState && authState.isAuthenticated){
            const url = `http://localhost:8080/api/admin/secure/increase/book/quantity?bookId=${bookId}`;
            const requestOptions = {
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
              },
            };
            const increaseQuantityResponse = await fetch(url, requestOptions)
            if (!increaseQuantityResponse.ok){
              throw new Error(' Something went wrong !!!')
            }
            setQuantity(quantity + 1);
            setRemaining(remaining + 1);
          }
    }

    const decreaseQuantity = async (bookId : number)=>{
        if (authState && authState.isAuthenticated){
            const url = `http://localhost:8080/api/admin/secure/decrease/book/quantity?bookId=${bookId}`;
            const requestOptions = {
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
              },
            };
            const decreaseQuantityResponse = await fetch(url, requestOptions)
            if (!decreaseQuantityResponse.ok){
              throw new Error(' Something went wrong !!!')
            }
            setQuantity(quantity - 1);
            setRemaining(remaining - 1);
          }
    }

    const deleteBook = async (bookId : number) =>{
        if (authState && authState.isAuthenticated){
            const url = `http://localhost:8080/api/admin/secure/delete/book?bookId=${bookId}`;
            const requestOptions = {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
              },
            };
            const decreaseQuantityResponse = await fetch(url, requestOptions)
            if (!decreaseQuantityResponse.ok){
              throw new Error(' Something went wrong !!!')
            }
            props.deleteBookf();
            props.setCurrentPage(1)
          }
    }

  return (
    <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>
        <div className='row g-0'>
            <div className='col-md-2'>
                <div className='d-none d-lg-block'>
                    {props.book.img ?
                        <img src={props.book.img} width='123' height='196' alt='Book' />
                        :
                        <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')} 
                            width='123' height='196' alt='Book' />
                    }
                </div>
                <div className='d-lg-none d-flex justify-content-center align-items-center'>
                    {props.book.img ?
                        <img src={props.book.img} width='123' height='196' alt='Book' />
                        :
                        <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')} 
                            width='123' height='196' alt='Book' />
                    }
                </div>
            </div>
            <div className='col-md-6'>
                <div className='card-body'>
                    <h5 className='card-title'>{props.book.author}</h5>
                    <h4>{props.book.title}</h4>
                    <p className='card-text'> {props.book.description} </p>
                </div>
            </div>
            <div className='mt-3 col-md-4'>
                <div className='d-flex justify-content-center algin-items-center'>
                    <p>Total Quantity: <b>{quantity}</b></p>
                </div>
                <div className='d-flex justify-content-center align-items-center'>
                    <p>Books Remaining: <b>{remaining}</b></p>
                </div>
            </div>
            <div className='mt-3 col-md-1'>
                <div className='d-flex justify-content-start'>
                    <button className='m-1 btn btn-md btn-danger' onClick={()=> deleteBook(props.book.id)} >Delete</button>
                </div>
            </div>
            <button className='m1 btn btn-md main-color text-white' onClick={()=> increaseQuantity(props.book.id)} >Add Quantity</button>
            <button className='m1 btn btn-md btn-warning' onClick={()=> decreaseQuantity(props.book.id)}>Decrease Quantity</button>
        </div>
    </div>
  )
}

export default ChangeQuantityOfBook