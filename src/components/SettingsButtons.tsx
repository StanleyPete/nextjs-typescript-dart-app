import React from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { handleRestartGameClassic } from '@/controllers/game-classic/handleRestartGameClassic'
import { handleRestartGameCricket } from '@/controllers/game-cricket/handleRestartGameCricket'
import { setBackFromGame } from '@/redux/slices/gameSettingsSlice'

const SettingsButtons = () => {
   const dispatch = useDispatch()
   const router = useRouter()
   const gameMode = useSelector((state: RootState) => state.gameSettings.gameMode)
   const playerNames = useSelector((state: RootState) => state.gameSettings.playerNames)
   const gameType = useSelector((state: RootState) => state.gameSettings.gameType)
   const { isGameEnd } = useSelector((state: RootState) => state.game)
   
   return (
      <div className="settings-buttons">
         <button 
            className="go-back" 
            onClick={() => {
               dispatch(setBackFromGame(true))
               router.replace('/')
               return
            }}>
               Back to Settings
         </button>
         <button 
            className="restart-game" 
            onClick={() => {
               if (gameMode === 'Cricket') {
                  handleRestartGameCricket(gameType, playerNames, isGameEnd, dispatch)
               } else {
                  handleRestartGameClassic(gameType, playerNames, gameMode, isGameEnd, dispatch)  
               }
            }}
         >
            Restart game
         </button>
      </div>
   )
}

export default SettingsButtons
