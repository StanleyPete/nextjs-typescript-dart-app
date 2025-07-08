import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { setIsGameEnd } from '@/redux/slices/gameSlice'
import { selectDataInKeyboardButtonsAndGameEndPopUp } from '@/redux/selectors/game-classic/selectDataInKeyboardButtonsAndGameEndPopUp'
import { handleRestartGameClassic } from '@/controllers/game-classic/handleRestartGameClassic'
import { handleUndoClassic } from '@/controllers/game-classic/handleUndoClassic'
import { setBackFromGame } from '@/redux/slices/gameSettingsSlice'

const GameEndPopUp = () => {
   const dispatch = useDispatch()
   const router = useRouter()
   const [focusedButton, setFocusedButton] = useState<string| null>('play-again')
   const gameType = useSelector((state: RootState) => state.gameSettings.gameType)
   const gameMode = useSelector((state: RootState) => state.gameSettings.gameMode)
   const playerNames = useSelector((state: RootState) => state.gameSettings.playerNames)
   const currentPlayerThrows = useSelector((state: RootState) => state.game?.currentPlayerThrows ?? [])
   const currentPlayerThrowsCount = useSelector((state: RootState) => state.game?.currentPlayerThrowsCount ?? 0)
   const isGameEnd = useSelector((state: RootState) => state.game?.isGameEnd ?? false)
   const winner = useSelector((state: RootState) => state.game?.winner ?? null)
   const showNumberButtons = useSelector((state: RootState) => state.gameClassic?.showNumberButtons ?? false)
   const throwValueSum = useSelector((state: RootState) => state.gameClassic?.throwValueSum ?? 0)

   //Memoized (@/redux/memoizedSelectors.ts):
   const { playersOrTeams, index, history } = useSelector(selectDataInKeyboardButtonsAndGameEndPopUp)
   

   useEffect(() => {
      if (!isGameEnd) return
      const handleKeyDown = (event: KeyboardEvent) => {
         const buttonOptions = ['play-again', 'go-back', 'undo']
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
               handleRestartGameClassic(gameType, playerNames, gameMode, isGameEnd, dispatch)
            } else if (focusedButton === 'go-back') {
               dispatch(setBackFromGame(true))
               router.replace('/')
            } else if (focusedButton === 'undo') {
               handleUndoClassic(gameType, playersOrTeams, index, history, showNumberButtons, throwValueSum, currentPlayerThrows, currentPlayerThrowsCount, gameMode, dispatch); dispatch(setIsGameEnd(false))
            }
         }
   
      }
   
      window.addEventListener('keydown', handleKeyDown)
   
      return () => { window.removeEventListener('keydown', handleKeyDown) }
   }, [focusedButton, isGameEnd])

   useEffect(() => {
      setFocusedButton('play-again')
   }, [isGameEnd])


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
                  <h3>Winner: {winner?.name}</h3>
                  <button 
                     className={`play-again ${focusedButton === 'play-again' ? 'focused' : ''} `} 
                     onClick={() => { handleRestartGameClassic(gameType, playerNames, gameMode, isGameEnd, dispatch) }}
                  >
                     Play Again
                  </button>
                  <button 
                     className={`go-back ${focusedButton === 'go-back' ? 'focused' : ''} `}  
                     onClick={() => {
                        dispatch(setBackFromGame(true))
                        router.replace('/')
                     }}
                  >
                     Home page
                  </button>
                  <button 
                     className={`undo ${focusedButton === 'undo' ? 'focused' : ''} `} 
                     onClick={() => {
                        handleUndoClassic(gameType, playersOrTeams, index, history, showNumberButtons, throwValueSum, currentPlayerThrows, currentPlayerThrowsCount, gameMode, dispatch); dispatch(setIsGameEnd(false))
                     }}
                  > 
                     Undo
                  </button>
               </div>
            </div>
         </div>
      )
   )
}

export default GameEndPopUp