//Redux
import { AppDispatch } from '@/redux/store'
import { 
    setThrowValueSum, 
    setCurrentPlayerThrows, 
    setCurrentPlayerThrowsCount 
} from "@/redux/slices/gameClassicSlice"
import { setPlayers } from '@/redux/slices/gameClassicSingleSlice'
import { setTeams } from '@/redux/slices/gameClassicTeamsSlice'
//Types
import { 
    GameSettingsStates, 
    GameClassicStates, 
    GameClassicSingleStates, 
    GameClassicTeamsStates, 
    PlayerClassic, 
    TeamClassic
} from "@/types/types"

/* USED IN: ThrowValueSection component */

export const handleToggleInputMethod = (
    gameType: GameSettingsStates['gameType'],
    playersOrTeams: PlayerClassic[] | TeamClassic,
    index: GameClassicSingleStates['currentPlayerIndex'] | GameClassicTeamsStates['currentTeamIndex'],
    currentPlayerThrowsCount: GameClassicStates['currentPlayerThrowsCount'],
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
   dispatch(gameType === 'single' 
      ? setPlayers(gamePlayersOrTeams) 
      : setTeams(gamePlayersOrTeams))
}