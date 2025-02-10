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
import GameLobbyHeader from '@/components/game-online/lobby/GameLobbyHeader'
import GuestReadyButton from '@/components/game-online/lobby/GuestReadyButton'
import { setPlayerNames } from '@/redux/slices/gameSettingsSlice'
import { setRole } from '@/redux/slices/game-online/socketSlice'
import { setPlayers } from '@/redux/slices/game-online/gameOnlineSlice'

const Lobby = () => {
   const router = useRouter()
   const dispatch = useDispatch()
   const socket = useSelector((state: RootState) => state.socket?.socket)
   const role = useSelector((state: RootState) => state.socket?.role)
   const gameId = useSelector((state: RootState) => state.socket?.gameId)
   const [guestReady, setGuestReady] = useState<boolean>(false)
   const { playerNames, gameMode } = useSelector((state: RootState) => state.gameSettings)
   const gameOnlineState = useSelector((state: RootState) => state.gameOnline)
   console.log('Game Online State:', gameOnlineState)
   
   useEffect(() => {
      if (role === 'host' && socket) {
         socket.on('guest-ready-res', () => {
            setGuestReady(prev => !prev) 
         })
      }
   }, [socket, role])

   useEffect(() => {
      if (role === 'guest' && socket) {
         socket.on('host-left-response', () => {
            dispatch(setRole('host'))
            dispatch(setPlayerNames([playerNames[1]]))
         })

         socket.on('game-start', () => {
            const gamePlayers = [
               {
                  name: playerNames[0],
                  legs: 0,
                  pointsLeft: Number(gameMode),
                  lastScore: 0,
                  average: 0,
               },
               {
                  name: playerNames[1],
                  legs: 0,
                  pointsLeft: Number(gameMode),
                  lastScore: 0,
                  average: 0,
               },
            ]
            dispatch(setPlayers(gamePlayers))
            router.push(`../game/${gameId}`)
         })

         return () => {
            socket.off('host-left-response')
            socket.off('game-start')
         }
      }
   }, [socket, role, dispatch, playerNames, gameId, router])

   useEffect(() => {
      console.log(playerNames)
   },[playerNames])

   if (!socket) {
      return router.push('/')
   }

   return (
      <div className='main-container form'>
         {/* GAME LOBBY HEADER */}
         <GameLobbyHeader />

         {/* URL SECTION  / JOIN/LEAVE NOTIFICATION */}
         {
            playerNames.length < 2 
               ? ( <UrlToCopySection />) 
               : (null)
         }

         {/* PLAYERS SECTION */}
         <LobbyPlayersSection guestReady={guestReady} />

         {/* GAME MODE SECTION */}
         <GameModeOnlineSection guestReady={guestReady} />
                 
         {/* WIN TYPE SECTION */}
         <WinTypeOnlineSection guestReady={guestReady} />
                 
         {/* NUMBER OF LEGS SECTION*/}
         <NumberOfLegsOnlineSection guestReady={guestReady}/>

         {/* START GAME / GAME READY BUTTONS*/}
         {
            role === 'host' 
               ? (<StartOnlineGameButton guestReady={guestReady}/>)
               : (<GuestReadyButton setGuestReady={setGuestReady} />)
         }

         {/*ERROR POP UP*/}
         <ErrorPopUp />
      </div>
   )
}

export default Lobby

