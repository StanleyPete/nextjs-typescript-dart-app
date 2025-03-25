'use client'
import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
//Redux
import { useSelector, useDispatch } from 'react-redux'
import { RootState, resetStates } from '@/redux/store'
import { setIsFirstLoad } from '../redux/slices/gameSettingsSlice'
//Components
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
import './styles/home.scss'
import NumberOfPlayersSection from '@/components/home/NumberOfPlayersSection'
import ThrowTimeSection from '@/components/home/ThrowTimeSection'


/* 
   HOME PAGE: 
      GAME CLASSIC: 301, 501, 701, 1001 modes
      GAME CRICKET: Cricket mode
*/

const Home = () => {
   const dispatch = useDispatch()
   const pathname = usePathname()
   const { gameType, gameMode, isFirstLoad} = useSelector((state: RootState) => state.gameSettings)
   
   //Preparing URL
   const gameFolders = {
      classic: 'game-classic',
      cricket: 'game-cricket',
      online: 'game-online'
   }
   let gameFolder

   if (gameMode === 'Cricket'){
      gameFolder = gameFolders.cricket
   } else if (gameType === 'single' || gameType === 'teams') {
      gameFolder = gameFolders.classic
   } else {
      gameFolder = gameFolders.online
   }

   const gameUrl = `/${gameFolder}`

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
   
   useEffect(() => {
      document.cookie = 'dart-app=dart-app; path=/; SameSite=Strict;'
   }, [])
   
   return (
      <div className='main-container form'>
         <h1 className='game-header'>FREE DARTS SCOREBOARD</h1>
         <GameTypeSection />
         { gameType === 'online' 
            ? (<NumberOfPlayersSection />) 
            : null }
         {gameType === 'single' 
            ? (<GameSinglePlayerNamesInput maxPlayers={4} />) 
            : gameType === 'teams' ? 
               ( 
                  <div className='players-section main-form team-section'>
                     {/* Team 1 */}
                     <GameTeamsPlayerNamesInput teamIndex={0} playerIndexes={[0, 1]} />
                     {/* Team 2 */}
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
         <ErrorPopUp />

      </div>
   )
}

export default Home

