
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SocketState } from '@/types/redux/socketTypes'

const initialState: SocketState = {
   socket: null, 
   role: null,
   gameId: null,
}


const socketSlice = createSlice({
   name: 'socket',
   initialState,
   reducers: {
      setSocket(state, action: PayloadAction<any>) {
         state.socket = action.payload
      },
      setRole(state, action: PayloadAction<'host' | 'guest' | null>){
         state.role = action.payload
      },
      setGameId(state, action: PayloadAction<string>){
         state.gameId = action.payload
      }
   },
})

export const { setSocket, setRole, setGameId } = socketSlice.actions

export default socketSlice.reducer