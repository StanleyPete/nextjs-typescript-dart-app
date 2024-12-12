import React from 'react'
import Image from 'next/image'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { 
   setCurrentThrow,  
   setThrowValueSum,  
   setCurrentPlayerThrowsCount, 
   setCurrentPlayerThrows,  
   setMultiplier, 
   setIsDoubleActive 
} from '@/redux/slices/gameClassicSlice'
import { setPlayers } from '@/redux/slices/gameClassicSingleSlice'
import { setTeams }from '@/redux/slices/gameClassicTeamsSlice'
import { handleThrowValueChange } from '@/controllers/handleThrowValueChange'
import { handleSubmitThrowKeyboardButtons } from '@/controllers/handleSubmitThrowKeyboardButtons'
import { 
   handleSubmitThrowSubmitScoreButtonRegular, 
   handleSubmitThrowSubmitScoreButtonTeams 
} from '@/controllers/handleSubmitThrowSubmitScoreButton'
import { 
   ThrowValueSectionComponentSelectorTypes, 
   PlayerClassic, 
   TeamClassic, 
   HistoryEntryClassicSingle, 
   HistoryEntryClassicTeams 
} from '@/types/types'

const ThrowValueSection = () => {
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
      currentThrow,
      currentPlayerThrowsCount,
      currentPlayerThrows,
      multiplier,
      isDoubleActive,
      isSoundEnabled,
   } = useSelector((state: RootState) => state.gameClassic)

   const { 
      playersOrTeams, 
      index, 
      currentPlayerIndexInTeam, 
      history 
   } = useSelector<RootState, ThrowValueSectionComponentSelectorTypes>((state) => {
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
         history: [],
      }
   })
   
   return (
      <>
         <div className="throw-value-section">

            {/* Toggle between input and number buttons */}
            <button 
               className={`input-toggle ${showNumberButtons ? 'buttons-active' : 'input-active'}`}
               onClick={() => {
                  //Resetting values when toggle button clicked
                  const gamePlayersOrTeams = JSON.parse(JSON.stringify(playersOrTeams))
                  const currentPlayerOrTeam = gamePlayersOrTeams[index]
                  if (currentPlayerThrowsCount > 0) {
          
                     //Resetting pointsLeft and totalThrows values
                     currentPlayerOrTeam.pointsLeft += throwValueSum
                     currentPlayerOrTeam.totalThrows -= throwValueSum
          
                     //Resetting throwValueSum, currentPlayerThrows and currentPlayersThrowsCount states
                     dispatch(setThrowValueSum(0))
                     dispatch(setCurrentPlayerThrows([]))
                     dispatch(setCurrentPlayerThrowsCount(0))         
                   
                     //Switching isInputPreffered
                     currentPlayerOrTeam.isInputPreffered = !currentPlayerOrTeam.isInputPreffered

                     //Updating player's state
                     dispatch(gameType === 'single' 
                        ? setPlayers(gamePlayersOrTeams) 
                        : setTeams(gamePlayersOrTeams))
                  }}
               }>
               {showNumberButtons ? 'Input' : 'Buttons'}
            </button>
       
            {/* Score input + remove-last value button*/}
            {!showNumberButtons && (
               <div className='score-input-section'>
                  <input
                     type="number"
                     value={currentThrow}
                     onChange={(e) => handleThrowValueChange(e.target.value, dispatch)}
                  />
                  <button 
                     className='remove-last'
                     onClick={() => {
                        const newValue = String(currentThrow).slice(0, -1)
                        dispatch(setCurrentThrow(newValue ? Number(newValue) : 0))
                        
                     }}
                  >
                     <Image 
                        src='/backspace.svg' 
                        alt='Remove last throw icon' 
                        width={24} 
                        height={24} 
                     />
                  </button>
               </div>
            )}

            {/* Throw details*/}
            {showNumberButtons && (
               <div className="current-player-throws">
                  {Array.from({ length: 3 }, (_, i) => (
                     <div className='current-throw' key={i}>
                        {currentPlayerThrows[i] !== undefined ? currentPlayerThrows[i] : '-'}
                     </div>
                  ))}
               </div>
            )}

            {/* Submit score button*/}
            <button 
               className='submit-score' 
               onClick={() => {
                  if (!showNumberButtons) {
                     const multiplierNumber = isDoubleActive ? 2 : 1
                     handleSubmitThrowKeyboardButtons(
                        gameType,
                        playersOrTeams as PlayerClassic[],
                        index,
                        currentPlayerIndexInTeam as number,
                        startIndex,
                        history as HistoryEntryClassicSingle[],
                        currentThrow,
                        multiplierNumber,
                        gameMode,
                        numberOfLegs,
                        gameWin,
                        isSoundEnabled,
                        isDoubleActive,
                        dispatch
                     ) 
                  } else {
                     if (gameType === 'single'){
                        handleSubmitThrowSubmitScoreButtonRegular(
                           playersOrTeams as PlayerClassic[],
                           index,
                           currentPlayerThrows,
                           history as HistoryEntryClassicSingle[],
                           isSoundEnabled,
                           dispatch
                        )
                     } else {
                        handleSubmitThrowSubmitScoreButtonTeams(
                           playersOrTeams as TeamClassic[],
                           index,
                           currentPlayerIndexInTeam as number,
                           currentPlayerThrows,
                           history as HistoryEntryClassicTeams[],
                           isSoundEnabled,
                           dispatch

                        )
                     }
                  }
               }}>
                  Submit Score
            </button>
         </div>
    
         {/* Multiplier section*/}
         <div className='multiplier-section'>
            {!showNumberButtons ? (
               playersOrTeams[index].pointsLeft <= 40 && playersOrTeams[index].pointsLeft % 2 === 0 && (
                  <button 
                     onClick={() => dispatch(setIsDoubleActive(!isDoubleActive))} 
                     className={isDoubleActive ? 'active' : ''}
                  >
                     Double
                  </button>
               )
            ) : (
               <div className="multiplier-buttons">
                  { [1, 2, 3].map((multiplierValue) => (
                     <button
                        key={multiplierValue}
                        onClick={() => dispatch(setMultiplier(multiplierValue))}
                        className={multiplier === multiplierValue ? 'active' : ''}
                     >
                        {multiplierValue === 1 ? 'Single' : multiplierValue === 2 ? 'Double' : 'Triple'}
                     </button>
                  ))}
               </div>
            )}
         </div>

      </>
   )
}

export default ThrowValueSection