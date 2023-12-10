import React from 'react'
import ShelfCurrentLoans from '../../models/ShelfCurrentLoans'
import { Link, Redirect } from 'react-router-dom'
import LoansModal from '../ShelfPage/components/LoansModal'
import { useOktaAuth } from '@okta/okta-react'
import { useHistory } from 'react-router-dom';

const BookLoans:React.FC<{shelfCurrentLoans : ShelfCurrentLoans, setIsReturn : any, setIsRenew: any, isReturn: boolean, isRenew : boolean}> = (props) => {
    const {authState} = useOktaAuth();
    const history = useHistory();
    const handleReturnBook = ()=>{
        const putReturnBook = async ()=>{
            if (authState && authState.isAuthenticated){
            const url = `${process.env.REACT_APP_API}/books/secure/return?bookId=${props.shelfCurrentLoans.book.id}`;
            const requestOptions = {
                method: 'PUT',
                headers: {
                Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
                }
            };
            const checkedOutResponse = await fetch(url, requestOptions)
            if (!checkedOutResponse.ok){
                throw new Error(' Something went wrong !!!')
            }
                props.setIsReturn(!props.isReturn)
            }
        }
        history.push("/fees")
        putReturnBook().catch((error: any)=>{
            throw new Error(' Return book fail !!')
        })
    }

    const handleRenewBook = ()=>{
        const putRenewBook = async ()=>{
            if (authState && authState.isAuthenticated){
            const url = `${process.env.REACT_APP_API}/books/secure/renew?bookId=${props.shelfCurrentLoans.book.id}`;
            const requestOptions = {
                method: 'PUT',
                headers: {
                Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
                }
            };
            const checkedOutResponse = await fetch(url, requestOptions)
            if (!checkedOutResponse.ok){
                throw new Error(' Something went wrong !!!')
            }
                props.setIsRenew(!props.isRenew)
            }
        }
        putRenewBook().catch((error: any)=>{
            throw new Error(' Return book fail !!')
        })
    }

    return (
        <>
            <div className="row ">
                <div className="col-md-9">
                    <div className="d-none d-lg-block">
                        {props.shelfCurrentLoans.book.img ? (
                        <img src={props.shelfCurrentLoans.book.img} width="200" height="300" alt="Book" />
                        ) : (
                        <img
                            src={require("../../Images/BooksImages/book-luv2code-1000.png")}
                            width="200"
                            height="300"
                            alt="Book"
                        />
                        )}
                    </div>
                    <div
                        className="d-lg-none d-flex justify-content-center 
                                    align-items-center"
                    >
                        {props.shelfCurrentLoans.book.img ? (
                        <img src={props.shelfCurrentLoans.book.img} width="200" height="300" alt="Book" />
                        ) : (
                        <img
                            src={require("../../Images/BooksImages/book-luv2code-1000.png")}
                            width="200"
                            height="300"
                            alt="Book"
                        />
                        )}
                    </div>
                </div>
                <div className="card col-3 col-md-3 container d-flex">
                        <div className="card-body">
                            <div className="mt-3">
                                <h5>Loans options</h5>
                                {
                                    props.shelfCurrentLoans.daysLeft > 0 &&
                                    <p className='text-secondary'>
                                        Due in {props.shelfCurrentLoans.daysLeft} days.
                                    </p>
                                }
                                {
                                    props.shelfCurrentLoans.daysLeft === 0 && 
                                    <p className='text-success'>
                                        Due Today
                                    </p>
                                }
                                {
                                    props.shelfCurrentLoans.daysLeft < 0 && 
                                    <p className='text-danger'>
                                        Past due by {props.shelfCurrentLoans.daysLeft} days.
                                    </p>
                                }
                                <div className="list-group mt-3">
                                    <button className='list-group-item list-group-item-action'
                                        aria-current='true' data-bs-toggle='modal'
                                        data-bs-target={`#modal${props.shelfCurrentLoans.book.id}`}>
                                            Manage Loans
                                    </button>
                                    <Link to={'search'} className='list-group-item list-group-item-action'>
                                            Search more books?
                                    </Link>
                                </div>
                                
                            </div>
                            <hr/>
                            <p className='mt-3'>
                                Help other find their adventure by reviewing your loan.
                            </p>
                            <Link className='btn btn-primary' to={`/checkout/${props.shelfCurrentLoans.book.id}`}>
                                Leave a review
                            </Link>
                        </div>
                </div>
            </div>
            <hr/>
            <LoansModal shelfCurrentLoan={props.shelfCurrentLoans} mobile={false} handleReturnBook={handleReturnBook} handleRenewBook ={handleRenewBook}/>
        </>
      )
}

export default BookLoans