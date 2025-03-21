import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { joinRoomTypes } from '@/types/redux/joinRoomTypes'

const initialState: joinRoomTypes = {
   isLoading: true,
   gameFound: false,
   message: '',
   currentPlayersInLobby: [],
   isLobbyJoined: false
}

const joinRoomSlice = createSlice({
   name: 'joinRoom',
   initialState,
   reducers: {
      setIsLoading(state, action: PayloadAction<boolean>) {
         state.isLoading = action.payload
      },
      setGameFound(state, action: PayloadAction<boolean>){
         state.gameFound = action.payload
      },
      setMessage(state, action: PayloadAction<string>){
         state.message = action.payload
      },
      setCurrentPlayersInLobby(state, action: PayloadAction<string[]>) {
         state.currentPlayersInLobby = action.payload
      },
      setIsLobbyJoined(state, action: PayloadAction<boolean>) {
         state.isLobbyJoined = action.payload
      },
   },
})

export const {
   setIsLoading,
   setGameFound,
   setMessage,
   setCurrentPlayersInLobby,
   setIsLobbyJoined,
} = joinRoomSlice.actions

export default joinRoomSlice.reducer
