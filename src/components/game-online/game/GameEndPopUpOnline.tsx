'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { setIsGameEnd, setIsGameStarted, setWinner } from '@/redux/slices/game-online/gameOnlineSlice'
import TimeoutSection from '../lobby/TimeoutSection'

const GameEndPopUpOnline = () => {
   const dispatch = useDispatch()
   const router = useRouter()
   const [focusedButton, setFocusedButton] = useState<string| null>('play-again')
   const gameId = useSelector((state: RootState) => state.gameOnline.gameId)
   const isGameEnd = useSelector((state: RootState) => state.gameOnline.isGameEnd)
   const winner = useSelector((state: RootState) => state.gameOnline.winner)
   const isTimeout = useSelector((state: RootState) => state.gameOnline.isTimeout)
   
   useEffect(() => {
      if (isTimeout) return router.replace('/game-online/status')
   }, [isTimeout])

   useEffect(() => {
      setFocusedButton('play-again')
   }, [isGameEnd])

   useEffect(() => {
      if (!isGameEnd) return
      const handleKeyDown = (event: KeyboardEvent) => {
         const buttonOptions = ['play-again', 'go-back']
         const currentButtonIndex = buttonOptions.findIndex(el => el === focusedButton)

         if (event.key === 'ArrowDown') {
            event.preventDefault()
            const nextButtonIndex = (currentButtonIndex + 1) % buttonOptions.length
            setFocusedButton(buttonOptions[nextButtonIndex])
         }

         if (event.key === 'ArrowUp') {
            event.preventDefault()
            const prevButtonIndex = (currentButtonIndex - 1 + buttonOptions.length) % buttonOptions.length
            setFocusedButton(buttonOptions[prevButtonIndex])
         }

         if (event.key === 'Enter') {
            event.preventDefault()
            if (focusedButton === 'play-again') {
               dispatch(setIsGameEnd(false))
               dispatch(setIsGameStarted(false))
               dispatch(setWinner(null))
               router.replace(`/game-online/lobby/${gameId}`)
            } else if (focusedButton === 'go-back') {
               window.location.href = 'http://localhost:3000'
            } 
         }
   
      }
   
      window.addEventListener('keydown', handleKeyDown)
   
      return () => { window.removeEventListener('keydown', handleKeyDown) }
   }, [focusedButton, isGameEnd])
   

   return (
      isGameEnd && (
         <div className='overlay'>
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
                     className={`play-again ${focusedButton === 'play-again' ? 'focused' : ''} `} 
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
                     className={`go-back ${focusedButton === 'go-back' ? 'focused' : ''} `}
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
