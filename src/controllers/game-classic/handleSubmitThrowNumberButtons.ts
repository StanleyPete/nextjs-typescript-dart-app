//Redux
import { AppDispatch } from '@/redux/store'
import {
   setCurrentThrow,
   setThrowValueSum,
   setCurrentPlayerThrowsCount,
   setCurrentPlayerThrows,
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
import { handleSwitchPlayerOrTeam } from '@/controllers/handleSwitchPlayerOrTeam'
import { handleSwitchStartPlayerOrTeamIndex } from '@/controllers/handleSwitchStartPlayerOrTeamIndex'
import { handleCheckGameEnd } from '@/controllers/handleCheckGameEnd'
import { playSound } from '@/controllers/playSound'
//Types
import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'
import { 
   GameClassicStates, 
   GameClassicSingleStates, 
   GameClassicTeamsStates, 
   PlayerClassic, 
   TeamClassic, 
   HistoryEntryClassicSingle, 
   HistoryEntryClassicTeams 
} from '@/types/redux/gameClassicTypes'

/* USED IN: 
      NumberButtons component
      handles BUTTONS from 0 - 20 (with multiplier from 1 - 3) and Bull, Outer and Miss buttons 
*/

export const handleSubmitThrowNumberButtons = (
   gameType: GameSettingsStates['gameType'],
   throwValue: number,
   playersOrTeams: PlayerClassic[] | TeamClassic[],
   index: GameClassicSingleStates['currentPlayerIndex']| GameClassicTeamsStates['currentTeamIndex'],
   currentPlayerIndexInTeam: GameClassicTeamsStates['currentPlayerIndexInTeam'],
   startIndex: GameClassicStates['startIndex'],
   history: HistoryEntryClassicSingle[] | HistoryEntryClassicTeams[],
   throwValueSum: GameClassicStates['throwValueSum'],
   currentPlayerThrowsCount: GameClassicStates['currentPlayerThrowsCount'],
   currentPlayerThrows: GameClassicStates['currentPlayerThrows'],
   multiplier: GameClassicStates['multiplier'],
   gameMode: GameSettingsStates['gameMode'],
   numberOfLegs: GameSettingsStates['numberOfLegs'],
   gameWin: GameSettingsStates['gameWin'],
   isSoundEnabled: GameClassicStates['isSoundEnabled'],
   dispatch: AppDispatch
) => {
   const gamePlayersOrTeams = JSON.parse(JSON.stringify(playersOrTeams))
   const currentPlayerOrTeam = gamePlayersOrTeams[index]
   const multiplierThrowValue = throwValue * multiplier

   //CREATING HISTORY BASED ON CURRENT VALUES (BEFORE UPDATING STATS )
   let newHistoryEntry: HistoryEntryClassicSingle | HistoryEntryClassicTeams
   switch (gameType) {
   case 'single':
      newHistoryEntry = {
         historyPlayerIndex: index,
         historyPointsLeft: currentPlayerOrTeam.pointsLeft + throwValueSum,
         historyTotalThrows:
          currentPlayerOrTeam.totalThrows + multiplierThrowValue,
         historyLastScore: currentPlayerOrTeam.lastScore,
         historyLastAverage: currentPlayerOrTeam.average,
         historyTotalAttempts: currentPlayerOrTeam.totalAttempts,
      }
      break
   case 'teams':
      newHistoryEntry = {
         historyTeamIndex: index,
         historyPlayerIndexInTeam: currentPlayerIndexInTeam,
         historyPointsLeft: currentPlayerOrTeam.pointsLeft + throwValueSum,
         historyTotalThrows:
          currentPlayerOrTeam.totalThrows + multiplierThrowValue,
         historyLastScore: currentPlayerOrTeam.lastScore,
         historyLastAverage: currentPlayerOrTeam.average,
         historyTotalAttempts: currentPlayerOrTeam.totalAttempts,
      }
      break
   default:
      throw new Error('Invalid gameType')
   }

   // Incrementing the currentPlayerThrowsCount to keep track of the throws
   const updatedThrowCount = currentPlayerThrowsCount + 1

   //SCENARIO WHEN PLAYER OR TEAM HAS NOT THROWN 3 TIMES YET
   if (updatedThrowCount < 3) {
      //Updating pointsLeft
      currentPlayerOrTeam.pointsLeft -= multiplierThrowValue

      //End leg scenario when player has NOT thrown 3 times yet, multiplier === 2 and pointsLeft === 0
      if (multiplier === 2 && currentPlayerOrTeam.pointsLeft === 0) {
         const newHistoryEntries = gamePlayersOrTeams
            .map((playerOrTeam: PlayerClassic | TeamClassic, i: number) => {
               //NewHistoryEntry not created for current player or team
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
         //Skipping current current player or team index (null)
            .filter((entry: HistoryEntryClassicSingle | HistoryEntryClassicTeams | null) => entry !== null)

         //Updating legs
         currentPlayerOrTeam.legs += 1

         //Updating game stats for new leg (for each player or team)
         gamePlayersOrTeams.forEach(
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
            dispatch(setHistoryClassicSingle([...history, ...newHistoryEntries, newHistoryEntry]))
            handleSwitchStartPlayerOrTeamIndex(gameMode, startIndex, playersOrTeams, dispatch)
            dispatch(setCurrentPlayerIndex((startIndex + 1) % playersOrTeams.length))
            dispatch(setPlayers(gamePlayersOrTeams))
         } else {
            dispatch(setHistoryClassicTeams([...history, ...newHistoryEntries, newHistoryEntry]))
            handleSwitchStartPlayerOrTeamIndex(gameMode, startIndex, playersOrTeams, dispatch)
            dispatch(setCurrentTeamIndex((startIndex + 1) % playersOrTeams.length))
            dispatch(setTeams(gamePlayersOrTeams))
         }

         handleCheckGameEnd(gamePlayersOrTeams, gameWin, numberOfLegs, isSoundEnabled, dispatch)
         dispatch(setThrowValueSum(0))
         dispatch(setCurrentPlayerThrowsCount(0))
         dispatch(setCurrentPlayerThrows([]))
         dispatch(setCurrentThrow(0))
         return
      }

      //Scenario when player has not thrown 3 times yet but pointsLeft are equal or less than 1
      if (currentPlayerOrTeam.pointsLeft <= 1) {
         currentPlayerOrTeam.pointsLeft = newHistoryEntry.historyPointsLeft
         currentPlayerOrTeam.lastScore = 0
         currentPlayerOrTeam.totalThrows -= throwValueSum
         currentPlayerOrTeam.totalAttempts += 1
         currentPlayerOrTeam.average =
        currentPlayerOrTeam.totalThrows / currentPlayerOrTeam.totalAttempts

         dispatch(
            gameType === 'single'
               ? setHistoryClassicSingle([...(history as HistoryEntryClassicSingle[]), newHistoryEntry as HistoryEntryClassicSingle])
               : setHistoryClassicTeams([...(history as HistoryEntryClassicTeams[]), newHistoryEntry as HistoryEntryClassicTeams])
         )

         playSound('no-score', isSoundEnabled)
         handleSwitchPlayerOrTeam(gameType, index, currentPlayerIndexInTeam, playersOrTeams, dispatch)
         dispatch(setThrowValueSum(0))
         dispatch(setCurrentPlayerThrowsCount(0))
         dispatch(setCurrentPlayerThrows([]))
         dispatch(setCurrentThrow(0))
         dispatch(
            gameType === 'single'
               ? setPlayers(gamePlayersOrTeams)
               : setTeams(gamePlayersOrTeams)
         )
         return
      }

      //Updating totalThrows, throwValueSum, currentPlayerThrows, currentPlayerThrowsCount (currentThrow in case player would like to switch input method)
      currentPlayerOrTeam.totalThrows += multiplierThrowValue
      dispatch(setThrowValueSum(throwValueSum + multiplierThrowValue))
      dispatch(setCurrentPlayerThrows([...currentPlayerThrows, multiplierThrowValue].slice(-3)))
      dispatch(setCurrentPlayerThrowsCount(updatedThrowCount))
      dispatch(setCurrentThrow(0))
   }

   //SCENARIO WHEN PLAYER OR TEAM HAS THROWN 3 TIMES:
   else {
      //Updating pointsLeft
      currentPlayerOrTeam.pointsLeft -= multiplierThrowValue

      //End leg scenario when player has thrown already 3 times, multiplier === 2 and pointsLeft === 0
      if (multiplier === 2 && currentPlayerOrTeam.pointsLeft === 0) {
         const newHistoryEntries = gamePlayersOrTeams
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
            .filter((entry: HistoryEntryClassicSingle | HistoryEntryClassicTeams | null) => entry !== null)

         currentPlayerOrTeam.legs += 1

         //Updating game stats for new leg (for each player)
         gamePlayersOrTeams.forEach(
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
            dispatch(setHistoryClassicSingle([...history, ...newHistoryEntries, newHistoryEntry]))
            handleSwitchStartPlayerOrTeamIndex(gameMode, startIndex, playersOrTeams, dispatch)
            dispatch(setCurrentPlayerIndex((startIndex + 1) % playersOrTeams.length))
         } else {
            dispatch(setHistoryClassicTeams([...history, ...newHistoryEntries, newHistoryEntry]))
            handleSwitchStartPlayerOrTeamIndex(gameMode, startIndex, playersOrTeams, dispatch)
            dispatch(setCurrentTeamIndex((startIndex + 1) % playersOrTeams.length))
         }

         handleCheckGameEnd(gamePlayersOrTeams, gameWin, numberOfLegs, isSoundEnabled, dispatch)
         dispatch(setThrowValueSum(0))
         dispatch(setCurrentPlayerThrowsCount(0))
         dispatch(setCurrentPlayerThrows([]))
         dispatch(setCurrentThrow(0))
         dispatch(
            gameType === 'single'
               ? setPlayers(gamePlayersOrTeams)
               : setTeams(gamePlayersOrTeams)
         )
         return
      }

      //Scenario when player or team has already thrown 3 times, but pointsLeft are equal or less than 1
      if (currentPlayerOrTeam.pointsLeft <= 1) {
         currentPlayerOrTeam.pointsLeft += multiplierThrowValue
         currentPlayerOrTeam.lastScore = 0
         currentPlayerOrTeam.totalThrows -= throwValueSum
         currentPlayerOrTeam.totalAttempts += 1
         currentPlayerOrTeam.average =
        currentPlayerOrTeam.totalThrows / currentPlayerOrTeam.totalAttempts

         dispatch(
            gameType === 'single'
               ? setHistoryClassicSingle([...(history as HistoryEntryClassicSingle[]), newHistoryEntry as HistoryEntryClassicSingle])
               : setHistoryClassicTeams([...(history as HistoryEntryClassicTeams[]), newHistoryEntry as HistoryEntryClassicTeams,])
         )
         playSound('no-score', isSoundEnabled)
         handleSwitchPlayerOrTeam(gameType, index, currentPlayerIndexInTeam, playersOrTeams, dispatch)
         dispatch(setThrowValueSum(0))
         dispatch(setCurrentPlayerThrowsCount(0))
         dispatch(setCurrentPlayerThrows([]))
         dispatch(setCurrentThrow(0))
         dispatch(
            gameType === 'single'
               ? setPlayers(gamePlayersOrTeams)
               : setTeams(gamePlayersOrTeams)
         )
         return
      }

      //Updating lastScore, totalThrows, totalAttempts, average when player or team has already thrown 3 times:
      currentPlayerOrTeam.lastScore = throwValueSum + multiplierThrowValue
      currentPlayerOrTeam.totalThrows += multiplierThrowValue
      currentPlayerOrTeam.totalAttempts += 1
      currentPlayerOrTeam.average =
      currentPlayerOrTeam.totalThrows / currentPlayerOrTeam.totalAttempts

      //Updating history state
      dispatch(
         gameType === 'single'
            ? setHistoryClassicSingle([...(history as HistoryEntryClassicSingle[]), newHistoryEntry as HistoryEntryClassicSingle])
            : setHistoryClassicTeams([...(history as HistoryEntryClassicTeams[]), newHistoryEntry as HistoryEntryClassicTeams])
      )

      //Sound effect:
      playSound((throwValueSum + multiplierThrowValue).toString(), isSoundEnabled)
      dispatch(setCurrentThrow(0))
      dispatch(setThrowValueSum(0))
      dispatch(setCurrentPlayerThrows([]))
      dispatch(setCurrentPlayerThrowsCount(0))
      handleSwitchPlayerOrTeam(gameType, index, currentPlayerIndexInTeam, playersOrTeams, dispatch)
   }

   dispatch(
      gameType === 'single'
         ? setPlayers(gamePlayersOrTeams)
         : setTeams(gamePlayersOrTeams)
   )
}
