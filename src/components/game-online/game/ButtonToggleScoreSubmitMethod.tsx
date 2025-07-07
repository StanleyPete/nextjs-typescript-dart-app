'use client'
import React, { useEffect, useState } from 'react'
import { RootState } from '@/redux/store'
import { useSelector, useDispatch } from 'react-redux'
import { handleToggleInputMethodOnline } from '@/controllers/game-online/handleToggleInputMethod'
import { setFocusedSection, setPreviousFocusedSection } from '@/redux/slices/gameSettingsSlice'
import { setMultiplier } from '@/redux/slices/game-online/gameOnlineSlice'




const ButtonToggleScoreSubmitMethod = () => {
   const dispatch = useDispatch()
   const [activeButton, setActiveButton] = useState<string | null>(null)
   const gameId = useSelector((state: RootState) => state.gameOnline.gameId)
   const showNumberButtons = useSelector((state: RootState) => state.gameOnline.showNumberButtons)
   const isGameEnd = useSelector((state: RootState) => state.gameOnline.isGameEnd)
   const players = useSelector((state: RootState) => state.gameOnline.players)
   const { isError } = useSelector((state: RootState) => state.gameSettings.error)
   const currentPlayerIndex = useSelector((state: RootState) => state.gameOnline.currentPlayerIndex)
   
   useEffect(() => {
      if (isGameEnd || isError) return
      const handleKeyDown = (event: KeyboardEvent) => {
         if (event.ctrlKey && event.key === 'b') {
            event.preventDefault()

            if (!showNumberButtons) {
               dispatch(setFocusedSection('multiplier-buttons'))
               dispatch(setPreviousFocusedSection(''))
               dispatch(setMultiplier(1))
            } else {
               dispatch(setFocusedSection(''))
               dispatch(setPreviousFocusedSection(''))
               dispatch(setMultiplier(1))
            }

            setActiveButton('input-toggle-button')
            setTimeout(() => setActiveButton(null), 100)
            handleToggleInputMethodOnline(gameId)

         
         }
      }
   
      window.addEventListener('keydown', handleKeyDown)
   
      return () => { window.removeEventListener('keydown', handleKeyDown) }
      
   }, [showNumberButtons, isError, isGameEnd])

  


   return (
      <button 
         className={
            `input-toggle 
            ${showNumberButtons || players[currentPlayerIndex].pointsLeft <= 40 
               && players[currentPlayerIndex].pointsLeft % 2 === 0 ? 'buttons-active' : 'input-active'}
            ${activeButton === 'input-toggle-button' ? 'clicked' : ''}`
         }
         onClick={() => { handleToggleInputMethodOnline(gameId)}}      
      >
         <div>
            <span className='input-toggle-button-title'>{showNumberButtons ? '0-9 buttons' : 'Score buttons'}</span>
            <span className='keyboard-shortcut'>( Ctrl + b )</span>
         </div>
      </button>
   )
}

export default ButtonToggleScoreSubmitMethod



