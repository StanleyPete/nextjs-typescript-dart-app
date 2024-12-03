import React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { handleRestartGame } from '@/lib/handleRestartGame'
import { handleUndoRegular, handleUndoRegularTeams } from '@/lib/handleUndo'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { 
   setIsGameEnd as setIsGameEndRegular, 
   HistoryEntry, 
   Player
} from '@/redux/slices/gameRegularSlice'
import { 
   setIsGameEnd as setIsGameEndTeams, 
   HistoryEntry as HistoryEntryTeams, 
   Team 
} from '@/redux/slices/gameRegularTeamsSlice'

interface GameEmdPopUpProps {
   context: 'gameRegular' | 'gameRegularTeams'
}

type GameData = {
   playersOrTeams: Player[] | Team[]
   history: HistoryEntry[] | HistoryEntryTeams[]
   index: number
   showNumberButtons: boolean
   throwValueSum: number
   currentPlayerThrowsCount: number
   currentPlayerThrows: number[]
   isGameEnd: boolean
   winner: Player | Team | null
}

const GameEndPopUp: React.FC<GameEmdPopUpProps> = ({ context }) => {
   const dispatch = useDispatch()
   const router = useRouter()

   const { gameMode } = useSelector((state: RootState) => state.gameSettings)

   const { 
      playersOrTeams,
      history, 
      index,
      showNumberButtons, 
      throwValueSum, 
      currentPlayerThrowsCount, 
      currentPlayerThrows, 
      isGameEnd,
      winner 
   } = useSelector<RootState, GameData>((state) => {
      if (context === 'gameRegular') {
         return {
            playersOrTeams: state.gameRegular.players,
            history: state.gameRegular.history,
            index: state.gameRegular.currentPlayerIndex,
            showNumberButtons: state.gameRegular.showNumberButtons,
            throwValueSum: state.gameRegular.throwValueSum,
            currentPlayerThrowsCount: state.gameRegular.currentPlayerThrowsCount,
            currentPlayerThrows: state.gameRegular.currentPlayerThrows,
            isGameEnd: state.gameRegular.isGameEnd,
            winner: state.gameRegular.winner  
         }
      }

      if (context === 'gameRegularTeams') {
         return {
            playersOrTeams: state.gameRegularTeams.teams,
            history: state.gameRegularTeams.history,
            index: state.gameRegularTeams.currentPlayerIndex,
            showNumberButtons: state.gameRegularTeams.showNumberButtons,
            throwValueSum: state.gameRegularTeams.throwValueSum,
            currentPlayerThrowsCount: state.gameRegularTeams.currentPlayerThrowsCount,
            currentPlayerThrows: state.gameRegularTeams.currentPlayerThrows,
            isGameEnd: state.gameRegularTeams.isGameEnd,
            winner: state.gameRegularTeams.winner  
         }
      }

      throw new Error('Invalid context')
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
                        handleRestartGame(dispatch, playersOrTeams, gameMode, isGameEnd)
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
                              dispatch, 
                              history as HistoryEntry[], 
                              playersOrTeams as Player[], 
                              gameMode, 
                              showNumberButtons, 
                              currentPlayerThrowsCount, 
                              currentPlayerThrows, 
                              index, 
                              throwValueSum
                           ); dispatch(setIsGameEndRegular(false))
                        } else {
                           handleUndoRegularTeams(
                              dispatch, 
                              history as HistoryEntryTeams[], 
                              playersOrTeams as Team[], 
                              gameMode, 
                              showNumberButtons, 
                              currentPlayerThrowsCount, 
                              currentPlayerThrows, 
                              index, 
                              throwValueSum
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