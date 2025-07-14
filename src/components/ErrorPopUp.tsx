import React, { useEffect } from 'react'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { setError } from '../redux/slices/gameSettingsSlice'

const ErrorPopUp = () => {
   const dispatch = useDispatch()
   const { isError, errorMessage } = useSelector((state: RootState) => state.gameSettings.error)
   const closeError = () => { dispatch(setError({ isError: false, errorMessage: '' })) }

   useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
         if (event.key === 'Escape' || event.key === 'Enter') {
            closeError() 
         }
      }

      window.addEventListener('keydown', handleKeyDown)

      return () => { window.removeEventListener('keydown', handleKeyDown) }
   }, [isError]) 

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
                  <button 
                     className='error-button'
                     onClick={closeError}>
                        OK
                  </button>
               </div>
            </div>
         </div>
      )
   )
}

export default ErrorPopUp