import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

const TimeoutSection = () => {
   const { gameNotStartedTimeoutEndTime } = useSelector((state: RootState) => state.gameOnline)
   const [ timeRemaining, setTimeRemaining ] = useState<number | null>(null)
   
   
   useEffect(() => {
      if (!gameNotStartedTimeoutEndTime) return 

      const intervalId = setInterval(() => {
         const currentTime = Date.now() 
         const remainingTime = gameNotStartedTimeoutEndTime - currentTime 

         if (remainingTime <= 0) {
            //Clear interval when timeout
            clearInterval(intervalId)
            setTimeRemaining(0)
            window.location.href = 'http://localhost:3000'
         } else {
            setTimeRemaining(remainingTime)
         }
      }, 1000) 

      return () => clearInterval(intervalId) 
   }, [gameNotStartedTimeoutEndTime])

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
         {timeRemaining === null 
            ? ( <p>Timeout in:</p> ) 
            : ( <p>Timeout in: {formatTime(timeRemaining)}</p> )
         }
      </div>  
  
   )
}

export default TimeoutSection