'use client'
import React, { useState }from 'react'
import GameSettings from './GameSettings'

const Start = () => {
   const [isGame, setIsGame] = useState<boolean>(false)
   const [gameMode, setGameMode] = useState<string>('')

   //Game mode handler
   const handlePlayGameMode = (mode: string) => {
      setGameMode(mode)
      setIsGame(true) 
   }

   return (
      <div>
         <h1>Welcome to the dart app</h1>
         {isGame ? <GameSettings gameMode={gameMode} /> : 
            <div className='game-mode'>
               <p>Please select the game you want to play:</p>
               <div className='game-mode-buttons'>
                  <button onClick={() => handlePlayGameMode('501')}>501</button>
                  <button onClick={() => handlePlayGameMode('301')}>301</button>
                  <button onClick={() => handlePlayGameMode('Cricket')}>Cricket</button>
               </div>
            </div>
         }
      </div>
   )
}

export default Start