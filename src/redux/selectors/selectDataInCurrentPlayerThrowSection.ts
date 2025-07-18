import { createSelector } from 'reselect'
import { RootState } from '@/redux/store'

const selectGameSettings = (state: RootState) => state.gameSettings
const selectGame = (state: RootState) => state.game
const selectGameClassicSingle = (state: RootState) => state.gameClassicSingle
const selectGameClassicTeams = (state: RootState) => state.gameClassicTeams
const selectGameCricketSingle = (state: RootState) => state.gameCricketSingle
const selectGameCricketTeams = (state: RootState) => state.gameCricketTeams


export const selectIsSoundEnabled = createSelector(
   [selectGame], (game) => {
      return { isSoundEnabled: game?.isSoundEnabled ?? true } 
   }
)
export const selectDataInCurrentPlayerThrowSection = createSelector(
   [selectGameSettings, selectGameClassicSingle, selectGameClassicTeams, selectGameCricketSingle, selectGameCricketTeams],
   (gameSettings, gameClassicSingle, gameClassicTeams, gameCricketSingle, gameCricketTeams) => {
      if (gameSettings.gameMode === 'Cricket') {

         if (gameSettings.gameType === 'single') return {
            playersOrTeams: gameCricketSingle?.players ?? [],
            index: gameCricketSingle?.currentPlayerIndex ?? 0,
            currentPlayerIndexInTeam: 0,
         }

         if (gameSettings.gameType === 'teams') return {
            playersOrTeams: gameCricketTeams?.teams ?? [],
            index: gameCricketTeams?.currentTeamIndex ?? 0,
            currentPlayerIndexInTeam: gameCricketTeams?.currentPlayerIndexInTeam ?? 0,
         }
        
         return {
            playersOrTeams: [],
            index: 0,
            currentPlayerIndexInTeam: 0,
         }

      } else {

         if (gameSettings.gameType === 'single') return {
            playersOrTeams: gameClassicSingle?.players ?? [],
            index: gameClassicSingle?.currentPlayerIndex ?? 0,
            currentPlayerIndexInTeam: 0,
         }

         if (gameSettings.gameType === 'teams') return {
            playersOrTeams: gameClassicTeams?.teams ?? [],
            index: gameClassicTeams?.currentTeamIndex ?? 0,
            currentPlayerIndexInTeam: gameClassicTeams?.currentPlayerIndexInTeam ?? 0,
         }
        
         return {
            playersOrTeams: [],
            index: 0,
            currentPlayerIndexInTeam: 0,
         }

      }

   }

)