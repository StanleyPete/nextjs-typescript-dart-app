//Redux
import { AppDispatch } from '@/redux/store'
import { setCurrentPlayerThrowsCount, setCurrentPlayerThrows } from '@/redux/slices/gameSlice'
import {setThrowValueSum } from '@/redux/slices/game-classic/gameClassicSlice'
import { setPlayers } from '@/redux/slices/game-classic/gameClassicSingleSlice'
import { setTeams } from '@/redux/slices/game-classic/gameClassicTeamsSlice'
//Types
import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'
import { GameStates } from '@/types/redux/gameTypes'
import { 
   GameClassicStates,
   GameClassicSingleStates,
   GameClassicTeamsStates, 
   PlayerClassic, 
   TeamClassic 
} from '@/types/redux/gameClassicTypes'


/* USED IN: ThrowValueSection component */

export const handleToggleInputMethod = (
   gameType: GameSettingsStates['gameType'],
   playersOrTeams: PlayerClassic[] | TeamClassic,
   index: GameClassicSingleStates['currentPlayerIndex'] | GameClassicTeamsStates['currentTeamIndex'],
   currentPlayerThrowsCount: GameStates['currentPlayerThrowsCount'],
   throwValueSum: GameClassicStates['throwValueSum'],
   dispatch: AppDispatch
) => {
   //Resetting values when toggle button clicked
   const gamePlayersOrTeams = JSON.parse(JSON.stringify(playersOrTeams))
   const currentPlayerOrTeam = gamePlayersOrTeams[index]
   if (currentPlayerThrowsCount > 0) {
      //Resetting pointsLeft and totalThrows values
      currentPlayerOrTeam.pointsLeft += throwValueSum
      currentPlayerOrTeam.totalThrows -= throwValueSum

      //Resetting throwValueSum, currentPlayerThrows and currentPlayersThrowsCount states
      dispatch(setThrowValueSum(0))
      dispatch(setCurrentPlayerThrows([]))
      dispatch(setCurrentPlayerThrowsCount(0))
   }

   //Switching isInputPreffered
   currentPlayerOrTeam.isInputPreffered = !currentPlayerOrTeam.isInputPreffered

   //Updating player's state
   dispatch(
      gameType === 'single'
         ? setPlayers(gamePlayersOrTeams)
         : setTeams(gamePlayersOrTeams)
   )
}
