import { createSelector } from 'reselect'
import { RootState } from '@/redux/store'

const selectGameSettings = (state: RootState) => state.gameSettings
const selectGameCricketSingle = (state: RootState) => state.gameCricketSingle
const selectGameCricketTeams = (state: RootState) => state.gameCricketTeams

export const selectDataInScoreButtons = createSelector(
   [selectGameSettings, selectGameCricketSingle, selectGameCricketTeams],
   (gameSettings, gameCricketSingle, gameCricketTeams) => {
      if (gameSettings.gameType === 'single') return {
         playersOrTeams: gameCricketSingle?.players ?? [],
         playerOrTeamIndex: gameCricketSingle?.currentPlayerIndex ?? 0,
         currentPlayerIndexInTeam: 0,
         history: gameCricketSingle?.historyCricketSingle ?? []
      }
    
      if (gameSettings.gameType === 'teams') return {
         playersOrTeams: gameCricketTeams?.teams ?? [],
         playerOrTeamIndex: gameCricketTeams?.currentTeamIndex ?? 0,
         currentPlayerIndexInTeam: gameCricketTeams?.currentPlayerIndexInTeam ?? 0,
         history: gameCricketTeams?.historyCricketTeams ?? []
      }

      return {
         playersOrTeams: [],
         playerOrTeamIndex: 0,
         currentPlayerIndexInTeam: 0,
         history: []
      }
   }
)