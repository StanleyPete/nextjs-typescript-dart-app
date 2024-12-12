import { AppDispatch } from '@/redux/store'
import { setStartIndex } from '@/redux/slices/gameClassicSlice'
import { PlayerClassic, TeamClassic, GameClassicStates } from '@/types/types'

/* Switch to another player or team starting the leg: 
       Example: If there are 4 players and startIndex === 3 (last player's turn), 
       after increasing startIndex by 1, 4%4 === 0 which is first player's index
*/

export const handleSwitchStartPlayerOrTeamIndex = (
   startIndex: GameClassicStates['startIndex'],
   playersOrTeams: PlayerClassic[] | TeamClassic[],
   dispatch: AppDispatch
) => {
   const nextStartPlayerOrTeamIndex = (startIndex + 1) % playersOrTeams.length
   dispatch(setStartIndex(nextStartPlayerOrTeamIndex))
}
