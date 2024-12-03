import React from 'react'
import Image from 'next/image'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setIsSoundEnabled as setGameRegularSoundEnabled } from '@/redux/slices/gameRegularSlice'
import { setIsSoundEnabled as setGameRegularTeamsSoundEnabled } from '@/redux/slices/gameRegularTeamsSlice'

interface CurrentPlayerThrowParagraphProps {
   context: 'gameRegular' | 'gameRegularTeams'
}

const CurrentPlayerThrowParagraph: React.FC<CurrentPlayerThrowParagraphProps>  = ({ context }) => {
   const dispatch = useDispatch()

   const { 
      playersOrTeams, 
      index,
      isSoundEnabled 
   } = useSelector((state: RootState) => {
      if (context === 'gameRegular') {
         return {
            playersOrTeams: state.gameRegular.players,
            index: state.gameRegular.currentPlayerIndex,
            isSoundEnabled: state.gameRegular.isSoundEnabled, 
         }
      }

      if (context === 'gameRegularTeams') {
         return {
            playersOrTeams: state.gameRegularTeams.teams[state.gameRegularTeams.currentTeamIndex].members,
            index: state.gameRegularTeams.currentPlayerIndexInTeam,
            isSoundEnabled: state.gameRegularTeams.isSoundEnabled,
      
         }
      }

      return { 
         playersOrTeams: [], 
         index: 0, 
         isSoundEnabled: true 
      }
   })
   
   const currentPlayerOrTeam = playersOrTeams[index].name

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
            {`${currentPlayerOrTeam.toUpperCase()}'S TURN TO THROW!`}
         </span>
         
      </p>
   )
}

export default CurrentPlayerThrowParagraph
