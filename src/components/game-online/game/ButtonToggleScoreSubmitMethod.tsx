'use client'
import React from 'react'
import { RootState } from '@/redux/store'
import { useSelector} from 'react-redux'
import { handleToggleInputMethodOnline } from '@/controllers/game-online/handleToggleInputMethod'

const ButtonToggleScoreSubmitMethod = () => {
   const gameId = useSelector((state: RootState) => state.gameOnline.gameId)
   const showNumberButtons = useSelector((state: RootState) => state.gameOnline.showNumberButtons)
  
   return (
      <button 
         className={`input-toggle ${showNumberButtons ? 'buttons-active' : 'input-active'}`}
         onClick={() => { handleToggleInputMethodOnline(gameId)}}      
      >
         {showNumberButtons ? 'Input' : 'Buttons'}
      </button>
   )
}

export default ButtonToggleScoreSubmitMethod



