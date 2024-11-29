import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Image from 'next/image'
import { RootState } from '@/redux/store'
import { setError } from '../redux/slices/gameSettingsSlice'

const ErrorPopUp = () => {

   const dispatch = useDispatch()
   
   const { isError, errorMessage } = useSelector((state: RootState) => state.gameSettings.error)

   //Close error handler
   const closeError = () => {
      dispatch(setError({ isError: false, errorMessage: '' })) 
   }

   return (
      isError && (
         <div className="overlay">
            <div className="error">
               <div className="error-content">
                  <Image 
                     src='/error.svg' 
                     alt='Error icon' 
                     width={100} 
                     height={100} 
                  />
                  <p>{errorMessage}</p>
                  <button onClick={closeError}>OK</button>
               </div>
            </div>
         </div>
      )
   )
}

export default ErrorPopUp