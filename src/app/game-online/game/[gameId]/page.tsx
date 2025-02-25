'use client'
import React from 'react'
import GameOnlinePlayersSection from '@/components/game-online/game/GameOnlinePlayersSection'
import { RootState } from '@/redux/store'
import { useSelector} from 'react-redux'
import CurrentPlayerThrowOnlineSection from '@/components/game-online/game/CurrentPlayerThrowOnlineSection'
import ScoreSectionOnline from '@/components/game-online/game/ScoreSectionOnline'
import OpponentTurnToThrow from '@/components/game-online/game/OpponentTurnToThrowSection'

const GameOnline = () => {
   const{ socket, role } = useSelector((state: RootState) => state.socket)
   const{ currentPlayerIndex, players, currentPlayer } = useSelector((state: RootState) => state.gameOnline)

   

   return (
      <div className='game-container'>
         <GameOnlinePlayersSection />
         <CurrentPlayerThrowOnlineSection />
         {currentPlayer === role ? <ScoreSectionOnline /> : <OpponentTurnToThrow />}
      </div>
   )
}

export default GameOnline

