import { createSelector } from 'reselect'
import { RootState } from '@/redux/store'

const selectGameSettings = (state: RootState) => state.gameSettings
const selectGameClassicSingle = (state: RootState) => state.gameClassicSingle
const selectGameClassicTeams = (state: RootState) => state.gameClassicTeams

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

//Current Player Throw Section Component:
export const selectDataInCurrentPlayerThrowSection = createSelector(
   [selectGameSettings, selectGameClassicSingle, selectGameClassicTeams],
   (gameSettings, gameClassicSingle, gameClassicTeams) => {
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

//Keyboard Buttons and Game End Pop Up Components: 
export const selectDataInKeyboardButtonsOrGameEndPopUp = createSelector(
   [selectGameSettings, selectGameClassicSingle, selectGameClassicTeams],
   (gameSettings, gameClassicSingle, gameClassicTeams) => {
      if (gameSettings.gameType === 'single') {
         return {
            playersOrTeams: gameClassicSingle.players,
            index: gameClassicSingle.currentPlayerIndex,
            history: gameClassicSingle.historyClassicSingle
         }
      } else if (gameSettings.gameType === 'teams') {
         return {
            playersOrTeams: gameClassicTeams.teams,
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
)
 
