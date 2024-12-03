import { AppDispatch } from '@/redux/store'
import { 
   setCurrentPlayerIndex, 
   setCurrentThrow, 
   setHistory, 
   setThrowValueSum, 
   setCurrentPlayerThrowsCount, 
   setIsGameEnd, 
   setWinner, 
   InitializePlayersType 
} from '@/redux/slices/gameRegularSlice'

export const handleRestartGame = (
   dispatch: AppDispatch, 
   playerNames: string[], 
   gameMode: number | string, 
   isGameEnd: boolean, 
   initializePlayers: InitializePlayersType
) => {
   
   dispatch(initializePlayers({ playerNames, gameMode }))
   dispatch(setCurrentPlayerIndex(0))
   dispatch(setCurrentThrow(0))
   dispatch(setHistory([]))
   dispatch(setThrowValueSum(0))
   dispatch(setCurrentPlayerThrowsCount(0))

   if (isGameEnd) {
      dispatch(setIsGameEnd(false))
      dispatch(setWinner(null))
   }
}
