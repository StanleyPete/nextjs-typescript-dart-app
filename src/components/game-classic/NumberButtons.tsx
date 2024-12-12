import React from 'react'
import { handleUndoRegular, handleUndoRegularTeams } from '@/controllers/handleUndo'
import { handleSubmitThrowNumberButtonsRegular, handleSubmitThrowNumberButtonsTeams } from '@/controllers/handleSubmitThrowNumberButtons'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { GameContextProps, HistoryEntry, HistoryEntryTeams, NumberButtonsType, Team } from '@/types/types'

const NumberButtons: React.FC<GameContextProps> = ({ context }) => {
   const dispatch = useDispatch()

   const {  
      gameType,
      gameMode,
      numberOfLegs,
      gameWin 
   } = useSelector((state: RootState) => state.gameSettings)

   const { 
      playersOrTeams,
      history,
      index,
      currentPlayerIndexInTeam,
      startIndex,
      showNumberButtons, 
      throwValueSum, 
      currentPlayerThrowsCount,
      currentPlayerThrows, 
      multiplier, 
      isSoundEnabled, 
   } = useSelector<RootState, NumberButtonsType>((state) => 
      context === 'gameRegular' 
         ? {
            playersOrTeams: state.gameRegular.players,
            history: state.gameRegular.history,
            index: state.gameRegular.currentPlayerIndex,
            currentPlayerIndexInTeam: undefined,
            startIndex: state.gameRegular.startPlayerIndex,
            showNumberButtons: state.gameRegular.showNumberButtons,
            throwValueSum: state.gameRegular.throwValueSum,
            currentPlayerThrowsCount: state.gameRegular.currentPlayerThrowsCount,
            currentPlayerThrows: state.gameRegular.currentPlayerThrows,
            multiplier: state.gameRegular.multiplier,
            isSoundEnabled: state.gameRegular.isSoundEnabled
          
         }
         : {
            playersOrTeams: state.gameRegularTeams.teams,
            history: state.gameRegularTeams.history,
            index: state.gameRegularTeams.currentPlayerIndex,
            currentPlayerIndexInTeam: state.gameRegularTeams.currentPlayerIndexInTeam,
            startIndex: state.gameRegularTeams.startTeamIndex,
            showNumberButtons: state.gameRegularTeams.showNumberButtons,
            throwValueSum: state.gameRegularTeams.throwValueSum,
            currentPlayerThrowsCount: state.gameRegularTeams.currentPlayerThrowsCount,
            currentPlayerThrows: state.gameRegularTeams.currentPlayerThrows,
            multiplier: state.gameRegularTeams.multiplier,
            isSoundEnabled: state.gameRegularTeams.isSoundEnabled
         }
   )

   const specialButtons = [
      { label: 'Bull (50)', value: 50 },
      { label: 'Outer (25)', value: 25 },
      { label: 'Miss', value: 0 },
   ]

   
   return (
      <div className='score-buttons'>
         {/* Score buttons */}
         {Array.from({ length: 20 }, (_, i) => {
            const baseValue = i + 1
            const displayValue = multiplier > 1 ? baseValue * multiplier : null

            return (
               <button 
                  key={baseValue} 
                  onClick={() => {
                     if(context === 'gameRegular'){
                        handleSubmitThrowNumberButtonsRegular(
                           baseValue,
                           playersOrTeams,
                           index,
                           startIndex,
                           history as HistoryEntry[],
                           throwValueSum,
                           currentPlayerThrowsCount,
                           currentPlayerThrows,
                           multiplier,
                           gameMode,
                           numberOfLegs,
                           gameWin,
                           isSoundEnabled,
                           dispatch
                        )
                     } else {
                        handleSubmitThrowNumberButtonsTeams(
                           baseValue,
                           playersOrTeams as Team[],
                           index,
                           currentPlayerIndexInTeam as number,
                           startIndex,
                           history as HistoryEntryTeams[],
                           throwValueSum,
                           currentPlayerThrowsCount,
                           currentPlayerThrows,
                           multiplier,
                           gameMode,
                           numberOfLegs,
                           gameWin,
                           isSoundEnabled,
                           dispatch
                        )
                     }
                  }}
               >
                  <span className="base-value">{baseValue}</span>
                  {displayValue && <span className="multiplied-value">({displayValue})</span>}
               </button>
            )
         })}

         {/* Bull, Outer, Miss and Undo buttons */}
         {specialButtons.map(({ label, value }) => (
            <button 
               key={label} 
               onClick={() => {
                  if(context === 'gameRegular'){
                     handleSubmitThrowNumberButtonsRegular(
                        multiplier === 2 ? value / 2 : multiplier === 3 ? value / 3 : value,
                        playersOrTeams,
                        index,
                        startIndex,
                        history as HistoryEntry[],
                        throwValueSum,
                        currentPlayerThrowsCount,
                        currentPlayerThrows,
                        multiplier,
                        gameMode,
                        numberOfLegs,
                        gameWin,
                        isSoundEnabled,
                        dispatch
                     )
                  } else {
                     handleSubmitThrowNumberButtonsTeams(
                        multiplier === 2 ? value / 2 : multiplier === 3 ? value / 3 : value,
                        playersOrTeams as Team[],
                        index,
                        currentPlayerIndexInTeam as number,
                        startIndex,
                        history as HistoryEntryTeams[],
                        throwValueSum,
                        currentPlayerThrowsCount,
                        currentPlayerThrows,
                        multiplier,
                        gameMode,
                        numberOfLegs,
                        gameWin,
                        isSoundEnabled,
                        dispatch
                     )
                  }
               }}
            >
               {label}
            </button>
         ))}
         <button 
            onClick={() => {
               if(context === 'gameRegular'){
                  handleUndoRegular(
                     playersOrTeams, 
                     index, 
                     history as HistoryEntry[], 
                     showNumberButtons, 
                     throwValueSum, 
                     currentPlayerThrows, 
                     currentPlayerThrowsCount, 
                     gameMode, 
                     dispatch
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
                     gameMode, 
                     dispatch
                  )
               }
            }}
         >
               Undo
         </button>
      </div>
   )
}

export default NumberButtons