import { AppDispatch } from '@/redux/store'
import { setStartPlayerIndex } from '@/redux/slices/gameRegularSlice'
import { setStartTeamIndex } from '@/redux/slices/gameRegularTeamsSlice'
import { Player, Team } from '@/types/types'

/* Switch to another player who starts the leg: 
       Example: If there are 4 players and startPlayerIndex === 3 (last player's turn), 
       after increasing startPlayerIndex by 1, 4%4 === 0 which is first team's index
*/

export const handleSwitchStartPlayerIndex = (
   startPlayerIndex: number,
   players: Player[],
   dispatch: AppDispatch
) => {
   const nextPlayerIndex = (startPlayerIndex + 1) % players.length
   dispatch(setStartPlayerIndex(nextPlayerIndex))
}

/* Switch to another team who starts the leg: 
       Example: there are 2 teams and startTeamIndex === 3 (last player's turn), 
       after increasing startTeamIndex by 1, 4%4 === 0 which is first team's index
*/

export const handleSwitchStartTeamIndex = (
   startTeamIndex: number,
   teams: Team[],
   dispatch: AppDispatch
) => {
   const nextStartTeamIndex = (startTeamIndex + 1) % teams.length
   dispatch(setStartTeamIndex(nextStartTeamIndex))
}
