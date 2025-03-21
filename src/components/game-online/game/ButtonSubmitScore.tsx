'use client'
import React from 'react'
import { RootState } from '@/redux/store'
import { useDispatch, useSelector} from 'react-redux'
import { handleSubmitThrowKeyboardButtonsOnline } from '@/controllers/game-online/handleSubmitThrowKeyboardButtonsOnline'
import { handleSubmitThrowSubmitScoreButtonOnline } from '@/controllers/game-online/handleSubmitThrowSubmitScoreButtonOnline'

const ButtonSubmitScoreOnline = () => {
   const dispatch = useDispatch()
   const players = useSelector((state: RootState) => state.gameOnline.players)
   const currentPlayerIndex = useSelector((state: RootState) => state.gameOnline.currentPlayerIndex)
   const showNumberButtons = useSelector((state: RootState) => state.gameOnline.showNumberButtons)
   const gameId = useSelector((state: RootState) => state.gameOnline.gameId)
   const currentThrow = useSelector((state: RootState) => state.gameOnline.currentThrow)
   const currentPlayerThrows = useSelector((state: RootState) => state.gameOnline.currentPlayerThrows)
   const isSoundEnabled = useSelector((state: RootState) => state.gameOnline.isSoundEnabled)
   const isDoubleActive = useSelector((state: RootState) => state.gameOnline.isDoubleActive)
  
   return (
      <button 
         className='submit-score' 
         onClick={() => {
            if (!showNumberButtons) {
               const multiplierNumber = isDoubleActive ? 2 : 1
               handleSubmitThrowKeyboardButtonsOnline(currentThrow, multiplierNumber, dispatch, gameId) 
            } else {
               handleSubmitThrowSubmitScoreButtonOnline(players, currentPlayerIndex, currentPlayerThrows, isSoundEnabled, dispatch) 
            }
         }}
      >
        Submit Score
      </button>

   )
}

export default ButtonSubmitScoreOnline



