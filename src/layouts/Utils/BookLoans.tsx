import React from 'react'
import ShelfCurrentLoans from '../../models/ShelfCurrentLoans'

const BookLoans:React.FC<{shelfCurrentLoans : ShelfCurrentLoans}> = (props) => {

    return (
        <>
            <div className="row ">
                <div className="col-md-8">
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
                <div className="col-md-4">
                        Loan Options
                </div>
            </div>
            <hr/>
        </>
      )
}

export default BookLoans