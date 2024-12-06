import { handleSwitchPlayer } from '@/controllers/handleSwitchPlayer'
import { handleSwitchStartPlayerIndex } from '@/controllers/handleSwitchStartPlayerIndex'
import { checkGameEndHandler } from '@/controllers/checkGameEndHandler'
import { playSound } from '@/controllers/playSound'
import { 
   setPlayers, 
   setHistory,
   setCurrentThrow, 
   setCurrentPlayerIndex,  
   setThrowValueSum, 
   setCurrentPlayerThrowsCount, 
   setCurrentPlayerThrows,  
} from '@/redux/slices/gameRegularSlice'
import { AppDispatch } from '@/redux/store'
import { Player, HistoryEntry } from '@/types/types'

export const handleSubmitThrowNumberButtons = (
   throwValue: number,
   players: Player[],
   currentPlayerIndex: number,
   startPlayerIndex: number,
   history: HistoryEntry[],
   throwValueSum: number,
   currentPlayerThrowsCount: number,
   currentPlayerThrows: number[],
   multiplier: number,
   gameMode: string | number,
   numberOfLegs: number,
   gameWin: string,
   isSoundEnabled: boolean,
   dispatch: AppDispatch
) => {
   const gamePlayers = JSON.parse(JSON.stringify(players))
   const currentPlayer = gamePlayers[currentPlayerIndex]
   const multiplierThrowValue = throwValue * multiplier
  
   //Creating newHistoryEntry
   const newHistoryEntry: HistoryEntry = {
      historyPlayerIndex: currentPlayerIndex,
      historyPointsLeft: currentPlayer.pointsLeft + throwValueSum,
      historyTotalThrows: currentPlayer.totalThrows + multiplierThrowValue, 
      historyLastScore: currentPlayer.lastScore,
      historyLastAverage: currentPlayer.average,
      historyTotalAttempts: currentPlayer.totalAttempts
   }
  
   // Incrementing the currentPlayerThrowsCount to keep track of the throws
   const updatedThrowCount = currentPlayerThrowsCount + 1
  
   //Scenario when player has not thrown 3 times yet
   if (updatedThrowCount < 3) {
      //Updating pointsLeft
      currentPlayer.pointsLeft -= multiplierThrowValue

      //End leg scenario when player has NOT thrown 3 times yet, multiplier === 2 and pointsLeft === 0
      if(multiplier === 2 && currentPlayer.pointsLeft === 0){
         const newHistoryEntries = gamePlayers
            .map((player: Player, index: number) => {
               if (index === currentPlayerIndex) {
                  return null //NewHistoryEntry not created for currentPlayerIndex
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

         //Updating legs
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
        
         //Updating history state
         dispatch(setHistory([...history, ...newHistoryEntries, newHistoryEntry]))

         //Switching to next player who start the leg
         handleSwitchStartPlayerIndex(startPlayerIndex, players, dispatch)

         //Setting current player index:
         dispatch(setCurrentPlayerIndex((startPlayerIndex + 1) % players.length))

         //Updating player's state
         dispatch(setPlayers(gamePlayers))

         //Checking game end
         checkGameEndHandler(gamePlayers, gameWin, numberOfLegs, isSoundEnabled, dispatch)

         //Resetting states
         dispatch(setThrowValueSum(0))
         dispatch(setCurrentPlayerThrowsCount(0))
         dispatch(setCurrentPlayerThrows([]))
         dispatch(setCurrentThrow(0))
       
         return
      }

      //Scenario when player has not thrown 3 times yet but pointsLeft are equal or less than 1
      if(currentPlayer.pointsLeft <= 1) {
         currentPlayer.pointsLeft = newHistoryEntry.historyPointsLeft
         currentPlayer.lastScore = 0
         currentPlayer.totalThrows -= throwValueSum
         currentPlayer.totalAttempts += 1
         currentPlayer.average = currentPlayer.totalThrows / currentPlayer.totalAttempts
         dispatch(setHistory([...history, newHistoryEntry]))

         //Sound effect:
         playSound('no-score', isSoundEnabled)

         //Switching to the next player:
         handleSwitchPlayer(currentPlayerIndex, players, dispatch)

         //Resetting states
         dispatch(setThrowValueSum(0))
         dispatch(setCurrentPlayerThrowsCount(0))
         dispatch(setCurrentPlayerThrows([]))
         dispatch(setCurrentThrow(0))

         dispatch(setPlayers(gamePlayers))

         return
      }

      //Updating totalThrows, throwValueSum, currentPlayerThrows, currentPlayerThrowsCount (currentThrow in case player would like to switch input method)
      currentPlayer.totalThrows += multiplierThrowValue
      dispatch(setThrowValueSum(throwValueSum + multiplierThrowValue))
      dispatch(setCurrentPlayerThrows([...currentPlayerThrows, multiplierThrowValue].slice(-3)))
      dispatch(setCurrentPlayerThrowsCount(updatedThrowCount))
      dispatch(setCurrentThrow(0))
   } 
   //Scenario when players has thrown already 3 times
   else {
      //Updating pointsLeft
      currentPlayer.pointsLeft -= multiplierThrowValue
     
      //End leg scenario when player has thrown already 3 times, multiplier === 2 and pointsLeft === 0
      if(multiplier === 2 && currentPlayer.pointsLeft === 0){
         const newHistoryEntries = gamePlayers
            .map((player: Player, index: number) => {
               if (index === currentPlayerIndex) {
                  return null //NewHistoryEntry not created for currentPlayerIndex
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
        
         //Updating history state
         dispatch(setHistory([...history, ...newHistoryEntries, newHistoryEntry]))

         //Switching to next player who start the leg
         handleSwitchStartPlayerIndex(startPlayerIndex, players, dispatch)

         //Setting current player index:
         dispatch(setCurrentPlayerIndex((startPlayerIndex + 1) % players.length))

         //Checking game end
         checkGameEndHandler(gamePlayers, gameWin, numberOfLegs, isSoundEnabled, dispatch)

         //Resetting states
         dispatch(setThrowValueSum(0))
         dispatch(setCurrentPlayerThrowsCount(0))
         dispatch(setCurrentPlayerThrows([]))
         dispatch(setCurrentThrow(0))
         dispatch(setPlayers(gamePlayers))
         return
      }

      //Scenario when player has already thrown 3 times, but pointsLeft are equal or less than 1
      if(currentPlayer.pointsLeft <= 1) {
         currentPlayer.pointsLeft += multiplierThrowValue
         currentPlayer.lastScore = 0
         currentPlayer.totalThrows -= throwValueSum
         currentPlayer.totalAttempts += 1
         currentPlayer.average = currentPlayer.totalThrows / currentPlayer.totalAttempts
         dispatch(setHistory([...history, newHistoryEntry]))
         playSound('no-score', isSoundEnabled)
         handleSwitchPlayer(currentPlayerIndex, players, dispatch)
         dispatch(setThrowValueSum(0))
         dispatch(setCurrentPlayerThrowsCount(0))
         dispatch(setCurrentPlayerThrows([]))
         dispatch(setCurrentThrow(0))
         dispatch(setPlayers(gamePlayers))
         return
      }

      //Updating lastScore, totalThrows, totalAttempts, average when player has already thrown 3 times:
      currentPlayer.lastScore = throwValueSum + multiplierThrowValue
      currentPlayer.totalThrows += multiplierThrowValue
      currentPlayer.totalAttempts += 1
      currentPlayer.average = currentPlayer.totalThrows / currentPlayer.totalAttempts
     
      //Updating history state
      dispatch(setHistory([...history, newHistoryEntry]))

      //Sound effect:
      playSound((throwValueSum + multiplierThrowValue).toString(), isSoundEnabled)

      //Resetting states:
      dispatch(setCurrentThrow(0))
      dispatch(setThrowValueSum(0))
      dispatch(setCurrentPlayerThrows([]))
      dispatch(setCurrentPlayerThrowsCount(0))
     
      //Switching to the next player
      handleSwitchPlayer(currentPlayerIndex, players, dispatch)
   }

   //Updating  player's state
   dispatch(setPlayers(gamePlayers))
}