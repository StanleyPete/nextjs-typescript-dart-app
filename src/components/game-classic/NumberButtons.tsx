import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { handleUndoClassic } from '@/controllers/game-classic/handleUndoClassic'
import { handleSubmitThrowNumberButtons } from '@/controllers/game-classic/handleSubmitThrowNumberButtons'
import { selectDataInThrowValueSectionAndNumberButtons } from '@/redux/selectors/game-classic/selectDataInThrowValueSectionAndNumberButtons'
import { HistoryEntryClassicSingle, HistoryEntryClassicTeams } from '@/types/redux/gameClassicTypes'
import { setFocusedSection, setPreviousFocusedSection } from '@/redux/slices/gameSettingsSlice'
import { setMultiplier } from '@/redux/slices/game-classic/gameClassicSlice'

const NumberButtons = () => {
   const dispatch = useDispatch()
   const [activeButton, setActiveButton] = useState<number | string | null>(null)
   const [focusedButton, setFocusedButton] = useState<number | string | null>(null)
   const gameType = useSelector((state: RootState) => state.gameSettings.gameType)
   const gameMode = useSelector((state: RootState) => state.gameSettings.gameMode)
   const numberOfLegs = useSelector((state: RootState) => state.gameSettings.numberOfLegs)
   const gameWin = useSelector((state: RootState) => state.gameSettings.gameWin)
   const focusedSection = useSelector((state: RootState) => state.gameSettings.focusedSection)
   const previousFocusedSection = useSelector((state: RootState) => state.gameSettings.previousFocusedSection)
   const { isError } = useSelector((state: RootState) => state.gameSettings.error)
   const startIndex = useSelector((state: RootState) => state.game.startIndex)
   const isGameEnd = useSelector((state: RootState) => state.game.isGameEnd)
   const currentPlayerThrowsCount = useSelector((state: RootState) => state.game.currentPlayerThrowsCount)
   const currentPlayerThrows = useSelector((state: RootState) => state.game.currentPlayerThrows)
   const isSoundEnabled = useSelector((state: RootState) => state.game.isSoundEnabled)
   const showNumberButtons = useSelector((state: RootState) => state.gameClassic.showNumberButtons)
   const throwValueSum = useSelector((state: RootState) => state.gameClassic.throwValueSum)
   const multiplier = useSelector((state: RootState) => state.gameClassic.multiplier)
   
   //Memoized (@/redux/selectors/game-classic/selectDataInThrowValueSectionAndNumberButtons.ts):
   const { playersOrTeams, index, currentPlayerIndexInTeam, history } = useSelector(selectDataInThrowValueSectionAndNumberButtons)

   const specialButtons = [
      { label: 'Bull (50)', value: 50 },
      { label: 'Outer (25)', value: 25 },
      { label: 'Miss', value: 0 },
   ]

   useEffect(() => {
      if (isGameEnd || isError) return
      const handleKeyDown = (event: KeyboardEvent) => {
         if (focusedSection === 'number-buttons-1-to-5') {
            const buttonsOptions = [1, 2, 3, 4, 5]
            const currentButtonIndex = buttonsOptions.findIndex(el => el === focusedButton)

            if (event.key === 'ArrowRight') {
               event.preventDefault()
               const nextButtonIndex = (currentButtonIndex + 1) % buttonsOptions.length
               setFocusedButton(buttonsOptions[nextButtonIndex])
            }

            if (event.key === 'ArrowLeft') {
               event.preventDefault()
               const prevButtonIndex = (currentButtonIndex - 1 + buttonsOptions.length) % buttonsOptions.length
               setFocusedButton(buttonsOptions[prevButtonIndex])
            }

            if (event.key === 'ArrowUp') {
               event.preventDefault()
               dispatch(setFocusedSection('multiplier-buttons'))
               dispatch(setPreviousFocusedSection('number-buttons-1-to-5'))
               if(focusedButton === 3 || focusedButton === 4 || focusedButton === 5) {
                  dispatch(setMultiplier(3))
               } else if (focusedButton === 2) {
                  dispatch(setMultiplier(2))
               } else if (focusedButton === 1){
                  dispatch(setMultiplier(1))
               }
               setFocusedButton(null)
            }

            if (event.key === 'ArrowDown') {
               event.preventDefault()
               const nextFocusedButton = Number(focusedButton) + 5
               setFocusedButton(nextFocusedButton)
               dispatch(setFocusedSection('number-buttons-6-to-10'))
            }
         }

         if (focusedSection === 'number-buttons-6-to-10') {
            const buttonsOptions = [6, 7, 8, 9, 10]
            const currentButtonIndex = buttonsOptions.findIndex(el => el === focusedButton)

            if (event.key === 'ArrowRight') {
               event.preventDefault()
               const nextButtonIndex = (currentButtonIndex + 1) % buttonsOptions.length
               setFocusedButton(buttonsOptions[nextButtonIndex])
            }

            if (event.key === 'ArrowLeft') {
               event.preventDefault()
               const prevButtonIndex = (currentButtonIndex - 1 + buttonsOptions.length) % buttonsOptions.length
               setFocusedButton(buttonsOptions[prevButtonIndex])
            }

            if (event.key === 'ArrowUp') {
               event.preventDefault()
               const nextFocusedButton = Number(focusedButton) - 5
               setFocusedButton(nextFocusedButton)
               dispatch(setFocusedSection('number-buttons-1-to-5'))
               dispatch(setPreviousFocusedSection('number-buttons-6-to-10'))
            }

            if (event.key === 'ArrowDown') {
               event.preventDefault()
               const nextFocusedButton = Number(focusedButton) + 5
               setFocusedButton(nextFocusedButton)
               dispatch(setFocusedSection('number-buttons-11-to-15'))
            }
         }

         if (focusedSection === 'number-buttons-11-to-15') {
            const buttonsOptions = [11, 12, 13, 14, 15]
            const currentButtonIndex = buttonsOptions.findIndex(el => el === focusedButton)

            if (event.key === 'ArrowRight') {
               event.preventDefault()
               const nextButtonIndex = (currentButtonIndex + 1) % buttonsOptions.length
               setFocusedButton(buttonsOptions[nextButtonIndex])
            }

            if (event.key === 'ArrowLeft') {
               event.preventDefault()
               const prevButtonIndex = (currentButtonIndex - 1 + buttonsOptions.length) % buttonsOptions.length
               setFocusedButton(buttonsOptions[prevButtonIndex])
            }

            if (event.key === 'ArrowUp') {
               event.preventDefault()
               const nextFocusedButton = Number(focusedButton) - 5
               setFocusedButton(nextFocusedButton)
               dispatch(setFocusedSection('number-buttons-6-to-10'))
            }

            if (event.key === 'ArrowDown') {
               event.preventDefault()
               const nextFocusedButton = Number(focusedButton) + 5
               setFocusedButton(nextFocusedButton)
               dispatch(setFocusedSection('number-buttons-16-to-20'))
            }
         }

         if (focusedSection === 'number-buttons-16-to-20') {
            const buttonsOptions = [16, 17, 18, 19, 20]
            const currentButtonIndex = buttonsOptions.findIndex(el => el === focusedButton)

            if (event.key === 'ArrowRight') {
               event.preventDefault()
               const nextButtonIndex = (currentButtonIndex + 1) % buttonsOptions.length
               setFocusedButton(buttonsOptions[nextButtonIndex])
            }

            if (event.key === 'ArrowLeft') {
               event.preventDefault()
               const prevButtonIndex = (currentButtonIndex - 1 + buttonsOptions.length) % buttonsOptions.length
               setFocusedButton(buttonsOptions[prevButtonIndex])
            }

            if (event.key === 'ArrowUp') {
               event.preventDefault()
               const nextFocusedButton = Number(focusedButton) - 5
               setFocusedButton(nextFocusedButton)
               dispatch(setFocusedSection('number-buttons-11-to-15'))
            }

            if (event.key === 'ArrowDown') {
               event.preventDefault()
               dispatch(setFocusedSection('special-buttons'))
               if(focusedButton === 19 || focusedButton === 20) {
                  setFocusedButton('undo')
               } else if (focusedButton === 18) {
                  setFocusedButton(0)
               } else if (focusedButton === 17) {
                  setFocusedButton(25)
               } else if (focusedButton === 16) {
                  setFocusedButton(50)
               }
            }
         }

         if (focusedSection === 'special-buttons') {
            const buttonsOptions = [50, 25, 0, 'undo']
            const currentButtonIndex = buttonsOptions.findIndex(el => el === focusedButton)

            if (event.key === 'ArrowRight') {
               event.preventDefault()
               const nextButtonIndex = (currentButtonIndex + 1) % buttonsOptions.length
               setFocusedButton(buttonsOptions[nextButtonIndex])
            }

            if (event.key === 'ArrowLeft') {
               event.preventDefault()
               const prevButtonIndex = (currentButtonIndex - 1 + buttonsOptions.length) % buttonsOptions.length
               setFocusedButton(buttonsOptions[prevButtonIndex])
            }

            if (event.key === 'ArrowUp') {
               event.preventDefault()
               dispatch(setFocusedSection('number-buttons-16-to-20'))
               if (focusedButton === 50) {
                  setFocusedButton(16)
               } else if (focusedButton === 25) {
                  setFocusedButton(17)
               } else if (focusedButton === 0) {
                  setFocusedButton(18)
               } else if (focusedButton === 'undo') {
                  setFocusedButton(19)
               }
            }
         }

         if (event.key === 'Enter') {
            event.preventDefault()
            setActiveButton(focusedButton)
            setTimeout(() => setActiveButton(null), 100)

            if (typeof focusedButton === 'number') {
               handleSubmitThrowNumberButtons(
                  gameType,
                  focusedButton,
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
               dispatch(setFocusedSection('multiplier-buttons'))
               dispatch(setMultiplier(1))
               setFocusedButton(null)
            }

            if (focusedButton === 'undo') {
               handleUndoClassic(
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
            }
         }

         if (event.ctrlKey && event.key === 'z') {
            setActiveButton('undo')
            setTimeout(() => setActiveButton(null), 100)
            handleUndoClassic(
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
            dispatch(setFocusedSection('multiplier-buttons'))
            dispatch(setMultiplier(1))
            setFocusedButton(null)

         }
      }
   
      window.addEventListener('keydown', handleKeyDown)
   
      return () => { window.removeEventListener('keydown', handleKeyDown) }
   }, [gameType, playersOrTeams, index, currentPlayerThrowsCount, throwValueSum, dispatch, showNumberButtons, multiplier, focusedSection, focusedButton])

   useEffect(() => {
      if (previousFocusedSection === 'number-buttons-6-to-10') return
      if (focusedSection === 'number-buttons-1-to-5'){
         dispatch(setPreviousFocusedSection(null))
         setFocusedButton(multiplier)
      }
   }, [focusedSection, previousFocusedSection])

   useEffect(() => {
      const isInputPreferred = playersOrTeams[index].isInputPreffered
      if (!isInputPreferred) {
         console.log('watrunek spelniony')
         dispatch(setFocusedSection('multiplier-buttons'))
         dispatch(setPreviousFocusedSection(null))
         setFocusedButton(null)
         
      }
   }, [index])

   

   return (
      <div className='score-buttons'>
         {/* Score buttons */}
         {Array.from({ length: 20 }, (_, i) => {
            const baseValue = i + 1
            const displayValue = multiplier > 1 ? baseValue * multiplier : null

            return (
               <button 
                  key={baseValue}
                  className={`
                     ${baseValue === focusedButton ? 'focused' : ''} 
                     ${activeButton === baseValue ? 'clicked' : ''} 
                  `} 
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
                     dispatch(setFocusedSection('multiplier-buttons'))
                     dispatch(setMultiplier(1))
                     setFocusedButton(null)  
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
               className={`
                  ${focusedButton === value ? 'focused' : ''}  
                  ${activeButton === value ? 'clicked' : ''}
               `}  
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
                  dispatch(setFocusedSection('multiplier-buttons'))
                  dispatch(setMultiplier(1))
                  setFocusedButton(null)
               }}
            >
               {label}
            </button>
         ))}
         <button 
            className={`
               ${focusedButton === 'undo' ? 'focused' : ''}  
               ${activeButton === 'undo' ? 'clicked' : ''}
            `} 
            onClick={() => {
               handleUndoClassic(
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
               dispatch(setFocusedSection('multiplier-buttons'))
               dispatch(setMultiplier(1))
               setFocusedButton(null)
            }}
         >
            Undo
            <span>(Ctrl + z)</span>
         </button>
      </div>
   )
}

export default NumberButtons