import React from 'react'
import { useRouter } from 'next/navigation'
//Redux
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
//Controllers
import { handleRestartGameClassic } from '@/controllers/game-classic/handleRestartGameClassic'
import { handleRestartGameCricket } from '@/controllers/game-cricket/handleRestartGameCricket'

const SettingsButtons = () => {

   const dispatch = useDispatch()

   const router = useRouter()

   const { gameMode, playerNames, gameType } = useSelector((state: RootState) => state.gameSettings)

   const { isGameEnd } = useSelector((state: RootState) => state.game)
   
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
