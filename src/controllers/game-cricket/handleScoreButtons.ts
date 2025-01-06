//Redux
import { AppDispatch } from '@/redux/store'
import { setError } from '@/redux/slices/gameSettingsSlice'
import { setCurrentPlayerThrowsCount, setCurrentPlayerThrows } from '@/redux/slices/gameSlice'
import { setCompletedSectors } from '@/redux/slices/game-cricket/gameCricketSlice'
import { 
   setPlayers, 
   setCurrentPlayerIndex, 
   setHistoryCricketSingle
} from '@/redux/slices/game-cricket/gameCricketSingleSlice'
import { 
   setTeams, 
   setCurrentTeamIndex, 
   setHistoryCricketTeams 
} from '@/redux/slices/game-cricket/gameCricketTeamsSlice'
//Controllers
import { handleSwitchStartPlayerOrTeamIndex } from '../handleSwitchStartPlayerOrTeamIndex'
import { handleSwitchPlayerOrTeamCricket } from './handleSwitchPlayerOrTeamCricket'
import { handleCheckGameEnd } from '../handleCheckGameEnd'
import { playSound } from '../playSound'
//Types
import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'
import { GameStates } from '@/types/redux/gameTypes'
import { 
   GameCricketSingleStates, 
   GameCricketTeamsStates, 
   PlayerCricket, 
   TeamCricket, 
   HistoryEntryCricketSingle,
   HistoryEntryCricketTeams, 
} from '@/types/redux/gameCricketTypes'

/* USED IN: ScoreButtonsCricket component */

