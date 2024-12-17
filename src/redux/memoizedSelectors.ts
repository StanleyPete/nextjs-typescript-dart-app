import { createSelector } from 'reselect'
import { RootState } from '@/redux/store'
import { PlayerClassic, PlayerCricket, TeamClassic, TeamCricket } from '@/types/types'

const selectGameSettings = (state: RootState) => state.gameSettings
const selectGameClassicSingle = (state: RootState) => state.gameClassicSingle
const selectGameClassicTeams = (state: RootState) => state.gameClassicTeams
const selectGameCricketSingle = (state: RootState) => state.gameCricketSingle
const selectGameCricketTeams = (state: RootState) => state.gameCricketTeams


//Game Classic Page:
export const selectDataInGameClassicPage = createSelector(
   [selectGameSettings, selectGameClassicSingle, selectGameClassicTeams],
   (gameSettings, gameClassicSingle, gameClassicTeams) => {
      if (gameSettings.gameType === 'single') {
         return {
            playersOrTeams: gameClassicSingle.players,
            history: gameClassicSingle.historyClassicSingle,
         }
      } else if (gameSettings.gameType === 'teams') {
         return {
            playersOrTeams: gameClassicTeams.teams,
            history: gameClassicTeams.historyClassicTeams,
         }
      }
  
      return {
         playersOrTeams: [],
         history: [],
      }
   }
)

export const selectDataInGameCricketPage = createSelector(
   [selectGameSettings, selectGameCricketSingle, selectGameCricketTeams],
   (gameSettings, gameCricketSingle, gameCricketTeams) => {
      if (gameSettings.gameType === 'single') {
         return {
            playersOrTeams: gameCricketSingle.players,
            history: gameCricketSingle.historyCricketSingle,
         }
      } else if (gameSettings.gameType === 'teams') {
         return {
            playersOrTeams: gameCricketTeams.teams,
            history: gameCricketTeams.historyCricketTeams,
         }
      }
  
      return {
         playersOrTeams: [],
         history: [],
      }
   }
)

//Current Player Throw Section Component:
export const selectDataInCurrentPlayerThrowSection = createSelector(
   [selectGameSettings, selectGameClassicSingle, selectGameClassicTeams, selectGameCricketSingle, selectGameCricketTeams],
   (gameSettings, gameClassicSingle, gameClassicTeams, gameCricketSingle, gameCricketTeams) => {
      if(gameSettings.gameMode === 'Cricket'){
         if (gameSettings.gameType === 'single') {
            return {
               playersOrTeams: gameCricketSingle.players,
               index: gameCricketSingle.currentPlayerIndex,
               currentPlayerIndexInTeam: 0
            }
         } else if (gameSettings.gameType === 'teams') {
            return {
               playersOrTeams: gameCricketTeams.teams,
               index: gameCricketTeams.currentTeamIndex,
               currentPlayerIndexInTeam: gameCricketTeams.currentPlayerIndexInTeam,
            }
         }
         return {
            playersOrTeams: [],
            index: 0,
            currentPlayerIndexInTeam: 0,
         }
      } else {
         if (gameSettings.gameType === 'single') {
            return {
               playersOrTeams: gameClassicSingle.players,
               index: gameClassicSingle.currentPlayerIndex,
               currentPlayerIndexInTeam: 0
            }
         } else if (gameSettings.gameType === 'teams') {
            return {
               playersOrTeams: gameClassicTeams.teams,
               index: gameClassicTeams.currentTeamIndex,
               currentPlayerIndexInTeam: gameClassicTeams.currentPlayerIndexInTeam,
            }
         }
         return {
            playersOrTeams: [],
            index: 0,
            currentPlayerIndexInTeam: 0,
         }
      }
   }
)

