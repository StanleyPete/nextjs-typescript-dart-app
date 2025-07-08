import React, { useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { handleRestartGameClassic } from '@/controllers/game-classic/handleRestartGameClassic'
import { handleRestartGameCricket } from '@/controllers/game-cricket/handleRestartGameCricket'
import { setBackFromGame } from '@/redux/slices/gameSettingsSlice'
import '../app/styles/nav-panel.scss'

const NavigationPanel = () => {
   const dispatch = useDispatch()
   const router = useRouter()
   const gameMode = useSelector((state: RootState) => state.gameSettings.gameMode)
   const gameWin = useSelector((state: RootState) => state.gameSettings.gameWin)
   const numberOfLegs = useSelector((state: RootState) => state.gameSettings.numberOfLegs)
   const playerNames = useSelector((state: RootState) => state.gameSettings.playerNames)
   const gameType = useSelector((state: RootState) => state.gameSettings.gameType)
   const isGameEnd  = useSelector((state: RootState) => state.game?.isGameEnd ?? false)
   const { isError } = useSelector((state: RootState) => state.gameSettings.error)
   const gameWinType = gameWin === 'best-of' ? 'BEST OF' : 'FIRST TO'
   
   useEffect(() => {
      if (isError) return
      const handleKeyDown = (event: KeyboardEvent) => {
         if (event.ctrlKey && event.altKey && event.key.toLowerCase() === 'r') {
            event.preventDefault()
            if (gameMode === 'Cricket') {
               handleRestartGameCricket(gameType, playerNames, isGameEnd, dispatch)
            } else {
               handleRestartGameClassic(gameType, playerNames, gameMode, isGameEnd, dispatch)
            }
         }

         if (event.key === 'Escape') {
            event.preventDefault()
            dispatch(setBackFromGame(true))
            router.replace('/')
         }        
      }

      window.addEventListener('keydown', handleKeyDown)

      return () => { window.removeEventListener('keydown', handleKeyDown) }
   }, [dispatch, router, isError, gameMode, gameType, playerNames, isGameEnd])


   return (
      <div className='nav-panel'>
         <button 
            className='go-back' 
            onClick={() => {
               dispatch(setBackFromGame(true))
               router.replace('/')
               return
            }}
            title='Back to home page Esc' 
         >
            <Image 
               src='go-back.svg' 
               alt='Go back arrow in nav panel' 
               width={14} 
               height={14}
            />
            <span>Quit</span>
         </button>
         <span className='current-game-header'>
            {`${gameWinType} ${numberOfLegs} LEGS`}
         </span>
         <button 
            className='restart-game' 
            onClick={() => {
               if (gameMode === 'Cricket') {
                  handleRestartGameCricket(gameType, playerNames, isGameEnd, dispatch)
               } else {
                  handleRestartGameClassic(gameType, playerNames, gameMode, isGameEnd, dispatch)  
               }
            }}
         >
            <Image 
               src='restart.svg' 
               alt='Restart game icon' 
               width={16} 
               height={16}
               title='Restart game: Ctrl + Alt + R' 
            />
         </button>
      </div>
   )
}

export default NavigationPanel
