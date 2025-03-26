import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

const GameEndPopUpOnline = () => {
   const dispatch = useDispatch()
   const router = useRouter()
   const isGameEnd = useSelector((state: RootState) => state.gameOnline.isGameEnd)
   const winner = useSelector((state: RootState) => state.gameOnline.winner)
   
   return (
      isGameEnd && (
         <div className="overlay">
            <div className='game-over-popup'>
               <div className='game-over-popup-content'>
                  <Image 
                     src='/winner.svg' 
                     alt='Winner icon' 
                     width={80} 
                     height={80} 
                  />
                  <h3>Winner: {winner?.playerName}</h3>
                  <button 
                     className='play-again' 
                     onClick={() => {}}
                  >
                    Go to lobby
                  </button>

                  <button 
                     className='go-back' 
                     onClick={() => router.back()}
                  >
                    Home page
                  </button>
                
               </div>
            </div>
         </div>
      )
   )
}

export default GameEndPopUpOnline
