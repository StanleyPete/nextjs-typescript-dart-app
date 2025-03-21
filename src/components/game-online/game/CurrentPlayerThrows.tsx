'use client'
import React from 'react'
import { RootState } from '@/redux/store'
import { useSelector} from 'react-redux'

const CurrentPlayerThrowsOnline = () => {
   const currentPlayerThrows = useSelector((state: RootState) => state.gameOnline.currentPlayerThrows)

   return (
      <div className="current-player-throws">
         {Array.from({ length: 3 }, (_, i) => (
            <div className='current-throw' key={i}>
               {currentPlayerThrows[i] !== undefined ? currentPlayerThrows[i] : '-'}
            </div>
         ))}
      </div>
      
     
   )
}

export default CurrentPlayerThrowsOnline



