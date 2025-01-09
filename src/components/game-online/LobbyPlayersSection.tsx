import React from 'react'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'

const LobbyPlayersSection = () => {
   
   const { playerNames } = useSelector((state: RootState) => state.gameSettings)

   return (
      <div className="lobby-players-section main-form">
         <p className='header'>Players:</p>
         <div className='game-online-players'>
            <div className='player-host'>{playerNames[0]}</div>
            <div className='player-joiner'>Another Player</div>
         </div>
        

      </div>
   )
}

export default LobbyPlayersSection