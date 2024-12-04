'use client'
import React, { useEffect } from 'react'
import Image from 'next/image'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import ErrorPopUp from '@/components/ErrorPopUp'
import GameEndPopUp from '@/components/GameEndPopUp'
import { setError } from '@/redux/slices/gameSettingsSlice'
import { Team, HistoryEntryTeams } from '../types/types'
import { 
   setTeams,
   setHistory,
   setCurrentThrow,
   setCurrentTeamIndex,
   setCurrentPlayerIndexInTeam,
   setStartTeamIndex,
   setShowNumberButtons,
   setThrowValueSum,
   setCurrentPlayerThrowsCount,
   setCurrentPlayerThrows,
   setMultiplier,
   setIsDoubleActive,
   setIsGameEnd,
   setWinner,
   setInitialSoundPlayed,
} from '@/redux/slices/gameRegularTeamsSlice'
import CurrentPlayerThrowParagraph from '@/components/CurrentPlayerThrowParagraph'
import GameTeamsPlayersSection from '@/components/game-regular-teams/GameTeamsPlayersSection'
import SettingsButtons from '@/components/SettingsButtons'


const GameTeams = () => {
   const dispatch = useDispatch()
   const context = 'gameRegularTeams'
   
   const { 
      gameMode,
      numberOfLegs,
      gameWin 
   } = useSelector((state: RootState) => state.gameSettings)

   const { 
      teams, 
      history,
      currentThrow,
      currentTeamIndex,
      currentPlayerIndexInTeam,
      startTeamIndex,
      showNumberButtons,
      throwValueSum,
      currentPlayerThrowsCount,
      currentPlayerThrows,
      multiplier,
      isDoubleActive,
      isSoundEnabled, 
      initialSoundPlayed 
   } = useSelector((state: RootState) => state.gameRegularTeams)
    

   
   //SCORE INPUT HANDLER
   const handleThrowChange = (value: string) => {
      setCurrentThrow(Number(value))
   }
   
   //NEXT TEAM HANDLER
   const handleSwitchTeam = () => {
      /* Switch to another team: 
            Example: If there are 2 teams and currentTeamIndex === 1 (last player's turn), 
            after increasing currentPlayerIndex by 1, 2%2 === 0 which is first teams's index
      */
      const nextTeamIndex = (currentTeamIndex + 1) % teams.length
      dispatch(setCurrentTeamIndex(nextTeamIndex))
      
      /* Switch to another player within team: 
            There are only two teams and two players in each team. When player 1 (team 1) throws, the function switches currentTeamIndex. When player 2 (team 2) throws nextTeamIndex === 0, what triggers updating curretPlayerIndexInTeam state
      */
      const updatedPlayerIndexInTeam = (currentPlayerIndexInTeam + 1) % teams[0].members.length
      if(nextTeamIndex === 0) {
         dispatch(setCurrentPlayerIndexInTeam(updatedPlayerIndexInTeam))
      }

   }

   //NEXT TEAM WHICH STARTS THE LEG HANDLER
   const handleSwitchTeamWhoStartsLeg = () => {
      const nextStartTeamIndex = (startTeamIndex + 1) % teams.length
      dispatch(setStartTeamIndex(nextStartTeamIndex))
   }

   //SOUND EFFECT HANDLER
   const playSound = (fileName: string) => {
      if(isSoundEnabled){
         const audio = new Audio(`/sounds/${fileName}.mp3`)
         audio.play().catch(error => console.log('Error:', error))
      }
   }

   //SUBMIT SCORE HANDLER FOR INPUT
   const handleSubmitThrowInput = (inputMultiplier: number) => {
      const invalidScores = [163, 166, 169, 172, 173, 175, 176, 178, 179]
      const gameTeams = JSON.parse(JSON.stringify(teams))
      const currentTeam = gameTeams[currentTeamIndex]
      
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
      const newHistoryEntry: HistoryEntryTeams = {
         historyTeamIndex: currentTeamIndex,
         historyPlayerIndexInTeam: currentPlayerIndexInTeam,
         historyPointsLeft: currentTeam.pointsLeft, 
         historyTotalThrows: currentTeam.totalThrows + (currentThrow * inputMultiplier),
         historyLastScore: currentTeam.lastScore,
         historyLastAverage: currentTeam.average,
         historyTotalAttempts: currentTeam.totalAttempts
      }
      
      //Updating pointsLeft
      currentTeam.pointsLeft -= (currentThrow * inputMultiplier)
      
      //End leg scenario
      if(isDoubleActive && currentTeam.pointsLeft === 0) {
         // Additional history entries created if leg ends in order to properly use Undo handler
         const newHistoryEntries = gameTeams
            .map((team: Team, index: number) => {
               if (index === currentTeamIndex) {
                  return null //NewHistoryEntry not created for currentTeamIndex!
               }
               return {
                  historyTeamIndex: index, 
                  historyPlayerIndexInTeam: currentPlayerIndexInTeam - 1 === -1 ? 1 : currentPlayerIndexInTeam - 1,
                  historyPointsLeft: team.pointsLeft, 
                  historyTotalThrows: team.totalThrows, 
                  historyLastScore: team.lastScore, 
                  historyLastAverage: team.average, 
                  historyTotalAttempts: team.totalAttempts 
               }
            })
            .filter((entry: HistoryEntryTeams | null) => entry !== null) //Skipping currentTeamIndex (null)

         //Updating legs for current team
         currentTeam.legs += 1
         
         //Updating game stats for new leg (for each team)
         gameTeams.forEach((team: Team) => {
            team.pointsLeft = Number(gameMode)
            team.lastScore = 0
            team.totalThrows = 0
            team.totalAttempts = 0
            team.average = 0
            team.isInputPreffered = true
         })

         //Updating history state with currentTeamIndex
         dispatch(setHistory([...history, ...newHistoryEntries, newHistoryEntry]))

         //Upadating team's state
         dispatch(setTeams(gameTeams)) 

         //Switching to the next team which starts the leg
         handleSwitchTeamWhoStartsLeg()

         //Setting current player index:
         dispatch(setCurrentTeamIndex((startTeamIndex + 1) % teams.length))

         //End game check
         checkGameEndHandler(gameTeams)

         //Resetting isDoubleActive state
         dispatch(setIsDoubleActive(false))
 
         //Resetting input value
         dispatch(setCurrentThrow(0))
         
         return
      }

      //Scenario when updated pointsLeft are equal or less than 1
      if(currentTeam.pointsLeft <= 1){
         //Updating historyTotalThrows
         newHistoryEntry.historyTotalThrows = currentTeam.totalThrows

         //Updating pointsLeft, lastScore, totalThrows, totalAttempts and average
         currentTeam.pointsLeft += (currentThrow * inputMultiplier)
         currentTeam.lastScore = 0
         currentTeam.totalThrows += 0
         currentTeam.totalAttempts += 1
         currentTeam.average = currentTeam.totalThrows / currentTeam.totalAttempts

         //Updating history state
         dispatch(setHistory([...history, newHistoryEntry]))

         //Upadating team's state
         dispatch(setTeams(gameTeams))

         //Sound effect
         playSound('no-score')

         //Switching to the next player
         handleSwitchTeam()

         //Resetting input value
         dispatch(setCurrentThrow(0))

         return
      }

      //Updating lastScore, totalThrows, totalAttempts, average
      currentTeam.lastScore = (currentThrow * inputMultiplier)
      currentTeam.totalThrows += (currentThrow * inputMultiplier)
      currentTeam.totalAttempts += 1
      currentTeam.isInputPreffered = true
      currentTeam.average = currentTeam.totalThrows / currentTeam.totalAttempts
      
      //Updating history state
      dispatch(setHistory([...history, newHistoryEntry]))
      
      //Upadating teams's state
      dispatch(setTeams(gameTeams))

      //Sound effect
      if (currentThrow === 0) {
         playSound('no-score')
      } else {
         playSound(currentThrow.toString())
      }
      
      //Switching to the next team
      handleSwitchTeam()
     
      //Resetting input value
      dispatch(setCurrentThrow(0))
   }

   //SUBMIT SCORE HANDLER FOR BUTTONS
   const handleSubmitThrowButtons = (throwValue: number) => {
      const gameTeams = JSON.parse(JSON.stringify(teams))
      const currentTeam = gameTeams[currentTeamIndex]
      const multiplierThrowValue = throwValue * multiplier
      
      //Creating newHistoryEntry
      const newHistoryEntry: HistoryEntryTeams = {
         historyTeamIndex: currentTeamIndex,
         historyPlayerIndexInTeam: currentPlayerIndexInTeam,
         historyPointsLeft: currentTeam.pointsLeft + throwValueSum,
         historyTotalThrows: currentTeam.totalThrows + multiplierThrowValue, 
         historyLastScore: currentTeam.lastScore,
         historyLastAverage: currentTeam.average,
         historyTotalAttempts: currentTeam.totalAttempts
      }
      
      // Incrementing the currentPlayerThrowsCount to keep track of the throws
      const updatedThrowCount = currentPlayerThrowsCount + 1
      
      //Scenario when player has not thrown 3 times yet
      if (updatedThrowCount < 3) {
         //Updating pointsLeft
         currentTeam.pointsLeft -= multiplierThrowValue

         //End leg scenario when player has NOT thrown 3 times yet, multiplier === 2 and pointsLeft === 0
         if(multiplier === 2 && currentTeam.pointsLeft === 0){
            const newHistoryEntries = gameTeams
               .map((team: Team, index: number) => {
                  if (index === currentTeamIndex) {
                     return null //NewHistoryEntry not created for currentTeamIndex
                  }
                  return {
                     historyTeamIndex: index, 
                     historyPlayerIndexInTeam: currentPlayerIndexInTeam - 1 === -1 ? 1 : currentPlayerIndexInTeam - 1,
                     historyPointsLeft: team.pointsLeft, 
                     historyTotalThrows: team.totalThrows, 
                     historyLastScore: team.lastScore, 
                     historyLastAverage: team.average, 
                     historyTotalAttempts: team.totalAttempts 
                  }
               })
               .filter((entry: HistoryEntryTeams | null) => entry !== null) //Skipping currentTeamIndex (null)

            //Updating legs
            currentTeam.legs += 1 

            //Updating game stats for new leg (for each team)
            gameTeams.forEach((team: Team) => {
               team.pointsLeft = Number(gameMode)
               team.lastScore = 0
               team.totalThrows = 0
               team.totalAttempts = 0
               team.average = 0
               team.isInputPreffered = true
            })
            
            //Updating history state
            dispatch(setHistory([...history, ...newHistoryEntries, newHistoryEntry]))

            //Switching to the next team which starts the leg
            handleSwitchTeamWhoStartsLeg()

            //Setting current team index:
            dispatch(setCurrentTeamIndex((startTeamIndex + 1) % teams.length))

            //Updating team's state
            dispatch(setTeams(gameTeams)) 

            //Checking game end
            checkGameEndHandler(gameTeams)

            //Resetting states
            dispatch(setThrowValueSum(0))
            dispatch(setCurrentPlayerThrowsCount(0))
            dispatch(setCurrentPlayerThrows([]))
            dispatch(setCurrentThrow(0))
            dispatch(setCurrentThrow(0))

            return
         }

         //Scenario when player has not thrown 3 times yet but pointsLeft are equal or less than 1
         if(currentTeam.pointsLeft <= 1) {
            currentTeam.pointsLeft = newHistoryEntry.historyPointsLeft
            currentTeam.lastScore = 0
            currentTeam.totalThrows -= throwValueSum
            currentTeam.totalAttempts += 1
            currentTeam.average = currentTeam.totalThrows / currentTeam.totalAttempts

            //Updating history state
            dispatch(setHistory([...history, newHistoryEntry]))

            //Sound effect:
            playSound('no-score')

            //Switching to the next team
            handleSwitchTeam()

            //Resetting states
            dispatch(setCurrentThrow(0))
            dispatch(setThrowValueSum(0))
            dispatch(setCurrentPlayerThrowsCount(0))
            dispatch(setCurrentPlayerThrows([]))
            dispatch(setCurrentThrow(0))

            //Updating team's state
            dispatch(setTeams(gameTeams))

            return
         }

         //Updating totalThrows, throwValueSum, currentPlayerThrows, currentPlayerThrowsCount (currentThrow in case player would like to switch input method)
         currentTeam.totalThrows += multiplierThrowValue
         dispatch(setThrowValueSum(throwValueSum + multiplierThrowValue))
         dispatch(setCurrentPlayerThrows([...currentPlayerThrows, multiplierThrowValue].slice(-3)))
         dispatch(setCurrentPlayerThrowsCount(updatedThrowCount))
         dispatch(setCurrentThrow(0))
      } 
      //Scenario when players has thrown already 3 times
      else {
         //Updating pointsLeft
         currentTeam.pointsLeft -= multiplierThrowValue
         
         //End leg scenario when player has thrown already 3 times, multiplier === 2 and pointsLeft === 0
         if(multiplier === 2 && currentTeam.pointsLeft === 0){
            const newHistoryEntries = gameTeams
               .map((team: Team, index: number) => {
                  if (index === currentTeamIndex) {
                     return null //NewHistoryEntry not created for currentTeamIndex
                  }
                  return {
                     historyTeamIndex: index, 
                     historyPlayerIndexInTeam: currentPlayerIndexInTeam - 1 === -1 ? 1 : currentPlayerIndexInTeam - 1,
                     historyPointsLeft: team.pointsLeft, 
                     historyTotalThrows: team.totalThrows, 
                     historyLastScore: team.lastScore, 
                     historyLastAverage: team.average, 
                     historyTotalAttempts: team.totalAttempts 
                  }
               })
               .filter((entry: HistoryEntryTeams | null) => entry !== null) //Skipping currentTeamIndex (null)

            //Updating legs:
            currentTeam.legs += 1 

            //Updating game stats for new leg (for each player)
            gameTeams.forEach((team: Team) => {
               team.pointsLeft = Number(gameMode)
               team.lastScore = 0
               team.totalThrows = 0
               team.totalAttempts = 0
               team.average = 0
               team.isInputPreffered = true
            })
            
            //Updating history state
            dispatch(setHistory([...history, ...newHistoryEntries, newHistoryEntry]))

            //Switching to next team which starts the leg
            handleSwitchTeamWhoStartsLeg()

            //Setting current team index:
            dispatch(setCurrentTeamIndex((startTeamIndex + 1) % teams.length))

            //Checking game end
            checkGameEndHandler(gameTeams)

            //Resetting states
            dispatch(setThrowValueSum(0))
            dispatch(setCurrentPlayerThrowsCount(0))
            dispatch(setCurrentPlayerThrows([]))
            dispatch(setCurrentThrow(0))

            //Updating team's state
            dispatch(setTeams(gameTeams)) 

            return
         }

         //Scenario when player has already thrown 3 times, but pointsLeft are equal or less than 1
         if(currentTeam.pointsLeft <= 1) {
            currentTeam.pointsLeft += multiplierThrowValue
            currentTeam.lastScore = 0
            currentTeam.totalThrows -= throwValueSum
            currentTeam.totalAttempts += 1
            currentTeam.average = currentTeam.totalThrows / currentTeam.totalAttempts
            dispatch(setHistory([...history, newHistoryEntry]))
            playSound('no-score')
            handleSwitchTeam()
            dispatch(setThrowValueSum(0))
            dispatch(setCurrentPlayerThrowsCount(0))
            dispatch(setCurrentPlayerThrows([]))
            dispatch(setCurrentThrow(0))
            dispatch(setTeams(gameTeams)) 
            return
         }

         //Updating lastScore, totalThrows, totalAttempts, average when player has already thrown 3 times:
         currentTeam.lastScore = throwValueSum + multiplierThrowValue
         currentTeam.totalThrows += multiplierThrowValue
         currentTeam.totalAttempts += 1
         currentTeam.average = currentTeam.totalThrows / currentTeam.totalAttempts
         
         //Updating history state
         dispatch(setHistory([...history, newHistoryEntry]))

         //Sound effect:
         playSound((throwValueSum + multiplierThrowValue).toString())

         //Resetting states:
         dispatch(setThrowValueSum(0))
         dispatch(setCurrentPlayerThrowsCount(0))
         dispatch(setCurrentPlayerThrows([]))
         dispatch(setCurrentThrow(0))
         
         //Switching to the next player
         handleSwitchTeam()
      }

      //Updating  player's state
      setTeams(gameTeams)
   }

   //SUBMIT SCORE HANDLER FOR BUTTONS (for better user experience, i.e. when player has thrown 0 or missed any of 3 darts - no need to click on button with 0 value)
   const handleSubmitScoreButtons = () => {
      const updatedTeams = JSON.parse(JSON.stringify(teams))
      const currentTeam = updatedTeams[currentTeamIndex]

      const throwSum = currentPlayerThrows.reduce((acc: number, throwValue: number) => acc + throwValue, 0)

      //Creating newHistoryEntry
      const newHistoryEntry: HistoryEntryTeams = {
         historyTeamIndex: currentTeamIndex,
         historyPlayerIndexInTeam: currentPlayerIndexInTeam,
         historyPointsLeft: currentTeam.pointsLeft + throwSum,
         historyTotalThrows: currentTeam.totalThrows, 
         historyLastScore: currentTeam.lastScore,
         historyLastAverage: currentTeam.average,
         historyTotalAttempts: currentTeam.totalAttempts
      }
      
      //Updating lastScore and totalAttempts
      currentTeam.lastScore = throwSum
      currentTeam.totalAttempts += 1

      //Average calculation:
      currentTeam.average = currentTeam.totalThrows / currentTeam.totalAttempts

      //Updating history state
      dispatch(setHistory([...history, newHistoryEntry]))

      //Sound-effect
      if(throwSum === 0){
         playSound('no-score')
      } else {
         playSound(throwSum.toString())
      }
      
      //Resetting states
      dispatch(setThrowValueSum(0))
      dispatch(setCurrentPlayerThrows([]))
      dispatch(setCurrentPlayerThrowsCount(0))
      dispatch(setCurrentThrow(0))

      //Switching to the next player
      handleSwitchTeam()
      
      //Updating player's state
      dispatch(setTeams(updatedTeams))
   }
   
   //UNDO HANDLER
   const handleUndo = () => {
      const lastEntry = history[history.length - 1]
      const gameTeams = JSON.parse(JSON.stringify(teams))

      //Scenario when players have just finished previous leg
      if(history.length !== 0 && lastEntry.historyTotalThrows === Number(gameMode)){
         const currentTeam = gameTeams[lastEntry.historyTeamIndex]

         currentTeam.legs -= 1

         //Updating game stats for each team
         gameTeams.forEach((team: Team, index: number) => {
            const teamHistory = [...history].reverse().find(entry => entry.historyTeamIndex === index)
            if (teamHistory) {
               team.pointsLeft = teamHistory.historyPointsLeft
               team.lastScore = teamHistory.historyLastScore
               team.totalThrows = teamHistory.historyTotalThrows === Number(gameMode) ? teamHistory.historyTotalThrows - teamHistory.historyLastScore : teamHistory.historyTotalThrows
               team.totalAttempts = teamHistory.historyTotalAttempts
               team.average = teamHistory.historyLastAverage
            }
         })

         //Setting currentTeamIndex to the last player who played in the history
         dispatch(setCurrentTeamIndex(lastEntry.historyTeamIndex)) 

         //Removing last history entries (inlcuding additional entries created when team finished leg)
         dispatch(setHistory(history.slice(0, history.length - gameTeams.length)))

         //Updating players state
         dispatch(setTeams(gameTeams)) 

         return
      }
      
      //Undo handler for input
      if(!showNumberButtons){
         if(history.length === 0) return
         
         const currentTeam = gameTeams[lastEntry.historyTeamIndex]

         //Restoring pointsLeft, lastScore, average, totalAttempts, totalThrows
         currentTeam.totalThrows -= currentTeam.lastScore
         currentTeam.pointsLeft = lastEntry.historyPointsLeft 
         currentTeam.lastScore = lastEntry.historyLastScore
         currentTeam.average = lastEntry.historyLastAverage
         currentTeam.totalAttempts = lastEntry.historyTotalAttempts
         
         //Setting currentTeamIndex and currentPlayerIndexInTeam to the last team/player who played in the history
         dispatch(setCurrentTeamIndex(lastEntry.historyTeamIndex))
         dispatch(setCurrentPlayerIndexInTeam(lastEntry.historyPlayerIndexInTeam)) 
         
         //Removing last history entry
         dispatch(setHistory(history.slice(0, -1)))
      }
      
      //Undo handler for buttons
      if(showNumberButtons){
         //SCENARIO 1: Empty history, currentPlayerThrowCount !== 0
         if(history.length === 0 && currentPlayerThrowsCount !== 0){
            const currentTeam = gameTeams[currentTeamIndex]
            
            //Temporary variables with updated throw count and throws array
            const updatedThrowCount = currentPlayerThrowsCount - 1
            const updatedThrows = [...currentPlayerThrows]
            
            //Updating pointsLeft, totalThrows and throwValueSum
            currentTeam.pointsLeft += updatedThrows[updatedThrows.length -1]
            currentTeam.totalThrows -= updatedThrows[updatedThrows.length -1]
            const updatedThrowValueSum = throwValueSum - currentPlayerThrows[currentPlayerThrows.length - 1]
            dispatch(setThrowValueSum(updatedThrowValueSum))
            
            
            //Removing last available throw from temporary variable
            updatedThrows.pop()
            
            //Updating currentPlayerThrows and currentPlayerThrowCount with temporary variables
            dispatch(setCurrentPlayerThrows(updatedThrows))
            dispatch(setCurrentPlayerThrowsCount(updatedThrowCount))
         } 
         //SCENARIO 2: Empty history
         else if (history.length === 0){
            return
         } 
         //SCENARIO 3: History available and no currentPlayerThrowsCount
         else if (history.length !== 0 && currentPlayerThrowsCount === 0){
            const currentTeam = gameTeams[lastEntry.historyTeamIndex]
            
            //Restoring pointsLeft, lastScore, average
            currentTeam.pointsLeft = lastEntry.historyPointsLeft 
            currentTeam.lastScore = lastEntry.historyLastScore
            currentTeam.average = lastEntry.historyLastAverage
            currentTeam.totalThrows = lastEntry.historyTotalThrows
            currentTeam.totalAttempts = lastEntry.historyTotalAttempts
            
            //Removing last history entry
            dispatch(setHistory(history.slice(0, -1)))
            
            //Setting currentTeamIndex and currentPlayerIndexInTeam to the last team/player who played in the history
            dispatch(setCurrentTeamIndex(lastEntry.historyTeamIndex)) 
            dispatch(setCurrentPlayerIndexInTeam(lastEntry.historyPlayerIndexInTeam))
         }
         //SCENARIO 4: History availble and currentPlayer has already thrown at least once 
         else {
            const currentTeam = gameTeams[currentTeamIndex]
            
            //Temporary variables with updated throw count and throws array
            const updatedThrowCount = currentPlayerThrowsCount - 1
            const updatedThrows = [...currentPlayerThrows]
            
            //Updating pointsLeft, totalThrows and throwValueSum
            currentTeam.pointsLeft += updatedThrows[updatedThrows.length -1]
            currentTeam.totalThrows -= updatedThrows[updatedThrows.length -1]
            const updatedThrowValueSum = throwValueSum - currentPlayerThrows[currentPlayerThrows.length - 1]
            dispatch(setThrowValueSum(updatedThrowValueSum))
            
            //Removing last available throw from temporary variable
            updatedThrows.pop()
   
            //Updating currentPlayerThrows and currentPlayerThrowCount with temporary variables
            dispatch(setCurrentPlayerThrows(updatedThrows))
            dispatch(setCurrentPlayerThrowsCount(updatedThrowCount))
         }
      }
      
      //Updating players state
      dispatch(setTeams(gameTeams)) 
   }

   //GAME END HANDLER
   const checkGameEndHandler = (gameTeams: Team[]) => {
      //Scenario when game type is set to best-of
      if (gameWin === 'best-of') {
         //Sum of legs for all teams
         const totalLegs = gameTeams.reduce((acc: number, team: Team) => acc + team.legs, 0)
         
         //Check if totalLegs for teams equals to number-of-legs parameter
         if (totalLegs === Number(numberOfLegs)) {
            //Finding winner player
            const maxLegs = Math.max(...gameTeams.map((team: Team) => team.legs))
            const winner = teams.find((team: Team) => team.legs === maxLegs) || null
            dispatch(setIsGameEnd(true))
            dispatch(setWinner(winner))
            playSound('and-the-game')
         } else {
            playSound('and-the-leg')
         }       
      }
      //Scenario when game type is set to first-to
      else if (gameWin === 'first-to') {
         //Finding winner team
         const winner = gameTeams.find((team: Team) => team.legs === Number(numberOfLegs)) || null
         if(winner){
            dispatch(setIsGameEnd(true))
            dispatch(setWinner(winner))
            playSound('and-the-game')
         } else {
            playSound('and-the-leg')
         }
      }    
   }
   
  


   useEffect(() => {
      if (teams[currentTeamIndex].isInputPreffered) {
         dispatch(setShowNumberButtons(false))
      } else {
         dispatch(setShowNumberButtons(true))
      }

      if(!initialSoundPlayed){
         playSound('game-is-on')
         dispatch(setInitialSoundPlayed(true))
      }

      console.log(history)
      console.log(teams)

   }, [teams, history, teams[currentTeamIndex].isInputPreffered, currentTeamIndex, initialSoundPlayed])

   return (
      <div className='game-container'>
         <GameTeamsPlayersSection />
         <CurrentPlayerThrowParagraph  context={context} />

         {/*Main score input section (input/buttons toggle, score preview, submit score button, score buttons ):*/}
         <div className='score-section'>  
            {/*Current throws section:*/}
            <div className="throw-value-section">
               {/* Toggle between input and number buttons */}
               <button 
                  className={`input-toggle ${showNumberButtons ? 'buttons-active' : 'input-active'}`} 
                  onClick={() => {
                     //Resetting values when toggle button clicked
                     const gameTeams = JSON.parse(JSON.stringify(teams))
                     const currentTeam = gameTeams[currentTeamIndex]
                     if (currentPlayerThrowsCount > 0) {
                  
                        //Resetting pointsLeft and totalThrows values
                        currentTeam.pointsLeft += throwValueSum
                        currentTeam.totalThrows -= throwValueSum
                  
                        //Resetting throwValueSum, currentPlayerThrows and currentPlayersThrowsCount states
                        dispatch(setThrowValueSum(0))
                        dispatch(setCurrentPlayerThrows([]))
                        setCurrentPlayerThrowsCount(0)         
                     }
                     
                     //Switching isInputPreffered
                     currentTeam.isInputPreffered = !currentTeam.isInputPreffered
                     //Updating player's state
                     dispatch(setTeams(gameTeams))    
                  }}>
                  {showNumberButtons ? 'Input' : 'Buttons'}
               </button>
               
               {/* Score input + remove-last value button*/}
               {!showNumberButtons && (
                  <div className='score-input-section'>
                     <input
                        type="number"
                        value={currentThrow}
                        onChange={(e) => handleThrowChange(e.target.value)}
                     />
                     <button 
                        className='remove-last'
                        onClick={() => {
                           const newValue = String(currentThrow).slice(0, -1)
                           dispatch(setCurrentThrow(newValue ? Number(newValue) : 0))
                        }}
                     >
                        <Image src='/backspace.svg' alt='User icon' width={24} height={24} />
                     </button>
                  </div>
               )}

               {/* Throw details*/}
               {showNumberButtons && (
                  <div className="current-player-throws">
                     {Array.from({ length: 3 }, (_, i) => (
                        <div className='current-throw' key={i}>
                           {currentPlayerThrows[i] !== undefined ? currentPlayerThrows[i] : '-'}
                        </div>
                     ))}
                  </div>
               )}

               {/* Submit score button*/}
               <button 
                  className='submit-score' 
                  onClick={() => {
                     if (!showNumberButtons) {
                        if (isDoubleActive) {
                           handleSubmitThrowInput(2)
                        } else {
                           handleSubmitThrowInput(1)
                        }
                     } else {
                        handleSubmitScoreButtons()
                     }
                  }}
               >
                  Submit Score
               </button>
            </div>
            
            {/* Multiplier section*/}
            <div className='multiplier-section'>
               {!showNumberButtons ? (
                  teams[currentTeamIndex].pointsLeft <= 40 && teams[currentTeamIndex].pointsLeft % 2 === 0 && (
                     <button 
                        onClick={() => dispatch(setIsDoubleActive(!isDoubleActive))} 
                        className={isDoubleActive ? 'active' : ''}
                     >
                        Double
                     </button>
                  )
               ) : (
                  <div className="multiplier-buttons">
                     <button 
                        onClick={() => dispatch(setMultiplier(1))} 
                        className={multiplier === 1 ? 'active' : ''}
                     >
                        Single
                     </button>
                     <button 
                        onClick={() => dispatch(setMultiplier(2))} 
                        className={multiplier === 2 ? 'active' : ''}
                     >
                        Double
                     </button>
                     <button 
                        onClick={() => dispatch(setMultiplier(3))} 
                        className={multiplier === 3 ? 'active' : ''}
                     >
                        Triple
                     </button>
                  </div>
               )}
            </div>

            <div className="score-buttons-section">
               {!showNumberButtons ? (
                  <div className='score-input'>
                     {/* Buttons 0-9 */}
                     {Array.from({ length: 9 }, (_, i) => (
                        <button 
                           key={i} 
                           onClick={() => {
                              const newValue = Number(`${currentThrow}${i+1}`)
                              dispatch(setCurrentThrow(newValue))
                           }}>
                           {i+1}
                        </button>
                     ))}
                     <button onClick={handleUndo}>Undo</button>
                     <button
                        onClick={() => {
                           const newValue = Number(`${currentThrow}${0}`)
                           dispatch(setCurrentThrow(newValue))
                        }}>
                           0
                     </button>
                  </div>
               ) : (
                  <div className='score-buttons'>
                     {/* Score buttons */}
                     {Array.from({ length: 20 }, (_, i) => {
                        const baseValue = i + 1
                        const displayValue = multiplier > 1 ? baseValue * multiplier : null

                        return (
                           <button key={baseValue} onClick={() => handleSubmitThrowButtons(baseValue)}>
                              <span className="base-value">{baseValue}</span>
                              {displayValue && <span className="multiplied-value">({displayValue})</span>}
                           </button>
                        )
                     })}
                     <button onClick={() => handleSubmitThrowButtons(multiplier === 2 ? 50 / 2 : multiplier === 3 ? 50 / 3 : 50)}>Bull (50)</button>
                     <button onClick={() => handleSubmitThrowButtons(multiplier === 2 ? 25 / 2 : multiplier === 3 ? 25 / 3 : 25)}>Outer (25)</button>
                     <button onClick={() => handleSubmitThrowButtons(0)}>Miss</button>
                     <button onClick={handleUndo}>Undo</button>
                  </div>
               )}  
            </div>
         </div>

        
         <SettingsButtons context={context} />
         <ErrorPopUp />
         <GameEndPopUp context={context}/>
      </div>
   )
}
 
export default GameTeams