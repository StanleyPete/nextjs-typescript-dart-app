import { 
   combineReducers, 
   configureStore,
   Reducer 
} from '@reduxjs/toolkit'
import gameSettingsReducer, { GameSettingsState } from './slices/gameSettingsSlice'
import gameRegularReducer, { GameRegularState } from './slices/gameRegularSlice'

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
}


export type RootState = {
  gameSettings: GameSettingsState
  gameRegular: GameRegularState
}
export type AppDispatch = typeof store.dispatch


