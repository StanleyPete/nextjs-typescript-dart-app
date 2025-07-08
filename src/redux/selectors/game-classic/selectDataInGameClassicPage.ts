import { createSelector } from 'reselect'
import { RootState } from '@/redux/store'

const selectGameSettings = (state: RootState) => state.gameSettings
const selectGameClassicSingle = (state: RootState) => state.gameClassicSingle
const selectGameClassicTeams = (state: RootState) => state.gameClassicTeams

export const selectDataInGameClassicPage = createSelector(
   [selectGameSettings, selectGameClassicSingle, selectGameClassicTeams],
   (gameSettings, gameClassicSingle, gameClassicTeams) => {
      if (gameSettings.gameType === 'single') return {
         playersOrTeams: gameClassicSingle?.players ?? [],
         history: gameClassicSingle?.historyClassicSingle ?? [],
      }

      if (gameSettings.gameType === 'teams') return {
         playersOrTeams: gameClassicTeams?.teams ?? [],
         history: gameClassicTeams?.historyClassicTeams ?? [],
      }
  
      return {
         playersOrTeams: [],
         history: [],
      }
      
   }
)