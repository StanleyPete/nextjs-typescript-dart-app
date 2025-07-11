'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { RootState } from '@/redux/store'
import { useSelector, useDispatch, useStore } from 'react-redux'
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
import Footer from '@/components/Footer'
import { setFocusedSection } from '@/redux/slices/gameSettingsSlice'
import { handleChangeFocusedSectionLobby } from '@/controllers/handleChangeFocusedSectionLobby'
import { socketService } from '@/socket/socket'

const Lobby = () => {
   const router = useRouter()
   const dispatch = useDispatch()
   const [allowed, setAllowed] = useState<boolean | null>(null)
   const store = useStore()
   const focusedSection = useSelector((state: RootState) => state.gameSettings.focusedSection)
   const numberOfPlayers = useSelector((state: RootState) => state.gameSettings.numberOfPlayers)
   const players =  useSelector((state: RootState) => state.gameOnline.players)
   const isConnected =  useSelector((state: RootState) => state.gameOnline.isConnected)
   const gameId =  useSelector((state: RootState) => state.gameOnline.gameId)
   const isGameStarted =  useSelector((state: RootState) => state.gameOnline.isGameStarted)
   const isTimeout = useSelector((state: RootState) => state.gameOnline.isTimeout)
   const role =  useSelector((state: RootState) => state.gameOnline.role)


   useEffect(() => {
      if (!isConnected) return router.replace('/game-online/status')
   }, [isConnected])

   useEffect(() => {
      const handleBeforeUnload = () => {
         try {
            const serializedStateGameOnline = JSON.stringify(store.getState())
            const socketId = socketService.getClientId()
            sessionStorage.setItem('storeGameOnline', serializedStateGameOnline)
            sessionStorage.setItem('gameId', gameId)
            sessionStorage.setItem('socketId', socketId ?? '')
            socketService.emitReloadOrCloseRequest(gameId)
         } catch (e) {
            console.error('sessionStorage savedown error', e)
         }
      }

      window.addEventListener('beforeunload', handleBeforeUnload)

      return () => { window.removeEventListener('beforeunload', handleBeforeUnload) }
   }, [store])

   useEffect(() => {
      if (isGameStarted) return router.replace(`/game-online/game/${gameId}`)
   }, [isGameStarted])

   useEffect(() => {
      if (isTimeout) return router.replace('/game-online/status')
   }, [isTimeout])

   useEffect(() => {dispatch(setFocusedSection(''))}, [])

   useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
         handleChangeFocusedSectionLobby(event, focusedSection, role, dispatch)
      }


      window.addEventListener('keydown', handleKeyDown)

      return () => { window.removeEventListener('keydown', handleKeyDown) }
   }, [focusedSection, dispatch])

   useEffect(() => {
      const isAllowed = sessionStorage.getItem('online-allowed')
      if (!isAllowed) {
         return router.replace('/')
      } else{
         setAllowed(true)
         const previousGameId = sessionStorage.getItem('gameId')
         const previousSocketId = sessionStorage.getItem('socketId')
         if (previousGameId === null || previousSocketId === null) return 
         socketService.connectAfterRefresh(previousGameId, previousSocketId)
         sessionStorage.removeItem('gameId')
         sessionStorage.removeItem('socketId')
      }
   }, [router])

   if (allowed === null) return null

   

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
         <ThrowTimeOnlineSection  />
         { role === 'host' 
            ? (<StartOnlineGameButton />)
            : (<GuestReadyButton />) }
         <Footer githubLogoSrc='/github-mark.svg' />
         <ErrorPopUp />
      </div>
   )
}

export default Lobby

