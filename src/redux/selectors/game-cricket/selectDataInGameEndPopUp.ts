import { createSelector } from 'reselect'
import { RootState } from '@/redux/store'

const selectGameSettings = (state: RootState) => state.gameSettings
const selectGameCricketSingle = (state: RootState) => state.gameCricketSingle
const selectGameCricketTeams = (state: RootState) => state.gameCricketTeams

export const selectDataInGameEndPopUp = createSelector(
   [selectGameSettings, selectGameCricketSingle, selectGameCricketTeams],
   (gameSettings, gameCricketSingle, gameCricketTeams) => {
      if (gameSettings.gameType === 'single') return {
         playersOrTeams: gameCricketSingle?.players ?? [],
         history: gameCricketSingle?.historyCricketSingle ?? [] ,
      }
    
      if (gameSettings.gameType === 'teams') return {
         playersOrTeams: gameCricketTeams?.teams ?? [],
         history: gameCricketTeams?.historyCricketTeams ?? [],
      }

      return {
         playersOrTeams: [],
         history: [],
      }
   }
)