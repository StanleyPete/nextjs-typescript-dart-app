import React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
//Redux
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { setIsGameEnd } from '@/redux/slices/game-classic/gameClassicSlice'
import { initializePlayers } from '@/redux/slices/game-classic/gameClassicSingleSlice'
import { initializeTeams } from '@/redux/slices/game-classic/gameClassicTeamsSlice'
import { selectDataInKeyboardButtonsOrGameEndPopUp } from '@/redux/memoizedSelectors'
//Controllers
import { handleRestartGame } from '@/controllers/handleRestartGame'
import { handleUndo } from '@/controllers/handleUndo'
 

const GameEndPopUp = () => {
   const dispatch = useDispatch()
   const router = useRouter()
   const { gameType, gameMode, playerNames } = useSelector((state: RootState) => state.gameSettings)
   const { 
      showNumberButtons, 
      throwValueSum, 
      currentPlayerThrows, 
      currentPlayerThrowsCount, 
      isGameEnd, 
      winner 
   } = useSelector((state: RootState) => state.gameClassic)
   //Memoized (@/redux/memoizedSelectors.ts):
   const { 
      playersOrTeams, 
      index, 
      history, 
   } = useSelector(selectDataInKeyboardButtonsOrGameEndPopUp)
   
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
                     className='play-again' 
                     onClick={() => {
                        handleRestartGame(
                           gameType,
                           playerNames, 
                           gameMode, 
                           isGameEnd, 
                           gameType === 'single' ? initializePlayers : initializeTeams,
                           dispatch, 
                        )
                     }}
                  >
                     Play Again
                  </button>
                  <button 
                     className='go-back' 
                     onClick={() => router.back()}>
                        Back to Settings
                  </button>
                  <button 
                     className='undo' 
                     onClick={() => {
                        handleUndo(
                           gameType,
                           playersOrTeams, 
                           index, 
                           history, 
                           showNumberButtons, 
                           throwValueSum,
                           currentPlayerThrows, 
                           currentPlayerThrowsCount, 
                           gameMode, 
                           dispatch 
                        ); dispatch(setIsGameEnd(false))
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