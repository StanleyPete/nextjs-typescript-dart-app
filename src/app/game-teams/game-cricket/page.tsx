'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Scores from '@/lib/cricket-scores'

interface Player {
   name: string
   legs: number
   points: number
   scores: { [key: string]: number}
}

interface Team {
   name: string
   members: Player[]
   legs: number
   points: number
   scores: { [key: string]: number}
}

interface HistoryEntry {
   historyPlayerIndex: number
   historyPlayerIndexInTeam: number
   historyPoints: number
   historyScores: { [key: string]: number }
   historyThrows: string[]
   historyLegs: number
   historyLastThrowSector: string
}


const Cricket = () => {
   const router = useRouter()
   const searchParams = useSearchParams()
   // const gameMode = searchParams.get('mode')
   const gameWinType = searchParams.get('game-win-type')
   const numberOfLegs = searchParams.get('number-of-legs')
   const urlPlayers: string[] = JSON.parse(decodeURIComponent(searchParams.get('players') || '[]'))
   
   //State to track players results
   const [players, setPlayers] = useState<Player[]>(urlPlayers.map((playerName: string) => ({
      name: playerName,
      legs: 0,
      points: 0, 
      scores: {
         '20': 0,
         '19': 0,
         '18': 0,
         '17': 0,
         '16': 0,
         '15': 0,
         'Bull': 0,
      }
       
   })))

   // Teams state:
   const [teams, setTeams] = useState<Team[]>([
      { 
         name: 'Team 1', 
         members: players.slice(0, 2), 
         legs: 0,
         points: 0, 
         scores: {
            '20': 0,
            '19': 0,
            '18': 0,
            '17': 0,
            '16': 0,
            '15': 0,
            'Bull': 0,
         }
      },
      { 
         name: 'Team 2', 
         members: players.slice(2, 4), 
         legs: 0,
         points: 0, 
         scores: {
            '20': 0,
            '19': 0,
            '18': 0,
            '17': 0,
            '16': 0,
            '15': 0,
            'Bull': 0,
         }
      }
   ])

   //State to track history of moves
   const [history, setHistory] = useState<HistoryEntry[]>([])
   //CurrentTeamIndex state declared in order to keep players index who currently plays
   const [currentTeamIndex, setCurrentTeamIndex] = useState<number>(0)
   //CurrentPlayerIndexInTeam state declared in order to keep player's index who is currently playing within team
   const [currentPlayerIndexInTeam, setCurrentPlayerIndexInTeam] = useState<number>(0)
   //State to track which player starts the leg
   const [startLegTeamIndex, setStartLegTeamIndex] = useState<number>(0)
   //State to track throws count for each player when using buttons
   const [currentPlayerThrowsCount, setCurrentPlayerThrowsCount] = useState<number>(0)
   //State to track current player throw value and display it in current throw section
   const [currentPlayerThrows, setCurrentPlayerThrows] = useState<string[]>([])
   //State to track if all players have completed sector
   const [completedSectors, setCompletedSectors] = useState<{ [key: string]: boolean }>({
      '20': false,
      '19': false,
      '18': false,
      '17': false,
      '16': false,
      '15': false,
      'Bull': false,
   })
   //State to track if error occured
   const [isError, setIsError] = useState<boolean>(false)
   //State to set error message
   const [errorMessage, setErrorMessage] = useState<string>('')
   //State to check if game ends
   const [isGameEnd, setIsGameEnd] = useState<boolean>(false)
   //State to set winner of the game
   const [winner, setWinner] = useState<Player | null>(null)
   //State to track if the sound is on/off
   const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true)
   //State to track if initial sound message ('game is on') has been played
   const [initialSoundPlayed, setInitialSoundPlayed] = useState<boolean>(false)

   //NEXT PLAYER HANDLER
   const handleSwtichTeam = () => {
      /* Switch to another player: 
         Example: If there are 4 players and currentTeamIndex === 3 (last player's turn), 
         after increasing currentTeamIndex by 1, 4%4 === 0 which is first player's index
      */
      const nextTeamIndex = (currentTeamIndex + 1) % teams.length
      setCurrentTeamIndex(nextTeamIndex)

      if (nextTeamIndex === 0) { 
         setCurrentPlayerIndexInTeam((prevIndex) => (prevIndex + 1) % teams[0].members.length)
      }
   }

   //NEXT PLAYER WHO STARTS THE LEG HANDLER
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

   //SCORE BUTTONS HANDLER:
   const handleScoreButtons = (sector: string, label: string, increment: number, value: number) => {
      const gameTeams = [...teams]
      const currentTeam = gameTeams[currentTeamIndex]
      const prevScores = currentTeam.scores[sector] 
      const updatedThrowCount = currentPlayerThrowsCount + 1
      
      if(currentPlayerThrows.length === 3) {
         setErrorMessage('You have already thrown three times! You can either undo last throw or submit the score')
         setIsError(true)
         return
      } else {
         const updatedPlayerThrows = [...currentPlayerThrows, label]

         const newHistoryEntry: HistoryEntry = {
            historyPlayerIndex: currentTeamIndex,
            historyPlayerIndexInTeam: currentPlayerIndexInTeam,
            historyPoints: currentTeam.points, 
            historyScores: { ...currentTeam.scores },
            historyThrows: [...currentPlayerThrows],
            historyLegs: currentTeam.legs,
            historyLastThrowSector: sector
         }
         
         currentTeam.scores[sector] = Math.min(prevScores + increment, 3)
         
         //End leg scenario:
         const currentTeamHasCompletedAllSectors = Object.values(currentTeam.scores).every(sector => sector === 3)
         const currentTeamHasHighestPoints = currentTeam.points === Math.max(...teams.map(team => team.points))
   
         if(currentTeamHasCompletedAllSectors && currentTeamHasHighestPoints){
            currentTeam.legs += 1
   
            setHistory(prevHistory => [...prevHistory, newHistoryEntry])
   
            teams.forEach(team => {
               team.points = 0
               team.scores = {
                  '20': 0,
                  '19': 0,
                  '18': 0,
                  '17': 0,
                  '16': 0,
                  '15': 0,
                  'Bull': 0,
               }
            })
            
            setTeams(gameTeams) 
            handleSwitchTeamWhoStartsLeg()
            setCurrentTeamIndex((startLegTeamIndex + 1) % teams.length)
            setCurrentPlayerThrowsCount(0) 
            setCurrentPlayerThrows([]) 
            checkGameEndHandler()
            return
         }
         if (currentTeam.scores[sector] === 3) {
            const isAnyTeamWhichHaveNotCompletedSector = teams.some(player => player.scores[sector] !== 3)
   
            if(currentTeam.scores[sector] === 3 && prevScores !== 3 && !isAnyTeamWhichHaveNotCompletedSector){
               playSound(`${sector}completedclosed`)
               setCompletedSectors(prev => ({ ...prev, [sector]: true }))
            } else if(currentTeam.scores[sector] === 3 && prevScores !== 3){
               playSound(`${sector}completed`)
            }
      
            if(isAnyTeamWhichHaveNotCompletedSector) {
               currentTeam.points += (prevScores + increment - currentTeam.scores[sector]) * (value/increment)
               
            }
         }
   
         setHistory(prevHistory => [...prevHistory, newHistoryEntry])
         
         if(updatedThrowCount < 3){
            setCurrentPlayerThrows(updatedPlayerThrows)
            setCurrentPlayerThrowsCount(updatedThrowCount)
         } else {
            const newExtraHistoryEntry: HistoryEntry = {
               historyPlayerIndex: currentTeamIndex,
               historyPlayerIndexInTeam: currentPlayerIndexInTeam,
               historyPoints: currentTeam.points, 
               historyScores: { ...currentTeam.scores },
               historyThrows: [...currentPlayerThrows, label],
               historyLegs: currentTeam.legs,
               historyLastThrowSector: sector
            }
            setHistory(prevHistory => [...prevHistory, newExtraHistoryEntry])
            handleSwtichTeam()
            setCurrentPlayerThrowsCount(0) 
            setCurrentPlayerThrows([]) 
         }
         
         setTeams(gameTeams)

      }
   }

   //SUBMIT SCORE BUTTON HANDLER
   const handleSubmitScore = () => {
      const gameTeams = [...teams]
      const currentTeam = gameTeams[currentTeamIndex]
      const newHistoryEntry: HistoryEntry = {
         historyPlayerIndex: currentTeamIndex,
         historyPlayerIndexInTeam: currentPlayerIndexInTeam,
         historyPoints: currentTeam.points, 
         historyScores: { ...currentTeam.scores },
         historyThrows: [...currentPlayerThrows],
         historyLegs: currentTeam.legs,
         historyLastThrowSector: ''
      }

      //Scenario when player missed all 3 throws and hits submit score button
      if(currentPlayerThrowsCount === 0){
         handleSwtichTeam()
         setCurrentPlayerThrowsCount(0) 
         setCurrentPlayerThrows([]) 
      } 
      //Scenario when player has already thrown at least once, but NOT 3 times
      else if (currentPlayerThrowsCount < 3){
         const sector = currentPlayerThrows[currentPlayerThrows.length - 1] === '25' || currentPlayerThrows[currentPlayerThrows.length - 1] === '50' ? 'Bull' : currentPlayerThrows[currentPlayerThrows.length - 1].replace(/[^0-9]/g, '')
         newHistoryEntry.historyLastThrowSector = sector
      }

      setHistory(prevHistory => [...prevHistory, newHistoryEntry])
      handleSwtichTeam()
      setCurrentPlayerThrowsCount(0) 
      setCurrentPlayerThrows([])
   }

   //MISS BUTTON HANDLER
   const handleMissButton = () => {
      const gameTeams = [...teams]
      const currentTeam = gameTeams[currentTeamIndex]
      const updatedThrowCount = currentPlayerThrowsCount + 1
      const updatedPlayerThrows = [...currentPlayerThrows, '0']
      
      const newHistoryEntry: HistoryEntry = {
         historyPlayerIndex: currentTeamIndex,
         historyPlayerIndexInTeam: currentPlayerIndexInTeam,
         historyPoints: currentTeam.points, 
         historyScores: { ...currentTeam.scores },
         historyThrows: [...currentPlayerThrows],
         historyLegs: currentTeam.legs,
         historyLastThrowSector: ''
      }

      //Scenario when undo button has been hit and currentPlayerThrowsCount === 3
      if(currentPlayerThrowsCount === 3){
         setErrorMessage('You have already thrown three times! You can either undo last throw or submit the score')
         setIsError(true)
         return
      }

      setHistory(prevHistory => [...prevHistory, newHistoryEntry])
      
      //Scenario when player has not thrown 3 times yet
      if(updatedThrowCount < 3){
         setCurrentPlayerThrows(updatedPlayerThrows)
         setCurrentPlayerThrowsCount(updatedThrowCount)
      } 
      //Scenario when player has just thrown 3 times and missed
      else {
         const newExtraHistoryEntry: HistoryEntry = {
            historyPlayerIndex: currentTeamIndex,
            historyPlayerIndexInTeam: currentPlayerIndexInTeam,
            historyPoints: currentTeam.points, 
            historyScores: { ...currentTeam.scores },
            historyThrows: [...currentPlayerThrows, '0'],
            historyLegs: currentTeam.legs,
            historyLastThrowSector: ''
         }
         setHistory(prevHistory => [...prevHistory, newExtraHistoryEntry])
         handleSwtichTeam()
         setCurrentPlayerThrowsCount(0) 
         setCurrentPlayerThrows([]) 
      }
      
   }

   //UNDO HANDLER:
   const handleUndo = () => {
      if(history.length === 0){
         return
      }

      const lastEntry = history[history.length - 1]
      const gameTeams = [...teams]
      const currentTeam = gameTeams[lastEntry.historyPlayerIndex]
      const sector = lastEntry.historyLastThrowSector

      //Scenario when player has already thrown at least once
      if (currentPlayerThrowsCount !== 0) {
         const updatedThrowCount = currentPlayerThrowsCount - 1
         setCurrentPlayerThrowsCount(updatedThrowCount)
      } 
      //Scenario when previous player has just won leg
      else if (currentPlayerThrowsCount === 0 && currentTeam.legs > lastEntry.historyLegs){
         currentTeam.legs -= 1
         setCurrentPlayerThrowsCount(lastEntry.historyThrows.length)

         gameTeams.forEach((player, index) => {
            if (index !== lastEntry.historyPlayerIndex) {
               const playerLastHistoryEntry = [...history]
                  .reverse()
                  .find(entry => entry.historyPlayerIndex === index)
      
               if (playerLastHistoryEntry) {
                  player.points = playerLastHistoryEntry.historyPoints
                  player.scores = { ...playerLastHistoryEntry.historyScores }
               }
            }
         })

      }
      //Scenario when player has not thrown yet 
      else if( currentPlayerThrowsCount === 0) {
         setCurrentPlayerThrowsCount(lastEntry.historyThrows.length)
      }

      currentTeam.points = lastEntry.historyPoints
      currentTeam.scores = { ...lastEntry.historyScores }

      //Checking if undo caused change in completedSectors state
      const isAnyPlayerWhichHaveNotCompletedSector = players.some(player => player.scores[sector] !== 3)
      if(isAnyPlayerWhichHaveNotCompletedSector){
         setCompletedSectors(prev => ({ ...prev, [sector]: false }))
      }

      setCurrentTeamIndex(lastEntry.historyPlayerIndex)
      setCurrentPlayerIndexInTeam(lastEntry.historyPlayerIndexInTeam)
      setCurrentPlayerThrows(lastEntry.historyThrows)
      setTeams(gameTeams)
      setHistory(history.slice(0, history.length - 1))
   }

   //GAME END HANDLER
   const checkGameEndHandler = () => {
      //Scenario when game type is set to best-of
      if (gameWinType === 'best-of') {
         //Sum of legs for all players
         const totalLegs = teams.reduce((acc, player) => acc + player.legs, 0)
         
         //Check if totalLegs for players equals to number-of-legs parameter
         if (totalLegs === Number(numberOfLegs)) {
            const maxLegs = Math.max(...teams.map(player => player.legs))
            const winner = teams.find(player => player.legs === maxLegs) || null
            setIsGameEnd(true)
            setWinner(winner)
            playSound('and-the-game')
         } else {
            playSound('and-the-leg')
         }      
      }
      //Scenario when game type is set to first-to
      else if (gameWinType === 'first-to') {
         const winner = teams.find(player => player.legs === Number(numberOfLegs)) || null
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
            points: 0,
            scores: {
               '20': 0,
               '19': 0,
               '18': 0,
               '17': 0,
               '16': 0,
               '15': 0,
               'Bull': 0,
            }
         },
         { 
            name: 'Team 2', 
            members: players.slice(2, 4), 
            legs: 0, 
            points: 0,
            scores: {
               '20': 0,
               '19': 0,
               '18': 0,
               '17': 0,
               '16': 0,
               '15': 0,
               'Bull': 0,
            }
         }
      ])
      setCurrentTeamIndex(0)
      setCurrentPlayerIndexInTeam(0)
      setStartLegTeamIndex(0) 
      setHistory([])
      setCurrentPlayerThrowsCount(0)
      setCurrentPlayerThrows([]) 
   }

   //ERROR CLOSE HANDLER
   const closeError = () => {
      setIsError(false)
   }

   useEffect(() => {
      if(!initialSoundPlayed){
         playSound('game-is-on')
         setInitialSoundPlayed(true)
      }

      console.log(history)
      console.log(`CurrentPlayerThrowsCount: ${currentPlayerThrowsCount}`)
      console.log(`CurrentPlayerThrows: ${currentPlayerThrows}`)

   }, [history, players, teams, currentPlayerThrowsCount, currentPlayerThrows, initialSoundPlayed])


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

                  {/* Team 1, Player 1 header */}
                  <div className='team-player'>
                     <div className='team-player-name '>
                        {players[0].name === teams[currentTeamIndex].members[currentPlayerIndexInTeam].name && (<Image src='/active-dot.svg' alt='Active dot icon' width={10} height={10} />)}
                        <Image src={players[0].name === teams[currentTeamIndex].members[currentPlayerIndexInTeam].name ? '/game-user-throw.svg' : '/game-user.svg'} alt='User icon' width={16} height={16} />
                        {players[0].name} 
                     </div>
                  
                  </div>

                  {/* Team 1, Player 2 header */}
                  <div className='team-player'>
                     <div className='team-player-name '>
                        {players[1].name === teams[currentTeamIndex].members[currentPlayerIndexInTeam].name && (<Image src='/active-dot.svg' alt='Active dot icon' width={10} height={10} />)}
                        <Image src={players[1].name === teams[currentTeamIndex].members[currentPlayerIndexInTeam].name ? '/game-user-throw.svg' : '/game-user.svg'} alt='User icon' width={16} height={16} />
                        {players[1].name} 
                     </div>
                  
                  </div>

                  {/*Team 1 points left*/}
                  <p className='team-points-left'>
                     {teams[0].points}
                  </p>

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

                  {/* Team 2, Player 1 header */}
                  <div className='team-player'>
                     <div className='team-player-name '>
                        {players[2].name === teams[currentTeamIndex].members[currentPlayerIndexInTeam].name && (<Image src='/active-dot.svg' alt='Active dot icon' width={10} height={10} />)}
                        <Image src={players[2].name === teams[currentTeamIndex].members[currentPlayerIndexInTeam].name ? '/game-user-throw.svg' : '/game-user.svg'} alt='User icon' width={16} height={16} />
                        {players[2].name} 
                     </div>
                  
                  </div>

                  {/* Team 2, Player 2 header */}
                  <div className='team-player'>
                     <div className='team-player-name '>
                        {players[3].name === teams[currentTeamIndex].members[currentPlayerIndexInTeam].name && (<Image src='/active-dot.svg' alt='Active dot icon' width={10} height={10} />)}     
                        <Image src={players[3].name === teams[currentTeamIndex].members[currentPlayerIndexInTeam].name ? '/game-user-throw.svg' : '/game-user.svg'} alt='User icon' width={16} height={16} />
                        {players[3].name} 
                     </div>
                  
                  </div>

                  {/*Team 2 points left*/}
                  <p className='team-points-left'>
                     {teams[1].points}
                  </p>

               </div>

            </div>
         </div>

         {/*Current player throw paragraph:*/}
         <p className='current-player-throw'>
            <button className='sound-button' onClick={toggleSound}>
               <Image 
                  src={isSoundEnabled ? '/sound-on.svg' : '/sound-off.svg'} 
                  alt={isSoundEnabled ? 'Sound On' : 'Sound Off'} 
                  width={16} 
                  height={16} 
               />
               <span>{isSoundEnabled ? 'On' : 'Off'}</span>
            </button>
            <span className='current-player-throw-message'>
               {`${players[currentTeamIndex].name.toUpperCase()}'S TURN TO THROW!`}
            </span>
         </p>

         {/*Main score input section:*/}
         <div className='score-section'> 

            {/*Current throws section:*/}
            <div className="throw-value-section">

               {/*Undo button:*/}
               <button 
                  className="input-toggle" 
                  onClick={handleUndo}>
                  Undo
               </button>
               
               {/* Throw details*/}
               <div className="current-player-throws">
                  {Array.from({ length: 3 }, (_, i) => (
                     <div className='current-throw' key={i}>
                        {currentPlayerThrows[i] !== undefined ? currentPlayerThrows[i] : '-'}
                     </div>
                  ))}
               </div>

               {/* Submit score button*/}
               <button 
                  className='submit-score' 
                  onClick={handleSubmitScore}>
                  Submit Score
               </button>
            </div>
         
            {/*Score buttons:*/}
               
            <div className='cricket-score-buttons'>
               {Scores.map((buttons, index) => (
                  <div  className={`score-row-v2 ${completedSectors[buttons[0] === '25' ? 'Bull' : buttons[0]] ? 'completed-sector' : ''}`} key={index}>
                     <div className='player-score'>
                        <span>
                           {(() => {
                              const scoreValue = teams[0].scores[buttons[0] === '25' ? 'Bull' : buttons[0]]
                              if (scoreValue === 0) {
                                 return ''
                              } else if (scoreValue === 1) {
                                 return 'I'
                              } else if (scoreValue === 2) {
                                 return 'II'
                              } else if (scoreValue === 3) {
                                 return <Image src='/completed.svg' alt='Completed icon' width={16} height={16} />
                              }
                           })()}
                        </span>
                        
                     </div>
                     <div className='cricket-buttons'>
                        {buttons.map((label, i) => {
                           const isTriple = label.startsWith('T')
                           const isDouble = label.startsWith('D')
                           const sector = label === '25' || label === '50' ? 'Bull' : label.replace(/[^0-9]/g, '')
                           const increment = label === '25' ? 1 : label === '50' ? 2 : isTriple ? 3 : isDouble ? 2 : 1
                           const value = isTriple || isDouble ? parseInt(label.slice(1)) * increment : label === '50' ? 50 : parseInt(label) * increment
                           const isSectorCompleted = completedSectors[sector]
                        
                           return (
                              <button 
                                 key={i} 
                                 data-sector={sector}
                                 data-value={value} 
                                 data-increment={increment}
                                 onClick={isSectorCompleted ? () => {} : () => handleScoreButtons(sector, label, increment, value)}
                              >
                                 {label}
                              </button>
                           )

                           
                        })}
                     </div>
                     <div className='player-score'>
                        <span>
                           {(() => {
                              const scoreValue = teams[1].scores[buttons[0] === '25' ? 'Bull' : buttons[0]]
                              if (scoreValue === 0) {
                                 return ''
                              } else if (scoreValue === 1) {
                                 return 'I'
                              } else if (scoreValue === 2) {
                                 return 'II'
                              } else if (scoreValue === 3) {
                                 return <Image src='/completed.svg' alt='Completed icon' width={16} height={16} />
                              }
                           })()}
                        </span> 
                     </div>
                  </div>
                  
               ))}
            </div>
            <div className="miss-button">
               <button onClick={handleMissButton}>Miss</button>
            </div>
         
         </div>
         
         {/* Settings buttons*/}
         <div className="settings-buttons">
            <button 
               className='go-back' 
               onClick={() => router.back()}>
                  Back to Settings
            </button>
            <button 
               className='restart-game' 
               onClick={handleRestartGame}>
                  Restart game
            </button>
         </div>
         
         {/* Error/Game End overlay */}
         {(isError || isGameEnd) && <div className="overlay"></div>}

         {/* Error section */}
         {isError && (
            <div className="error">
               <div className="error-content">
                  <Image 
                     src='/error.svg' 
                     alt='Error icon' 
                     width={100} 
                     height={100} 
                  />
                  <p>{errorMessage}</p>
                  <button 
                     onClick={closeError}>
                        OK
                  </button>
               </div>
            </div>
         )}

         {/* End game pop-up */}
         {isGameEnd && (
            <div className='game-over-popup'>
               <div className='game-over-popup-content'>
                  <Image 
                     src='/winner.svg' 
                     alt='Winner image' 
                     width={80} 
                     height={80} 
                  />
                  <h3>Winner: {winner?.name}</h3>
                  <button 
                     className='play-again' 
                     onClick={handleRestartGame}>
                        Play Again
                  </button>
                  <button 
                     className='go-back' 
                     onClick={() => router.back()}>
                        Back to Settings
                  </button>
                  <button 
                     className='undo' 
                     onClick={() => {
                        handleUndo(); setIsGameEnd(false)}}>
                        Undo
                  </button>
               </div>
            </div>
         )}
        
      </div>
   )
}

export default Cricket
