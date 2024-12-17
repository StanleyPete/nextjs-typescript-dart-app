'use client'
import React, { useEffect } from 'react'
import { useRouter, } from 'next/navigation'
import Image from 'next/image'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import Scores from '@/lib/cricket-scores'
import GameCricketSinglePlayersSection from '@/components/game-cricket/GameCricketSinglePlayersSection'
import GameCricketTeamsPlayersSection from '@/components/game-cricket/GameCricketTeamsPlayersSection'
import CurrentPlayerThrowSection from '@/components/CurrentPlayerThrowSection'
import { playSound } from '@/controllers/playSound'
import { setInitialSoundPlayed } from '@/redux/slices/game-cricket/gameCricketSlice'
import { selectDataInGameCricketPage } from '@/redux/memoizedSelectors'
import SettingsButtons from '@/components/SettingsButtons'
import ErrorPopUp from '@/components/ErrorPopUp'
import GameEndPopUp from '@/components/GameEndPopUp'

const GameCricket = () => {
   const dispatch = useDispatch()
   const { gameType } = useSelector((state: RootState) => state.gameSettings)
   const { isSoundEnabled, initialSoundPlayed } = useSelector((state: RootState) => state.gameCricket)
   const { playersOrTeams, history } = useSelector(selectDataInGameCricketPage)

   
   //NEXT PLAYER HANDLER
   const handleSwitchPlayer = () => {
      /* Switch to another player: 
         Example: If there are 4 players and currentPlayerIndex === 3 (last player's turn), 
         after increasing currentPlayerIndex by 1, 4%4 === 0 which is first player's index
      */
      const nextPlayerIndex = (currentPlayerIndex + 1) % players.length
      setCurrentPlayerIndex(nextPlayerIndex)
   }

   //NEXT PLAYER WHO STARTS THE LEG HANDLER
   const handleStartPlayerIndex = () => {
      setStartPlayerIndex(prevIndex => (prevIndex + 1) % players.length)
   }



   //SCORE BUTTONS HANDLER:
   const handleScoreButtons = (sector: string, label: string, increment: number, value: number) => {
      const gamePlayers = [...players]
      const currentPlayer = gamePlayers[currentPlayerIndex]
      const prevScores = currentPlayer.scores[sector] 
      const updatedThrowCount = currentPlayerThrowsCount + 1
      
      if(currentPlayerThrows.length === 3) {
         setErrorMessage('You have already thrown three times! You can either undo last throw or submit the score')
         setIsError(true)
         return
      } else {
         const updatedPlayerThrows = [...currentPlayerThrows, label]

         const newHistoryEntry: HistoryEntry = {
            historyPlayerIndex: currentPlayerIndex,
            historyPoints: currentPlayer.points, 
            historyScores: { ...currentPlayer.scores },
            historyThrows: [...currentPlayerThrows],
            historyLegs: currentPlayer.legs,
            historyLastThrowSector: sector
         }
         
         currentPlayer.scores[sector] = Math.min(prevScores + increment, 3)
         
         //End leg scenario:
         const currentPlayerHasCompletedAllSectors = Object.values(currentPlayer.scores).every(sector => sector === 3)
         const currentPlayerHasHighestPoints = currentPlayer.points === Math.max(...players.map(player => player.points))
   
         if(currentPlayerHasCompletedAllSectors && currentPlayerHasHighestPoints){
            currentPlayer.legs += 1
   
            setHistory(prevHistory => [...prevHistory, newHistoryEntry])
   
            players.forEach(player => {
               player.points = 0
               player.scores = {
                  '20': 0,
                  '19': 0,
                  '18': 0,
                  '17': 0,
                  '16': 0,
                  '15': 0,
                  'Bull': 0,
               }
            })
            
            setPlayers(gamePlayers) 
            handleStartPlayerIndex()
            setCurrentPlayerIndex((startPlayerIndex + 1) % players.length)
            setCurrentPlayerThrowsCount(0) 
            setCurrentPlayerThrows([]) 
            checkGameEndHandler()
            return
         }
         if (currentPlayer.scores[sector] === 3) {
            const isAnyPlayerWhichHaveNotCompletedSector = players.some(player => player.scores[sector] !== 3)
   
            if(currentPlayer.scores[sector] === 3 && prevScores !== 3 && !isAnyPlayerWhichHaveNotCompletedSector){
               playSound(`${sector}completedclosed`)
               setCompletedSectors(prev => ({ ...prev, [sector]: true }))
            } else if(currentPlayer.scores[sector] === 3 && prevScores !== 3){
               playSound(`${sector}completed`)
            }
      
            if(isAnyPlayerWhichHaveNotCompletedSector) {
               currentPlayer.points += (prevScores + increment - currentPlayer.scores[sector]) * (value/increment)
               
            }
         }
   
         setHistory(prevHistory => [...prevHistory, newHistoryEntry])
         
         if(updatedThrowCount < 3){
            setCurrentPlayerThrows(updatedPlayerThrows)
            setCurrentPlayerThrowsCount(updatedThrowCount)
         } else {
            const newExtraHistoryEntry: HistoryEntry = {
               historyPlayerIndex: currentPlayerIndex,
               historyPoints: currentPlayer.points, 
               historyScores: { ...currentPlayer.scores },
               historyThrows: [...currentPlayerThrows, label],
               historyLegs: currentPlayer.legs,
               historyLastThrowSector: sector
            }
            setHistory(prevHistory => [...prevHistory, newExtraHistoryEntry])
            handleSwitchPlayer()
            setCurrentPlayerThrowsCount(0) 
            setCurrentPlayerThrows([]) 
         }
         
         setPlayers(gamePlayers)

      }
   }

   //SUBMIT SCORE BUTTON HANDLER
   const handleSubmitScore = () => {
      const gamePlayers = [...players]
      const currentPlayer = gamePlayers[currentPlayerIndex]
      const newHistoryEntry: HistoryEntry = {
         historyPlayerIndex: currentPlayerIndex,
         historyPoints: currentPlayer.points, 
         historyScores: { ...currentPlayer.scores },
         historyThrows: [...currentPlayerThrows],
         historyLegs: currentPlayer.legs,
         historyLastThrowSector: ''
      }

      //Scenario when player missed all 3 throws and hits submit score button
      if(currentPlayerThrowsCount === 0){
         handleSwitchPlayer()
         setCurrentPlayerThrowsCount(0) 
         setCurrentPlayerThrows([]) 
      } 
      //Scenario when player has already thrown at least once, but NOT 3 times
      else if (currentPlayerThrowsCount < 3){
         const sector = currentPlayerThrows[currentPlayerThrows.length - 1] === '25' || currentPlayerThrows[currentPlayerThrows.length - 1] === '50' ? 'Bull' : currentPlayerThrows[currentPlayerThrows.length - 1].replace(/[^0-9]/g, '')
         newHistoryEntry.historyLastThrowSector = sector
      }

      setHistory(prevHistory => [...prevHistory, newHistoryEntry])
      handleSwitchPlayer()
      setCurrentPlayerThrowsCount(0) 
      setCurrentPlayerThrows([])
   }

   //MISS BUTTON HANDLER
   const handleMissButton = () => {
      const gamePlayers = [...players]
      const currentPlayer = gamePlayers[currentPlayerIndex]
      const updatedThrowCount = currentPlayerThrowsCount + 1
      const updatedPlayerThrows = [...currentPlayerThrows, '0']
      
      const newHistoryEntry: HistoryEntry = {
         historyPlayerIndex: currentPlayerIndex,
         historyPoints: currentPlayer.points, 
         historyScores: { ...currentPlayer.scores },
         historyThrows: [...currentPlayerThrows],
         historyLegs: currentPlayer.legs,
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
            historyPlayerIndex: currentPlayerIndex,
            historyPoints: currentPlayer.points, 
            historyScores: { ...currentPlayer.scores },
            historyThrows: [...currentPlayerThrows, '0'],
            historyLegs: currentPlayer.legs,
            historyLastThrowSector: ''
         }
         setHistory(prevHistory => [...prevHistory, newExtraHistoryEntry])
         handleSwitchPlayer()
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
      const gamePlayers = [...players]
      const currentPlayer = gamePlayers[lastEntry.historyPlayerIndex]
      const sector = lastEntry.historyLastThrowSector

      //Scenario when player has already thrown at least once
      if (currentPlayerThrowsCount !== 0) {
         const updatedThrowCount = currentPlayerThrowsCount - 1
         setCurrentPlayerThrowsCount(updatedThrowCount)
      } 
      //Scenario when previous player has just won leg
      else if (currentPlayerThrowsCount === 0 && currentPlayer.legs > lastEntry.historyLegs){
         currentPlayer.legs -= 1
         setCurrentPlayerThrowsCount(lastEntry.historyThrows.length)

         gamePlayers.forEach((player, index) => {
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

      currentPlayer.points = lastEntry.historyPoints
      currentPlayer.scores = { ...lastEntry.historyScores }

      //Checking if undo caused change in completedSectors state
      const isAnyPlayerWhichHaveNotCompletedSector = players.some(player => player.scores[sector] !== 3)
      if(isAnyPlayerWhichHaveNotCompletedSector){
         setCompletedSectors(prev => ({ ...prev, [sector]: false }))
      }

      setCurrentPlayerIndex(lastEntry.historyPlayerIndex)
      setCurrentPlayerThrows(lastEntry.historyThrows)
      setPlayers(gamePlayers)
      setHistory(history.slice(0, history.length - 1))
   }

   // //GAME END HANDLER
   // const checkGameEndHandler = () => {
   //    //Scenario when game type is set to best-of
   //    if (gameWinType === 'best-of') {
   //       //Sum of legs for all players
   //       const totalLegs = players.reduce((acc, player) => acc + player.legs, 0)
         
   //       //Check if totalLegs for players equals to number-of-legs parameter
   //       if (totalLegs === Number(numberOfLegs)) {
   //          const maxLegs = Math.max(...players.map(player => player.legs))
   //          const winner = players.find(player => player.legs === maxLegs) || null
   //          setIsGameEnd(true)
   //          setWinner(winner)
   //          playSound('and-the-game')
   //       } else {
   //          playSound('and-the-leg')
   //       }      
   //    }
   //    //Scenario when game type is set to first-to
   //    else if (gameWinType === 'first-to') {
   //       const winner = players.find(player => player.legs === Number(numberOfLegs)) || null
   //       if(winner){
   //          setIsGameEnd(true)
   //          setWinner(winner)
   //          playSound('and-the-game')
   //       } else {
   //          playSound('and-the-leg')
   //       }
   //    }
   // }



   // //ERROR CLOSE HANDLER
   // const closeError = () => {
   //    setIsError(false)
   // }

   useEffect(() => {
      if(!initialSoundPlayed){
         playSound('game-is-on', isSoundEnabled)
         dispatch(setInitialSoundPlayed(true))
      }

      //Only for the purpose of reviewing players/teams and history states in console
      console.log('Players: ', playersOrTeams)
      console.log('History: ', history)

   }, [playersOrTeams, history, initialSoundPlayed, dispatch, isSoundEnabled])


   return (    
      <div className='game-container'>
         {gameType === 'single' 
            ? (<GameCricketSinglePlayersSection />) 
            : (<GameCricketTeamsPlayersSection />)
         }
         <CurrentPlayerThrowSection />

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
            {players.length === 2 ? (
               <>
                  <div className='cricket-score-buttons'>
                     {Scores.map((buttons, index) => (
                        <div  className={`score-row-v2 ${completedSectors[buttons[0] === '25' ? 'Bull' : buttons[0]] ? 'completed-sector' : ''}`} key={index}>
                           <div className='player-score'>
                              <span>
                                 {(() => {
                                    const scoreValue = players[0].scores[buttons[0] === '25' ? 'Bull' : buttons[0]]
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
                                    const scoreValue = players[1].scores[buttons[0] === '25' ? 'Bull' : buttons[0]]
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
               </>

            ) : (
               <>
                  {/*Player row section:*/}
                  <div className="players-row">
                     {players.map((player, index) => (
                        <span key={index} className="player-name">
                           {player.name}
                        </span>
                     ))}
                  </div>
                  
                  {/* Score buttons for > 2 players */}
                  <div className="cricket-score-buttons-v2">
                     {Scores.map((buttons, index) => (
                        <div className={`score-row-v2 ${completedSectors[buttons[0] === '25' ? 'Bull' : buttons[0]] ? 'completed-sector' : ''}`} key={index}>
                           {/* Sekcja z player-score dla każdego gracza */}
                           <div className="player-scores-v2">
                              {players.map((_, playerIndex) => (
                                 <div key={playerIndex} className="player-score-v2">
                                    {(() => {
                                       const scoreValue = players[playerIndex].scores[buttons[0] === '25' ? 'Bull' : buttons[0]]
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
                                 </div>
                              ))}
                           </div>
                           <div className="cricket-buttons-v2">
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
                        </div>
                     ))}
                     <div className="miss-button">
                        <button 
                           onClick={handleMissButton}>
                              Miss
                        </button>
                     </div>
                    
                  </div>

               </>
            )}

         </div>
         
         <SettingsButtons />
         <ErrorPopUp />
         <GameEndPopUp />
         
        
      </div>
   )
}

export default GameCricket
