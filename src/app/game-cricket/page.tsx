'use client'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch, useStore } from 'react-redux'
import { RootState } from '@/redux/store'
import { useRouter } from 'next/navigation'
import { setInitialSoundPlayed } from '@/redux/slices/gameSlice'
import { selectDataInGameCricketPage } from '@/redux/selectors/game-cricket/selectDataInGameCricketPage'
import GameCricketSinglePlayersSection from '@/components/game-cricket/GameCricketSinglePlayersSection'
import GameCricketTeamsPlayersSection from '@/components/game-cricket/GameCricketTeamsPlayersSection'
import ErrorPopUp from '@/components/ErrorPopUp'
import GameEndPopUp from '@/components/game-cricket/GameEndPopUp'
import ThrowValueSectionCricket from '@/components/game-cricket/ThrowValueSectionCricket'
import ScoreButtonsCricket from '@/components/game-cricket/ScoreButtonsCricket'
import CurrentPlayerThrowSection from '@/components/CurrentPlayerThrowSection'
import Footer from '@/components/Footer'
import { playSound } from '@/controllers/playSound'
import NavigationPanel from '@/components/NavigationPanel'

const GameCricket = () => {
   const router = useRouter()
   const [allowed, setAllowed] = useState<boolean | null>(null)
   const dispatch = useDispatch()
   const store = useStore()
   const { gameType } = useSelector((state: RootState) => state.gameSettings)
   const isSoundEnabled = useSelector((state: RootState) => state.game?.isSoundEnabled ?? true)
   const initialSoundPlayed = useSelector((state: RootState) => state.game?.initialSoundPlayed ?? true)
   const completedSectors = useSelector((state: RootState) => state.gameCricket?.completedSectors)
   //Memoized (@redux/selectors/game-cricket/selectDataInGameCricketPage)
   const { playersOrTeams, history } = useSelector(selectDataInGameCricketPage)

   useEffect(() => {
      const handleBeforeUnload = () => {
         try {
            const serializedState = JSON.stringify(store.getState())
            if (gameType === 'single') {
               sessionStorage.setItem('storeGameCricketSingle', serializedState)
            } else {
               sessionStorage.setItem('storeGameCricketTeams', serializedState)
            }
         } catch (e) {
            console.error('sessionStorage savedown error', e)
         }
      }

      window.addEventListener('beforeunload', handleBeforeUnload)

      return () => { window.removeEventListener('beforeunload', handleBeforeUnload) }
   }, [store])

   useEffect(() => {
      //Initial sound played only once (when game start)
      if(allowed && !initialSoundPlayed){
         playSound('game-is-on', isSoundEnabled)
         dispatch(setInitialSoundPlayed(true))
      }
   }, [playersOrTeams, history, initialSoundPlayed, dispatch, isSoundEnabled, completedSectors, allowed])

   useEffect(() => {
      const isAllowed = sessionStorage.getItem('cricket-allowed')
      if (!isAllowed) {
         router.replace('/')
      } else {
         setAllowed(true)
      }
   }, [router])

   if (allowed === null) {
   // Poczekaj, aż sprawdzisz sessionStorage
      return null
   }

   
   return (    
      <div className='game-container'>
         <NavigationPanel />
         {gameType === 'single' 
            ? (<GameCricketSinglePlayersSection />) 
            : (<GameCricketTeamsPlayersSection />)
         }
         <CurrentPlayerThrowSection />
         <ThrowValueSectionCricket />
         <ScoreButtonsCricket />
         <Footer githubLogoSrc='/github-mark-white.svg' />
         <ErrorPopUp />
         <GameEndPopUp />
      </div>
   )
}

export default GameCricket
