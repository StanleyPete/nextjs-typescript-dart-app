import { socketService } from '@/socket/socket'
import { GameOnlineStates } from '@/types/redux/gameOnlineTypes'

export const handleSubmitThrowNumberButtonsOnline = (
   gameId: string,
   throwValue: number,
   multiplier: GameOnlineStates['multiplier']
) => {
   const multiplierThrowValue = throwValue * multiplier
   socketService.emitSubmitScoreNumberButtons(gameId, multiplierThrowValue, multiplier)

 
}


