import { createSelector } from 'reselect'
import { RootState } from '@/redux/store'

const selectGameSettings = (state: RootState) => state.gameSettings
const selectGameCricketSingle = (state: RootState) => state.gameCricketSingle
const selectGameCricketTeams = (state: RootState) => state.gameCricketTeams

export const selectDataInThrowValueSection = createSelector(
   [selectGameSettings, selectGameCricketSingle, selectGameCricketTeams],
   (gameSettings, gameCricketSingle, gameCricketTeams) => {

      if (gameSettings.gameType === 'single') return {
         playersOrTeams: gameCricketSingle.players,
         index: gameCricketSingle.currentPlayerIndex,
         currentPlayerIndexInTeam: undefined,
         history: gameCricketSingle.historyCricketSingle,
      }

      if (gameSettings.gameType === 'teams') return {
         playersOrTeams: gameCricketTeams.teams,
         index: gameCricketTeams.currentTeamIndex,
         currentPlayerIndexInTeam: gameCricketTeams.currentPlayerIndexInTeam,
         history: gameCricketTeams.historyCricketTeams,
      }

      return {
         playersOrTeams: [],
         index: 0,
         currentPlayerIndexInTeam: 0,
         history: [],
      }
   }
)
  