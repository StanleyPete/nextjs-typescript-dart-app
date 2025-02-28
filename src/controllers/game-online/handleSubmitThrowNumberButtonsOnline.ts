//Redux
import { AppDispatch } from '@/redux/store'
import {
   setCurrentPlayerThrowsCount,
   setCurrentPlayerThrows,
} from '@/redux/slices/gameSlice'
import {
   setCurrentThrow,
   setThrowValueSum,
} from '@/redux/slices/game-classic/gameClassicSlice'
import {
   setPlayers,
   setHistoryClassicSingle,
   setCurrentPlayerIndex,
} from '@/redux/slices/game-classic/gameClassicSingleSlice'
import {
   setTeams,
   setHistoryClassicTeams,
   setCurrentTeamIndex,
} from '@/redux/slices/game-classic/gameClassicTeamsSlice'
//Controllers
import { handleSwitchPlayerOrTeamClassic } from '@/controllers/game-classic/handleSwitchPlayerOrTeamClassic'
import { handleSwitchStartPlayerOrTeamIndex } from '@/controllers/handleSwitchStartPlayerOrTeamIndex'
import { handleCheckGameEnd } from '@/controllers/handleCheckGameEnd'
import { playSound } from '@/controllers/playSound'
//Types
import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'
import { GameStates } from '@/types/redux/gameTypes'
import {
   GameClassicStates,
   GameClassicSingleStates,
   GameClassicTeamsStates,
   PlayerClassic,
   TeamClassic,
   HistoryEntryClassicSingle,
   HistoryEntryClassicTeams,
} from '@/types/redux/gameClassicTypes'
import { GameOnlineStates, PlayerOnline } from '@/types/redux/gameOnlineTypes'

/* USED IN: 
      NumberButtons component
      handles BUTTONS from 0 - 20 (with multiplier from 1 - 3) and Bull, Outer and Miss buttons 
*/

