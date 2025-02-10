'use client'
import React from 'react'
import GameOnlinePlayersSection from '@/components/game-online/game/GameOnlinePlayersSection'
import { RootState } from '@/redux/store'
import { useSelector} from 'react-redux'
import CurrentPlayerThrowOnlineSection from '@/components/game-online/game/CurrentPlayerThrowOnlineSection'

const GameOnline = () => {

   const gameOnlineState = useSelector((state: RootState) => state.gameOnline)
   console.log('Game Online State:', gameOnlineState)

   

   return (
      <div className='game-container'>
         <GameOnlinePlayersSection />
         <CurrentPlayerThrowOnlineSection />
      </div>
   )
}

export default GameOnline

