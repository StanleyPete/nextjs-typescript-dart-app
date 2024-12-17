import React from 'react'
import Image from 'next/image'
//Redux
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setIsSoundEnabled } from '@/redux/slices/game-classic/gameClassicSlice'
import { selectDataInCurrentPlayerThrowSection } from '@/redux/selectors/selectDataInCurrentPlayerThrowSection'
//Types
import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'
import { TeamClassic } from '@/types/redux/gameClassicTypes'

const CurrentPlayerThrowSection = () => {
   const dispatch = useDispatch()
   const gameType = useSelector((state: RootState) => state.gameSettings.gameType) as GameSettingsStates['gameType']
   const gameMode = useSelector((state: RootState) => state.gameSettings.gameMode) as GameSettingsStates['gameMode']
   const { isSoundEnabled } = useSelector((state: RootState) => {
      if (gameMode === 'Cricket') {
         return { isSoundEnabled: state.gameCricket.isSoundEnabled}
      } else {
         return { isSoundEnabled: state.gameClassic.isSoundEnabled}
      }
   })
   //Memoized (@/redux/selectors/selectDataInCurrentPlayerThrowSection.ts):
   const { playersOrTeams, index, currentPlayerIndexInTeam } = useSelector(selectDataInCurrentPlayerThrowSection)
   
   const currentPlayerOrTeam = playersOrTeams[index]

   //Sound toggle handler
   const toggleSound = () => {
      dispatch(setIsSoundEnabled(!isSoundEnabled))
   }
   
   return (
      <p className="current-player-throw">

         {/* Button to toggle sound */}
         <button className="sound-button" onClick={toggleSound}>
            <Image
               src={isSoundEnabled ? '/sound-on.svg' : '/sound-off.svg'}
               alt={isSoundEnabled ? 'Sound On' : 'Sound Off'}
               width={16}
               height={16}
            />
            <span>{isSoundEnabled ? 'On' : 'Off'}</span>
         </button>

         {/* Current player's turn message */}
         <span className="current-player-throw-message">
            {gameType === 'single' 
               ? `${currentPlayerOrTeam.name.toUpperCase()}'S TURN TO THROW!`
               : `${(currentPlayerOrTeam as TeamClassic).members[currentPlayerIndexInTeam].toUpperCase()}'S TURN TO THROW!`
            }
         </span>
         
      </p>
   )
}

export default CurrentPlayerThrowSection
