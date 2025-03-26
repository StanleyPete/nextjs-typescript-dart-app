'use client'
import React from 'react'
import { RootState } from '@/redux/store'
import { useSelector} from 'react-redux'
import { handleToggleInputMethodOnline } from '@/controllers/game-online/handleToggleInputMethod'

const ButtonToggleScoreSubmitMethod = () => {
   const gameId = useSelector((state: RootState) => state.gameOnline.gameId)
   const showNumberButtons = useSelector((state: RootState) => state.gameOnline.showNumberButtons)
   const players = useSelector((state: RootState) => state.gameOnline.players)
   const currentPlayerIndex = useSelector((state: RootState) => state.gameOnline.currentPlayerIndex)
  
   return (
      <button 
         className={
            `input-toggle 
            ${showNumberButtons || players[currentPlayerIndex].pointsLeft <= 40 
               && players[currentPlayerIndex].pointsLeft % 2 === 0 ? 'buttons-active' : 'input-active'}`}
         onClick={() => { handleToggleInputMethodOnline(gameId)}}      
      >
         {showNumberButtons ? 'Input' : 'Buttons'}
      </button>
   )
}

export default ButtonToggleScoreSubmitMethod



