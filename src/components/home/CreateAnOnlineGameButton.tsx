'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, addGameOnlineStates  } from '@/redux/store'
import { setError } from '@/redux/slices/gameSettingsSlice'
import { socketService } from '@/socket/socket'

const CreateAnOnlineGameButton = () => {
   const dispatch = useDispatch()
   const router = useRouter()
   const focusedSection = useSelector((state: RootState) => state.gameSettings.focusedSection)
   const playerNames = useSelector((state: RootState) => state.gameSettings.playerNames)
   const gameMode = useSelector((state: RootState) => state.gameSettings.gameMode)
   const gameWin = useSelector((state: RootState) => state.gameSettings.gameWin)
   const numberOfLegs = useSelector((state: RootState) => state.gameSettings.numberOfLegs)
   const numberOfPlayers = useSelector((state: RootState) => state.gameSettings.numberOfPlayers)
   const throwTime = useSelector((state: RootState) => state.gameSettings.throwTime)
   const isConnected = useSelector((state: RootState) => state.gameOnline?.isConnected ?? false)
   const gameId = useSelector((state: RootState) => state.gameOnline?.gameId ?? null)

   const validatePlayerNames = () => {
      if (playerNames.some((name: string) => name.trim() === '')) {
         dispatch(setError({ isError: true, errorMessage: 'Please enter your name!' }))
         return false
      }
      return true
   }

   const handleCreateOnlineGame = (event: React.MouseEvent<HTMLButtonElement> | KeyboardEvent ) => {
      if (!validatePlayerNames()) {
         event.preventDefault()
         return
      }

      addGameOnlineStates()
      socketService.connectAndCreateGame(
         playerNames[0], 
         { gameMode, gameWin, numberOfLegs, numberOfPlayers,throwTime }
      )
   }

   useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
         if (focusedSection === 'gameOnlineStart' && event.key === 'Enter') {
            handleCreateOnlineGame(event)
         }
      }

      window.addEventListener('keydown', handleKeyDown)

      return () => { window.removeEventListener('keydown', handleKeyDown) }
   }, [focusedSection])

   useEffect(() => {
      if (isConnected && gameId) {
         router.replace(`/game-online/lobby/${gameId}`)
      }
   }, [isConnected, gameId])

 
   return (
      <button
         className={`game-start-button  ${focusedSection === 'gameOnlineStart' ? 'focused' : ''}`} 
         onClick={handleCreateOnlineGame}
      >
        Create an online game!
      </button>
   )
}

export default CreateAnOnlineGameButton
