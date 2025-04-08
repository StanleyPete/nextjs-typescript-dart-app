'use client'
import React, { useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { setIsGameEnd, setIsGameStarted, setWinner } from '@/redux/slices/game-online/gameOnlineSlice'
import TimeoutSection from '../lobby/TimeoutSection'

const GameEndPopUpOnline = () => {
   const dispatch = useDispatch()
   const router = useRouter()
   const gameId = useSelector((state: RootState) => state.gameOnline.gameId)
   const isGameEnd = useSelector((state: RootState) => state.gameOnline.isGameEnd)
   const winner = useSelector((state: RootState) => state.gameOnline.winner)
   const isTimeout = useSelector((state: RootState) => state.gameOnline.isTimeout)
   
   useEffect(() => {
      if (isTimeout) return router.replace('/game-online/status')
   }, [isTimeout])

   return (
      isGameEnd && (
         <div className="overlay">
            <div className='game-over-popup'>
               <div className='game-over-popup-content'>
                  <TimeoutSection />
                  <Image 
                     src='/winner.svg' 
                     alt='Winner icon' 
                     width={80} 
                     height={80} 
                  />
                  <h3>Winner: {winner?.playerName}</h3>
                  <button 
                     className='play-again' 
                     onClick={() => {
                        dispatch(setIsGameEnd(false))
                        dispatch(setIsGameStarted(false))
                        dispatch(setWinner(null))
                        router.replace(`/game-online/lobby/${gameId}`)
                     }}
                  >
                    Go to lobby
                  </button>

                  <button 
                     className='go-back' 
                     onClick={() => { window.location.href = 'http://localhost:3000' }}
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
