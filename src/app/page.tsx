'use client'
import React, { useEffect} from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, resetStates } from '@/redux/store'
import { setPlayerNames, setIsFirstLoad } from '../redux/slices/gameSettingsSlice'
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
import './styles/home.scss'
import Footer from '@/components/Footer'
import { handleChangeFocusedSection } from '@/controllers/handleChangeFoucesSection'

/* 
   HOME PAGE: 
      GAME CLASSIC: 301, 501, 701, 1001 modes
      GAME CRICKET: Cricket mode
*/

const Home = () => {
   const dispatch = useDispatch()
   const pathname = usePathname()
   const { focusedSection, previousFocusedSection, playerNames, gameType, gameMode, isFirstLoad} = useSelector((state: RootState) => state.gameSettings)
   
   //Preparing URL
   const gameFolders = {
      classic: 'game-classic',
      cricket: 'game-cricket',
      online: 'game-online'
   }
   let gameFolder

   if (gameMode === 'Cricket') {
      gameFolder = gameFolders.cricket
   } else if (gameType === 'single' || gameType === 'teams') {
      gameFolder = gameFolders.classic
   } else {
      gameFolder = gameFolders.online
   }

   const gameUrl = `/${gameFolder}`


   const addPlayerInput = () => {
      dispatch(setPlayerNames([...playerNames, '']))
   }


 

   useEffect(() => {
      console.log(`to jest focused section : ${focusedSection}`)
      console.log(`to jest previousFocusedSection: ${previousFocusedSection}`)
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
         return () => {
            window.removeEventListener('keydown', handleKeyDown)
         }
      }


      window.addEventListener('keydown', handleKeyDown)

      return () => {
         window.removeEventListener('keydown', handleKeyDown)
      }
   }, [focusedSection, dispatch, gameType, previousFocusedSection])

   useEffect(() => {
      if (playerNames.length === 4) return

      const handleAddPlayerKeyboard = (event: KeyboardEvent) => {
         if (gameType === 'single' && event.ctrlKey && event.key === '+') {
            addPlayerInput()
         }
      }

      window.addEventListener('keydown', handleAddPlayerKeyboard)

      return () => {
         window.removeEventListener('keydown', handleAddPlayerKeyboard)
      }
   }, [playerNames, gameType])


   useEffect(() => {
      /*
         When Home Page is rendered for the first time, isFirstLoad flag is set to false.
         When user returns to Home Page from any of game pages, it triggers resetReducer function
         All of game states are removed from the redux store.
      */
      if(isFirstLoad){
         dispatch(setIsFirstLoad(false))
      } else if (!isFirstLoad && pathname === '/'){
         resetStates()
      }
   }, [pathname])

   return (
      <div className='main-container form'>
         <h1 className='game-header'>FREE DARTS SCOREBOARD</h1>
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
               ? ( <Link href={gameUrl}> <ToTheGameButton /> </Link> ) 
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

