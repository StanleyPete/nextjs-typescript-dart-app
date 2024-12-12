import React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { handleRestartGameRegular, handleRestartGameRegularTeams } from '@/controllers/handleRestartGame'
import { handleUndoRegular, handleUndoRegularTeams } from '@/controllers/handleUndo'
import { RootState } from '@/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { setIsGameEnd as setIsGameEndRegular, initializePlayers } from '@/redux/slices/gameClassicSingleSlice'
import { setIsGameEnd as setIsGameEndTeams, initializeTeams } from '@/redux/slices/gameClassicTeamsSlice'
import { GameContextProps } from '@/types/types'
import { Player, Team, HistoryEntry, HistoryEntryTeams, GameData } from '@/types/types' 

const GameEndPopUp: React.FC<GameContextProps> = ({ context }) => {
   const dispatch = useDispatch()
   const router = useRouter()

   const { gameMode, playerNames } = useSelector((state: RootState) => state.gameSettings)

   const { 
      playersOrTeams, 
      index, 
      history, 
      showNumberButtons, 
      throwValueSum, 
      currentPlayerThrows, 
      currentPlayerThrowsCount, 
      isGameEnd, 
      winner 
   } = useSelector<RootState, GameData>((state) => 
      context === 'gameRegular' 
         ? {
            playersOrTeams: state.gameRegular.players,
            index: state.gameRegular.currentPlayerIndex,
            history: state.gameRegular.history,
            showNumberButtons: state.gameRegular.showNumberButtons,
            throwValueSum: state.gameRegular.throwValueSum,
            currentPlayerThrows: state.gameRegular.currentPlayerThrows,
            currentPlayerThrowsCount: state.gameRegular.currentPlayerThrowsCount,
            isGameEnd: state.gameRegular.isGameEnd,
            winner: state.gameRegular.winner
         }
         : {
            playersOrTeams: state.gameRegularTeams.teams,
            index: state.gameRegularTeams.currentPlayerIndex,
            history: state.gameRegularTeams.history,
            showNumberButtons: state.gameRegularTeams.showNumberButtons,
            throwValueSum: state.gameRegularTeams.throwValueSum,
            currentPlayerThrows: state.gameRegularTeams.currentPlayerThrows,
            currentPlayerThrowsCount: state.gameRegularTeams.currentPlayerThrowsCount,
            isGameEnd: state.gameRegularTeams.isGameEnd,
            winner: state.gameRegularTeams.winner
         }
   )
   
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
                        if(context === 'gameRegular'){
                           handleRestartGameRegular(
                              playerNames, 
                              gameMode, 
                              isGameEnd, 
                              initializePlayers,
                              dispatch, 
                           )
                        } else {
                           handleRestartGameRegularTeams(
                              playerNames,
                              gameMode,
                              isGameEnd,
                              initializeTeams,
                              dispatch
                           )
                        }
                     }}>
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
                        if(context === 'gameRegular'){
                           handleUndoRegular(
                              playersOrTeams as Player[], 
                              index, 
                              history as HistoryEntry[], 
                              showNumberButtons, 
                              throwValueSum,
                              currentPlayerThrows, 
                              currentPlayerThrowsCount, 
                              gameMode, 
                              dispatch 
                           ); dispatch(setIsGameEndRegular(false))
                        } else {
                           handleUndoRegularTeams(
                              playersOrTeams as Team[], 
                              index, 
                              history as HistoryEntryTeams[], 
                              showNumberButtons, 
                              throwValueSum,
                              currentPlayerThrows, 
                              currentPlayerThrowsCount, 
                              gameMode, 
                              dispatch 
                           ); dispatch(setIsGameEndTeams(false))
                        }}}> 
                        Undo
                  </button>
               </div>
            </div>
         </div>
      )
   )
}

export default GameEndPopUp