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
import { GameClassicStates, GameClassicSingleStates, GameClassicTeamsStates } from '@/types/redux/gameClassicTypes'
import { GameCricketStates, GameCricketSingleStates, GameCricketTeamsStates } from '@/types/redux/gameCricketTypes'
import { GameOnlineStates } from '@/types/redux/gameOnlineTypes'
import { joinRoomTypes } from '@/types/redux/joinRoomTypes'


function loadStateFromSessionStorage() {
   if (typeof window === 'undefined') return undefined

   const serializedStateSingle = sessionStorage.getItem('storeGameSingle')
   const serializedStateTeams = sessionStorage.getItem('storeGameTeams')
   const serializedStateCricketSingle = sessionStorage.getItem('storeGameCricketSingle')
   const serializedStateCricketTeams = sessionStorage.getItem('storeGameCricketTeams')
   const serializedStateGameOnline = sessionStorage.getItem('storeGameOnline')

   if (serializedStateSingle === null 
      && serializedStateTeams === null 
      && serializedStateCricketSingle === null
      && serializedStateCricketTeams === null
      && serializedStateGameOnline === null
   ) return

   if (serializedStateSingle) {
      sessionStorage.removeItem('storeGameSingle')
      return {state: JSON.parse(serializedStateSingle), type: 'single'}  
   }

   if (serializedStateTeams) {
      sessionStorage.removeItem('storeGameTeams')
      return {state: JSON.parse(serializedStateTeams), type: 'teams'} 
   }

   if (serializedStateCricketSingle) {
      sessionStorage.removeItem('storeGameCricketSingle')
      return {state: JSON.parse(serializedStateCricketSingle), type: 'cricketSingle'}  
   }

   if (serializedStateCricketTeams) {
      sessionStorage.removeItem('storeGameCricketTeams')
      return {state: JSON.parse(serializedStateCricketTeams), type: 'cricketTeams'}  
   }

   if (serializedStateGameOnline) {
      sessionStorage.removeItem('storeGameOnline')
      return {state: JSON.parse(serializedStateGameOnline), type: 'gameOnline'}  
   }
}

const persistedState = loadStateFromSessionStorage()

let rootReducer: Reducer
let preloadedState

if (persistedState) {
   preloadedState = persistedState.state

   if(persistedState.type === 'single'){
      rootReducer = combineReducers({
         gameSettings: gameSettingsReducer,
         game: gameReducer,
         gameClassic: gameClassicReducer,
         gameClassicSingle: gameClassicSingleReducer
      })
      
   } else if (persistedState.type === 'teams') {
      rootReducer = combineReducers({
         gameSettings: gameSettingsReducer,
         game: gameReducer,
         gameClassic: gameClassicReducer,
         gameClassicTeams: gameClassicTeamsReducer,
      })
      
   } else if (persistedState.type === 'cricketSingle') {
      rootReducer = combineReducers({
         gameSettings: gameSettingsReducer,
         game: gameReducer,
         gameCricket: gameCricketReducer,
         gameCricketSingle: gameCricketSingleReducer,
      })
   } else if (persistedState.type === 'cricketTeams') {
      rootReducer = combineReducers({
         gameSettings: gameSettingsReducer,
         game: gameReducer,
         gameCricket: gameCricketReducer,
         gameCricketTeams: gameCricketTeamsReducer,
      })
   } else if (persistedState.type === 'gameOnline') {
      rootReducer = combineReducers({
         gameSettings: gameSettingsReducer,
         gameOnline: gameOnlineReducer,
         joinRoom: joinRoomReducer
      })
   } else {
      rootReducer = combineReducers({
         gameSettings: gameSettingsReducer,
      })
   }
} else {
   rootReducer = combineReducers({
      gameSettings: gameSettingsReducer,
   })
}

export const store = configureStore({
   reducer: rootReducer,
   preloadedState
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
