import { setPlayers, setCurrentPlayerIndex, setCurrentThrow, setHistory, setThrowValueSum, setCurrentPlayerThrowsCount, setIsGameEnd, setWinner, Player } from '@/redux/slices/gameRegularSlice'
import { AppDispatch } from '@/redux/store'

export const handleRestartGame = (dispatch: AppDispatch, players: Player[], gameMode: number | string, isGameEnd: boolean) => {
   const gamePlayers = players.map(player => ({
      ...player,
      pointsLeft: Number(gameMode),
      legs: 0,
      lastScore: 0,
      totalThrows: 0,
      totalAttempts: 0,
      average: 0,
      isInputPreffered: true,
   }))

   dispatch(setPlayers(gamePlayers))
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
