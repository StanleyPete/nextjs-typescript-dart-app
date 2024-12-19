//Redux
import { AppDispatch } from '@/redux/store'
import { setIsGameEnd, setWinner } from '@/redux/slices/gameSlice'
//Controllers
import { playSound } from '@/controllers/playSound'
//Types
import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'
import { GameStates } from '@/types/redux/gameTypes'
import { PlayerClassic, TeamClassic } from '@/types/redux/gameClassicTypes'
import { PlayerCricket, TeamCricket } from '@/types/redux/gameCricketTypes'


/* USED IN: 
      game-classic:
         - handleSubmitThrowKeyboardButtons 
         - handleSubmitThrowNumberButtons 
      game-cricket:
         - handleScoreButtons
*/

export const handleCheckGameEnd = (
   gamePlayersOrTeams: PlayerClassic[] | TeamClassic[] | PlayerCricket[] | TeamCricket[],
   gameWin: GameSettingsStates['gameWin'],
   numberOfLegs: GameSettingsStates['numberOfLegs'],
   isSoundEnabled: GameStates['isSoundEnabled'],
   dispatch: AppDispatch
) => {
   //GAME WIN SET TO BEST-OF
   if (gameWin === 'best-of') {
      //Sum of legs for all players or teams
      const totalLegs = gamePlayersOrTeams.reduce(
         (acc: number, playerOrTeam: PlayerClassic | TeamClassic | PlayerCricket | TeamCricket) =>
            acc + playerOrTeam.legs,
         0
      )

      //Check if totalLegs for players or teams equals to number-of-legs parameter
      if (totalLegs === Number(numberOfLegs)) {
      //Finding winner player or team
         const maxLegs = Math.max(
            ...gamePlayersOrTeams.map(
               (playerOrTeam: PlayerClassic | TeamClassic | PlayerCricket | TeamCricket) => playerOrTeam.legs
            )
         )

         const winner =
        gamePlayersOrTeams.find(
           (playerOrTeam: PlayerClassic | TeamClassic | PlayerCricket | TeamCricket) =>
              playerOrTeam.legs === maxLegs
        ) || null

         dispatch(setIsGameEnd(true))
         dispatch(setWinner(winner))
         playSound('and-the-game', isSoundEnabled)
      } else {
         playSound('and-the-leg', isSoundEnabled)
      }
   }

   //GAME WIN SET TO FIRST TO
   else if (gameWin === 'first-to') {
      //Finding winner player
      const winner =
      gamePlayersOrTeams.find(
         (playerOrTeam: PlayerClassic | TeamClassic | PlayerCricket | TeamCricket) =>
            playerOrTeam.legs === Number(numberOfLegs)
      ) || null

      if (winner) {
         dispatch(setIsGameEnd(true))
         dispatch(setWinner(winner))
         playSound('and-the-game', isSoundEnabled)
      } else {
         playSound('and-the-leg', isSoundEnabled)
      }
   }
}
