'use client'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import checkoutArray from '@/lib/checkout-table'

interface Player {
   name: string
   lastScore: number
   totalThrows: number
   totalAttempts: number
   average: number   
}

interface Team {
   name: string
   members: Player[]
   pointsLeft: number
   lastScore: number
   legs: number
   totalThrows: number
   totalAttempts: number
   average: number
   isInputPreffered: boolean
}

interface HistoryEntry {
   historyTeamIndex: number
   historyPlayerIndexInTeam: number
   historyPointsLeft: number
   historyLastScore: number
   historyTotalThrows: number
   historyLastAverage: number
   historyTotalAttempts: number
}

const Game = () => {
   const router = useRouter()
   const searchParams = useSearchParams()
   
   //Declaring gameMode, gameWinType, numberOfLegs and players based on URL
   const gameMode = searchParams.get('mode')
   const gameWinType = searchParams.get('game-win-type')
   const numberOfLegs = searchParams.get('number-of-legs')
   const urlPlayers: string[] = JSON.parse(decodeURIComponent(searchParams.get('players') || '[]'))

   //Players state:
   const [players, setPlayers] = useState<Player[]>(urlPlayers.map((playerName: string) => ({
      name: playerName,
      lastScore: 0,
      totalThrows: 0,
      totalAttempts: 0, 
      average: 0,
   })))

   // Teams state:
   const [teams, setTeams] = useState<Team[]>([
      { 
         name: 'Team 1', 
         members: players.slice(0, 2), 
         legs: 0, 
         pointsLeft: Number(gameMode),
         lastScore: 0,
         totalThrows: 0,
         totalAttempts: 0,
         average: 0,
         isInputPreffered: true
      },
      { 
         name: 'Team 2', 
         members: players.slice(2, 4), 
         legs: 0, 
         pointsLeft: Number(gameMode),
         lastScore: 0,
         totalThrows: 0,
         totalAttempts: 0,
         average: 0,
         isInputPreffered: true
      }
   ])

   //State to track history of moves
   const [history, setHistory] = useState<HistoryEntry[]>([])
   //CurrentThrow state declared in order to temporarily keep score filled in the score input
   const [currentThrow, setCurrentThrow] = useState<number>(0)
   //CurrentPlayerIndex state declared in order to keep players index who currently plays
   const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0)
   //CurrentTeamIndex state declared in order to keep team's index which is currently playing
   const [currentTeamIndex, setCurrentTeamIndex] = useState<number>(0)
   //CurrentPlayerIndexInTeam state declared in order to keep player's index who is currently playing within team
   const [currentPlayerIndexInTeam, setCurrentPlayerIndexInTeam] = useState<number>(0)
   //State to track which team starts the leg
   const [startLegTeamIndex, setStartLegTeamIndex] = useState<number>(0)
   //State to toggle between input and number buttons
   const [showNumberButtons, setShowNumberButtons] = useState<boolean>(false)
   //State to track total throws sum for current player when using buttons
   const [throwValueSum, setThrowValueSum] = useState<number>(0)
   //State to track throws count for each player when using buttons
   const [currentPlayerThrowsCount, setCurrentPlayerThrowsCount] = useState<number>(0)
   //State to track current team throw value and display it in current throw section
   const [currentPlayerThrows, setCurrentPlayerThrows] = useState<number[]>([])
   //State to set multiplier for buttons (single, double, triple)
   const [multiplier, setMultiplier] = useState<number>(1)
   //State to track if error occured
   const [isError, setIsError] = useState<boolean>(false)
   //State to set error message
   const [errorMessage, setErrorMessage] = useState<string>('')
   //State to turn on double points for input handler
   const [isDoubleActive, setIsDoubleActive] = useState<boolean>(false)
   //State to check if game ends
   const [isGameEnd, setIsGameEnd] = useState<boolean>(false)
   //State to set winner of the game
   const [winner, setWinner] = useState<Player | null>(null)
   //State to track if the sound is on/off
   const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true)
   //State to track if initial sound message ('game is on') has been played
   const [initialSoundPlayed, setInitialSoundPlayed] = useState<boolean>(false)
   
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
      setCurrentTeamIndex(nextTeamIndex)
      
      //Switching to next player within team:
      if (nextTeamIndex === 0) { 
         setCurrentPlayerIndexInTeam((prevIndex) => (prevIndex + 1) % teams[0].members.length)
      }
   }

   //NEXT TEAM WHICH STARTS THE LEG HANDLER
   const handleSwitchTeamWhoStartsLeg = () => {
      setStartLegTeamIndex(prevIndex => (prevIndex + 1) % teams.length)
   }

   //SOUND EFFECT HANDLER
   const playSound = (fileName: string) => {
      if(isSoundEnabled){
         const audio = new Audio(`/sounds/${fileName}.mp3`)
         audio.play().catch(error => console.log('Error:', error))
      }
   }

   //SOUND TOGGLE HANDLER
   const toggleSound = () => {
      setIsSoundEnabled(prev => !prev)
   }

   //SUBMIT SCORE HANDLER FOR INPUT
   const handleSubmitThrowInput = (inputMultiplier: number) => {
      const invalidScores = [163, 166, 169, 172, 173, 175, 176, 178, 179]
      const gameTeams = [...teams]
      const currentTeam = gameTeams[currentTeamIndex]
      
      //Error hanlder (currentThrow over 180)
      if(currentThrow > 180){
         setErrorMessage('Score higher than 180 is not possible')
         setIsError(true)
         setCurrentThrow(0)
         return
      }

      if(invalidScores.includes(currentThrow)){
         setErrorMessage(`${currentThrow} is not possible`)
         setIsError(true)
         setCurrentThrow(0)
         return
      }

      //Creating newHistoryEntry
      const newHistoryEntry: HistoryEntry = {
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
         const newHistoryEntries = teams
            .map((team, index) => {
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
            .filter(entry => entry !== null) //Skipping currentTeamIndex (null)

         //Updating history with additional history entries
         setHistory(prevHistory => [...prevHistory, ...newHistoryEntries])
         
         //Updating legs for current team
         currentTeam.legs += 1
         
         //Updating game stats for new leg (for each team)
         teams.forEach(team => {
            team.pointsLeft = Number(gameMode)
            team.lastScore = 0
            team.totalThrows = 0
            team.totalAttempts = 0
            team.average = 0
            team.isInputPreffered = true
         })

         //Updating history state with currentTeamIndex
         setHistory(prevHistory => [...prevHistory, newHistoryEntry])

         //Upadating team's state
         setTeams(gameTeams) 

         //Switching to the next team which starts the leg
         handleSwitchTeamWhoStartsLeg()

         //Setting current player index:
         setCurrentTeamIndex((startLegTeamIndex + 1) % teams.length)

         //End game check
         checkGameEndHandler()

         //Resetting isDoubleActive state
         setIsDoubleActive(false)
 
         //Resetting input value
         setCurrentThrow(0)
         
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
         setHistory(prevHistory => [...prevHistory, newHistoryEntry])

         //Upadating team's state
         setTeams(gameTeams)

         //Sound effect
         playSound('no-score')

         //Switching to the next player
         handleSwitchTeam()

         //Resetting input value
         setCurrentThrow(0)

         return
      }

      //Updating lastScore, totalThrows, totalAttempts, average
      currentTeam.lastScore = (currentThrow * inputMultiplier)
      currentTeam.totalThrows += (currentThrow * inputMultiplier)
      currentTeam.totalAttempts += 1
      currentTeam.isInputPreffered = true
      currentTeam.average = currentTeam.totalThrows / currentTeam.totalAttempts
      
      //Updating history state
      setHistory(prevHistory => [...prevHistory, newHistoryEntry])
      
      //Upadating teams's state
      setTeams(gameTeams)

      //Sound effect
      if (currentThrow === 0) {
         playSound('no-score')
      } else {
         playSound(currentThrow.toString())
      }
      
      //Switching to the next team
      handleSwitchTeam()
     
      //Resetting input value
      setCurrentThrow(0)
   }

   //SUBMIT SCORE HANDLER FOR BUTTONS
   const handleSubmitThrowButtons = (throwValue: number) => {
      const gameTeams = [...teams]
      const currentTeam = gameTeams[currentTeamIndex]
      const multiplierThrowValue = throwValue * multiplier
      
      //Creating newHistoryEntry
      const newHistoryEntry: HistoryEntry = {
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
            const newHistoryEntries = teams
               .map((team, index) => {
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
               .filter(entry => entry !== null) //Skipping currentTeamIndex (null)

            //Updating history with additional history entries
            setHistory(prevHistory => [...prevHistory, ...newHistoryEntries])
            
            //Updating legs
            currentTeam.legs += 1 

            //Updating game stats for new leg (for each team)
            teams.forEach(team => {
               team.pointsLeft = Number(gameMode)
               team.lastScore = 0
               team.totalThrows = 0
               team.totalAttempts = 0
               team.average = 0
               team.isInputPreffered = true
            })
            
            //Updating history state
            setHistory(prevHistory => [...prevHistory, newHistoryEntry])

            //Switching to the next team which starts the leg
            handleSwitchTeamWhoStartsLeg()

            //Setting current team index:
            setCurrentTeamIndex((startLegTeamIndex + 1) % teams.length)

            //Updating team's state
            setTeams(gameTeams) 

            //Checking game end
            checkGameEndHandler()

            //Resetting states
            setThrowValueSum(0)
            setCurrentPlayerThrowsCount(0)
            setCurrentPlayerThrows([])
            setCurrentThrow(0)
            setCurrentThrow(0)

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
            setHistory(prevHistory => [...prevHistory, newHistoryEntry])

            //Sound effect:
            playSound('no-score')

            //Switching to the next team
            handleSwitchTeam()

            //Resetting states
            setCurrentThrow(0)
            setThrowValueSum(0)
            setCurrentPlayerThrowsCount(0)
            setCurrentPlayerThrows([])
            setCurrentThrow(0)

            //Updating team's state
            setTeams(gameTeams)

            return
         }

         //Updating totalThrows, throwValueSum, currentPlayerThrows, currentPlayerThrowsCount (currentThrow in case player would like to switch input method)
         currentTeam.totalThrows += multiplierThrowValue
         setThrowValueSum(prevSum => prevSum + multiplierThrowValue)
         setCurrentPlayerThrows(prevThrows => [...prevThrows, multiplierThrowValue].slice(-3))
         setCurrentPlayerThrowsCount(updatedThrowCount)
         setCurrentThrow(0)
      } 
      //Scenario when players has thrown already 3 times
      else {
         //Updating pointsLeft
         currentTeam.pointsLeft -= multiplierThrowValue
         
         //End leg scenario when player has thrown already 3 times, multiplier === 2 and pointsLeft === 0
         if(multiplier === 2 && currentTeam.pointsLeft === 0){
            const newHistoryEntries = teams
               .map((team, index) => {
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
               .filter(entry => entry !== null) //Skipping currentTeamIndex (null)

            //Updating history with additional history entries
            setHistory(prevHistory => [...prevHistory, ...newHistoryEntries])

            //Updating legs:
            currentTeam.legs += 1 

            //Updating game stats for new leg (for each player)
            teams.forEach(team => {
               team.pointsLeft = Number(gameMode)
               team.lastScore = 0
               team.totalThrows = 0
               team.totalAttempts = 0
               team.average = 0
               team.isInputPreffered = true
            })
            
            //Updating history state
            setHistory(prevHistory => [...prevHistory, newHistoryEntry])

            //Switching to next team which starts the leg
            handleSwitchTeamWhoStartsLeg()

            //Setting current team index:
            setCurrentTeamIndex((startLegTeamIndex + 1) % teams.length)

            //Checking game end
            checkGameEndHandler()

            //Resetting states
            setThrowValueSum(0)
            setCurrentPlayerThrowsCount(0)
            setCurrentPlayerThrows([])
            setCurrentThrow(0)
            setCurrentThrow(0)

            //Updating team's state
            setTeams(gameTeams) 

            return
         }

         //Scenario when player has already thrown 3 times, but pointsLeft are equal or less than 1
         if(currentTeam.pointsLeft <= 1) {
            currentTeam.pointsLeft += multiplierThrowValue
            currentTeam.lastScore = 0
            currentTeam.totalThrows -= throwValueSum
            currentTeam.totalAttempts += 1
            currentTeam.average = currentTeam.totalThrows / currentTeam.totalAttempts
            setHistory(prevHistory => [...prevHistory, newHistoryEntry])
            playSound('no-score')
            handleSwitchTeam()
            setThrowValueSum(0)
            setCurrentPlayerThrowsCount(0)
            setCurrentPlayerThrows([])
            setCurrentThrow(0)
            setTeams(gameTeams) 
            return
         }

         //Updating lastScore, totalThrows, totalAttempts, average when player has already thrown 3 times:
         currentTeam.lastScore = throwValueSum + multiplierThrowValue
         currentTeam.totalThrows += multiplierThrowValue
         currentTeam.totalAttempts += 1
         currentTeam.average = currentTeam.totalThrows / currentTeam.totalAttempts
         
         //Updating history state
         setHistory(prevHistory => [...prevHistory, newHistoryEntry])

         //Sound effect:
         playSound((throwValueSum + multiplierThrowValue).toString())

         //Resetting states:
         setThrowValueSum(0)
         setCurrentPlayerThrowsCount(0)
         setCurrentPlayerThrows([])
         setCurrentThrow(0)
         
         //Switching to the next player
         handleSwitchTeam()
      }

      //Updating  player's state
      setTeams(gameTeams)
   }

   //SUBMIT SCORE HANDLER FOR BUTTONS (for better user experience, i.e. when player has thrown 0 or missed any of 3 darts - no need to click on button with 0 value)
   const handleSubmitScoreButtons = () => {
      const updatedTeams = [...teams]
      const currentTeam = updatedTeams[currentTeamIndex]

      const throwSum = currentPlayerThrows.reduce((acc, throwValue) => acc + throwValue, 0)

      //Creating newHistoryEntry
      const newHistoryEntry: HistoryEntry = {
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
      setHistory(prevHistory => [...prevHistory, newHistoryEntry])

      //Sound-effect
      if(throwSum === 0){
         playSound('no-score')
      } else {
         playSound(throwSum.toString())
      }
      
      //Resetting states
      setThrowValueSum(0)
      setCurrentPlayerThrows([]) 
      setCurrentPlayerThrowsCount(0)
      setCurrentThrow(0)

      //Switching to the next player
      handleSwitchTeam()
      
      //Updating player's state
      setTeams(updatedTeams)
   }
   
   //UNDO HANDLER
   const handleUndo = () => {
      const lastEntry = history[history.length - 1]
      const gameTeams = [...teams]

      //Scenario when players have just finished previous leg
      if(history.length !== 0 && lastEntry.historyTotalThrows === Number(gameMode)){
         const currentTeam = gameTeams[lastEntry.historyTeamIndex]

         currentTeam.legs -= 1

         //Updating game stats for each team
         gameTeams.forEach((team, index) => {
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
         setCurrentTeamIndex(lastEntry.historyTeamIndex) 

         //Removing last history entries (inlcuding additional entries created when team finished leg)
         setHistory(prevHistory => prevHistory.slice(0, prevHistory.length - gameTeams.length))

         //Updating players state
         setTeams(gameTeams) 

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
         setCurrentTeamIndex(lastEntry.historyTeamIndex)
         setCurrentPlayerIndexInTeam(lastEntry.historyPlayerIndexInTeam) 
         
         //Removing last history entry
         setHistory(prevHistory => prevHistory.slice(0, -1))
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
            setThrowValueSum(prevSum => prevSum - currentPlayerThrows[currentPlayerThrows.length -1])
            
            //Removing last available throw from temporary variable
            updatedThrows.pop()
            
            //Updating currentPlayerThrows and currentPlayerThrowCount with temporary variables
            setCurrentPlayerThrows(updatedThrows)
            setCurrentPlayerThrowsCount(updatedThrowCount)
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
            setHistory(prevHistory => prevHistory.slice(0, -1))
            
            //Setting currentTeamIndex and currentPlayerIndexInTeam to the last team/player who played in the history
            setCurrentTeamIndex(lastEntry.historyTeamIndex) 
            setCurrentPlayerIndexInTeam(lastEntry.historyPlayerIndexInTeam)
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
            setThrowValueSum(prevSum => prevSum - currentPlayerThrows[currentPlayerThrows.length -1])
            
            //Removing last available throw from temporary variable
            updatedThrows.pop()
   
            //Updating currentPlayerThrows and currentPlayerThrowCount with temporary variables
            setCurrentPlayerThrows(updatedThrows)
            setCurrentPlayerThrowsCount(updatedThrowCount)
         }
      }
      
      //Updating players state
      setTeams(gameTeams) 
   }

   //GAME END HANDLER
   const checkGameEndHandler = () => {
      //Scenario when game type is set to best-of
      if (gameWinType === 'best-of') {
         //Sum of legs for all teams
         const totalLegs = teams.reduce((acc, team) => acc + team.legs, 0)
         
         //Check if totalLegs for teams equals to number-of-legs parameter
         if (totalLegs === Number(numberOfLegs)) {
            //Finding winner player
            const maxLegs = Math.max(...teams.map(team => team.legs))
            const winner = teams.find(team => team.legs === maxLegs) || null
            setIsGameEnd(true)
            setWinner(winner)
            playSound('and-the-game')
         } else {
            playSound('and-the-leg')
         }       
      }
      //Scenario when game type is set to first-to
      else if (gameWinType === 'first-to') {
         //Finding winner team
         const winner = teams.find(team=> team.legs === Number(numberOfLegs)) || null
         if(winner){
            setIsGameEnd(true)
            setWinner(winner)
            playSound('and-the-game')
         } else {
            playSound('and-the-leg')
         }
      }    
   }
   
   //RESTART GAME HANDLER
   const handleRestartGame = () => {
      setTeams([
         { 
            name: 'Team 1', 
            members: players.slice(0, 2), 
            legs: 0, 
            pointsLeft: Number(gameMode),
            lastScore: 0,
            totalThrows: 0,
            totalAttempts: 0,
            average: 0,
            isInputPreffered: true
         },
         { 
            name: 'Team 2', 
            members: players.slice(2, 4), 
            legs: 0, 
            pointsLeft: Number(gameMode),
            lastScore: 0,
            totalThrows: 0,
            totalAttempts: 0,
            average: 0,
            isInputPreffered: true
         }
      ])
      setCurrentTeamIndex(0) 
      setCurrentPlayerIndexInTeam(0)
      setCurrentThrow(0) 
      setHistory([]) 
      setThrowValueSum(0) 
      setCurrentPlayerThrowsCount(0) 

      if(isGameEnd){
         setIsGameEnd(false)
         setWinner(null)
      }
   }

   //ERROR CLOSE HANDLER
   const closeError = () => {
      setIsError(false)
   }

   useEffect(() => {
      if (teams[currentTeamIndex].isInputPreffered) {
         setShowNumberButtons(false)
      } else {
         setShowNumberButtons(true)
      }

      if(!initialSoundPlayed){
         playSound('game-is-on')
         setInitialSoundPlayed(true)
      }

      console.log(history)
      console.log(players)

   }, [players, teams, history, teams[currentTeamIndex].isInputPreffered, currentTeamIndex, initialSoundPlayed])

   return (
      <div className='game-container'>

         {/*Game players section:*/}
         <div className="game-players-section">
         
            <div className='teams-preview'>

               {/*Team 1: */}
               <div className={`team-section ${currentTeamIndex === 0 ? 'current-active-team' : ''}`}>
                  
                  {/* Team 1 header */}
                  <div className='team-header'>
                     <p>TEAM 1:</p>
                     <div className='team-legs'>
                        {teams[0].legs}
                     </div>
                  </div>

                  {/* Team 1 players */}
                  {players.slice(0, 2).map((player, index) => (
                     <div className='team-player' key={index}>
                        <div className='team-player-name'>
                           {player.name === teams[currentTeamIndex].members[currentPlayerIndexInTeam].name && (
                              <Image 
                                 src='/active-dot.svg' 
                                 alt='Active dot icon' 
                                 width={6} 
                                 height={6} 
                              />
                           )}
                           <Image
                              src={player.name === teams[currentTeamIndex].members[currentPlayerIndexInTeam].name ? '/game-user-throw.svg' : '/game-user.svg'
                              }
                              alt='User icon'
                              width={16}
                              height={16}
                           />
                           {player.name}
                        </div>
                     </div>
                  ))}


                  {/*Team 1 points left*/}
                  <p className='team-points-left'>
                     {teams[0].pointsLeft}
                  </p>

                  {/*Team 1 checkout options*/}
                  {teams[0].pointsLeft <= 170 && (
                     <p className='checkout-options'>{checkoutArray[teams[0].pointsLeft - 2]}</p>
                  )}

                  {/*Team 1 stats*/}
                  <div className='team-stats'>
                     3-DART AVERAGE: 
                     <p>{teams[0].average.toFixed(2)}</p>
                  </div>
                  <div className='team-stats'>
                     LAST SCORE: 
                     <p>{teams[0].lastScore}</p>
                  </div>

               </div>

               {/*Team 2: */}
               <div className={`team-section ${currentTeamIndex === 1 ? 'current-active-team' : ''}`}>
                  
                  {/* Team 2 header */}
                  <div className='team-header'>
                     <p>TEAM 2:</p>
                     <div className='team-legs'>
                        {teams[1].legs}
                     </div>
                  </div>

                  {/* Team 2 players */}
                  {players.slice(2, 4).map((player, index) => (
                     <div className='team-player' key={index}>
                        <div className='team-player-name'>
                           {player.name === teams[currentTeamIndex].members[currentPlayerIndexInTeam].name && (
                              <Image 
                                 src='/active-dot.svg' 
                                 alt='Active dot icon' 
                                 width={6} 
                                 height={6} 
                              />
                           )}
                           <Image
                              src={player.name === teams[currentTeamIndex].members[currentPlayerIndexInTeam].name ? '/game-user-throw.svg' : '/game-user.svg'
                              }
                              alt='User icon'
                              width={16}
                              height={16}
                           />
                           {player.name}
                        </div>
                     </div>
                  ))}

                  {/*Team 2 points left*/}
                  <p className='team-points-left'>
                     {teams[1].pointsLeft}
                  </p>

                  {/*Team 2 checkout options*/}
                  {teams[1].pointsLeft <= 170 && (
                     <p className='checkout-options'>{checkoutArray[teams[1].pointsLeft - 2]}</p>
                  )}

                  {/*Team 2 stats*/}
                  <div className='team-stats'>
                     3-DART AVERAGE: 
                     <p>{teams[1].average.toFixed(2)}</p>
                  </div>
                  <div className='team-stats'>
                     LAST SCORE: 
                     <p>{teams[1].lastScore}</p>
                  </div>

               </div>

            </div>
            

         </div>
           
         {/*Current player throw paragraph:*/}
         <p className='current-player-throw'>
            <button className='sound-button' onClick={toggleSound}>
               <Image 
                  src={isSoundEnabled ? '/sound-on.svg' : 'sound-off.svg'} 
                  alt={isSoundEnabled ? 'Sound On' : 'Sound Off'} 
                  width={16} 
                  height={16} 
               />
               <span>{isSoundEnabled ? 'On' : 'Off'}</span>
            </button>
            <span className='current-player-throw-message'>
               {`${teams[currentTeamIndex].members[currentPlayerIndexInTeam].name.toUpperCase()}'S TURN TO THROW!`}
            </span>
         </p>

         {/*Main score input section (input/buttons toggle, score preview, submit score button, score buttons ):*/}
         <div className='score-section'>  
            {/*Current throws section:*/}
            <div className="throw-value-section">
               {/* Toggle between input and number buttons */}
               <button 
                  className={`input-toggle ${showNumberButtons ? 'buttons-active' : 'input-active'}`} 
                  onClick={() => {
                     //Resetting values when toggle button clicked
                     const gameTeams = [...teams]
                     const currentTeam = gameTeams[currentTeamIndex]
                     if (currentPlayerThrowsCount > 0) {
                  
                        //Resetting pointsLeft and totalThrows values
                        currentTeam.pointsLeft += throwValueSum
                        currentTeam.totalThrows -= throwValueSum
                  
                        //Resetting throwValueSum, currentPlayerThrows and currentPlayersThrowsCount states
                        setThrowValueSum(0)
                        setCurrentPlayerThrows([])
                        setCurrentPlayerThrowsCount(0)         
                     }
                     
                     //Switching isInputPreffered
                     currentTeam.isInputPreffered = !currentTeam.isInputPreffered
                     //Updating player's state
                     setTeams(gameTeams)    
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
                           setCurrentThrow(newValue ? Number(newValue) : 0)
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
                        onClick={() => setIsDoubleActive(!isDoubleActive)} 
                        className={isDoubleActive ? 'active' : ''}
                     >
                        Double
                     </button>
                  )
               ) : (
                  <div className="multiplier-buttons">
                     <button 
                        onClick={() => setMultiplier(1)} 
                        className={multiplier === 1 ? 'active' : ''}
                     >
                        Single
                     </button>
                     <button 
                        onClick={() => setMultiplier(2)} 
                        className={multiplier === 2 ? 'active' : ''}
                     >
                        Double
                     </button>
                     <button 
                        onClick={() => setMultiplier(3)} 
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
                              setCurrentThrow(newValue)
                           }}>
                           {i+1}
                        </button>
                     ))}
                     <button onClick={handleUndo}>Undo</button>
                     <button
                        onClick={() => {
                           const newValue = Number(`${currentThrow}${0}`)
                           setCurrentThrow(newValue)
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
         <div className="settings-buttons">
            <button className='go-back' onClick={() => router.back()}>Back to Settings</button>
            <button className='restart-game' onClick={handleRestartGame}>Restart game</button>
         </div>
         
         {/* Error/Game End overlay */}
         {(isError || isGameEnd) && <div className="overlay"></div>}

         {/* Error section */}
         {isError && (
            <div className="error">
               <div className="error-content">
                  <Image src='/error.svg' alt='Error icon' width={100} height={100} />
                  <p>{errorMessage}</p>
                  <button onClick={closeError}>OK</button>
               </div>
            </div>
         )}

         {/* End game pop-up */}
         {isGameEnd && (
            <div className='game-over-popup'>
               <div className='game-over-popup-content'>
                  <Image src='/winner.svg' alt='Error icon' width={80} height={80} />
                  <h3>Winner: {winner?.name}</h3>
                  <button className='play-again' onClick={handleRestartGame}>Play Again</button>
                  <button className='go-back' onClick={() => router.back()}>Back to Settings</button>
                  <button className='undo' onClick={() => {handleUndo(); setIsGameEnd(false)}}>Undo</button>
               </div>
            </div>
         )}
      </div>
   )
}
 
export default Game