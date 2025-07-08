import { createSelector } from 'reselect'
import { RootState } from '@/redux/store'

const selectGameSettings = (state: RootState) => state.gameSettings
const selectGameClassicSingle = (state: RootState) => state.gameClassicSingle
const selectGameClassicTeams = (state: RootState) => state.gameClassicTeams

export const selectDataInScoreSection = createSelector(
   [selectGameSettings, selectGameClassicSingle, selectGameClassicTeams],
   (gameSettings, gameClassicSingle, gameClassicTeams) => {

      if (gameSettings.gameType === 'single') return {
         playersOrTeams: gameClassicSingle?.players ?? [],
         index: gameClassicSingle?.currentPlayerIndex ?? 0,
      }

      if (gameSettings.gameType === 'teams') return {
         playersOrTeams: gameClassicTeams?.teams ?? [],
         index: gameClassicTeams?.currentTeamIndex ?? 0,
      }
      
      return {
         playersOrTeams: [],
         index: 0,
      }
   }
)