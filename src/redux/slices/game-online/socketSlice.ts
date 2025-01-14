
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SocketState } from '@/types/redux/socketTypes'
import { Socket } from 'socket.io-client'

const initialState: SocketState = {
   socket: null, 
}


const socketSlice = createSlice({
   name: 'socket',
   initialState,
   reducers: {
      setSocket(state, action: PayloadAction<any>) {
         state.socket = action.payload
      }
   },
})

export const { setSocket } = socketSlice.actions

export default socketSlice.reducer