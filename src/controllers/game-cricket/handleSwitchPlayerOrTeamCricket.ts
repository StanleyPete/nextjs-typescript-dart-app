//Redux
import { AppDispatch } from '@/redux/store'
import { setCurrentPlayerIndex } from '@/redux/slices/game-cricket/gameCricketSingleSlice'
import {
   setCurrentTeamIndex,
   setCurrentPlayerIndexInTeam,
} from '@/redux/slices/game-cricket/gameCricketTeamsSlice'
//Types
import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'
import { 
   GameCricketSingleStates, 
   GameCricketTeamsStates, 
   TeamCricket, 
   PlayerCricket 
} from '@/types/redux/gameCricketTypes'

/* 
   USED IN:

   SWITCH TO ANOTHER PLAYER OR TEAM: 
      Example: If there are 2 teams and currentTeamIndex === 1 (last player's turn), 
      after increasing currentPlayerIndex by 1, 2%2 === 0 which is first teams's index
*/

export const handleSwitchPlayerOrTeamCricket = (
   gameType: GameSettingsStates['gameType'],
   index: GameCricketSingleStates['currentPlayerIndex'] | GameCricketTeamsStates['currentTeamIndex'],
   currentPlayerIndexInTeam: GameCricketTeamsStates['currentPlayerIndexInTeam'],
   playersOrTeams: PlayerCricket[] | TeamCricket[],
   dispatch: AppDispatch
) => {
   const nextPlayerOrTeamIndex = (index + 1) % playersOrTeams.length

   if (gameType === 'single') {
      dispatch(setCurrentPlayerIndex(nextPlayerOrTeamIndex))
   } else {
      dispatch(setCurrentTeamIndex(nextPlayerOrTeamIndex))

      /* 
         SWITCH TO ANOTHER PLAYER WITHIN TEAM: 
         There are only two teams and two players in each team. When player 1 (team 1) throws, the function switches currentTeamIndex. When player 2 (team 2) has just thrown  nextPlayerOrTeamIndex === 0, what triggers updating curretPlayerIndexInTeam state
      */

      const team = playersOrTeams[0] as TeamCricket
      const updatedPlayerIndexInTeam =
      (currentPlayerIndexInTeam + 1) % team.members.length

      if (nextPlayerOrTeamIndex === 0) {
         dispatch(setCurrentPlayerIndexInTeam(updatedPlayerIndexInTeam))
      }
   }
}
