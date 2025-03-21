'use client'
import React, { useEffect } from 'react'
import { RootState } from '@/redux/store'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import UrlToCopySection from '@/components/game-online/lobby/UrlToCopySection'
import LobbyPlayersSection from '@/components/game-online/lobby/LobbyPlayersSection'
import GameModeOnlineSection from '@/components/game-online/lobby/GameModeOnlineSection'
import WinTypeOnlineSection from '@/components/game-online/lobby/WinTypeOnlineSection'
import NumberOfLegsOnlineSection from '@/components/game-online/lobby/NumberOfLegsOnlineSection'
import StartOnlineGameButton from '@/components/game-online/lobby/StartOnlineGameButton'
import ThrowTimeOnlineSection from '@/components/game-online/lobby/ThrowTimeOnlineSection'
import TimeoutSection from '@/components/game-online/lobby/TimeoutSection'
import ErrorPopUp from '@/components/ErrorPopUp'
import GuestReadyButton from '@/components/game-online/lobby/GuestReadyButton'
import '../../../styles/home.scss'

const Lobby = () => {
   const router = useRouter()
   const numberOfPlayers = useSelector((state: RootState) => state.gameSettings.numberOfPlayers)
   const players =  useSelector((state: RootState) => state.gameOnline.players)
   const gameId =  useSelector((state: RootState) => state.gameOnline.gameId)
   const isGameStarted =  useSelector((state: RootState) => state.gameOnline.isGameStarted)
   const role =  useSelector((state: RootState) => state.gameOnline.role)

   useEffect(() => {
      if (isGameStarted){
         router.push(`/game-online/game/${gameId}`)
      }
   }, [isGameStarted])

   return (
      <div className='main-container form'>
         <h1 className='game-header'>GAME LOBBY</h1>
         <TimeoutSection />
         { players.length < numberOfPlayers 
            ? ( <UrlToCopySection />) 
            : (null) }
         <LobbyPlayersSection />
         <GameModeOnlineSection />
         <WinTypeOnlineSection />
         <NumberOfLegsOnlineSection />
         <ThrowTimeOnlineSection />
         { role === 'host' 
            ? (<StartOnlineGameButton />)
            : (<GuestReadyButton />) }
         <ErrorPopUp />
      </div>
   )
}

export default Lobby

