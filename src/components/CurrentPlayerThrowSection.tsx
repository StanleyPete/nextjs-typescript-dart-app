import React from 'react'
import Image from 'next/image'
//Redux
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setIsSoundEnabled } from '@/redux/slices/gameClassicSlice'
import { selectDataInCurrentPlayerThrowSection } from '@/redux/memoizedSelectors'
//Types
import { 
   GameSettingsStates, 
   TeamClassic, 
} from '@/types/types'

const CurrentPlayerThrowSection = () => {
   const dispatch = useDispatch()
   const gameType = useSelector((state: RootState) => state.gameSettings.gameType) as GameSettingsStates['gameType']
   const { isSoundEnabled } = useSelector((state: RootState) => state.gameClassic)
   //Memoized (@/redux/memoizedSelectors.ts):
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