export const handleScoreButtons = (
   sectorPassed: '20' | '19' | '18' | '17' | '16' | '15' | 'Bull', 
   label: string, 
   increment: number, 
   value: number,
   gameType: GameSettingsStates['gameType'],
   gameWin: GameSettingsStates['gameWin'],
   numberOfLegs: GameSettingsStates['numberOfLegs'],
   isSoundEnabled: GameStates['isSoundEnabled'],
   playersOrTeams: PlayerCricket[] | TeamCricket[],
   index: GameCricketSingleStates['currentPlayerIndex'] | GameCricketTeamsStates['currentTeamIndex'],
   currentPlayerIndexInTeam: GameCricketTeamsStates['currentPlayerIndexInTeam'],
   startIndex: GameStates['startIndex'],
   history: HistoryEntryCricketSingle[] | HistoryEntryCricketTeams[],
   currentPlayerThrowsCount: GameStates['currentPlayerThrowsCount'],
   currentPlayerThrows: GameStates['currentPlayerThrows'],
   dispatch: AppDispatch
) => {
   const gamePlayersOrTeams = JSON.parse(JSON.stringify(playersOrTeams))
   const currentPlayerOrTeam = gamePlayersOrTeams[index]
   const prevScores = currentPlayerOrTeam.scores[sectorPassed] 
   const updatedThrowCount = currentPlayerThrowsCount + 1
    
   if(currentPlayerThrows.length === 3) {
      dispatch(setError({isError: true, errorMessage: 'You have already thrown three times! You can either undo last throw or submit the score'}))
      return
      
   } else {
      const updatedPlayerThrows = [...currentPlayerThrows as string[], label]
      
      let newHistoryEntry: HistoryEntryCricketSingle | HistoryEntryCricketTeams
      switch(gameType) {
      case 'single':
         newHistoryEntry = {
            historyPlayerIndex: index,
            historyPoints: currentPlayerOrTeam.points, 
            historyScores: { ...currentPlayerOrTeam.scores },
            historyThrows: [...currentPlayerThrows],
            historyLegs: currentPlayerOrTeam.legs,
            historyLastThrowSector: sectorPassed
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
            historyLastThrowSector: sectorPassed
         } as HistoryEntryCricketTeams
         break
      default:
         throw new Error('Invalid gameType')
      }
       
      currentPlayerOrTeam.scores[sectorPassed] = Math.min(prevScores + increment, 3)
       
      //End leg scenario:
      const currentPlayerOrTeamHasCompletedAllSectors = Object.values(currentPlayerOrTeam.scores).every(sector => sector === 3)
      const currentPlayerHasHighestPoints = currentPlayerOrTeam.points === Math.max(...playersOrTeams.map(playerOrTeam => playerOrTeam.points))
 
      if(currentPlayerOrTeamHasCompletedAllSectors && currentPlayerHasHighestPoints){
         currentPlayerOrTeam.legs += 1
         
         dispatch(
            gameType === 'single'
               ? setHistoryCricketSingle([...history as HistoryEntryCricketSingle[], newHistoryEntry as HistoryEntryCricketSingle])
               : setHistoryCricketTeams([...history as HistoryEntryCricketTeams[], newHistoryEntry as HistoryEntryCricketTeams])
         )
 
         playersOrTeams.forEach(playerOrTeam => {
            playerOrTeam.points = 0
            playerOrTeam.scores = {
               '20': 0,
               '19': 0,
               '18': 0,
               '17': 0,
               '16': 0,
               '15': 0,
               'Bull': 0,
            }
         })
          
         dispatch(
            gameType === 'single'
               ? setPlayers(gamePlayersOrTeams)
               : setTeams(gamePlayersOrTeams)
         )
  
         handleSwitchStartPlayerOrTeamIndex(startIndex, playersOrTeams, dispatch)
         dispatch(
            gameType === 'single'
               ? setCurrentPlayerIndex((startIndex + 1) % playersOrTeams.length)
               : setCurrentTeamIndex((startIndex + 1) % playersOrTeams.length)
         )
         dispatch(setCurrentPlayerThrowsCount(0)) 
         dispatch(setCurrentPlayerThrows([])) 
         handleCheckGameEnd(playersOrTeams, gameWin, numberOfLegs, isSoundEnabled, dispatch)
         return
      }
      if (currentPlayerOrTeam.scores[sectorPassed] === 3) {
         const isAnyPlayerOrTeamWhichHaveNotCompletedSector = playersOrTeams.some((playerOrTeam, i) => 
            i !== index && playerOrTeam.scores[sectorPassed] !== 3
         )

         if(currentPlayerOrTeam.scores[sectorPassed] === 3 && prevScores !== 3 && !isAnyPlayerOrTeamWhichHaveNotCompletedSector){
            playSound(`${sectorPassed}completedclosed`, isSoundEnabled)
            dispatch(setCompletedSectors({ sector: sectorPassed, completed: true }))
         } else if(currentPlayerOrTeam.scores[sectorPassed] === 3 && prevScores !== 3){
            playSound(`${sectorPassed}completed`, isSoundEnabled)
         }
    
         if(isAnyPlayerOrTeamWhichHaveNotCompletedSector) {
            currentPlayerOrTeam.points += (prevScores + increment - currentPlayerOrTeam.scores[sectorPassed]) * (value/increment)      
         }
      }
      dispatch(
         gameType === 'single'
            ? setHistoryCricketSingle([...history as HistoryEntryCricketSingle[], newHistoryEntry as HistoryEntryCricketSingle])
            : setHistoryCricketTeams([...history as HistoryEntryCricketTeams[], newHistoryEntry as HistoryEntryCricketTeams])
      )
       
      if(updatedThrowCount < 3){
         dispatch(setCurrentPlayerThrows(updatedPlayerThrows as string[]))
         dispatch(setCurrentPlayerThrowsCount(updatedThrowCount))
      } else {
         let newExtraHistoryEntry: HistoryEntryCricketSingle | HistoryEntryCricketTeams
         switch(gameType) {
         case 'single':
            newExtraHistoryEntry = {
               historyPlayerIndex: index,
               historyPoints: currentPlayerOrTeam.points, 
               historyScores: { ...currentPlayerOrTeam.scores },
               historyThrows: [...currentPlayerThrows, label],
               historyLegs: currentPlayerOrTeam.legs,
               historyLastThrowSector: sectorPassed
            } as HistoryEntryCricketSingle
            break
         case 'teams':
            newExtraHistoryEntry = {
               historyTeamIndex: index,
               historyPlayerIndexInTeam: currentPlayerIndexInTeam,
               historyPoints: currentPlayerOrTeam.points, 
               historyScores: { ...currentPlayerOrTeam.scores },
               historyThrows: [...currentPlayerThrows, label],
               historyLegs: currentPlayerOrTeam.legs,
               historyLastThrowSector: sectorPassed
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
        
         handleSwitchPlayerOrTeamCricket(gameType, index, currentPlayerIndexInTeam, playersOrTeams, dispatch)
         dispatch(setCurrentPlayerThrowsCount(0)) 
         dispatch(setCurrentPlayerThrows([]))
      }
       
      dispatch(
         gameType === 'single'
            ? setPlayers(gamePlayersOrTeams)
            : setTeams(gamePlayersOrTeams)
      )

   }
}