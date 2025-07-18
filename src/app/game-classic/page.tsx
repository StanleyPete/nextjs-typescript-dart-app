'use client'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch, useStore } from 'react-redux'
import { RootState } from '@/redux/store'
import { useRouter } from 'next/navigation'
import { setInitialSoundPlayed } from '@/redux/slices/gameSlice'
import { selectDataInGameClassicPage } from '@/redux/selectors/game-classic/selectDataInGameClassicPage'
import GameClassicSinglePlayersSection from '@/components/game-classic/GameClassicSinglePlayersSection'
import GameClassicTeamsPlayersSection from '@/components/game-classic/GameClassicTeamsPlayersSection'
import CurrentPlayerThrowSection from '@/components/CurrentPlayerThrowSection'
import ScoreSection from '@/components/game-classic/ScoreSection'
import ErrorPopUp from '@/components/ErrorPopUp'
import GameEndPopUp from '@/components/game-classic/GameEndPopUp'
import { playSound } from '@/controllers/playSound'
import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'
import Footer from '@/components/Footer'
import NavigationPanel from '@/components/NavigationPanel'

/* 
GAME CLASSIC: 
- only for 301, 501, 701, 1001 modes
- used for both single and teams game types 
*/

const GameClassic = () => {
   const router = useRouter()
   const dispatch = useDispatch()
   const [allowed, setAllowed] = useState<boolean | null>(null)
   const store = useStore()
   const isIphoneUser = useSelector((state: RootState) => state.gameSettings.isIphoneUser)
   const gameType = useSelector((state: RootState) => state.gameSettings.gameType) as GameSettingsStates['gameType']
   const isSoundEnabled = useSelector((state: RootState) => state.game?.isSoundEnabled ?? true)
   const initialSoundPlayed= useSelector((state: RootState) => state.game?.initialSoundPlayed ?? true)
  
   //Memoized (@/redux/selectors/game-classic/selectDataInGameClassicPage.ts):
   const { playersOrTeams, history } = useSelector(selectDataInGameClassicPage)

   useEffect(() => { 
      //Initial sound played only once (when game start)
      if(!initialSoundPlayed){
         playSound('game-is-on', isSoundEnabled)
         dispatch(setInitialSoundPlayed(true))
      }
   }, [playersOrTeams, history, initialSoundPlayed, dispatch, isSoundEnabled])

   useEffect(() => {
      const handleBeforeUnload = () => {
         const serializedState = JSON.stringify(store.getState())
         try {
            if (gameType === 'single') {
               sessionStorage.setItem('storeGameSingle', serializedState)
            } else {
               sessionStorage.setItem('storeGameTeams', serializedState)
            }
         } catch (e) {
            console.error('sessionStorage savedown error', e)
         }
      }

      window.addEventListener('beforeunload', handleBeforeUnload)
    

      return () => { window.removeEventListener('beforeunload', handleBeforeUnload) }
   }, [store])


   useEffect(() => {
      const saveStateToSession = () => {
         try {
            const serializedState = JSON.stringify(store.getState())
            if (gameType === 'single') {
               sessionStorage.setItem('storeGameSingle', serializedState)
            } else {
               sessionStorage.setItem('storeGameTeams', serializedState)
            }
         } catch (e) {
            console.error('sessionStorage savedown error', e)
         }
      }

      if (isIphoneUser) {
         const unsubscribe = store.subscribe(saveStateToSession)
         return () => unsubscribe()
      } 
   }, [store, isIphoneUser, gameType])
   
   
   useEffect(() => {
      const isAllowed = sessionStorage.getItem('classic-allowed')
      if (!isAllowed) {
         router.replace('/')
      } else {
         setAllowed(true)
      }
   }, [router])

   if (allowed === null) return null

   return (
      <div className='game-container'>
         <NavigationPanel />
         {gameType === 'single' 
            ? (<GameClassicSinglePlayersSection />) 
            : (<GameClassicTeamsPlayersSection />)
         }
         <CurrentPlayerThrowSection />
         <ScoreSection />
         <Footer githubLogoSrc='/github-mark-white.svg' />
         <GameEndPopUp />
         <ErrorPopUp />
      </div>
   )
}
 
export default GameClassic