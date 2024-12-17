import { createSelector } from 'reselect'
import { RootState } from '@/redux/store'

const selectGameSettings = (state: RootState) => state.gameSettings
const selectGameClassicSingle = (state: RootState) => state.gameClassicSingle
const selectGameClassicTeams = (state: RootState) => state.gameClassicTeams
const selectGameCricketSingle = (state: RootState) => state.gameCricketSingle
const selectGameCricketTeams = (state: RootState) => state.gameCricketTeams

//Current Player Throw Section Component:
export const selectDataInCurrentPlayerThrowSection = createSelector(
   [selectGameSettings, selectGameClassicSingle, selectGameClassicTeams, selectGameCricketSingle, selectGameCricketTeams],
   (gameSettings, gameClassicSingle, gameClassicTeams, gameCricketSingle, gameCricketTeams) => {
      if (gameSettings.gameMode === 'Cricket') {

         if (gameSettings.gameType === 'single') return {
            playersOrTeams: gameCricketSingle.players,
            index: gameCricketSingle.currentPlayerIndex,
            currentPlayerIndexInTeam: 0,
         }

         if (gameSettings.gameType === 'teams') return {
            playersOrTeams: gameCricketTeams.teams,
            index: gameCricketTeams.currentTeamIndex,
            currentPlayerIndexInTeam: gameCricketTeams.currentPlayerIndexInTeam,
         }
        
         return {
            playersOrTeams: [],
            index: 0,
            currentPlayerIndexInTeam: 0,
         }

      } else {

         if (gameSettings.gameType === 'single') return {
            playersOrTeams: gameClassicSingle.players,
            index: gameClassicSingle.currentPlayerIndex,
            currentPlayerIndexInTeam: 0,
         }

         if (gameSettings.gameType === 'teams') return {
            playersOrTeams: gameClassicTeams.teams,
            index: gameClassicTeams.currentTeamIndex,
            currentPlayerIndexInTeam: gameClassicTeams.currentPlayerIndexInTeam,
         }
        
         return {
            playersOrTeams: [],
            index: 0,
            currentPlayerIndexInTeam: 0,
         }

      }

   }

)