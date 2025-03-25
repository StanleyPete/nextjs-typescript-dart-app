import { socketService } from '@/socket/socket'

export const handleUndo = (gameId: string) => {
   socketService.emitUndo(gameId)
}
