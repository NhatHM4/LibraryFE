import React from 'react'
interface PaginationProps {
    currentPage: number;
    totalPages: number;
    paginate: any
}
const Pagination:React.FC<PaginationProps> = (props) => {
  return (
    <nav>

    </nav>
  )
}

export default Pagination