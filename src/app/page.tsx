'use client'
import React, { useEffect, useState} from 'react'
import Image from 'next/image'
import { useSelector, useDispatch } from 'react-redux'
import { resetStates, RootState } from '@/redux/store'
import GameTypeSection from '@/components/home/GameTypeSection'
import GameSinglePlayerNamesInput from '@/components/home/GameSinglePlayerNamesInput'
import GameTeamsPlayerNamesInput from '@/components/home/GameTeamsPlayerNamesInput'
import GameOnlinePlayerNameInput from '@/components/home/GameOnlinePlayerNameInput'
import GameModeSection from '@/components/home/GameModeSection'
import WinTypeSection from '@/components/home/WinTypeSection'
import NumberOfLegsSection from '@/components/home/NumberOfLegsSection'
import ToTheGameButton from '@/components/home/ToTheGameButton'
import CreateAnOnlineGameButton from '@/components/home/CreateAnOnlineGameButton'
import ErrorPopUp from '@/components/ErrorPopUp'
import NumberOfPlayersSection from '@/components/home/NumberOfPlayersSection'
import ThrowTimeSection from '@/components/home/ThrowTimeSection'
import Footer from '@/components/Footer'
import { handleChangeFocusedSection } from '@/controllers/handleChangeFoucesSection'
import './styles/home.scss'
import { setBackFromGame, setFocusedSection } from '@/redux/slices/gameSettingsSlice'

/* 
   HOME PAGE: 
      GAME CLASSIC: 301, 501, 701, 1001 modes
      GAME CRICKET: Cricket mode
*/

const Home = () => {
   const dispatch = useDispatch()
   const [hydrated, setHydrated] = useState(false)
   const focusedSection = useSelector((state: RootState) => state.gameSettings.focusedSection)
   const previousFocusedSection = useSelector((state: RootState) => state.gameSettings.previousFocusedSection)
   const gameType = useSelector((state: RootState) => state.gameSettings.gameType)
   const backFromGame = useSelector((state: RootState) => state.gameSettings.backFromGame)
   
   useEffect(() => {
      sessionStorage.removeItem('classic-allowed')
      sessionStorage.removeItem('cricket-allowed')
      sessionStorage.removeItem('storeGameSingle')
      sessionStorage.removeItem('storeGameTeams')
      sessionStorage.removeItem('storeGameCricketSingle')
      sessionStorage.removeItem('storeGameCricketTeams')
      // resetStates()
      setHydrated(true)
   }, [])

   useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
         const activeElement = document.activeElement
         
         if (activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement) {
            return
         }

         event.preventDefault()
         event.stopPropagation()

         if (activeElement instanceof HTMLElement) {
            activeElement.blur()
         }

         handleChangeFocusedSection(event, gameType, focusedSection, previousFocusedSection, dispatch)
      }

      if (focusedSection === 'gameSinglePlayerNameInput' || focusedSection === 'gameTeamsPlayerNameInputTeam1' || focusedSection === 'gameTeamsPlayerNameInputTeam2') {
         return () => { window.removeEventListener('keydown', handleKeyDown) }
      }


      window.addEventListener('keydown', handleKeyDown)

      return () => { window.removeEventListener('keydown', handleKeyDown) }
   }, [focusedSection, dispatch, gameType, previousFocusedSection])

   useEffect(() => {
      if(backFromGame){
         resetStates()
         dispatch(setBackFromGame(false))
         dispatch(setFocusedSection(null))
      }

   }, [backFromGame])

   if (!hydrated) return null

   return (
      <div className='main-container form'>
         <div className="logo">
            <Image
               src="/logo.webp" 
               alt="Logo"
               width={320}  
               height={38} 
            />
         </div>
         <GameTypeSection />
         { gameType === 'online' 
            ? ( <NumberOfPlayersSection /> ) 
            : null }
         { gameType === 'single' 
            ? ( <GameSinglePlayerNamesInput maxPlayers={4} /> ) 
            : gameType === 'teams' ? 
               ( 
                  <div className='players-section main-form team-section'>
                     <GameTeamsPlayerNamesInput teamIndex={0} playerIndexes={[0, 1]} />
                     <GameTeamsPlayerNamesInput teamIndex={1} playerIndexes={[2, 3]} />
                  </div>
               ) 
               : gameType === 'online' 
                  ? ( <GameOnlinePlayerNameInput /> )
                  : null 
         }
         <GameModeSection />
         <WinTypeSection />
         <NumberOfLegsSection />
         { gameType === 'online' 
            ? (<ThrowTimeSection />) 
            : null
         }
         <div className='game-start'>
            { gameType === 'single' || gameType === 'teams' 
               ? ( <ToTheGameButton />) 
               : gameType === 'online' 
                  ? ( <CreateAnOnlineGameButton /> ) 
                  : null }
         </div>
         <Footer githubLogoSrc='/github-mark.svg' />
         <ErrorPopUp />
      </div>
   )
}

export default Home

