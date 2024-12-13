import React from 'react'
//Redux
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
//Controllers
import { handleUndo } from '@/controllers/handleUndo'
import { handleSubmitThrowNumberButtons } from '@/controllers/handleSubmitThrowNumberButtons'
//Types
import { 
   NumberButtonsComponentSelectorTypes, 
   HistoryEntryClassicSingle, 
   HistoryEntryClassicTeams
} from '@/types/types'

const NumberButtons = () => {
   const dispatch = useDispatch()

   const {  
      gameType,
      gameMode,
      numberOfLegs,
      gameWin 
   } = useSelector((state: RootState) => state.gameSettings)

   const {  
      startIndex,
      showNumberButtons, 
      throwValueSum, 
      currentPlayerThrowsCount,
      currentPlayerThrows, 
      multiplier, 
      isSoundEnabled 
   } = useSelector((state: RootState) => state.gameClassic)

   const { 
      playersOrTeams,
      index,
      currentPlayerIndexInTeam,
      history 
   } = useSelector<RootState, NumberButtonsComponentSelectorTypes>((state) => {
      if (gameType === 'single') return {
         playersOrTeams: state.gameClassicSingle.players,
         index: state.gameClassicSingle.currentPlayerIndex,
         currentPlayerIndexInTeam: undefined,   
         history: state.gameClassicSingle.historyClassicSingle,
      }

      if (gameType === 'teams') return {
         playersOrTeams: state.gameClassicTeams.teams,
         index: state.gameClassicTeams.currentTeamIndex,
         currentPlayerIndexInTeam: state.gameClassicTeams.currentPlayerIndexInTeam,
         history: state.gameClassicTeams.historyClassicTeams,
      }

      return {
         playersOrTeams: [],
         index: 0,
         currentPlayerIndexInTeam: undefined,
         history: []
      }

   })

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
                     handleSubmitThrowNumberButtons(
                        gameType,
                        baseValue,
                        playersOrTeams,
                        index,
                        gameType === 'teams' ? currentPlayerIndexInTeam! : 0,
                        startIndex,
                        history as HistoryEntryClassicSingle[] | HistoryEntryClassicTeams[],
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
                  handleSubmitThrowNumberButtons(
                     gameType,
                     multiplier === 2 ? value / 2 : multiplier === 3 ? value / 3 : value,
                     playersOrTeams,
                     index,
                     gameType === 'teams' ? currentPlayerIndexInTeam! : 0,
                     startIndex,
                     history as HistoryEntryClassicSingle[] | HistoryEntryClassicTeams[],
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
               }}
            >
               {label}
            </button>
         ))}
         <button 
            onClick={() => {
               handleUndo(
                  gameType,
                  playersOrTeams, 
                  index, 
                  history as HistoryEntryClassicSingle[] | HistoryEntryClassicTeams[], 
                  showNumberButtons, 
                  throwValueSum, 
                  currentPlayerThrows, 
                  currentPlayerThrowsCount, 
                  gameMode, 
                  dispatch
               )
            }}
         >
            Undo
         </button>
      </div>
   )
}

export default NumberButtons