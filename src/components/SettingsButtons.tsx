'use client'

import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { RootState } from '@/redux/store'
import { handleRestartGame } from '@/lib/handleRestartGame'
import { initializePlayers } from '../redux/slices/gameRegularSlice'


const SettingsButtons = () => {
   const dispatch = useDispatch()
   const router = useRouter()

   const { isGameEnd } = useSelector((state: RootState) => state.gameRegular)
   const { gameMode, playerNames } = useSelector((state: RootState) => state.gameSettings)

   return (
      <div className="settings-buttons">
         <button 
            className="go-back" 
            onClick={() => {
               router.back()
            }}>
        Back to Settings
         </button>
         <button 
            className="restart-game" 
            onClick={() => {
               handleRestartGame(dispatch, playerNames, gameMode, isGameEnd, initializePlayers)
            }}>
        Restart game
         </button>
      </div>
   )
}

export default SettingsButtons
