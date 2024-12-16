import { combineReducers, configureStore, Reducer } from '@reduxjs/toolkit'
import gameSettingsReducer from './slices/gameSettingsSlice'
import gameClassicReducer from './slices/game-classic/gameClassicSlice'
import gameClassicSingleReducer from './slices/game-classic/gameClassicSingleSlice'
import gameClassicTeamsReducer from './slices/game-classic/gameClassicTeamsSlice'
import gameCricketReducer from './slices/game-cricket/gameCricketSlice'
import gameCricketSingleReducer from './slices/game-cricket/gameCricketSingleSlice'
import gameCricketTeamsReducer from './slices/game-cricket/gameCricketTeamsSlice'
import {
   GameSettingsStates,
   GameClassicStates,
   GameClassicSingleStates,
   GameClassicTeamsStates,
   GameCricketStates,
   GameCricketSingleStates,
   GameCricketTeamsStates,
} from '@/types/types'

//Initial store setup
export const store = configureStore({
   reducer: {
      gameSettings: gameSettingsReducer,
   },
})

let rootReducer: Reducer = combineReducers({
   gameSettings: gameSettingsReducer,
})

//Add Game Classic Single States (only for 301, 501, 701, 1001 modes)
export const addGameClassicSingleReducer = () => {
   rootReducer = combineReducers({
      gameSettings: gameSettingsReducer,
      gameClassic: gameClassicReducer,
      gameClassicSingle: gameClassicSingleReducer,
   })

   store.replaceReducer(rootReducer)
}

//Add Game Classic Teams States (only for 301, 501, 701, 1001 modes)
export const addGameClassicTeamsReducer = () => {
   rootReducer = combineReducers({
      gameSettings: gameSettingsReducer,
      gameClassic: gameClassicReducer,
      gameClassicTeams: gameClassicTeamsReducer,
   })

   store.replaceReducer(rootReducer)
}

//Add Game Cricket Single States (only for Cricket mode)
export const addGameCricketSingleReducer = () => {
   rootReducer = combineReducers({
      gameSettings: gameSettingsReducer,
      gameCricket: gameCricketReducer,
      gameCricketSingle: gameCricketSingleReducer,
   })

   store.replaceReducer(rootReducer)
}

//Add Game Cricket Teams States (only for Cricket mode)
export const addGameCricketTeamsReducer = () => {
   rootReducer = combineReducers({
      gameSettings: gameSettingsReducer,
      gameCricket: gameCricketReducer,
      gameCricketTeams: gameCricketTeamsReducer,
   })

   store.replaceReducer(rootReducer)
}

export const resetReducer = () => {
   rootReducer = combineReducers({
      gameSettings: gameSettingsReducer,
   })

   store.replaceReducer(rootReducer)
}

export type RootState = {
  gameSettings: GameSettingsStates
  gameClassic: GameClassicStates
  gameClassicSingle: GameClassicSingleStates
  gameClassicTeams: GameClassicTeamsStates
  gameCricket: GameCricketStates
  gameCricketSingle: GameCricketSingleStates
  gameCricketTeams: GameCricketTeamsStates
}
export type AppDispatch = typeof store.dispatch
