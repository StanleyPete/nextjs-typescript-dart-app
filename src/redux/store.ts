import { combineReducers, configureStore, Reducer } from '@reduxjs/toolkit'
import gameSettingsReducer from './slices/gameSettingsSlice'
import gameReducer from './slices/gameSlice'
import gameClassicReducer from './slices/game-classic/gameClassicSlice'
import gameClassicSingleReducer from './slices/game-classic/gameClassicSingleSlice'
import gameClassicTeamsReducer from './slices/game-classic/gameClassicTeamsSlice'
import gameCricketReducer from './slices/game-cricket/gameCricketSlice'
import gameCricketSingleReducer from './slices/game-cricket/gameCricketSingleSlice'
import gameCricketTeamsReducer from './slices/game-cricket/gameCricketTeamsSlice'
import socketReducer from './slices/game-online/socketSlice'
import gameOnlineReducer from './slices/game-online/gameOnlineSlice'


//Types
import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'
import { GameStates } from '@/types/redux/gameTypes'
import { 
   GameClassicStates,
   GameClassicSingleStates, 
   GameClassicTeamsStates 
} from '@/types/redux/gameClassicTypes'
import {
   GameCricketStates, 
   GameCricketSingleStates, 
   GameCricketTeamsStates 
} from '@/types/redux/gameCricketTypes'
import { SocketState } from '@/types/redux/socketTypes'
import { GameOnlineStates } from '@/types/redux/gameOnlineTypes'



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
export const addGameClassicSingleStates = () => {
   rootReducer = combineReducers({
      gameSettings: gameSettingsReducer,
      game: gameReducer,
      gameClassic: gameClassicReducer,
      gameClassicSingle: gameClassicSingleReducer,
   })

   store.replaceReducer(rootReducer)
}

//Add Game Classic Teams States (only for 301, 501, 701, 1001 modes)
export const addGameClassicTeamsStates = () => {
   rootReducer = combineReducers({
      gameSettings: gameSettingsReducer,
      game: gameReducer,
      gameClassic: gameClassicReducer,
      gameClassicTeams: gameClassicTeamsReducer,
   })

   store.replaceReducer(rootReducer)
}

//Add Game Cricket Single States (only for Cricket mode)
export const addGameCricketSingleStates = () => {
   rootReducer = combineReducers({
      gameSettings: gameSettingsReducer,
      game: gameReducer,
      gameCricket: gameCricketReducer,
      gameCricketSingle: gameCricketSingleReducer,
   })

   store.replaceReducer(rootReducer)
}

//Add Game Cricket Teams States (only for Cricket mode)
export const addGameCricketTeamsStates = () => {
   rootReducer = combineReducers({
      gameSettings: gameSettingsReducer,
      game: gameReducer,
      gameCricket: gameCricketReducer,
      gameCricketTeams: gameCricketTeamsReducer,
   })

   store.replaceReducer(rootReducer)
}



//Add Socket States (only game-online)
export const addSocketState = () => {
   rootReducer = combineReducers({
      socket: socketReducer,
      gameSettings: gameSettingsReducer,
      gameOnline: gameOnlineReducer,
   })

   store.replaceReducer(rootReducer)
}

export const resetStates = () => {
   rootReducer = combineReducers({
      gameSettings: gameSettingsReducer,
   })

   store.replaceReducer(rootReducer)
}

export type RootState = {
  gameSettings: GameSettingsStates
  game: GameStates
  gameClassic: GameClassicStates
  gameClassicSingle: GameClassicSingleStates
  gameClassicTeams: GameClassicTeamsStates
  gameCricket: GameCricketStates
  gameCricketSingle: GameCricketSingleStates
  gameCricketTeams: GameCricketTeamsStates
  socket: SocketState
  gameOnline: GameOnlineStates
};
export type AppDispatch = typeof store.dispatch
