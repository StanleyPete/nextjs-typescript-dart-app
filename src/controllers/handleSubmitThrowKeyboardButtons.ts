import { handleSwitchPlayer } from '@/controllers/handleSwitchPlayer'
import { handleSwitchStartPlayerIndex } from '@/controllers/handleSwitchStartPlayerIndex'
import { checkGameEndHandler } from '@/controllers/checkGameEndHandler'
import { playSound } from '@/controllers/playSound'
import { setError } from '@/redux/slices/gameSettingsSlice'
import { 
   setPlayers, 
   setHistory,
   setCurrentThrow, 
   setCurrentPlayerIndex,   
   setIsDoubleActive,  
} from '@/redux/slices/gameRegularSlice'
import { AppDispatch } from '@/redux/store'
import { Player, HistoryEntry } from '@/app/types/types'

export const handleSubmitThrowKeyboardButtons = (
   players: Player[],
   currentPlayerIndex: number,
   startPlayerIndex: number,
   history: HistoryEntry[],
   currentThrow: number,
   inputMultiplier: number,
   gameMode: string,
   numberOfLegs: number,
   gameWin: any,
   isSoundEnabled: boolean,
   isDoubleActive: boolean,
   dispatch: AppDispatch,
) => {
   const invalidScores = [163, 166, 169, 172, 173, 175, 176, 178, 179]
   const gamePlayers = JSON.parse(JSON.stringify(players))
   const currentPlayer = gamePlayers[currentPlayerIndex]
 
   //Error hanlder (currentThrow over 180)
   if(currentThrow > 180){
      dispatch(setError({ isError: true, errorMessage: 'Score higher than 180 is not possible' }))
      dispatch(setCurrentThrow(0))
      return
   }

   if(invalidScores.includes(currentThrow)){
      dispatch(setError({ isError: true, errorMessage: `${currentThrow} is not possible` }))
      dispatch(setCurrentThrow(0))
      return
   }

   //Creating newHistoryEntry
   const newHistoryEntry: HistoryEntry = {
      historyPlayerIndex: currentPlayerIndex,
      historyPointsLeft: currentPlayer.pointsLeft, 
      historyTotalThrows: currentPlayer.totalThrows + (currentThrow * inputMultiplier),
      historyLastScore: currentPlayer.lastScore,
      historyLastAverage: currentPlayer.average,
      historyTotalAttempts: currentPlayer.totalAttempts
   }
  
   //Updating pointsLeft
   currentPlayer.pointsLeft -= (currentThrow * inputMultiplier)
  
   //End leg scenario
   if(isDoubleActive && currentPlayer.pointsLeft === 0) {
      // Additional history entries created if leg ends in order to properly Undo handler usage 
      const newHistoryEntries = gamePlayers
         .map((player: Player, index: number) => {
            if (index === currentPlayerIndex) {
               return null //NewHistoryEntry not created for currentPlayerIndex!
            }
            return {
               historyPlayerIndex: index, 
               historyPointsLeft: player.pointsLeft, 
               historyTotalThrows: player.totalThrows, 
               historyLastScore: player.lastScore, 
               historyLastAverage: player.average, 
               historyTotalAttempts: player.totalAttempts 
            }
         })
         .filter((entry: HistoryEntry | null) => entry !== null) //Skipping currentPlayerIndex (null)
     
      //Updating legs for current player
      currentPlayer.legs += 1
     
      //Updating game stats for new leg (for each player)
      gamePlayers.forEach((player: Player) => {
         player.pointsLeft = Number(gameMode)
         player.lastScore = 0
         player.totalThrows = 0
         player.totalAttempts = 0
         player.average = 0
         player.isInputPreffered = true
      })

      //Updating history state with currentPlayerIndex
      dispatch(setHistory([...history, ...newHistoryEntries, newHistoryEntry]))

      //Upadating player's state
      dispatch(setPlayers(gamePlayers)) 

      //Switching to next player who start the leg
      handleSwitchStartPlayerIndex(startPlayerIndex, players, dispatch)

      //Setting current player index:
      dispatch(setCurrentPlayerIndex((startPlayerIndex + 1) % players.length))

      //End game check
      checkGameEndHandler(gamePlayers, gameWin, numberOfLegs, isSoundEnabled, dispatch)

      //Resetting isDoubleActive state
      dispatch(setIsDoubleActive(false))

      //Resetting input value
      dispatch(setCurrentThrow(0))
     
      return
   }

   //Scenario when updated pointsLeft are equal or less than 1
   if(currentPlayer.pointsLeft <= 1){
      //Updating historyTotalThrows
      newHistoryEntry.historyTotalThrows = currentPlayer.totalThrows

      //Updating pointsLeft, lastScore, totalThrows, totalAttempts and average
      currentPlayer.pointsLeft += (currentThrow * inputMultiplier)
      currentPlayer.lastScore = 0
      currentPlayer.totalThrows += 0
      currentPlayer.totalAttempts += 1
      currentPlayer.average = currentPlayer.totalThrows / currentPlayer.totalAttempts

      //Updating history state
      dispatch(setHistory([...history, newHistoryEntry]))

      //Upadating player's state
      dispatch(setPlayers(gamePlayers))

      //Sound effect
      playSound('no-score', isSoundEnabled)

      //Switching to the next player
      handleSwitchPlayer(currentPlayerIndex, players, dispatch)

      //Resetting input value
      dispatch(setCurrentThrow(0))

      return
   }

   //Updating lastScore, totalThrows, totalAttempts, average
   currentPlayer.lastScore = (currentThrow * inputMultiplier)
   currentPlayer.totalThrows += (currentThrow * inputMultiplier)
   currentPlayer.totalAttempts += 1
   currentPlayer.isInputPreffered = true
   currentPlayer.average = currentPlayer.totalThrows / currentPlayer.totalAttempts
  
   //Updating history state
   dispatch(setHistory([...history, newHistoryEntry]))
  
   //Upadating player's state
   dispatch(setPlayers(gamePlayers))

   //Sound effect
   if (currentThrow === 0) {
      playSound('no-score', isSoundEnabled)
   } else {
      playSound(currentThrow.toString(), isSoundEnabled)
   }
  
   //Switching to the next player
   handleSwitchPlayer(currentPlayerIndex, players, dispatch)
 
   //Resetting input value
   dispatch(setCurrentThrow(0))
}