import React from 'react'
import { handleUndoRegular, handleUndoRegularTeams } from '@/controllers/handleUndo'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setCurrentThrow, } from '@/redux/slices/gameClassicSingleSlice'
import { setCurrentThrow as setCurrentThrowTeams, } from '@/redux/slices/gameClassicTeamsSlice'
import { GameContextProps, HistoryEntry, KeyboardButtonsType, Player, Team, HistoryEntryTeams } from '@/types/types'

const KeyboardButtons: React.FC<GameContextProps> = ({ context }) => {
   const dispatch = useDispatch()

   const gameMode = useSelector((state: RootState) => state.gameSettings)

   const { 
      playersOrTeams, 
      index, 
      history, 
      showNumberButtons, 
      currentThrow, 
      throwValueSum, 
      currentPlayerThrowsCount, 
      currentPlayerThrows, 
    
   } = useSelector<RootState, KeyboardButtonsType>((state) => 
      context === 'gameRegular' 
         ? {
            playersOrTeams: state.gameRegular.players,
            index: state.gameRegular.currentPlayerIndex,
            currentPlayerIndexInTeam: undefined,
            history: state.gameRegular.history,
            showNumberButtons: state.gameRegular.showNumberButtons,
            currentThrow: state.gameRegular.currentThrow,
            throwValueSum: state.gameRegular.throwValueSum,
            currentPlayerThrowsCount: state.gameRegular.currentPlayerThrowsCount,
            currentPlayerThrows: state.gameRegular.currentPlayerThrows,
         }
         : {
            playersOrTeams: state.gameRegularTeams.teams,
            index: state.gameRegularTeams.currentPlayerIndex,
            currentPlayerIndexInTeam: state.gameRegularTeams.currentPlayerIndexInTeam,
            history: state.gameRegularTeams.history,
            showNumberButtons: state.gameRegularTeams.showNumberButtons,
            currentThrow: state.gameRegularTeams.currentThrow,
            throwValueSum: state.gameRegularTeams.throwValueSum,
            currentPlayerThrowsCount: state.gameRegularTeams.currentPlayerThrowsCount,
            currentPlayerThrows: state.gameRegularTeams.currentPlayerThrows,
         }
   )

   return (
      <div className='score-input'>
         {/* Buttons 0-9 */}
         {Array.from({ length: 9 }, (_, i) => (
            <button 
               key={i} 
               onClick={() => {
                  const newValue = Number(`${currentThrow}${i+1}`)
                  dispatch(context === 'gameRegular'
                     ? setCurrentThrow(newValue)
                     : setCurrentThrowTeams(newValue)
                  )
               }}
            >
               {i+1}
            </button>
         ))}
         <button 
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
                     gameMode as unknown as number | string, 
                     dispatch, 
                  )
               } else {
                  handleUndoRegularTeams(
                     playersOrTeams as Team[], 
                     index, 
                     history as HistoryEntryTeams[], 
                     showNumberButtons, 
                     throwValueSum,
                     currentPlayerThrows, 
                     currentPlayerThrowsCount, 
                     gameMode as unknown as number | string, 
                     dispatch, 
                  )
               }
            }}>
                   Undo
         </button>
         <button
            onClick={() => {
               const newValue = Number(`${currentThrow}${0}`)
               dispatch(context === 'gameRegular'
                  ? setCurrentThrow(newValue)
                  : setCurrentThrowTeams(newValue)
               )
            }}>
                   0
         </button>
      </div>
   )
}

export default KeyboardButtons