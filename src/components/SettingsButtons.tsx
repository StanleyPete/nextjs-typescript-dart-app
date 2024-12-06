import React from 'react'
import { useRouter } from 'next/navigation'
import { handleRestartGameRegular, handleRestartGameRegularTeams } from '@/controllers/handleRestartGame'
import { RootState } from '@/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { initializePlayers } from '../redux/slices/gameRegularSlice'
import { initializeTeams } from '../redux/slices/gameRegularTeamsSlice'
import { GameContextProps } from '@/types/types'

const SettingsButtons: React.FC<GameContextProps> = ({ context }) => {
   const dispatch = useDispatch()
   const router = useRouter()

   const { gameMode, playerNames } = useSelector((state: RootState) => state.gameSettings)

   const isGameEnd = useSelector<RootState, boolean>(
      (state) => context === 'gameRegular' 
         ? state.gameRegular.isGameEnd 
         : state.gameRegularTeams.isGameEnd
   )

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
               if(context === 'gameRegular'){
                  handleRestartGameRegular(
                     playerNames, 
                     gameMode, 
                     isGameEnd, 
                     initializePlayers,
                     dispatch, 
                  )
               } else {
                  handleRestartGameRegularTeams(
                     playerNames,
                     gameMode,
                     isGameEnd,
                     initializeTeams,
                     dispatch
                  )
               }}}>
                  Restart game
         </button>
      </div>
   )
}

export default SettingsButtons
