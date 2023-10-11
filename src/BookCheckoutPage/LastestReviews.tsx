import React from 'react'
import ReviewModel from '../models/ReviewModel'
import { Link } from 'react-router-dom'
import Review from '../layouts/Utils/Review'

interface LastestReviewsProps {
    reviews : ReviewModel[],
    bookId: number | undefined,
    mobile: boolean
}

const LastestReviews: React.FC<LastestReviewsProps> = (props) => {

  return (
    <div className={props.mobile ? 'mt-3' : 'row mt-5'}>
        <div className={props.mobile ? '' : 'col-sm-2 col-md-2'}>
            <h2> Lastest Reviews: </h2>
        </div>
        <div className="col-sm-10 col-md-10">
            { props.reviews.length > 0 ?
                <>
                    {props.reviews.slice(0,3).map(eachReview => (
                        <Review review = {eachReview} key={eachReview.id}></Review>
                    ))}
                    <div className="m-3">
                        <Link to="#" type='button' className='btn main-color btn-md text-white'>
                            Reach all review
                        </Link>
                    </div>
                </>
                :
                <div className='m-3'>
                        <p className='lead'>
                            Currently there are no reviews for this book
                        </p>
                </div>
            }
        </div>
        
    </div>
  )
}

export default LastestReviews