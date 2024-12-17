//Redux
import { AppDispatch } from '@/redux/store'
import {
   setCurrentPlayerThrowsCount,
   setCurrentPlayerThrows,
   setCompletedSectors,
} from '@/redux/slices/game-cricket/gameCricketSlice'
import {
   setPlayers,
   setCurrentPlayerIndex,
   setHistoryCricketSingle,
} from '@/redux/slices/game-cricket/gameCricketSingleSlice'
import {
   setTeams,
   setCurrentTeamIndex,
   setCurrentPlayerIndexInTeam,
   setHistoryCricketTeams,
} from '@/redux/slices/game-cricket/gameCricketTeamsSlice'
//Types
import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'
import { 
   GameCricketStates, 
   PlayerCricket, 
   TeamCricket, 
   HistoryEntryCricketSingle,
   HistoryEntryCricketTeams 
} from '@/types/redux/gameCricketTypes'


export const handleUndoCricket = (
   gameType: GameSettingsStates['gameType'],
   playersOrTeams: PlayerCricket[] | TeamCricket[],
   history: HistoryEntryCricketSingle[] | HistoryEntryCricketTeams[],
   currentPlayerThrowsCount: GameCricketStates['currentPlayerThrowsCount'],
   dispatch: AppDispatch
) => {
   const lastEntry = history[history.length - 1]
   if (!lastEntry) return
   const gamePlayersOrTeams = JSON.parse(JSON.stringify(playersOrTeams))
   const currentPlayerOrTeam =
    'historyPlayerIndex' in lastEntry
       ? gamePlayersOrTeams[lastEntry.historyPlayerIndex]
       : gamePlayersOrTeams[lastEntry.historyTeamIndex]
   const lastThrowSector: '20' | '19' | '18' | '17' | '16' | '15' | 'Bull' | '' =
    lastEntry.historyLastThrowSector

   //SCENARIO WHEN PLAYER OR TEAM HAS THROWN AT LEAST ONCE
   if (currentPlayerThrowsCount !== 0) {
      const updatedThrowCount = currentPlayerThrowsCount - 1
      dispatch(setCurrentPlayerThrowsCount(updatedThrowCount))
   }
   //SCENARIO WHEN PREVIOUS PLAYER OR TEAM HAS JUST WON THE LEG
   else if (
      currentPlayerThrowsCount === 0 &&
    currentPlayerOrTeam.legs > lastEntry.historyLegs
   ) {
      currentPlayerOrTeam.legs -= 1
      dispatch(setCurrentPlayerThrowsCount(lastEntry.historyThrows.length))

      gamePlayersOrTeams.forEach(
         (playerOrTeam: PlayerCricket | TeamCricket, index: number) => {
            if ('historyPlayerIndex' in lastEntry) {
               if (index !== lastEntry.historyPlayerIndex) {
                  const playerLastHistoryEntry = [
                     ...(history as HistoryEntryCricketSingle[]),
                  ]
                     .reverse()
                     .find((entry) => entry.historyPlayerIndex === index)

                  if (playerLastHistoryEntry) {
                     playerOrTeam.points = playerLastHistoryEntry.historyPoints
                     playerOrTeam.scores = { ...playerLastHistoryEntry.historyScores }
                  }
               }
            } else {
               if (index !== lastEntry.historyTeamIndex) {
                  const teamLastHistoryEntry = [
                     ...(history as HistoryEntryCricketTeams[]),
                  ]
                     .reverse()
                     .find((entry) => entry.historyTeamIndex === index)

                  if (teamLastHistoryEntry) {
                     playerOrTeam.points = teamLastHistoryEntry.historyPoints
                     playerOrTeam.scores = { ...teamLastHistoryEntry.historyScores }
                  }
               }
            }
         }
      )
   }
   //SCENARIO WHEN PLAYER OR TEAM HAS NOT THROWN YET
   else if (currentPlayerThrowsCount === 0) {
      dispatch(setCurrentPlayerThrowsCount(lastEntry.historyThrows.length))
   }

   //Updating points/scores
   currentPlayerOrTeam.points = lastEntry.historyPoints
   currentPlayerOrTeam.scores = { ...lastEntry.historyScores }

   //Checking if undo caused change in completedSectors state
   const isAnyPlayerOrTeamWhichHaveNotCompletedSector = playersOrTeams.some(
      (playerOrTeam) => playerOrTeam.scores[lastThrowSector] !== 3
   )
   if (isAnyPlayerOrTeamWhichHaveNotCompletedSector) {
      dispatch(
         setCompletedSectors({ sector: lastThrowSector, completed: false })
      )
   }

   //States update:
   if (gameType === 'single' && 'historyPlayerIndex' in lastEntry) {
      dispatch(setCurrentPlayerIndex(lastEntry.historyPlayerIndex))
      dispatch(setCurrentPlayerThrows(lastEntry.historyThrows))
      dispatch(setPlayers(gamePlayersOrTeams))
      dispatch(
         setHistoryCricketSingle(
        history.slice(0, history.length - 1) as HistoryEntryCricketSingle[]
         )
      )
   } else if (gameType === 'teams' && 'historyTeamIndex' in lastEntry) {
      dispatch(setCurrentTeamIndex(lastEntry.historyTeamIndex))
      dispatch(setCurrentPlayerIndexInTeam(lastEntry.historyPlayerIndexInTeam))
      dispatch(setCurrentPlayerThrows(lastEntry.historyThrows))
      dispatch(setTeams(gamePlayersOrTeams))
      dispatch(
         setHistoryCricketTeams(
        history.slice(0, history.length - 1) as HistoryEntryCricketTeams[]
         )
      )
   }
}
