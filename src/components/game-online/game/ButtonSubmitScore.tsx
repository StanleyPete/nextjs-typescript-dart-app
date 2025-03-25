'use client'
import React from 'react'
import { RootState } from '@/redux/store'
import { useDispatch, useSelector} from 'react-redux'
import { handleSubmitThrowKeyboardButtonsOnline } from '@/controllers/game-online/handleSubmitThrowKeyboardButtonsOnline'
import { handleSubmitThrowNumberButtonsBeforeThirdThrow } from '@/controllers/game-online/handleSubmitThrowNumberButtonsBeforeThirdThrow'

const ButtonSubmitScoreOnline = () => {
   const dispatch = useDispatch()
   const showNumberButtons = useSelector((state: RootState) => state.gameOnline.showNumberButtons)
   const gameId = useSelector((state: RootState) => state.gameOnline.gameId)
   const currentThrow = useSelector((state: RootState) => state.gameOnline.currentThrow)
   const isDoubleActive = useSelector((state: RootState) => state.gameOnline.isDoubleActive)
  
   return (
      <button 
         className='submit-score' 
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



