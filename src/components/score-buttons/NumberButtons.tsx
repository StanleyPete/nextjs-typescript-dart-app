import React from 'react'
import { handleUndo } from '@/lib/handleUndo'
import { playSound } from '@/lib/playSound'
import { handleSwitchPlayer } from '@/lib/handleSwitchPlayer'
import { handleSwitchStartPlayerIndex } from '@/lib/handleSwitchStartPlayerIndex'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { 
   Player,
   setPlayers, 
   setHistory,
   HistoryEntry, 
   setCurrentThrow, 
   setCurrentPlayerIndex,  
   setThrowValueSum, 
   setCurrentPlayerThrowsCount, 
   setCurrentPlayerThrows, 
   setIsGameEnd, 
   setWinner, 
} from '@/redux/slices/gameRegularSlice'

const NumberButtons = () => {
   const dispatch = useDispatch()

   const {  
      gameMode,
      numberOfLegs,
      gameWin 
   } = useSelector((state: RootState) => state.gameSettings)

   const { 
      players, 
      history,  
      currentPlayerIndex, 
      startPlayerIndex, 
      showNumberButtons, 
      throwValueSum, 
      currentPlayerThrowsCount, 
      currentPlayerThrows, 
      multiplier, 
      isSoundEnabled, 
   } = useSelector((state: RootState) => state.gameRegular)

   //SUBMIT SCORE HANDLER FOR NUMBER BUTTONS
   const handleSubmitThrowButtons = (throwValue: number) => {
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
            checkGameEndHandler(gamePlayers)

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
            checkGameEndHandler(gamePlayers)

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
         dispatch(setThrowValueSum(0))
         dispatch(setCurrentPlayerThrowsCount(0))
         dispatch(setCurrentPlayerThrows([]))
         dispatch(setCurrentThrow(0))
       
         //Switching to the next player
         handleSwitchPlayer(currentPlayerIndex, players, dispatch)
      }

      //Updating  player's state
      dispatch(setPlayers(gamePlayers))
   }

   //GAME END HANDLER
   const checkGameEndHandler = (gamePlayers: Player[]) => {
      //Scenario when game type is set to best-of
      if (gameWin === 'best-of') {
         //Sum of legs for all players
         const totalLegs = gamePlayers.reduce((acc: number, player: Player) => acc + player.legs, 0)
       
         //Check if totalLegs for players equals to number-of-legs parameter
         if (totalLegs === Number(numberOfLegs)) {
            //Finding winner player
            const maxLegs = Math.max(...gamePlayers.map((player: Player) => player.legs))
            const winner = gamePlayers.find((player: Player) => player.legs === maxLegs) || null
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
         const winner = gamePlayers.find((player: Player) => player.legs === Number(numberOfLegs)) || null
         console.log(winner)
         if(winner){
            dispatch(setIsGameEnd(true))
            dispatch(setWinner(winner))
            playSound('and-the-game', isSoundEnabled)
         } else {
            playSound('and-the-leg', isSoundEnabled)
         }
      }
   }
 

   return (
      <div className='score-buttons'>
         {/* Score buttons */}
         {Array.from({ length: 20 }, (_, i) => {
            const baseValue = i + 1
            const displayValue = multiplier > 1 ? baseValue * multiplier : null

            return (
               <button 
                  key={baseValue} 
                  onClick={() => handleSubmitThrowButtons(baseValue)}>
                  <span 
                     className="base-value">
                     {baseValue}
                  </span>
                  {displayValue && 
                         <span 
                            className="multiplied-value">
                               ({displayValue})
                         </span>
                  }
               </button>
            )
         })}

         {/* Bull, Outer, Miss and Undo buttons */}
         <button 
            onClick={() => handleSubmitThrowButtons(multiplier === 2 ? 50 / 2 : multiplier === 3 ? 50 / 3 : 50)}>
                   Bull (50)
         </button>
         <button 
            onClick={() => handleSubmitThrowButtons(multiplier === 2 ? 25 / 2 : multiplier === 3 ? 25 / 3 : 25)}>
                   Outer (25)
         </button>
         <button 
            onClick={() => handleSubmitThrowButtons(0)}>
                   Miss
         </button>
         <button 
            onClick={() => {
               handleUndo(dispatch, history, players, gameMode, showNumberButtons, currentPlayerThrowsCount, currentPlayerThrows, currentPlayerIndex, throwValueSum)}}>
                   Undo
         </button>
      </div>
   )
}

export default NumberButtons