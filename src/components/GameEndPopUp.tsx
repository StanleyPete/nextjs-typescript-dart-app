import React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
//Redux
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { setIsGameEnd } from '@/redux/slices/gameClassicSlice'
import { initializePlayers } from '@/redux/slices/gameClassicSingleSlice'
import { initializeTeams } from '@/redux/slices/gameClassicTeamsSlice'
//Controllers
import { handleRestartGame } from '@/controllers/handleRestartGame'
import { handleUndo } from '@/controllers/handleUndo'
//Types
import { GameEndPopUpComponentSelectorTypes } from '@/types/types' 

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
   
   const { 
      playersOrTeams, 
      index, 
      history, 
   } = useSelector<RootState, GameEndPopUpComponentSelectorTypes>((state) => {
      if (gameType === 'single') return {
         playersOrTeams: state.gameClassicSingle.players,
         index: state.gameClassicSingle.currentPlayerIndex,
         history: state.gameClassicSingle.historyClassicSingle,
      } 

      if (gameType === 'teams') return {
         playersOrTeams: state.gameClassicTeams.teams,
         index: state.gameClassicTeams.currentTeamIndex,
         history: state.gameClassicTeams.historyClassicTeams,
      }

      return {
         playersOrTeams: [],
         index: 0,
         history: []
      }    
   })
   
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