import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setCurrentThrow, setMultiplier, setIsDoubleActive } from '@/redux/slices/game-classic/gameClassicSlice'
import { selectDataInThrowValueSectionAndNumberButtons } from '@/redux/selectors/game-classic/selectDataInThrowValueSectionAndNumberButtons'
import { handleToggleInputMethod } from '@/controllers/game-classic/handleToggleInputMethod'
import { handleThrowValueChange } from '@/controllers/game-classic/handleThrowValueChange'
import { handleSubmitThrowKeyboardButtons } from '@/controllers/game-classic/handleSubmitThrowKeyboardButtons'
import { handleSubmitThrowSubmitScoreButton } from '@/controllers/game-classic/handleSubmitThrowSubmitScoreButton'
import { PlayerClassic, TeamClassic, HistoryEntryClassicSingle,HistoryEntryClassicTeams } from '@/types/redux/gameClassicTypes'
import { setFocusedSection, setPreviousFocusedSection } from '@/redux/slices/gameSettingsSlice'

const ThrowValueSection = () => {
   const dispatch = useDispatch()
   const [activeButton, setActiveButton] = useState<string | null>(null)
   const [focusedMultiplierButton, setFocusedMultiplierButton] = useState<number | null>(null)
   const gameType = useSelector((state: RootState) => state.gameSettings.gameType)
   const gameMode = useSelector((state: RootState) => state.gameSettings.gameMode)
   const gameWin = useSelector((state: RootState) => state.gameSettings.gameWin)
   const focusedSection = useSelector((state: RootState) => state.gameSettings.focusedSection)
   const previousFocusedSection = useSelector((state: RootState) => state.gameSettings.previousFocusedSection)
   const { isError } = useSelector((state: RootState) => state.gameSettings.error)
   const numberOfLegs = useSelector((state: RootState) => state.gameSettings.numberOfLegs)
   const startIndex = useSelector((state: RootState) => state.game.startIndex)
   const isGameEnd = useSelector((state: RootState) => state.game.isGameEnd)
   const currentPlayerThrowsCount = useSelector((state: RootState) => state.game.currentPlayerThrowsCount)
   const currentPlayerThrows = useSelector((state: RootState) => state.game.currentPlayerThrows)
   const isSoundEnabled = useSelector((state: RootState) => state.game.isSoundEnabled)
   const showNumberButtons = useSelector((state: RootState) => state.gameClassic.showNumberButtons)
   const throwValueSum = useSelector((state: RootState) => state.gameClassic.throwValueSum)
   const currentThrow = useSelector((state: RootState) => state.gameClassic.currentThrow)
   const multiplier = useSelector((state: RootState) => state.gameClassic.multiplier)
   const isDoubleActive = useSelector((state: RootState) => state.gameClassic.isDoubleActive)
   
   //Memoized (@/redux/selectors/game-classic/selectDataInThrowValueSectionAndNumberButtons.ts):
   const { playersOrTeams, index, currentPlayerIndexInTeam, history } = useSelector(selectDataInThrowValueSectionAndNumberButtons)
   
   useEffect(() => {
      if (isGameEnd || isError) return
      const handleKeyDown = (event: KeyboardEvent) => {
         if (event.ctrlKey && event.key === 'b') {
            event.preventDefault()
            setActiveButton('input-toggle')
            setTimeout(() => setActiveButton(null), 100)
            handleToggleInputMethod(
               gameType,
               playersOrTeams,
               index,
               currentPlayerThrowsCount,
               throwValueSum,
               dispatch
            )
            dispatch(setCurrentThrow(0))
         }

         if (event.key === 'Backspace' && !showNumberButtons) {
            event.preventDefault()
            setActiveButton('remove-last')
            setTimeout(() => setActiveButton(null), 100)
            const newValue = String(currentThrow).slice(0, -1) 
            dispatch(setCurrentThrow(newValue ? Number(newValue) : 0))
         }

         if (event.key === 'Enter' && !showNumberButtons && !isError) {
            event.preventDefault() 
            setActiveButton('submit-score')
            setTimeout(() => setActiveButton(null), 100)
            const multiplierNumber = isDoubleActive ? 2 : 1
            handleSubmitThrowKeyboardButtons(
               gameType,
               playersOrTeams,
               index,
               gameType === 'teams' ? currentPlayerIndexInTeam! : 0,
               startIndex,
               history as HistoryEntryClassicSingle[] | HistoryEntryClassicTeams[],
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

         if (focusedSection === 'multiplier-buttons') {
            const multiplierOptions = [1, 2, 3]
            const currentMultiplierIndex = multiplierOptions.findIndex(el => el === multiplier)

            if (event.key === 'ArrowRight') {
               event.preventDefault()
               const nextMultiplierIndex = (currentMultiplierIndex + 1) % multiplierOptions.length
               dispatch(setMultiplier(multiplierOptions[nextMultiplierIndex]))
               setFocusedMultiplierButton(multiplierOptions[nextMultiplierIndex])
            }
   
            if (event.key === 'ArrowLeft') {
               event.preventDefault()
               const prevMultiplierIndex = (currentMultiplierIndex - 1 + multiplierOptions.length) % multiplierOptions.length
               dispatch(setMultiplier(multiplierOptions[prevMultiplierIndex]))
               setFocusedMultiplierButton(multiplierOptions[prevMultiplierIndex])
            }
   
            if (event.key === 'ArrowDown') {
               event.preventDefault()
               dispatch(setFocusedSection('number-buttons-1-to-5'))
               dispatch(setPreviousFocusedSection(null))
               setFocusedMultiplierButton(null)
            }

         }

      }
   
      window.addEventListener('keydown', handleKeyDown)
   
      return () => { window.removeEventListener('keydown', handleKeyDown) }
   }, [gameType, playersOrTeams, index, currentPlayerThrowsCount, throwValueSum, dispatch, currentThrow, showNumberButtons, isError, isDoubleActive, multiplier, focusedSection, focusedMultiplierButton, isGameEnd])

   useEffect(() => {
      if (previousFocusedSection === 'number-buttons-1-to-5') {
         const currentMultiplier = multiplier
         setFocusedMultiplierButton(currentMultiplier)
         return
      }
      if (focusedSection !== 'multiplier-buttons') return
      if (showNumberButtons){
         
         dispatch(setFocusedSection('multiplier-buttons'))
         dispatch(setMultiplier(1))
         setFocusedMultiplierButton(1)
      } else {
         dispatch(setFocusedSection(null))
         setFocusedMultiplierButton(null)
      }
   }, [showNumberButtons, focusedSection, dispatch, previousFocusedSection])

   useEffect(() => {
      setFocusedMultiplierButton(multiplier)
   }, [multiplier])

   return (
      <>
         <div className="throw-value-section">

            {/* Toggle between input and number buttons */}
            <button 
               className={`
                  input-toggle 
                  ${showNumberButtons || playersOrTeams[index].pointsLeft <= 40 && playersOrTeams[index].pointsLeft % 2 === 0 
         ? 'buttons-active' 
         : 'input-active'
      } 
                  ${activeButton === 'input-toggle' 
         ? 'clicked' 
         : ''
      }
               `}
               onClick={() => {
                  handleToggleInputMethod(
                     gameType,
                     playersOrTeams,
                     index,
                     currentPlayerThrowsCount,
                     throwValueSum,
                     dispatch
                  )
                  dispatch(setCurrentThrow(0))
               }}      
            >
               <div>
                  <span className='input-toggle-button-title'>{showNumberButtons ? '0-9 buttons' : 'Score buttons'}</span>
                  <span className='keyboard-shortcut'>( Ctrl + b )</span>
               </div>
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
                     className={`remove-last ${activeButton === 'remove-last' ? 'clicked' : ''}`}
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
               className={`submit-score  ${activeButton === 'submit-score' ? 'clicked' : ''}` } 
               onClick={() => {
                  if (!showNumberButtons) {
                     const multiplierNumber = isDoubleActive ? 2 : 1
                     handleSubmitThrowKeyboardButtons(
                        gameType,
                        playersOrTeams,
                        index,
                        gameType === 'teams' ? currentPlayerIndexInTeam! : 0,
                        startIndex,
                        history as HistoryEntryClassicSingle[] | HistoryEntryClassicTeams[],
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
                     handleSubmitThrowSubmitScoreButton(
                        gameType,
                        playersOrTeams as PlayerClassic[] | TeamClassic[],
                        index,
                        gameType === 'teams' ? currentPlayerIndexInTeam! : 0,
                        currentPlayerThrows,
                        history as HistoryEntryClassicSingle[] | HistoryEntryClassicTeams[],
                        isSoundEnabled,
                        dispatch
                     ) 
                  }
               }}
            >
               Submit Score
            </button>
         </div>
    
         {/* Multiplier section*/}
         <div className='multiplier-section'>
            {!showNumberButtons ? (
               playersOrTeams[index].pointsLeft <= 40 && playersOrTeams[index].pointsLeft % 2 === 0 && (
                  <button 
                     className={`button-double ${isDoubleActive ? 'active' : ''}`}
                     onClick={() => dispatch(setIsDoubleActive(!isDoubleActive))} 
                  >
                     Double
                  </button>
               )
            ) : (
               <div className={'multiplier-buttons'}>
                  { [1, 2, 3].map((multiplierValue) => (
                     <button
                        key={multiplierValue}
                        className={`${multiplier === multiplierValue ? 'active' : ''} ${focusedMultiplierButton === multiplierValue ? 'focused' : ''}`}
                        onClick={() => dispatch(setMultiplier(multiplierValue))}
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