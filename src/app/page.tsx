'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import './styles/home.scss'



const Home = () => {
   //State tp tracl game type
   const [gameType, setGameType] = useState<'regular' | 'teams' | 'online'>('regular')
   //State to track player names
   const [playerNames, setPlayerNames] = useState<string[]>(['', ''])
   //State to track selected score (301, 501, 701)
   const [selectedScore, setSelectedScore] = useState<number | string>(501)
   // State to track game type (best of / first to)
   const [gameWin, setGameWin] = useState<'best-of' | 'first-to'>('best-of')
   //State to track number of legs
   const [numberOfLegs, setNumberOfLegs] = useState(3)
   //State to track if error occured
   const [isError, setIsError] = useState<boolean>(false)
   //State to set error message
   const [errorMessage, setErrorMessage] = useState<string>('')
   const [isHovered, setIsHovered] = useState(false)

   //Max number of players
   const maxPlayers = 4
   

   const handleGameType = (type: 'regular' | 'teams' | 'online') => {
      setGameType(type)
   }

   //Player name update handler
   const handleNameChange = (index: number, value: string) => {
      const newNames = [...playerNames]
      newNames[index] = value
      setPlayerNames(newNames)
   }
   
   //Add a new player handler
   const addPlayerInput = () => {
      setPlayerNames([...playerNames, ''])
   }

   //Remove player handler
   const removePlayerInput = (index: number) => {
      const newNames = [...playerNames]
      newNames.splice(index, 1)
      setPlayerNames(newNames)
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
   const handleScoreSelection = (score: number | string) => {
      setSelectedScore(score)
   }

   // Game type handler
   const handleGameWin = (type: 'best-of' | 'first-to') => {
      setGameWin(type)
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
   const gameUrl = `/game?mode=${selectedScore}&game-type=${gameWin}&players=${playersJson}&number-of-legs=${numberOfLegs}`
   
   return (
      <div className='main-container form'>
         <div className='game-type main-form'>
            <p className='type header'>Game type:</p>
            <div className='game-options'>
               <button 
                  className={`game-type-button ${gameType === 'regular' ? 'active' : ''}`} 
                  onClick={() => handleGameType('regular')}
               >
                  Regular
               </button>
               <button 
                  className={`game-type-button ${gameType === 'teams' ? 'active' : ''}`} 
                  onClick={() => handleGameType('teams')}
               >
                  Teams
               </button>
               <button 
                  className={`game-type-button ${gameType === 'online' ? 'active' : ''}`} 
                  onClick={() => handleGameType('online')}
               >
                  Online
               </button>
            </div>
         </div>
         {/* Error section */}
         {isError && (
            <div className="error">
               <div className="error-content">
                  <p>{errorMessage}</p>
                  <button onClick={closeError}>OK</button>
               </div>
            </div>
         )}


         {/* Players section */}
         <div className='players-section main-form'>
            <p className='players header'>{playerNames.length === 1 ? `${playerNames.length} Player:` : `${playerNames.length} Players:`}</p>
            {/* Players name section */}
            {playerNames.map((name, index) => (
               <div className='player-input' key={index}>
                  <input
                     type="text"
                     className={index === 0 ? 'full-width' : ''}
                     id={`player-${index}`}
                     value={name}
                     placeholder={`Player ${index + 1} name`}
                     onChange={(event) => handleNameChange(index, event.target.value)}
                  />
                  {/* Button to remove player */}
                  {playerNames.length > 1 && index > 0 && (
                     <button 
                        className="remove-player-button" 
                        onClick={() => removePlayerInput(index)}
                     >
                        <Image src='/minus.svg' alt='Remove player icon' width={22} height={22} />
                     </button>
                  )}
               </div>
            ))}
            {/* Button to add a new player - displayed when players number < 4 players */}
            {playerNames.length < maxPlayers && (
               <button 
                  onClick={addPlayerInput} 
                  className={`add-player-button ${isHovered ? 'hovered' : ''}`}
                  onMouseEnter={() => setIsHovered(true)} 
                  onMouseLeave={() => setIsHovered(false)}
               >
                  <Image src='/plus.svg' alt='Add player icon' width={16} height={16} />
                  <span>Add new player</span>
               </button>
            )}
         </div>
      
         {/* Selecting score section */}
         <div className='game-mode main-form'>
            <p className='mode header'>Game mode:</p>
            <div className="game-options">
               {[301, 501, 701, 1001, 'Cricket'].map((score) => (
                  <button
                     key={score}
                     className={`score-button ${selectedScore === score ? 'active' : ''}`}
                     onClick={() => handleScoreSelection(score)}
                  >
                     {score}
                  </button>
               ))}
            </div>
         </div>
         
         {/* Selecting game type section */}
         <div className='win-type main-form'>
            <p className='type header'>Win type:</p>
            <div className="game-options">
               <button 
                  className={`win-type-button ${gameWin === 'best-of' ? 'active' : ''}`} 
                  onClick={() => handleGameWin('best-of')}
               >
                  Best Of
               </button>
               <button 
                  className={`win-type-button ${gameWin === 'first-to' ? 'active' : ''}`} 
                  onClick={() => handleGameWin('first-to')}
               >
                  First To
               </button>
            </div>
         </div>
         
         {/* Selecting number of legs section */}
         <div className='legs-buttons main-form'>
            <p className='legs header'>Number of legs</p>
            <div className="game-options">
               {/* Selecting number of legs section if game type is set to best-of*/}
               {gameWin === 'best-of'
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

