import { socketService } from '@/socket/socket'

export const handleToggleInputMethodOnline = (gameId: string) => {
   socketService.emitToggleInputMethod(gameId)
}
