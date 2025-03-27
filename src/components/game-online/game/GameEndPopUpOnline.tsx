'use client'
import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { setIsGameEnd, setIsGameStarted, setWinner } from '@/redux/slices/game-online/gameOnlineSlice'
import { socketService } from '@/socket/socket'
import TimeoutSection from '../lobby/TimeoutSection'

const GameEndPopUpOnline = () => {
   const dispatch = useDispatch()
   const router = useRouter()
   const gameId = useSelector((state: RootState) => state.gameOnline.gameId)
   const isGameEnd = useSelector((state: RootState) => state.gameOnline.isGameEnd)
   const winner = useSelector((state: RootState) => state.gameOnline.winner)
   
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
                        router.push(`/game-online/lobby/${gameId}`)
                     }}
                  >
                    Go to lobby
                  </button>

                  <button 
                     className='go-back' 
                     onClick={() => {
                        socketService.close()
                        router.push('/')
                     }}
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
