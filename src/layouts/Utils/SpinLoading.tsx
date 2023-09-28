import React from 'react'

const SpinLoading = () => {
  return (
    <div className='container m-5 d-flex justify-content-center' style={{height:550}}>
        <div className="spinner-border text-primary" role='status'>
            <span className="visuallu-hidden">
            </span>
        </div>
    </div>
  )
}

export default SpinLoading