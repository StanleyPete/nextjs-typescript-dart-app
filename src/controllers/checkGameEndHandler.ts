import { AppDispatch } from '@/redux/store'
import { Player, Team } from '@/types/types'
import { setIsGameEnd, setWinner } from '@/redux/slices/gameRegularSlice'
import { playSound } from '@/controllers/playSound'

export const checkGameEndHandlerRegular = (
   gamePlayers: Player[],
   gameWin: string,
   numberOfLegs: number,
   isSoundEnabled: boolean,
   dispatch: AppDispatch
) => {
   //Scenario when game type is set to best-of
   if (gameWin === 'best-of') {
      //Sum of legs for all players
      const totalLegs = gamePlayers.reduce(
         (acc: number, player: Player) => acc + player.legs,
         0
      )

      //Check if totalLegs for players equals to number-of-legs parameter
      if (totalLegs === Number(numberOfLegs)) {
      //Finding winner player
         const maxLegs = Math.max(
            ...gamePlayers.map((player: Player) => player.legs)
         )
         const winner =
        gamePlayers.find((player: Player) => player.legs === maxLegs) || null
         dispatch(setIsGameEnd(true))
         dispatch(setWinner(winner))
         playSound('and-the-game', isSoundEnabled)
      } else {
         playSound('and-the-leg', isSoundEnabled)
      }
   }
   //Scenario when game type is set to first-to
   else if (gameWin === 'first-to') {
      //Finding winner player
      const winner =
      gamePlayers.find(
         (player: Player) => player.legs === Number(numberOfLegs)
      ) || null
      console.log(winner)
      if (winner) {
         dispatch(setIsGameEnd(true))
         dispatch(setWinner(winner))
         playSound('and-the-game', isSoundEnabled)
      } else {
         playSound('and-the-leg', isSoundEnabled)
      }
   }
}

export const checkGameEndHandlerTeams = (
   gameTeams: Team[],
   gameWin: string,
   numberOfLegs: number,
   isSoundEnabled: boolean,
   dispatch: AppDispatch
) => {
   //Scenario when game type is set to best-of
   if (gameWin === 'best-of') {
      //Sum of legs for all players
      const totalLegs = gameTeams.reduce(
         (acc: number, team: Team) => acc + team.legs,
         0
      )

      //Check if totalLegs for players equals to number-of-legs parameter
      if (totalLegs === Number(numberOfLegs)) {
      //Finding winner player
         const maxLegs = Math.max(
            ...gameTeams.map((team: Team) => team.legs)
         )
         const winner =
        gameTeams.find((team: Team) => team.legs === maxLegs) || null
         dispatch(setIsGameEnd(true))
         dispatch(setWinner(winner))
         playSound('and-the-game', isSoundEnabled)
      } else {
         playSound('and-the-leg', isSoundEnabled)
      }
   }
   //Scenario when game type is set to first-to
   else if (gameWin === 'first-to') {
      //Finding winner player
      const winner =
      gameTeams.find(
         (team: Team) => team.legs === Number(numberOfLegs)
      ) || null
      console.log(winner)
      if (winner) {
         dispatch(setIsGameEnd(true))
         dispatch(setWinner(winner))
         playSound('and-the-game', isSoundEnabled)
      } else {
         playSound('and-the-leg', isSoundEnabled)
      }
   }
}