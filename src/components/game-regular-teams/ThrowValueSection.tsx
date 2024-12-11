import React from 'react'
import Image from 'next/image'
import { handleThrowChangeRegular, handleThrowChangeTeams } from '@/controllers/handleThrowChange'
import { 
   handleSubmitThrowKeyboardButtonsRegular, 
   handleSubmitThrowKeyboardButtonsTeams 
} from '@/controllers/handleSubmitThrowKeyboardButtons'
import { 
   handleSubmitThrowSubmitScoreButtonRegular, 
   handleSubmitThrowSubmitScoreButtonTeams 
} from '@/controllers/handleSubmitThrowSubmitScoreButton'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { 
   setPlayers, 
   setCurrentThrow,  
   setThrowValueSum, 
   setCurrentPlayerThrowsCount, 
   setCurrentPlayerThrows, 
   setMultiplier, 
   setIsDoubleActive,  
} from '@/redux/slices/gameRegularSlice'
import { 
   setTeams, 
   setCurrentThrow as setCurrentThrowTeams,  
   setThrowValueSum as setThrowValueSumTeams, 
   setCurrentPlayerThrowsCount as setCurrentPlayerThrowsCountTeams, 
   setCurrentPlayerThrows as setCurrentPlayerThrowsTeams, 
   setMultiplier as setMultiplierTeams, 
   setIsDoubleActive as setIsDoubleActiveTeams,  
} from '@/redux/slices/gameRegularTeamsSlice'
import { GameContextProps, HistoryEntryTeams, ThrowValueSectionType, HistoryEntry, Player, Team } from '@/types/types'

const ThrowValueSection: React.FC<GameContextProps> = ({ context }) => {
   const dispatch = useDispatch()

   const {  
      gameMode,
      numberOfLegs,
      gameWin 
   } = useSelector((state: RootState) => state.gameSettings)

   const { 
      playersOrTeams, 
      index,
      currentPlayerIndexInTeam, 
      startIndex, 
      history, 
      showNumberButtons, 
      throwValueSum, 
      currentThrow, 
      currentPlayerThrowsCount, 
      currentPlayerThrows, 
      multiplier, 
      isDoubleActive, 
      isSoundEnabled, 
   } = useSelector<RootState, ThrowValueSectionType>((state) => 
      context === 'gameRegular' 
         ? {
            playersOrTeams: state.gameRegular.players,
            index: state.gameRegular.currentPlayerIndex,
            currentPlayerIndexInTeam: undefined,
            startIndex: state. gameRegular.startPlayerIndex,
            history: state.gameRegular.history,
            showNumberButtons: state.gameRegular.showNumberButtons,
            throwValueSum: state.gameRegular.throwValueSum,
            currentThrow: state.gameRegular.currentThrow,
            currentPlayerThrowsCount: state.gameRegular.currentPlayerThrowsCount,
            currentPlayerThrows: state.gameRegular.currentPlayerThrows,
            multiplier: state.gameRegular.multiplier,
            isDoubleActive: state.gameRegular.isDoubleActive,
            isSoundEnabled: state.gameRegular.isSoundEnabled
          
         }
         : {
            playersOrTeams: state.gameRegularTeams.teams,
            index: state.gameRegularTeams.currentTeamIndex,
            currentPlayerIndexInTeam: state.gameRegularTeams.currentPlayerIndexInTeam,
            startIndex: state. gameRegularTeams.startTeamIndex,
            history: state.gameRegularTeams.history,
            showNumberButtons: state.gameRegularTeams.showNumberButtons,
            throwValueSum: state.gameRegularTeams.throwValueSum,
            currentThrow: state.gameRegularTeams.currentThrow,
            currentPlayerThrowsCount: state.gameRegularTeams.currentPlayerThrowsCount,
            currentPlayerThrows: state.gameRegularTeams.currentPlayerThrows,
            multiplier: state.gameRegularTeams.multiplier,
            isDoubleActive: state.gameRegularTeams.isDoubleActive,
            isSoundEnabled: state.gameRegularTeams.isSoundEnabled
         }
   )


   return (
      <>
         {/*Current throws section:*/}
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
                     if(context === 'gameRegular'){
                        dispatch(setThrowValueSum(0))
                        dispatch(setCurrentPlayerThrows([]))
                        dispatch(setCurrentPlayerThrowsCount(0))         
                     } else {
                        dispatch(setThrowValueSumTeams(0))
                        dispatch(setCurrentPlayerThrowsTeams([]))
                        dispatch(setCurrentPlayerThrowsCountTeams(0))  
                     }
                  }
             
                  //Switching isInputPreffered
                  currentPlayerOrTeam.isInputPreffered = !currentPlayerOrTeam.isInputPreffered

                  //Updating player's state
                  dispatch(context === 'gameRegular' 
                     ? setPlayers(gamePlayersOrTeams) 
                     : setTeams(gamePlayersOrTeams))
               }}
            >
               {showNumberButtons ? 'Input' : 'Buttons'}
            </button>
       
            {/* Score input + remove-last value button*/}
            {!showNumberButtons && (
               <div className='score-input-section'>
                  <input
                     type="number"
                     value={currentThrow}
                     onChange={(e) => 
                        context === 'gameRegular' 
                           ? handleThrowChangeRegular(e.target.value, dispatch)
                           : handleThrowChangeTeams(e.target.value, dispatch)
                     }
                  />
                  <button 
                     className='remove-last'
                     onClick={() => {
                        const newValue = String(currentThrow).slice(0, -1)
                        dispatch(
                           context === 'gameRegular'
                              ? setCurrentThrow(newValue ? Number(newValue) : 0)
                              : setCurrentThrowTeams(newValue ? Number(newValue) : 0)
                        )
                        
                     }}>
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
                     if(context === 'gameRegular'){
                        handleSubmitThrowKeyboardButtonsRegular(
                             playersOrTeams as Player[],
                             index,
                             startIndex,
                             history as HistoryEntry[],
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
                        handleSubmitThrowKeyboardButtonsTeams(
                              playersOrTeams as Team[],
                              index,
                              currentPlayerIndexInTeam as number,
                              startIndex,
                              history as HistoryEntryTeams[],
                              currentThrow,
                              multiplierNumber,
                              gameMode,
                              numberOfLegs,
                              gameWin,
                              isSoundEnabled,
                              isDoubleActive,
                              dispatch
                        )
                     }
                     
                  } else {
                     if (context === 'gameRegular'){
                        handleSubmitThrowSubmitScoreButtonRegular(
                           playersOrTeams as Player[],
                           index,
                           currentPlayerThrows,
                           history as HistoryEntry[],
                           isSoundEnabled,
                           dispatch
                        )
                     } else {
                        handleSubmitThrowSubmitScoreButtonTeams(
                           playersOrTeams as Team[],
                           index,
                           currentPlayerIndexInTeam as number,
                           currentPlayerThrows,
                           history as HistoryEntryTeams[],
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
                     onClick={() => 
                        context === 'gameRegular' 
                           ? dispatch(setIsDoubleActive(!isDoubleActive)) 
                           : dispatch(setIsDoubleActiveTeams(!isDoubleActive))
                     } 
                     className={isDoubleActive ? 'active' : ''}>
                        Double
                  </button>
               )
            ) : (
               <div className="multiplier-buttons">
                  { [1, 2, 3].map((multiplierValue) => (
                     <button
                        key={multiplierValue}
                        onClick={() => 
                           context === 'gameRegular' 
                              ? dispatch(setMultiplier(multiplierValue)) 
                              : dispatch(setMultiplierTeams(multiplierValue))
                        }
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