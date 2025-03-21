'use client'
import React from 'react'
import { RootState } from '@/redux/store'
import { useDispatch, useSelector} from 'react-redux'
import { setIsDoubleActive } from '@/redux/slices/game-online/gameOnlineSlice'

const ButtonDoubleOnline = () => {
   const dispatch = useDispatch()
   const players = useSelector((state: RootState) => state.gameOnline.players)
   const currentPlayerIndex = useSelector((state: RootState) => state.gameOnline.currentPlayerIndex)
   const isDoubleActive = useSelector((state: RootState) => state.gameOnline.isDoubleActive)
   
   return (
      players[currentPlayerIndex].pointsLeft <= 40 
      && players[currentPlayerIndex].pointsLeft % 2 === 0 
      && (
         <button 
            className={isDoubleActive ? 'active' : ''}
            onClick={() => dispatch(setIsDoubleActive(!isDoubleActive))} 
         >
            Double
         </button>
      )
   )
}

export default ButtonDoubleOnline



