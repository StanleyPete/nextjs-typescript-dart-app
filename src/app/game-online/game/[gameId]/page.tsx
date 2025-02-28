'use client'
import React, { useEffect } from 'react'
import GameOnlinePlayersSection from '@/components/game-online/game/GameOnlinePlayersSection'
import { RootState } from '@/redux/store'
import { useSelector, useDispatch } from 'react-redux'
import CurrentPlayerThrowOnlineSection from '@/components/game-online/game/CurrentPlayerThrowOnlineSection'
import ScoreSectionOnline from '@/components/game-online/game/ScoreSectionOnline'
import OpponentTurnToThrow from '@/components/game-online/game/OpponentTurnToThrowSection'
import { PlayerOnline } from '@/types/redux/gameOnlineTypes'
import { setPlayers, setCurrentPlayerIndex, setIsItYourTurn, setCurrentPlayerTurnStartTime } from '@/redux/slices/game-online/gameOnlineSlice'
import { setRole } from '@/redux/slices/game-online/socketSlice'
import ErrorPopUp from '@/components/ErrorPopUp'
import { playSound } from '@/controllers/playSound'

const GameOnline = () => {
   const dispatch = useDispatch()
   const{ socket, role } = useSelector((state: RootState) => state.socket)
   const gameOnline = useSelector((state: RootState) => state.gameOnline)
   const{ isItYourTurn, isSoundEnabled } = useSelector((state: RootState) => state.gameOnline)

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

      const updatePlayers = (data: { gamePlayers: [] }) => {
         dispatch(setPlayers(formatPlayers(data.gamePlayers)))
      }

      const onScoreSubmitted = (data: { gamePlayers: [], currentPlayerIndex: number, scoreSubmitted: number }) => {
         dispatch(setPlayers(formatPlayers(data.gamePlayers)))
         dispatch(setCurrentPlayerIndex(data.currentPlayerIndex))
         playSound(data.scoreSubmitted.toString(), isSoundEnabled )
         if (isItYourTurn) {
            dispatch(setIsItYourTurn(false))
         }
      }

      const onNoScoreResult = (
         data: { 
            gamePlayers: [], 
            currentPlayerIndex: number, 
            currentPlayerTurnStartTime: number 
         }) => {
         dispatch(setPlayers(formatPlayers(data.gamePlayers)))
         dispatch(setCurrentPlayerIndex(data.currentPlayerIndex))
         dispatch(setCurrentPlayerTurnStartTime(data.currentPlayerTurnStartTime))
         playSound('no-score', isSoundEnabled )
         if (isItYourTurn) {
            dispatch(setIsItYourTurn(false))
         }
      }

      const onCurrentPlayerTurnTimeout = (
         data: { 
            gamePlayers: [], 
            currentPlayerIndex: number, 
            currentPlayerTurnStartTime: number 
         }) => {
         dispatch(setPlayers(formatPlayers(data.gamePlayers)))
         dispatch(setCurrentPlayerIndex(data.currentPlayerIndex))
         dispatch(setCurrentPlayerTurnStartTime(data.currentPlayerTurnStartTime))
         playSound('no-score', isSoundEnabled )
         if (isItYourTurn) {
            dispatch(setIsItYourTurn(false))
         }
      }




      socket.on('score-submitted', onScoreSubmitted)
      socket.on('no-score-result', onNoScoreResult)
      socket.on('current-player-turn-timeout', onCurrentPlayerTurnTimeout)
      socket.on('player-left', updatePlayers)
      socket.on('your-turn-now', () => { dispatch(setIsItYourTurn(true))})
      socket.on('host-change', () => { dispatch(setRole('host'))})
   
      return () => {
         socket.off('score-submitted', onScoreSubmitted)
         socket.off('no-score-result', onNoScoreResult)
         socket.off('player-left', updatePlayers)
         socket.off('your-turn-now')
         socket.off('host-change')
      }
   }, [socket, dispatch, isItYourTurn, isSoundEnabled ])


   useEffect(() => {
      console.log('Updated gameOnline state:', gameOnline)
   }, [gameOnline])

   useEffect(() => {
      console.log('Updated gameOnline state:', role)
   }, [role])



   return (
      <div className='game-container'>
         <GameOnlinePlayersSection />
         <CurrentPlayerThrowOnlineSection />
         {isItYourTurn ? <ScoreSectionOnline /> : <OpponentTurnToThrow />}
         <ErrorPopUp />
      </div>
   )
}

export default GameOnline



