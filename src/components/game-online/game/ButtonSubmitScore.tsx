'use client'
import React, { useEffect, useState } from 'react'
import { RootState } from '@/redux/store'
import { useDispatch, useSelector} from 'react-redux'
import { handleSubmitThrowKeyboardButtonsOnline } from '@/controllers/game-online/handleSubmitThrowKeyboardButtonsOnline'
import { handleSubmitThrowNumberButtonsBeforeThirdThrow } from '@/controllers/game-online/handleSubmitThrowNumberButtonsBeforeThirdThrow'

const ButtonSubmitScoreOnline = () => {
   const dispatch = useDispatch()
   const [activeButton, setActiveButton] = useState<string | null>(null)
   const showNumberButtons = useSelector((state: RootState) => state.gameOnline.showNumberButtons)
   const gameId = useSelector((state: RootState) => state.gameOnline.gameId)
   const currentThrow = useSelector((state: RootState) => state.gameOnline.currentThrow)
   const isDoubleActive = useSelector((state: RootState) => state.gameOnline.isDoubleActive)
   const isGameEnd = useSelector((state: RootState) => state.gameOnline.isGameEnd)
   const { isError } = useSelector((state: RootState) => state.gameSettings.error)

   useEffect(() => {
      if (isGameEnd || isError) return
      const handleKeyDown = (event: KeyboardEvent) => {
         
         if (event.key === 'Enter' && !showNumberButtons && !isError) {
            event.preventDefault() 
            setActiveButton('submit-score')
            setTimeout(() => setActiveButton(null), 100)
            const multiplierNumber = isDoubleActive ? 2 : 1
            handleSubmitThrowKeyboardButtonsOnline(currentThrow, multiplierNumber, dispatch, gameId) 
         }

         if (event.key === 'Enter' && showNumberButtons && !isError) {
            event.preventDefault() 
            setActiveButton('submit-score')
            setTimeout(() => setActiveButton(null), 100)
            handleSubmitThrowNumberButtonsBeforeThirdThrow(gameId)
         }

        

      }
   
      window.addEventListener('keydown', handleKeyDown)
   
      return () => { window.removeEventListener('keydown', handleKeyDown) }
   }, [currentThrow, showNumberButtons, isError, isGameEnd])
  
   return (
      <button 
         className={`submit-score  ${activeButton === 'submit-score' ? 'clicked' : ''}` }  
         onClick={() => {
            if (!showNumberButtons) {
               const multiplierNumber = isDoubleActive ? 2 : 1
               handleSubmitThrowKeyboardButtonsOnline(currentThrow, multiplierNumber, dispatch, gameId) 
            } else {
               handleSubmitThrowNumberButtonsBeforeThirdThrow(gameId)
            }
         }}
      >
        Submit Score
      </button>

   )
}

export default ButtonSubmitScoreOnline



