import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { handleSubmitThrowNumberButtonsOnline } from '@/controllers/game-online/handleSubmitThrowNumberButtonsOnline'
import { handleUndo } from '@/controllers/game-online/handleUndo'
import { setFocusedSection, setPreviousFocusedSection } from '@/redux/slices/gameSettingsSlice'
import { setMultiplier } from '@/redux/slices/game-online/gameOnlineSlice'

const NumberButtonsOnline = () => {
   const dispatch = useDispatch()
   const [activeButton, setActiveButton] = useState<number | string | null>(null)
   const [focusedButton, setFocusedButton] = useState<number | string | null>(null)
   const focusedSection = useSelector((state: RootState) => state.gameSettings.focusedSection)
   const previousFocusedSection = useSelector((state: RootState) => state.gameSettings.previousFocusedSection)
   const gameId = useSelector((state: RootState) => state.gameOnline.gameId)
   const isGameEnd = useSelector((state: RootState) => state.gameOnline.isGameEnd)
   const multiplier = useSelector((state: RootState) => state.gameOnline.multiplier)
   const { isError } = useSelector((state: RootState) => state.gameSettings.error)
   const specialButtons = [
      { label: 'Bull (50)', value: 50 },
      { label: 'Outer (25)', value: 25 },
      { label: 'Miss', value: 0 },
   ]

   useEffect(() => {
      if (previousFocusedSection === 'multiplier-buttons' && focusedSection === 'number-buttons-1-to-5') {
         setFocusedButton(multiplier)
      }
   }, [previousFocusedSection, focusedSection])
   
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
               if (focusedButton === 3 || focusedButton === 4 || focusedButton === 5) {
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
               handleSubmitThrowNumberButtonsOnline(gameId, focusedButton, multiplier)
               dispatch(setFocusedSection('multiplier-buttons'))
               dispatch(setMultiplier(1))
               setFocusedButton(null)
            }
               
            if (focusedButton === 'undo') {
               handleUndo(gameId)
            }
               
         }
               
         if (event.ctrlKey && event.key === 'z') {
            setActiveButton('undo')
            setTimeout(() => setActiveButton(null), 100)
            handleUndo(gameId)
            dispatch(setFocusedSection('multiplier-buttons'))
            dispatch(setMultiplier(1))
            setFocusedButton(null)    
         }
      }
         
      window.addEventListener('keydown', handleKeyDown)
         
      return () => { window.removeEventListener('keydown', handleKeyDown) }
   }, [dispatch, multiplier, focusedSection, focusedButton])
            
   return (
      <div className='score-buttons-section'>
         <div className='score-buttons'>

            {/* NUMBER BUTTONS: 1-20 */}
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
                        handleSubmitThrowNumberButtonsOnline(gameId, baseValue, multiplier)  
                     }}
                  >
                     <span className='base-value'>{baseValue}</span>
                     {displayValue && <span className='multiplied-value'>({displayValue})</span>}
                  </button>
               )
            })}

            {/* BULL, OUTER, MISS BUTTONS */}
            {specialButtons.map(({ label, value }) => (
               <button 
                  key={label}
                  className={`
                  ${focusedButton === value ? 'focused' : ''}  
                  ${activeButton === value ? 'clicked' : ''}
               `}  
                  onClick={() => {
                     handleSubmitThrowNumberButtonsOnline(
                        gameId,
                        multiplier === 2 ? value / 2 : multiplier === 3 ? value / 3 : value,
                        multiplier,
                     )
                  }}
               >
                  {label}
               </button>
            ))}

            {/* UNDO BUTTON */}
            <button 
               className={`
                  ${focusedButton === 'undo' ? 'focused' : ''}  
                  ${activeButton === 'undo' ? 'clicked' : ''}
               `} 
               onClick={() => { handleUndo(gameId) }} >
               Undo
               <span>(Ctrl + z)</span>
            </button>
           
         </div>

      </div>
   )
}

export default NumberButtonsOnline