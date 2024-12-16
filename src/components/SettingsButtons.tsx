import React from 'react'
import { useRouter } from 'next/navigation'
//Redux
import { useDispatch, useSelector } from 'react-redux'
import { initializePlayers } from '../redux/slices/game-classic/gameClassicSingleSlice'
import { initializeTeams } from '../redux/slices/game-classic/gameClassicTeamsSlice'
import { RootState } from '@/redux/store'
//Controllers
import { handleRestartGame } from '@/controllers/handleRestartGame'

const SettingsButtons = () => {
   const dispatch = useDispatch()
   const router = useRouter()
   const { gameMode, playerNames, gameType } = useSelector((state: RootState) => state.gameSettings)
   const { isGameEnd } = useSelector((state: RootState) => state.gameClassic)

   return (
      <div className="settings-buttons">
         <button 
            className="go-back" 
            onClick={() => {router.back()}}>
               Back to Settings
         </button>
         <button 
            className="restart-game" 
            onClick={() => {
               handleRestartGame(
                  gameType,
                  playerNames, 
                  gameMode, 
                  isGameEnd, 
                  gameType === 'single' ? initializePlayers : initializeTeams,
                  dispatch, 
               )  
            }}
         >
            Restart game
         </button>
      </div>
   )
}

export default SettingsButtons
