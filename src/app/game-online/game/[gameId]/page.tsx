'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { RootState } from '@/redux/store'
import { useSelector, useStore } from 'react-redux'
import GameOnlinePlayersSection from '@/components/game-online/game/GameOnlinePlayersSection'
import CurrentPlayerThrowOnlineSection from '@/components/game-online/game/CurrentPlayerThrowOnlineSection'
import OpponentTurnToThrow from '@/components/game-online/game/OpponentTurnToThrowSection'
import NumberButtonsOnline from '@/components/game-online/game/NumberButtonsOnline'
import KeyboardButtonsOnline from '@/components/game-online/game/KeyboardButtonsOnline'
import ErrorPopUp from '@/components/ErrorPopUp'
import ButtonToggleScoreSubmitMethod from '@/components/game-online/game/ButtonToggleScoreSubmitMethod'
import CurrentPlayerThrowsOnline from '@/components/game-online/game/CurrentPlayerThrows'
import ScoreValueOnline from '@/components/game-online/game/ScoreValue'
import ButtonSubmitScoreOnline from '@/components/game-online/game/ButtonSubmitScore'
import ButtonsMultiplierOnline from '@/components/game-online/game/ButtonsMultiplier'
import ButtonDoubleOnline from '@/components/game-online/game/ButtonDouble'
import GameEndPopUpOnline from '@/components/game-online/game/GameEndPopUpOnline'
import Footer from '@/components/Footer'
import { socketService } from '@/socket/socket'

const GameOnline = () => {
   const router = useRouter()
   const [allowed, setAllowed] = useState<boolean | null>(null)
   const store = useStore()
   const isServerError = useSelector((state: RootState) => state.gameSettings.isServerError)
   const gameOnline = useSelector((state: RootState) => state.gameOnline)
   const gameId =  useSelector((state: RootState) => state.gameOnline.gameId)
   const isItYourTurn = useSelector((state: RootState) => state.gameOnline.isItYourTurn)
   const isConnected =  useSelector((state: RootState) => state.gameOnline.isConnected)
   const showNumberButtons = useSelector((state: RootState) => state.gameOnline.showNumberButtons)
   const ThrowValue = showNumberButtons ? <CurrentPlayerThrowsOnline /> : <ScoreValueOnline />
   const MultiplierSection = showNumberButtons ? <ButtonsMultiplierOnline /> : <ButtonDoubleOnline />
   const InputMethod = showNumberButtons ? <NumberButtonsOnline /> : <KeyboardButtonsOnline />

   
   useEffect(() => {
      if (!isConnected || isServerError) return router.replace('/game-online/status')
   }, [isConnected, isServerError])

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
      console.log('Updated gameOnline state:', gameOnline)
   }, [gameOnline])

   useEffect(() => {
      const isAllowed = sessionStorage.getItem('online-allowed')
      if (!isAllowed) {
         router.replace('/')
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
      <div className='game-container'>
         <GameOnlinePlayersSection />
         <CurrentPlayerThrowOnlineSection />
         <div className='score-section'>
            { isItYourTurn 
               ? (
                  <> 
                     <div className="throw-value-section">
                        <ButtonToggleScoreSubmitMethod />
                        { ThrowValue }
                        <ButtonSubmitScoreOnline />
                     </div>

                     <div className='multiplier-section'> 
                        { MultiplierSection } 
                     </div>

                     { InputMethod }
                     
                  </> ) 
               : ( <OpponentTurnToThrow /> )
            }
         </div>
         <Footer githubLogoSrc='/github-mark-white.svg' />
         <ErrorPopUp />
         <GameEndPopUpOnline />
      </div>
   )
}

export default GameOnline



