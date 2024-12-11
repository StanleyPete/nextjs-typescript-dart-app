import { AppDispatch } from '@/redux/store'
import { setCurrentPlayerIndex } from '@/redux/slices/gameRegularSlice'
import { setCurrentTeamIndex, setCurrentPlayerIndexInTeam } from '@/redux/slices/gameRegularTeamsSlice'
import { Player, Team } from '@/types/types'

/* Switch to another player: 
       Example: If there are 4 players and currentPlayerIndex === 3 (last player's turn), 
       after increasing currentPlayerIndex by 1, 4%4 === 0 which is first player's index
*/

export const handleSwitchPlayer = (
   currentPlayerIndex: number,
   players: Player[],
   dispatch: AppDispatch
) => {
   const nextPlayerIndex = (currentPlayerIndex + 1) % players.length
   dispatch(setCurrentPlayerIndex(nextPlayerIndex))
}


/* Switch to another team: 
      Example: If there are 2 teams and currentTeamIndex === 1 (last player's turn), 
      after increasing currentPlayerIndex by 1, 2%2 === 0 which is first teams's index
*/

export const handleSwitchTeam = (
   currentTeamIndex: number,
   currentPlayerIndexInTeam: number,
   teams: Team[],
   dispatch: AppDispatch
) => {
   const nextTeamIndex = (currentTeamIndex + 1) % teams.length
   dispatch(setCurrentTeamIndex(nextTeamIndex))
   
   /* Switch to another player within team: 
         There are only two teams and two players in each team. When player 1 (team 1) throws, the function switches currentTeamIndex. When player 2 (team 2) throws nextTeamIndex === 0, what triggers updating curretPlayerIndexInTeam state
   */
   const updatedPlayerIndexInTeam = (currentPlayerIndexInTeam + 1) % teams[0].members.length
   if(nextTeamIndex === 0) {
      dispatch(setCurrentPlayerIndexInTeam(updatedPlayerIndexInTeam))
   }

}