//Score Section Component:
export const selectDataInScoreSection = createSelector(
   [selectGameSettings, selectGameClassicSingle, selectGameClassicTeams],
   (gameSettings, gameClassicSingle, gameClassicTeams) => {
      if (gameSettings.gameType === 'single') {
         return {
            playersOrTeams: gameClassicSingle.players,
            index: gameClassicSingle.currentPlayerIndex,
          
         }
      } else if (gameSettings.gameType === 'teams') {
         return {
            playersOrTeams: gameClassicTeams.teams,
            index: gameClassicTeams.currentTeamIndex,
         
         }
      }
      return {
         playersOrTeams: [],
         index: 0,
        
      }
   }
)

//Throw Value Section and NumberButtons Components:
export const selectDataInThrowValueSectionOrNumberButtons = createSelector(
   [selectGameSettings, selectGameClassicSingle, selectGameClassicTeams],
   (gameSettings, gameClassicSingle, gameClassicTeams) => {
      if (gameSettings.gameType === 'single') {
         return {
            playersOrTeams: gameClassicSingle.players,
            index: gameClassicSingle.currentPlayerIndex,
            currentPlayerIndexInTeam: undefined,
            history: gameClassicSingle.historyClassicSingle
         }
      } else if (gameSettings.gameType === 'teams') {
         return {
            playersOrTeams: gameClassicTeams.teams,
            index: gameClassicTeams.currentTeamIndex,
            currentPlayerIndexInTeam: gameClassicTeams.currentPlayerIndexInTeam,
            history: gameClassicTeams.historyClassicTeams
         }
      }
      return {
         playersOrTeams: [],
         index: 0,
         currentPlayerIndexInTeam: 0,
         history: []
      }
   }
)

export const selectDataInThrowValueSectionCricket = createSelector(
   [selectGameSettings, selectGameCricketSingle, selectGameCricketTeams],
   (gameSettings, gameCricketSingle, gameCricketTeams) => {
      if (gameSettings.gameType === 'single') {
         return {
            playersOrTeams: gameCricketSingle.players,
            index: gameCricketSingle.currentPlayerIndex,
            currentPlayerIndexInTeam: undefined,
            history: gameCricketSingle.historyCricketSingle
         }
      } else if (gameSettings.gameType === 'teams') {
         return {
            playersOrTeams: gameCricketTeams.teams,
            index: gameCricketTeams.currentTeamIndex,
            currentPlayerIndexInTeam: gameCricketTeams.currentPlayerIndexInTeam,
            history: gameCricketTeams.historyCricketTeams
         }
      }
      return {
         playersOrTeams: [],
         index: 0,
         currentPlayerIndexInTeam: 0,
         history: []
      }
   }
)

//Keyboard Buttons and Game End Pop Up Components: 
export const selectDataInKeyboardButtonsOrGameEndPopUp = createSelector(
   [selectGameSettings, selectGameClassicSingle, selectGameClassicTeams, selectGameCricketSingle, selectGameCricketTeams],
   (gameSettings, gameClassicSingle, gameClassicTeams, gameCricketSingle, gameCricketTeams) => {
      if(gameSettings.gameMode === 'Cricket'){
         if (gameSettings.gameType === 'single') {
            return {
               playersOrTeams: gameCricketSingle.players as PlayerCricket[],
               index: gameCricketSingle.currentPlayerIndex,
               history: gameCricketSingle.historyCricketSingle
            } 
         } else if (gameSettings.gameType === 'teams'){
            return {
               playersOrTeams: gameCricketTeams.teams as TeamCricket[],
               index: gameCricketTeams.currentTeamIndex,
               history: gameCricketTeams.historyCricketTeams
            }
         }
         return {
            playersOrTeams: [],
            index: 0,
            history: []
         }

      } else {
            if (gameSettings.gameType === 'single') {
               return {
                  playersOrTeams: gameClassicSingle.players as PlayerClassic[],
                  index: gameClassicSingle.currentPlayerIndex,
                  history: gameClassicSingle.historyClassicSingle
               }
            } else if (gameSettings.gameType === 'teams') {
               return {
                  playersOrTeams: gameClassicTeams.teams as TeamClassic[],
                  index: gameClassicTeams.currentTeamIndex,
                  history: gameClassicTeams.historyClassicTeams
               }
            }
            return {
               playersOrTeams: [],
               index: 0,
               history: []
            }
         }
   }
)
 
