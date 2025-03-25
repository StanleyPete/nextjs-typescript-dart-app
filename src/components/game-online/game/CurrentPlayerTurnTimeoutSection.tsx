import React, { useEffect, useState } from 'react'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'

const CurrentPlayerTurnTimeoutSection = () => {
   const currentPlayerTurnStartTime = useSelector((state: RootState) => state.gameOnline.currentPlayerTurnStartTime)
   const currentPlayerTurnTimerDuartion = useSelector((state: RootState) => state.gameOnline.currentPlayerTurnTimerDuartion)
   const [ timeRemaining, setTimeRemaining ] = useState<number | null>(null)
   
   useEffect(() => {
      if (!currentPlayerTurnStartTime) return 

      const calculatedEndTime = currentPlayerTurnStartTime + currentPlayerTurnTimerDuartion

      setTimeRemaining(calculatedEndTime - Date.now())

      const intervalId = setInterval(() => {
         const currentTime = Date.now()
         const remainingTime = calculatedEndTime - currentTime

         if (remainingTime <= 0) {
            //Clear interval when timeout
            clearInterval(intervalId)
            setTimeRemaining(0)
         } else {
            setTimeRemaining(remainingTime)
         }
      }, 1000) 

      return () => clearInterval(intervalId) 
   }, [currentPlayerTurnStartTime, currentPlayerTurnTimerDuartion])

   // 
   const formatTime = (milliseconds: number) => {
      // Converting into minutes:
      const minutes = Math.floor(milliseconds / 60000) 
      // Converting into seconds:
      const seconds = Math.floor((milliseconds % 60000) / 1000) 
      // Converting into mm:ss
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
   }
  

   return (
      <div className="timeout">
         {timeRemaining !== null 
            ? <span>{formatTime(timeRemaining)}</span>
            : <span>Loading timeout...</span>
         }
      </div>
   )
}

export default CurrentPlayerTurnTimeoutSection