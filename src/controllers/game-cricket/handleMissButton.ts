//Redux
import { AppDispatch } from '@/redux/store'
import { setError } from '@/redux/slices/gameSettingsSlice'
import { setCurrentPlayerThrowsCount, setCurrentPlayerThrows } from '@/redux/slices/game-cricket/gameCricketSlice'
import { setHistoryCricketSingle } from '@/redux/slices/game-cricket/gameCricketSingleSlice'
import { setHistoryCricketTeams } from '@/redux/slices/game-cricket/gameCricketTeamsSlice'
//Controllers
import { handleSwitchPlayerOrTeamCricket } from './handleSwitchPlayerOrTeamCricket'
//Types
import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'
import { 
   GameCricketStates, 
   GameCricketSingleStates, 
   GameCricketTeamsStates, 
   PlayerCricket, 
   TeamCricket, 
   HistoryEntryCricketSingle, 
   HistoryEntryCricketTeams 
} from '@/types/redux/gameCricketTypes'

export const handleMissButton = (
   gameType: GameSettingsStates['gameType'],
   playersOrTeams: PlayerCricket[] | TeamCricket[],
   index: GameCricketSingleStates['currentPlayerIndex'] | GameCricketTeamsStates['currentTeamIndex'],
   currentPlayerIndexInTeam: GameCricketTeamsStates['currentPlayerIndexInTeam'],
   history: HistoryEntryCricketSingle[] | HistoryEntryCricketTeams[],
   currentPlayerThrowsCount: GameCricketStates['currentPlayerThrowsCount'],
   currentPlayerThrows: GameCricketStates['currentPlayerThrows'],
   dispatch: AppDispatch
) => {
   const gamePlayersOrTeams = JSON.parse(JSON.stringify(playersOrTeams))
   const currentPlayerOrTeam = gamePlayersOrTeams[index]
   const updatedThrowCount = currentPlayerThrowsCount + 1
   const updatedPlayerThrows = [...currentPlayerThrows, '0']
   
   let newHistoryEntry: HistoryEntryCricketSingle | HistoryEntryCricketTeams
   switch(gameType) {
   case 'single':
      newHistoryEntry = {
         historyPlayerIndex: index,
         historyPoints: currentPlayerOrTeam.points, 
         historyScores: { ...currentPlayerOrTeam.scores },
         historyThrows: [...currentPlayerThrows],
         historyLegs: currentPlayerOrTeam.legs,
         historyLastThrowSector: ''
      } as HistoryEntryCricketSingle
      break
   case 'teams':
      newHistoryEntry = {
         historyTeamIndex: index,
         historyPlayerIndexInTeam: currentPlayerIndexInTeam,
         historyPoints: currentPlayerOrTeam.points, 
         historyScores: { ...currentPlayerOrTeam.scores },
         historyThrows: [...currentPlayerThrows],
         historyLegs: currentPlayerOrTeam.legs,
         historyLastThrowSector: ''
      } as HistoryEntryCricketTeams
      break
   default:
      throw new Error('Invalid gameType')
   }
  

   //Scenario when undo button has been hit and currentPlayerThrowsCount === 3
   if(currentPlayerThrowsCount === 3){
      dispatch(setError({isError: true,  errorMessage: 'You have already thrown three times! You can either undo last throw or submit the score'}))
      return
   }

   dispatch(
      gameType === 'single'
         ? setHistoryCricketSingle([...history as HistoryEntryCricketSingle[], newHistoryEntry as HistoryEntryCricketSingle])
         : setHistoryCricketTeams([...history as HistoryEntryCricketTeams[], newHistoryEntry as HistoryEntryCricketTeams])
   )
    
    
   //Scenario when player has not thrown 3 times yet
   if(updatedThrowCount < 3){
      dispatch(setCurrentPlayerThrows(updatedPlayerThrows))
      dispatch(setCurrentPlayerThrowsCount(updatedThrowCount))
   } 
   //Scenario when player has just thrown 3 times and missed
   else {

      let newExtraHistoryEntry: HistoryEntryCricketSingle | HistoryEntryCricketTeams
      switch(gameType) {
      case 'single':
         newExtraHistoryEntry = {
            historyPlayerIndex: index,
            historyPoints: currentPlayerOrTeam.points, 
            historyScores: { ...currentPlayerOrTeam.scores },
            historyThrows: [...currentPlayerThrows, '0'],
            historyLegs: currentPlayerOrTeam.legs,
            historyLastThrowSector: ''
         } as HistoryEntryCricketSingle
         break
      case 'teams':
         newExtraHistoryEntry = {
            historyTeamIndex: index,
            historyPlayerIndexInTeam: currentPlayerIndexInTeam,
            historyPoints: currentPlayerOrTeam.points, 
            historyScores: { ...currentPlayerOrTeam.scores },
            historyThrows: [...currentPlayerThrows, '0'],
            historyLegs: currentPlayerOrTeam.legs,
            historyLastThrowSector: ''
         } as HistoryEntryCricketTeams
         break
      default:
         throw new Error('Invalid gameType')
      }
         
      dispatch(
         gameType === 'single'
            ? setHistoryCricketSingle([...history as HistoryEntryCricketSingle[], newExtraHistoryEntry as HistoryEntryCricketSingle])
            : setHistoryCricketTeams([...history as HistoryEntryCricketTeams[], newExtraHistoryEntry as HistoryEntryCricketTeams])
      )
    
      handleSwitchPlayerOrTeamCricket(gameType, index,currentPlayerIndexInTeam, playersOrTeams, dispatch)
      dispatch(setCurrentPlayerThrowsCount(0))
      dispatch(setCurrentPlayerThrows([]))
   }
    
}