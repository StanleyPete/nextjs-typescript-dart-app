import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

const TimeoutComponent = () => {
   const message = useSelector((state: RootState) => state.gameOnline.message)

   return (
      <div className='timeout-component'>
         <p style={{ color: 'white' }}>{message}</p>
         <button
            onClick={() => window.location.href = 'http://localhost:3000'}
         >
            Home page
         </button>
      </div>
   )
}

export default TimeoutComponent