import React from 'react'
import Image from 'next/image'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setIsSoundEnabled as setGameRegularSoundEnabled } from '@/redux/slices/gameRegularSlice'
import { setIsSoundEnabled as setGameRegularTeamsSoundEnabled } from '@/redux/slices/gameRegularTeamsSlice'
import { GameContextProps } from '@/app/types/types'

const CurrentPlayerThrowParagraph: React.FC<GameContextProps>  = ({ context }) => {
   const dispatch = useDispatch()

   const { 
      playersOrTeams, 
      playerOrTeamindex,
      currentPlayerIndexInTeam, 
      isSoundEnabled 
   } = useSelector((state: RootState) => {
      return context === 'gameRegular'
         ? {
            playersOrTeams: state.gameRegular.players,
            playerOrTeamindex: state.gameRegular.currentPlayerIndex,
            isSoundEnabled: state.gameRegular.isSoundEnabled
         }
         : {
            playersOrTeams: state.gameRegularTeams.teams,
            playerOrTeamindex: state.gameRegularTeams.currentTeamIndex,
            currentPlayerIndexInTeam: state.gameRegularTeams.currentPlayerIndexInTeam,
            isSoundEnabled: state.gameRegularTeams.isSoundEnabled
         }
   })
   
   const currentPlayerOrTeam = playersOrTeams[playerOrTeamindex]

   //Sound toggle handler
   const toggleSound = () => {
      if(context === 'gameRegular'){
         dispatch(setGameRegularSoundEnabled(!isSoundEnabled))
      } else {
         dispatch(setGameRegularTeamsSoundEnabled(!isSoundEnabled))
      }
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
            {context === 'gameRegular' 
               ? `${currentPlayerOrTeam.name.toUpperCase()}'S TURN TO THROW!`
               : `${currentPlayerOrTeam.members[currentPlayerIndexInTeam].toUpperCase()}'S TURN TO THROW!`
            }
         </span>
         
      </p>
   )
}

export default CurrentPlayerThrowParagraph
