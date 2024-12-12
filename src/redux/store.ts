import { combineReducers, configureStore, Reducer } from '@reduxjs/toolkit'
import gameSettingsReducer from './slices/gameSettingsSlice'
import gameClassicReducer from './slices/gameClassicSlice'
import gameClassicSingleReducer from './slices/gameClassicSingleSlice'
import gameClassicTeamsReducer from './slices/gameClassicTeamsSlice'
import {
   GameSettingsStates,
   GameClassicStates,
   GameClassicSingleStates,
   GameClassicTeamsStates,
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
};
export type AppDispatch = typeof store.dispatch
