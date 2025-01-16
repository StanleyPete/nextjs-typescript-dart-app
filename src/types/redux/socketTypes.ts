
import { Socket } from 'socket.io-client'

export type SocketState = {
  socket: Socket | null
  role: 'host' | 'guest' | null
}