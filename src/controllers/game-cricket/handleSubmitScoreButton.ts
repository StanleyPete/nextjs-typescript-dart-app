//Redux
import { AppDispatch } from '@/redux/store'
import { setCurrentPlayerThrowsCount, setCurrentPlayerThrows } from '@/redux/slices/game-cricket/gameCricketSlice'
import { setHistoryCricketSingle } from '@/redux/slices/game-cricket/gameCricketSingleSlice'
import { setHistoryCricketTeams } from '@/redux/slices/game-cricket/gameCricketTeamsSlice'
//Controllers:
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

export const handleSubmitScoreButton = (
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

   let newHistoryEntry: HistoryEntryCricketSingle | HistoryEntryCricketTeams
   switch (gameType) {
   case 'single':
      newHistoryEntry = {
         historyPlayerIndex: index,
         historyPoints: currentPlayerOrTeam.points,
         historyScores: { ...currentPlayerOrTeam.scores },
         historyThrows: [...currentPlayerThrows],
         historyLegs: currentPlayerOrTeam.legs,
         historyLastThrowSector: '',
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
         historyLastThrowSector: '',
      } as HistoryEntryCricketTeams
      break
   default:
      throw new Error('Invalid gameType')
   }

   //Scenario when player missed all 3 throws and hits submit score button
   if (currentPlayerThrowsCount === 0) {
      handleSwitchPlayerOrTeamCricket(gameType, index, currentPlayerIndexInTeam, playersOrTeams, dispatch )
      dispatch(setCurrentPlayerThrowsCount(0))
      dispatch(setCurrentPlayerThrows([]))
   }
   //Scenario when player has already thrown at least once, but NOT 3 times
   else if (currentPlayerThrowsCount < 3) {
      let sector: '20' | '19' | '18' | '17' | '16' | '15' | 'Bull' | ''

      const lastThrow = currentPlayerThrows[currentPlayerThrows.length - 1]
      if (lastThrow === '25' || lastThrow === '50') {
         sector = 'Bull'
      } else {
         sector = lastThrow.replace(/[^0-9]/g, '') as
        | '20'
        | '19'
        | '18'
        | '17'
        | '16'
        | '15'
      }

      newHistoryEntry.historyLastThrowSector = sector
   }

   dispatch(
      gameType === 'single'
         ? setHistoryCricketSingle([...(history as HistoryEntryCricketSingle[]), newHistoryEntry as HistoryEntryCricketSingle])
         : setHistoryCricketTeams([...(history as HistoryEntryCricketTeams[]), newHistoryEntry as HistoryEntryCricketTeams])
   )
  
   handleSwitchPlayerOrTeamCricket(gameType, index, currentPlayerIndexInTeam, playersOrTeams, dispatch)
   dispatch(setCurrentPlayerThrowsCount(0))
   dispatch(setCurrentPlayerThrows([]))
}