export const handleSubmitThrowNumberButtonsOnline = (
   throwValue: number,
   players: PlayerOnline[],
   index: GameOnlineStates['currentPlayerIndex'],
   throwValueSum: GameOnlineStates['throwValueSum'],
   currentPlayerThrowsCount: GameOnlineStates['currentPlayerThrowsCount'],
   currentPlayerThrows: GameOnlineStates['currentPlayerThrows'],
   multiplier: GameOnlineStates['multiplier'],
   isSoundEnabled: GameOnlineStates['isSoundEnabled'],
   dispatch: AppDispatch
) => {
   const gamePlayers = JSON.parse(JSON.stringify(players))
   const currentPlayers = gamePlayers[index]
   const multiplierThrowValue = throwValue * multiplier

 
   // Incrementing the currentPlayerThrowsCount to keep track of the throws
   const updatedThrowCount = currentPlayerThrowsCount + 1

   //SCENARIO WHEN PLAYER OR TEAM HAS NOT THROWN 3 TIMES YET
   if (updatedThrowCount < 3) {
      //Updating pointsLeft
      currentPlayers.pointsLeft -= multiplierThrowValue

      //End leg scenario when player has NOT thrown 3 times yet, multiplier === 2 and pointsLeft === 0
      if (multiplier === 2 && currentPlayers.pointsLeft === 0) {
        
         dispatch(setThrowValueSum(0))
         dispatch(setCurrentPlayerThrowsCount(0))
         dispatch(setCurrentPlayerThrows([]))
         dispatch(setCurrentThrow(0))
         return
      }

      //Scenario when player has not thrown 3 times yet but pointsLeft are equal or less than 1
      if (currentPlayers.pointsLeft <= 1) {
         currentPlayers.pointsLeft = newHistoryEntry.historyPointsLeft
         currentPlayers.lastScore = 0
         currentPlayers.totalThrows -= throwValueSum
         currentPlayers.attempts += 1
         currentPlayers.average =
        currentPlayers.totalThrows / currentPlayers.totalAttempts

         playSound('no-score', isSoundEnabled)
   
         dispatch(setThrowValueSum(0))
         dispatch(setCurrentPlayerThrowsCount(0))
         dispatch(setCurrentPlayerThrows([]))
         dispatch(setCurrentThrow(0))
         return
      }

      //Updating totalThrows, throwValueSum, currentPlayerThrows, currentPlayerThrowsCount (currentThrow in case player would like to switch input method)
      currentPlayers.totalThrows += multiplierThrowValue
      dispatch(setThrowValueSum(throwValueSum + multiplierThrowValue))
      dispatch(
         setCurrentPlayerThrows(
            [...(currentPlayerThrows as number[]), multiplierThrowValue].slice(-3)
         )
      )
      dispatch(setCurrentPlayerThrowsCount(updatedThrowCount))
      dispatch(setCurrentThrow(0))
   }

   //SCENARIO WHEN PLAYER OR TEAM HAS THROWN 3 TIMES:
   else {
      //Updating pointsLeft
      currentPlayers.pointsLeft -= multiplierThrowValue

      //End leg scenario when player has thrown already 3 times, multiplier === 2 and pointsLeft === 0
      if (multiplier === 2 && currentPlayers.pointsLeft === 0) {
         const newHistoryEntries = gamePlayers
            .map((playerOrTeam: PlayerClassic | TeamClassic, i: number) => {
               //NewHistoryEntry not created for currentPlayerIndex
               if (i === index) return null

               if (gameType === 'single')
                  return {
                     historyPlayerIndex: i,
                     historyPointsLeft: playerOrTeam.pointsLeft,
                     historyTotalThrows: playerOrTeam.totalThrows,
                     historyLastScore: playerOrTeam.lastScore,
                     historyLastAverage: playerOrTeam.average,
                     historyTotalAttempts: playerOrTeam.totalAttempts,
                  }

               if (gameType === 'teams')
                  return {
                     historyTeamIndex: i,
                     historyPlayerIndexInTeam:
                currentPlayerIndexInTeam - 1 === -1
                   ? 1
                   : currentPlayerIndexInTeam - 1,
                     historyPointsLeft: playerOrTeam.pointsLeft,
                     historyTotalThrows: playerOrTeam.totalThrows,
                     historyLastScore: playerOrTeam.lastScore,
                     historyLastAverage: playerOrTeam.average,
                     historyTotalAttempts: playerOrTeam.totalAttempts,
                  }
            })
         //Skipping current player or team index (null)
            .filter(
               (
                  entry: HistoryEntryClassicSingle | HistoryEntryClassicTeams | null
               ) => entry !== null
            )

         currentPlayers.legs += 1

         //Updating game stats for new leg (for each player)
         gamePlayers.forEach(
            (playerOrTeam: PlayerClassic | TeamClassic) => {
               playerOrTeam.pointsLeft = Number(gameMode)
               playerOrTeam.lastScore = 0
               playerOrTeam.totalThrows = 0
               playerOrTeam.totalAttempts = 0
               playerOrTeam.average = 0
               playerOrTeam.isInputPreffered = true
            }
         )

         if (gameType === 'single') {
            dispatch(
               setHistoryClassicSingle([
                  ...history,
                  ...newHistoryEntries,
                  newHistoryEntry,
               ])
            )
            handleSwitchStartPlayerOrTeamIndex(
               startIndex,
               players,
               dispatch
            )
            dispatch(
               setCurrentPlayerIndex((startIndex + 1) % players.length)
            )
         } else {
            dispatch(
               setHistoryClassicTeams([
                  ...history,
                  ...newHistoryEntries,
                  newHistoryEntry,
               ])
            )
            handleSwitchStartPlayerOrTeamIndex(
               startIndex,
               players,
               dispatch
            )
            dispatch(setCurrentTeamIndex((startIndex + 1) % players.length))
         }

         handleCheckGameEnd(
            gamePlayers,
            gameWin,
            numberOfLegs,
            isSoundEnabled,
            dispatch
         )
         dispatch(setThrowValueSum(0))
         dispatch(setCurrentPlayerThrowsCount(0))
         dispatch(setCurrentPlayerThrows([]))
         dispatch(setCurrentThrow(0))
         dispatch(
            gameType === 'single'
               ? setPlayers(gamePlayers)
               : setTeams(gamePlayers)
         )
         return
      }

      //Scenario when player or team has already thrown 3 times, but pointsLeft are equal or less than 1
      if (currentPlayers.pointsLeft <= 1) {
         currentPlayers.pointsLeft += multiplierThrowValue
         currentPlayers.lastScore = 0
         currentPlayers.totalThrows -= throwValueSum
         currentPlayers.totalAttempts += 1
         currentPlayers.average =
        currentPlayers.totalThrows / currentPlayers.totalAttempts

         dispatch(
            gameType === 'single'
               ? setHistoryClassicSingle([
                  ...(history as HistoryEntryClassicSingle[]),
              newHistoryEntry as HistoryEntryClassicSingle,
               ])
               : setHistoryClassicTeams([
                  ...(history as HistoryEntryClassicTeams[]),
              newHistoryEntry as HistoryEntryClassicTeams,
               ])
         )
         playSound('no-score', isSoundEnabled)
         handleSwitchPlayerOrTeamClassic(
            gameType,
            index,
            currentPlayerIndexInTeam,
            players,
            dispatch
         )
         dispatch(setThrowValueSum(0))
         dispatch(setCurrentPlayerThrowsCount(0))
         dispatch(setCurrentPlayerThrows([]))
         dispatch(setCurrentThrow(0))
         dispatch(
            gameType === 'single'
               ? setPlayers(gamePlayers)
               : setTeams(gamePlayers)
         )
         return
      }

      //Updating lastScore, totalThrows, totalAttempts, average when player or team has already thrown 3 times:
      currentPlayers.lastScore = throwValueSum + multiplierThrowValue
      currentPlayers.totalThrows += multiplierThrowValue
      currentPlayers.totalAttempts += 1
      currentPlayers.average =
      currentPlayers.totalThrows / currentPlayers.totalAttempts

      //Updating history state
      dispatch(
         gameType === 'single'
            ? setHistoryClassicSingle([...(history as HistoryEntryClassicSingle[]), newHistoryEntry as HistoryEntryClassicSingle ])
            : setHistoryClassicTeams([
               ...(history as HistoryEntryClassicTeams[]),
            newHistoryEntry as HistoryEntryClassicTeams,
            ])
      )

      //Sound effect:
      playSound(
         (throwValueSum + multiplierThrowValue).toString(),
         isSoundEnabled
      )
      dispatch(setCurrentThrow(0))
      dispatch(setThrowValueSum(0))
      dispatch(setCurrentPlayerThrows([]))
      dispatch(setCurrentPlayerThrowsCount(0))
      handleSwitchPlayerOrTeamClassic(
         gameType,
         index,
         currentPlayerIndexInTeam,
         players,
         dispatch
      )
   }

   dispatch(
      gameType === 'single'
         ? setPlayers(gamePlayers)
         : setTeams(gamePlayers)
   )
}
