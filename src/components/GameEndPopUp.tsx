import React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
//Redux
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { setIsGameEnd as setIsGameEndClassic } from '@/redux/slices/game-classic/gameClassicSlice'
import { setIsGameEnd as setIsGameEndCricket } from '@/redux/slices/game-cricket/gameCricketSlice'
import { selectDataInKeyboardButtonsOrGameEndPopUp } from '@/redux/memoizedSelectors'
//Controllers
import { handleRestartGameClassic } from '@/controllers/game-classic/handleRestartGameClassic'
import { handleRestartGameCricket } from '@/controllers/game-cricket/handleRestartGameCricket'
import { handleUndo } from '@/controllers/game-classic/handleUndo'
import { handleUndoCricket } from '@/controllers/game-cricket/handleUndoCricket'
import { HistoryEntryClassicSingle, HistoryEntryClassicTeams, HistoryEntryCricketSingle, HistoryEntryCricketTeams, PlayerClassic, PlayerCricket, TeamClassic, TeamCricket } from '@/types/types'
 

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
                        if (gameMode === 'Cricket') {
                           handleRestartGameCricket(gameType, playerNames, isGameEnd, dispatch)
                        } else {
                           handleRestartGameClassic(gameType, playerNames, gameMode, isGameEnd, dispatch)  
                        }
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
                        if (gameMode === 'Cricket'){
                           handleUndoCricket(gameType, playersOrTeams as PlayerCricket[] | TeamCricket[], history as HistoryEntryCricketSingle[] | HistoryEntryCricketTeams[], currentPlayerThrowsCount, dispatch); dispatch(setIsGameEndCricket(false))
                        } else {
                           handleUndo(gameType, playersOrTeams as PlayerClassic[] | TeamClassic[], index, history as HistoryEntryClassicSingle[] | HistoryEntryClassicTeams[], showNumberButtons, throwValueSum, currentPlayerThrows, currentPlayerThrowsCount, gameMode, dispatch); dispatch(setIsGameEndClassic(false))
                        }
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