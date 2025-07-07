'use client'
import React, { useEffect, useState } from 'react'
import { RootState } from '@/redux/store'
import { useDispatch, useSelector} from 'react-redux'
import { setMultiplier } from '@/redux/slices/game-online/gameOnlineSlice'
import { setFocusedSection, setPreviousFocusedSection } from '@/redux/slices/gameSettingsSlice'

const ButtonsMultiplierOnline = () => {
   const dispatch = useDispatch()
   const [focusedMultiplierButton, setFocusedMultiplierButton] = useState<number | null>(null)
   const focusedSection = useSelector((state: RootState) => state.gameSettings.focusedSection)
   const previousFocusedSection = useSelector((state: RootState) => state.gameSettings.previousFocusedSection)
   const multiplier = useSelector((state: RootState) => state.gameOnline.multiplier)
   const showNumberButtons = useSelector((state: RootState) => state.gameOnline.showNumberButtons)
   const isGameEnd = useSelector((state: RootState) => state.gameOnline.isGameEnd)
   const { isError } = useSelector((state: RootState) => state.gameSettings.error)
   
   useEffect(() => {
      if (showNumberButtons) {
         dispatch(setFocusedSection('multiplier-buttons'))
         setFocusedMultiplierButton(1)
      }
   }, [showNumberButtons])
  

   useEffect(() => {
      if (focusedSection === 'number-buttons-1-to-5' ||
         focusedSection === 'number-buttons-6-to-10' ||
         focusedSection === 'number-buttons-11-to-15' ||
         focusedSection === 'number-buttons-16-to-20' ||
         focusedSection === 'special-buttons') {
         setFocusedMultiplierButton(null)
         return
      }

      if (focusedSection === 'multiplier-buttons') {
         setFocusedMultiplierButton(multiplier)
      }
  
   }, [focusedSection, multiplier])

   useEffect(() => {
      if (isGameEnd || isError) return
      const handleKeyDown = (event: KeyboardEvent) => {
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
               dispatch(setPreviousFocusedSection('multiplier-buttons'))
               setFocusedMultiplierButton(null)
            }

         }
      }
   
      window.addEventListener('keydown', handleKeyDown)
   
      return () => { window.removeEventListener('keydown', handleKeyDown) }

   }, [dispatch,  showNumberButtons, isError, multiplier, focusedSection, focusedMultiplierButton, previousFocusedSection, isGameEnd])
  
   return (
      <div className='multiplier-buttons'>
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
   )
}

export default ButtonsMultiplierOnline



