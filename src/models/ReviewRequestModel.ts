class ReviewRequestModel {
    rating : number;
    bookId : number;
    reviewDecription?: string

    constructor(rating: number, bookId: number,  reviewDecription : string){
      this.rating = rating;
      this.bookId = bookId;
      this.reviewDecription = reviewDecription;
    }

}

export default ReviewRequestModel;