import React, { useState } from 'react'
import '../../app/styles/insert-new-joiner-name.scss'

interface InsertNewJoinerNameProps {
   currentPlayerInLobby: string;
}

const InsertNewJoinerName: React.FC<InsertNewJoinerNameProps> = ({ currentPlayerInLobby }) => {

   const [playerName, setPlayerName] = useState('')

   const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setPlayerName(event.target.value)
   }

   return (

      <div className='main-container'>
         <h1 className='game-online-header'>GAME ONLINE</h1>
         <p className='current-player-in-lobby'>(Current player in lobby: {currentPlayerInLobby})</p>

         <div className="players-section main-form">
            <p className="players header">Enter your name:</p>
            <div className="player-input">
               <input
                  className='full-width'
                  type="text"
                  value={playerName}
                  placeholder='Player name...' 
                  onChange={handleInputChange}
               />
            </div>
         </div>

         <div className="game-start">
            <button className="game-start-button">
               Join game lobby
            </button>

         </div>
         
      </div>
   )
}


export default InsertNewJoinerName