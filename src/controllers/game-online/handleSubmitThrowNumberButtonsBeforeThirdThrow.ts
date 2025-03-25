import { socketService } from '@/socket/socket'

export const handleSubmitThrowNumberButtonsBeforeThirdThrow = (gameId: string) => {
   socketService.emitSubmitScoreNumberButtonsBeforeThirdThrow(gameId)
}
