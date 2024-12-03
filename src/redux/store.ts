import { 
   combineReducers, 
   configureStore,
   Reducer 
} from '@reduxjs/toolkit'
import gameSettingsReducer, { GameSettingsState } from './slices/gameSettingsSlice'
import gameRegularReducer, { GameRegularState } from './slices/gameRegularSlice'
import gameRegularTeams, { GameRegularTeamsState } from './slices/gameRegularTeamsSlice'

//Initial store setup
export const store = configureStore({
   reducer: {
      gameSettings: gameSettingsReducer,
   },
})

let rootReducer: Reducer = combineReducers({
   gameSettings: gameSettingsReducer,
})

//Adding game regular reducer
export const addGameRegularReducer = () => {
   rootReducer = combineReducers({
      gameSettings: gameSettingsReducer,
      gameRegular: gameRegularReducer,
   })

   store.replaceReducer(rootReducer)
   // console.log('addGameRegularReducer function completed')
}

//Adding game regular reducer
export const addGameRegularTeamsReducer = () => {
   rootReducer = combineReducers({
      gameSettings: gameSettingsReducer,
      gameRegularTeams: gameRegularTeams,
   })

   store.replaceReducer(rootReducer)
   // console.log('addGameRegularReducer function completed')
}

export const resetReducer = () => {
   rootReducer = combineReducers({
      gameSettings: gameSettingsReducer,
   })

   store.replaceReducer(rootReducer)
   // console.log('resetReducer function completed')
}


export type RootState = {
  gameSettings: GameSettingsState
  gameRegular: GameRegularState
  gameRegularTeams: GameRegularTeamsState
}
export type AppDispatch = typeof store.dispatch


