import { combineReducers, configureStore, Reducer } from '@reduxjs/toolkit'
import gameSettingsReducer from './slices/gameSettingsSlice'
import gameReducer from './slices/gameSlice'
import gameClassicReducer from './slices/game-classic/gameClassicSlice'
import gameClassicSingleReducer from './slices/game-classic/gameClassicSingleSlice'
import gameClassicTeamsReducer from './slices/game-classic/gameClassicTeamsSlice'
import gameCricketReducer from './slices/game-cricket/gameCricketSlice'
import gameCricketSingleReducer from './slices/game-cricket/gameCricketSingleSlice'
import gameCricketTeamsReducer from './slices/game-cricket/gameCricketTeamsSlice'
import gameOnlineReducer from './slices/game-online/gameOnlineSlice'
import joinRoomReducer from './slices/game-online/joinRoomSlice'
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
import { GameOnlineStates } from '@/types/redux/gameOnlineTypes'
import { joinRoomTypes } from '@/types/redux/joinRoomTypes'


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



//Add Game Online States: 
export const addGameOnlineStates = () => {
   rootReducer = combineReducers({
      gameSettings: gameSettingsReducer,
      gameOnline: gameOnlineReducer,
      joinRoom: joinRoomReducer
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
  gameOnline: GameOnlineStates
  joinRoom: joinRoomTypes
};
export type AppDispatch = typeof store.dispatch
