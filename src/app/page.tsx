'use client'
import React, { useState } from 'react'
import Link from 'next/link'

const Home = () => {
   //State to track player names
   const [playerNames, setPlayerNames] = useState<string[]>(['', ''])
   //State to track selected score (301, 501, 701)
   const [selectedScore, setSelectedScore] = useState<number>(501)
   // State to track game type (best of / first to)
   const [gameType, setGameType] = useState<'best-of' | 'first-to'>('best-of')
   //State to track number of legs
   const [numberOfLegs, setNumberOfLegs] = useState(3)
   //State to track if error occured
   const [isError, setIsError] = useState<boolean>(false)
   //State to set error message
   const [errorMessage, setErrorMessage] = useState<string>('')

   //Max number of players
   const maxPlayers = 4
   
   //Player name update handler
   const handleNameChange = (index: number, value: string) => {
      const newNames = [...playerNames]
      newNames[index] = value
      setPlayerNames(newNames)
   }
   
   //Add a new player handler
   const addPlayerInput = () => {
      if (playerNames.length < maxPlayers) {
         setPlayerNames([...playerNames, ''])
      } else {
         setIsError(true)
         setErrorMessage('Max player number is 4')
      }
   }

   //Remove player handler
   const removePlayerInput = (index: number) => {
      if (playerNames.length > 1) {
         const newNames = [...playerNames]
         newNames.splice(index, 1)
         setPlayerNames(newNames)
      } else {
         setIsError(true)
         setErrorMessage('At least one player is required.')
      }
   }
   
   //Validate player names
   const validatePlayerNames = () => {
      if (playerNames.some(name => name.trim() === '')) {
         setIsError(true)
         setErrorMessage('All player names must be filled out.')
         return false
      }
      return true
   }

   // Score selection handler
   const handleScoreSelection = (score: number) => {
      setSelectedScore(score)
   }

   // Game type handler
   const handleGameTypeChange = (type: 'best-of' | 'first-to') => {
      setGameType(type)
   }
   
   // Number of legs handler
   const handleNumberOfLegs = (legs: number) => {
      setNumberOfLegs(legs)
   }
   
   //Error close handler
   const closeError = () => {
      setIsError(false)
      setErrorMessage('')
   }
   
   // Preparing players data and generating URL
   const playersJson = encodeURIComponent(JSON.stringify(playerNames))
   const gameUrl = `/game?mode=${selectedScore}&game-type=${gameType}&players=${playersJson}&number-of-legs=${numberOfLegs}`
   
   return (
      <div className='main-container'>
         {/* Error section */}
         {isError && (
            <div className="error">
               <div className="error-content">
                  <p>{errorMessage}</p>
                  <button onClick={closeError}>OK</button>
               </div>
            </div>
         )}

         {/* Button to add a new player */}
         <button onClick={addPlayerInput} className='add-player-button'>Add Player</button>

         {/* Players section */}
         <div>
            {playerNames.map((name, index) => (
               <div key={index}>
                  <label htmlFor={`player-${index}`}>Player {index + 1} Name:</label>
                  <input
                     type="text"
                     id={`player-${index}`}
                     value={name}
                     onChange={(event) => handleNameChange(index, event.target.value)}
                  />
                  {/* Button to remove player */}
                  <button 
                     className="remove-player-button" 
                     onClick={() => removePlayerInput(index)}
                  >
                     Remove
                  </button>
               </div>
            ))}
         </div>

         {/* Selecting score section */}
         <div className='score-buttons'>
            {[301, 501, 701].map((score) => (
               <button
                  key={score}
                  className={`score-button ${selectedScore === score ? 'active' : ''}`}
                  onClick={() => handleScoreSelection(score)}
               >
                  {score}
               </button>
            ))}
         </div>
         
         {/* Selecting game type section */}
         <div className='game-type-buttons'>
            <button 
               className={`game-type-button ${gameType === 'best-of' ? 'active' : ''}`} 
               onClick={() => handleGameTypeChange('best-of')}
            >
               Best Of
            </button>
            <button 
               className={`game-type-button ${gameType === 'first-to' ? 'active' : ''}`} 
               onClick={() => handleGameTypeChange('first-to')}
            >
               First To
            </button>
         </div>
         
         {/* Selecting number of legs section */}
         <div className='legs-buttons'>
            {/* Selecting number of legs section if game type is set to best-of*/}
            {gameType === 'best-of'
               ? [1, 3, 5, 7, 9].map((legs) => (
                  <button
                     key={legs}
                     className={`legs-button ${numberOfLegs === legs ? 'active' : ''}`}
                     onClick={() => handleNumberOfLegs(legs)}
                  >
                     {legs}
                  </button>
               ))
               //Selecting number of legs section if game type is set to first-to
               : [1, 2, 3, 4, 5, 6, 7].map((legs) => (
                  <button
                     key={legs}
                     className={`legs-button ${numberOfLegs === legs ? 'active' : ''}`}
                     onClick={() => handleNumberOfLegs(legs)}
                  >
                     {legs}
                  </button>
               ))}
         </div>
       
         {/* Buttons section */}
         <div className='game-start'>
            <Link href={gameUrl}>
               <button 
                  className='game-start-button' 
                  onClick={(event) => {
                     if(!validatePlayerNames()){
                        event.preventDefault()
                        return
                     }
                  }}
               >
                  To the game!
               </button>
            </Link>
         </div>
      </div>
   )
}

export default Home

