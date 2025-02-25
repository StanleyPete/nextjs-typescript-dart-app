'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import UrlToCopySection from '@/components/game-online/lobby/UrlToCopySection'
import LobbyPlayersSection from '@/components/game-online/lobby/LobbyPlayersSection'
import GameModeOnlineSection from '@/components/game-online/lobby/GameModeOnlineSection'
import WinTypeOnlineSection from '@/components/game-online/lobby/WinTypeOnlineSection'
import NumberOfLegsOnlineSection from '@/components/game-online/lobby/NumberOfLegsOnlineSection'
import StartOnlineGameButton from '@/components/game-online/lobby/StartOnlineGameButton'
import { RootState } from '@/redux/store'
import { useSelector, useDispatch } from 'react-redux'
import '../../../styles/home.scss'
import ErrorPopUp from '@/components/ErrorPopUp'
import GuestReadyButton from '@/components/game-online/lobby/GuestReadyButton'
import { setPlayers } from '@/redux/slices/game-online/gameOnlineSlice'
import { PlayerOnline } from '@/types/redux/gameOnlineTypes'
import { setRole } from '@/redux/slices/game-online/socketSlice'
import { setGameMode, setNumberOfLegs, setGameWin, setError } from '@/redux/slices/gameSettingsSlice'

const Lobby = () => {
   // const router = useRouter()
   const dispatch = useDispatch()
   const socket = useSelector((state: RootState) => state.socket?.socket)
   const role = useSelector((state: RootState) => state.socket?.role)
   // const gameId = useSelector((state: RootState) => state.socket?.gameId)
   const { numberOfPlayers } = useSelector((state: RootState) => state.gameSettings)
   const { players } = useSelector((state: RootState) => state.gameOnline)
  
   
   useEffect(() => {
      if (!socket) return
      const formatPlayers = (gamePlayers: any[]): PlayerOnline[] =>
         gamePlayers.map(player => ({
            name: player.playerName,
            ready: player.ready,
            legs: player.legs,
            pointsLeft: player.pointsLeft,
            lastScore: player.lastScore,
            totalThrows: player.totalThrowsValue,
            attempts: player.attempts,
            average: player.average
         }))

      const updatePlayers = (data: { gamePlayers: any[] }) => {
         dispatch(setPlayers(formatPlayers(data.gamePlayers)))
      }

      const handleGameSettingsChanged = (data: { updatedGameSettings: any, gamePlayers: any[] }) => {
         dispatch(setGameMode(data.updatedGameSettings.gameMode))
         dispatch(setNumberOfLegs(data.updatedGameSettings.numberOfLegs))
         dispatch(setGameWin(data.updatedGameSettings.gameWin))
      }

      const onGameSettingsChanged = (data: { updatedGameSettings: any, gamePlayers: any[] }) => {
         handleGameSettingsChanged(data)
         updatePlayers(data)
      }
      
      socket.on('guest-joined-lobby', updatePlayers)
      socket.on('player-left', updatePlayers)
      socket.on('player-ready', updatePlayers)
      socket.on('game-settings-changed', onGameSettingsChanged)
      socket.on('host-change', () => { dispatch(setRole('host'))})
      socket.on('game-settings-change-failed', (data) => {
         dispatch(setError({ isError: true, errorMessage: data.message }))
      } )
      
      return () => {
         socket.off('guest-joined-lobby', updatePlayers)
         socket.off('player-left', updatePlayers)
         socket.off('player-ready', updatePlayers)
         socket.off('game-settings-changed', onGameSettingsChanged)
         socket.off('host-change')
         socket.off('game-settings-change-failed')
      }
   }, [socket, dispatch])

   useEffect(() => {
      console.log(players)
   },[players])

   // if (!socket) {
   //    return router.push('/')
   // }

   return (
      <div className='main-container form'>
         {/* GAME LOBBY HEADER */}
         <h1 className='game-header'>
            GAME LOBBY
         </h1>

         {/* URL SECTION  / JOIN/LEAVE NOTIFICATION */}
         { players.length < numberOfPlayers 
            ? ( <UrlToCopySection />) 
            : (null) }

         {/* PLAYERS SECTION */}
         <LobbyPlayersSection />

         {/* GAME MODE SECTION */}
         <GameModeOnlineSection />
                 
         {/* WIN TYPE SECTION */}
         <WinTypeOnlineSection />
                 
         {/* NUMBER OF LEGS SECTION*/}
         <NumberOfLegsOnlineSection />

         {/* START GAME / GAME READY BUTTONS*/}
         { role === 'host' 
            ? (<StartOnlineGameButton />)
            : (<GuestReadyButton />) }

         {/*ERROR POP UP*/}
         <ErrorPopUp />
      </div>
   )
}

export default Lobby

