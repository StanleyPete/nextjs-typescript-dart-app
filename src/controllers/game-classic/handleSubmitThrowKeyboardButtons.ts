//Redux
import { AppDispatch } from '@/redux/store'
import { setError } from '@/redux/slices/gameSettingsSlice'
import { setCurrentThrow, setIsDoubleActive } from '@/redux/slices/game-classic/gameClassicSlice'
import { setPlayers, setCurrentPlayerIndex, setHistoryClassicSingle } from '@/redux/slices/game-classic/gameClassicSingleSlice'
import { setTeams, setCurrentTeamIndex, setHistoryClassicTeams } from '@/redux/slices/game-classic/gameClassicTeamsSlice'
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

/* USED IN: 
      ThrowValueSection component when showNumberButtons === false, 
      Handles BUTTONS from 0 - 9
*/

export const handleSubmitThrowKeyboardButtons = (
   gameType: GameSettingsStates['gameType'],
   playersOrTeams: PlayerClassic[] | TeamClassic[],
   index:
    | GameClassicSingleStates['currentPlayerIndex']
    | GameClassicTeamsStates['currentTeamIndex'],
   currentPlayerIndexInTeam: GameClassicTeamsStates['currentPlayerIndexInTeam'],
   startIndex: GameStates['startIndex'],
   history: HistoryEntryClassicSingle[] | HistoryEntryClassicTeams[],
   currentThrow: GameClassicStates['currentThrow'],
   inputMultiplier: number,
   gameMode: GameSettingsStates['gameMode'],
   numberOfLegs: GameSettingsStates['numberOfLegs'],
   gameWin: GameSettingsStates['gameWin'],
   isSoundEnabled: GameStates['isSoundEnabled'],
   isDoubleActive: GameClassicStates['isDoubleActive'],
   dispatch: AppDispatch
) => {
   //ERROR (currentThrow over 180)
   if (currentThrow > 180) {
      dispatch(
         setError({
            isError: true,
            errorMessage: 'Score higher than 180 is not possible',
         })
      )
      dispatch(setCurrentThrow(0))
      return
   }

   //ERROR (invalid scores)
   const invalidScores = [163, 166, 169, 172, 173, 175, 176, 178, 179]
   if (invalidScores.includes(currentThrow)) {
      dispatch(setError({ isError: true, errorMessage: `${currentThrow} is not possible`}))
      dispatch(setCurrentThrow(0))
      return
   }

   const gamePlayersOrTeams = JSON.parse(JSON.stringify(playersOrTeams))
   const currentPlayerOrTeam = gamePlayersOrTeams[index]

   //CREATING HISTORY BASED ON CURRENT VALUES (BEFORE UPDATING STATS )
   let newHistoryEntry: HistoryEntryClassicSingle | HistoryEntryClassicTeams
   switch (gameType) {
   case 'single':
      newHistoryEntry = {
         historyPlayerIndex: index,
         historyPointsLeft: currentPlayerOrTeam.pointsLeft,
         historyTotalThrows: currentPlayerOrTeam.totalThrows + currentThrow * inputMultiplier,
         historyLastScore: currentPlayerOrTeam.lastScore,
         historyLastAverage: currentPlayerOrTeam.average,
         historyTotalAttempts: currentPlayerOrTeam.totalAttempts,
      }
      break
   case 'teams':
      newHistoryEntry = {
         historyTeamIndex: index,
         historyPlayerIndexInTeam: currentPlayerIndexInTeam,
         historyPointsLeft: currentPlayerOrTeam.pointsLeft,
         historyTotalThrows:
          currentPlayerOrTeam.totalThrows + currentThrow * inputMultiplier,
         historyLastScore: currentPlayerOrTeam.lastScore,
         historyLastAverage: currentPlayerOrTeam.average,
         historyTotalAttempts: currentPlayerOrTeam.totalAttempts,
      }
      break
   default:
      throw new Error('Invalid gameType')
   }

   //POINTS LEFT UPDATE
   currentPlayerOrTeam.pointsLeft -= currentThrow * inputMultiplier

   //SCENARIO WHEN PLAYER OR TEAM HAS JUST WON THE LEG
   if (isDoubleActive && currentPlayerOrTeam.pointsLeft === 0) {
      // Additional history entries created if leg ends in order undo handler works correctly
      const newHistoryEntries = gamePlayersOrTeams
         .map((playerOrTeam: PlayerClassic | TeamClassic, i: number) => {
            //NewHistoryEntry not created for current player or team
            if (i === index) return null
            //NewHistoryEntry created for players
            if (gameType === 'single')
               return {
                  historyPlayerIndex: i,
                  historyPointsLeft: playerOrTeam.pointsLeft,
                  historyTotalThrows: playerOrTeam.totalThrows,
                  historyLastScore: playerOrTeam.lastScore,
                  historyLastAverage: playerOrTeam.average,
                  historyTotalAttempts: playerOrTeam.totalAttempts,
               }
            //NewHistoryEntry created for teams
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
            (entry: HistoryEntryClassicSingle | HistoryEntryClassicTeams | null) =>
               entry !== null
         )

      currentPlayerOrTeam.legs += 1

      handleCheckGameEnd(
         gamePlayersOrTeams,
         gameWin,
         numberOfLegs,
         isSoundEnabled,
         dispatch
      )

      //Updating game stats for new leg (for each player or team)
      gamePlayersOrTeams.forEach((playerOrTeam: PlayerClassic | TeamClassic) => {
         playerOrTeam.pointsLeft = Number(gameMode)
         playerOrTeam.lastScore = 0
         playerOrTeam.totalThrows = 0
         playerOrTeam.totalAttempts = 0
         playerOrTeam.average = 0
         playerOrTeam.isInputPreffered = true
      })

      //Updating players and teams states + history state updated with current player or team
      if (gameType === 'single') {
         dispatch(
            setHistoryClassicSingle([
               ...history,
               ...newHistoryEntries,
               newHistoryEntry,
            ])
         )
         dispatch(setPlayers(gamePlayersOrTeams))
      } else {
         dispatch(
            setHistoryClassicTeams([
               ...history,
               ...newHistoryEntries,
               newHistoryEntry,
            ])
         )
         dispatch(setTeams(gamePlayersOrTeams))
      }

      //Switching to next player or team who start the leg
      handleSwitchStartPlayerOrTeamIndex(startIndex, playersOrTeams, dispatch)

      //Switching current player or team index:
      dispatch(
         gameType === 'single'
            ? setCurrentPlayerIndex((startIndex + 1) % playersOrTeams.length)
            : setCurrentTeamIndex((startIndex + 1) % playersOrTeams.length)
      )

      dispatch(setIsDoubleActive(false))
      dispatch(setCurrentThrow(0))
      return
   }

   //SCENARIO WHEN UPDATED POINTS LEFT ARE EQUAL OR LESS THAN 1
   if (currentPlayerOrTeam.pointsLeft <= 1) {
      //Updating historyTotalThrows
      newHistoryEntry.historyTotalThrows = currentPlayerOrTeam.totalThrows

      //Updating pointsLeft, lastScore, totalThrows, totalAttempts and average
      currentPlayerOrTeam.pointsLeft += currentThrow * inputMultiplier
      currentPlayerOrTeam.lastScore = 0
      currentPlayerOrTeam.totalThrows += 0
      currentPlayerOrTeam.totalAttempts += 1
      currentPlayerOrTeam.average =
      currentPlayerOrTeam.totalThrows / currentPlayerOrTeam.totalAttempts

      //Updating history + players or teams states
      if (gameType === 'single') {
         dispatch(
            setHistoryClassicSingle([
               ...(history as HistoryEntryClassicSingle[]),
          newHistoryEntry as HistoryEntryClassicSingle,
            ])
         )
         dispatch(setPlayers(gamePlayersOrTeams))
      } else {
         dispatch(
            setHistoryClassicTeams([
               ...(history as HistoryEntryClassicTeams[]),
          newHistoryEntry as HistoryEntryClassicTeams,
            ])
         )
         dispatch(setTeams(gamePlayersOrTeams))
      }

      handleSwitchPlayerOrTeamClassic(
         gameType,
         index,
         currentPlayerIndexInTeam,
         playersOrTeams,
         dispatch
      )
      playSound('no-score', isSoundEnabled)
      dispatch(setCurrentThrow(0))
      return
   }

   //Updating lastScore, totalThrows, totalAttempts, average
   currentPlayerOrTeam.lastScore = currentThrow * inputMultiplier
   currentPlayerOrTeam.totalThrows += currentThrow * inputMultiplier
   currentPlayerOrTeam.totalAttempts += 1
   currentPlayerOrTeam.isInputPreffered = true
   currentPlayerOrTeam.average =
    currentPlayerOrTeam.totalThrows / currentPlayerOrTeam.totalAttempts

   //Updating history + players or teams states
   if (gameType === 'single') {
      dispatch(
         setHistoryClassicSingle([
            ...(history as HistoryEntryClassicSingle[]),
        newHistoryEntry as HistoryEntryClassicSingle,
         ])
      )
      dispatch(setPlayers(gamePlayersOrTeams))
   } else {
      dispatch(
         setHistoryClassicTeams([
            ...(history as HistoryEntryClassicTeams[]),
        newHistoryEntry as HistoryEntryClassicTeams,
         ])
      )
      dispatch(setTeams(gamePlayersOrTeams))
   }

   //Sound effect
   if (currentThrow === 0) {
      playSound('no-score', isSoundEnabled)
   } else {
      playSound(currentThrow.toString(), isSoundEnabled)
   }

   handleSwitchPlayerOrTeamClassic(
      gameType,
      index,
      currentPlayerIndexInTeam,
      playersOrTeams,
      dispatch
   )
   dispatch(setCurrentThrow(0))
   return
}
