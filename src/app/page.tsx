'use client'
import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
//Redux
import { useSelector, useDispatch } from 'react-redux'
import { 
   RootState, 
   addGameClassicSingleReducer, 
   addGameClassicTeamsReducer, 
   resetReducer 
} from '@/redux/store'
import { 
   setGameType, 
   setPlayerNames, 
   setGameMode, 
   setGameWin, 
   setNumberOfLegs,
   setIsFirstLoad, 
   setError 
} from '../redux/slices/gameSettingsSlice'
import { initializePlayers } from '../redux/slices/gameClassicSingleSlice'
import { initializeTeams } from '../redux/slices/gameClassicTeamsSlice'
//Components
import ErrorPopUp from '@/components/ErrorPopUp'
import GameSinglePlayerNamesInput from '@/components/home/GameSinglePlayerNamesInput'
import GameTeamsPlayerNamesInput from '@/components/home/GameTeamsPlayerNamesInput'
import './styles/home.scss'
//Types
import { GameSettingsStates } from '@/types/types'


/* 
   HOME PAGE: 
      GAME CLASSIC: 301, 501, 701, 1001 modes
      GAME CRICKET: Cricket mode
*/
const Home = () => {
   const dispatch = useDispatch()
   const pathname = usePathname()
   
   const { 
      gameType, 
      playerNames, 
      gameMode, 
      gameWin, 
      numberOfLegs, 
      isFirstLoad
   } = useSelector((state: RootState) => state.gameSettings)
   
   //Game type handler
   const handleGameTypeChange = (type: GameSettingsStates['gameType']) => {
      dispatch(setGameType(type))
      if (type === 'teams') {
         dispatch(setPlayerNames(['', '', '', '']))
      } else if (type === 'single') {
         dispatch(setPlayerNames(['', '']))
      }
   }

   //Validate player names
   const validatePlayerNames = () => {
      if (playerNames.some((name: string) => name.trim() === '')) {
         dispatch(setError({ isError: true, errorMessage: 'Each player name input must be filled out!' }))
         return false
      }
      return true
   }

   //Game mode handler
   const handleGameMode = (mode: GameSettingsStates['gameMode']) => {
      dispatch(setGameMode(mode))
   }
   
   //Win type handler
   const handleWinTypeChange = (winType: GameSettingsStates['gameWin']) => {
      dispatch(setGameWin(winType))
   }

   //Legs options based on gameWin type
   const getLegsOptions = (gameWin: GameSettingsStates['gameWin']) => {
      if (gameWin === 'best-of') {
         return [1, 3, 5, 7, 9]
      } else {
         return [1, 2, 3, 4, 5, 6, 7]
      }
   }

   //Legs change handler
   const handleLegsChange = (legs: number) => {
      dispatch(setNumberOfLegs(legs))
   }

   //Game start handler
   const handleGameStart = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!validatePlayerNames()) {
         event.preventDefault()
         return
      }

      //States added added dynamically to the redux store based on gameType.
      if (gameType === 'single'){
         addGameClassicSingleReducer()
         dispatch(initializePlayers({ playerNames, gameMode }))
      }

      if (gameType === 'teams'){
         addGameClassicTeamsReducer()
         dispatch(initializeTeams({ playerNames, gameMode }))
      }
   }
   
   //Preparing URL
   const gameFolders = {
      classic: 'game-classic',
      cricket: 'game-cricket',
      online: 'game-online'
   }
   const gameFolder = gameMode === 'Cricket' ? gameFolders.cricket : gameFolders.classic
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
         resetReducer()
      }
   }, [pathname])
   
   
   return (
      <div className='main-container form'>

         {/* GAME TYPE SECTION */}
         <div className='game-type main-form'>
            <p className='type header'>Game type:</p>
            <div className='game-options'>
               {['single', 'teams', 'online'].map((type) => (
                  <button
                     key={type}
                     className={`game-type-button ${gameType === type ? 'active' : ''}`}
                     onClick={() => handleGameTypeChange(type as GameSettingsStates['gameType'])}
                  >
                     {type.charAt(0).toUpperCase() + type.slice(1)} 
                  </button>
               ))}
            </div>
         </div>
         
         {/* PLAYER NAMES INPUT SECTION*/}
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
               : gameType === 'online' ? 
                  (
                     <div>Test</div>
                  ) : null 
         }
         
         {/* GAME MODE SECTION */}
         <div className='game-mode main-form'>
            <p className='mode header'>Game mode:</p>
            <div className="game-options">
               {[301, 501, 701, 1001, 'Cricket'].map((mode) => (
                  <button
                     key={mode}
                     className={`score-button ${gameMode === mode ? 'active' : ''}`}
                     onClick={() => handleGameMode(mode)}
                  >
                     {mode}
                  </button>
               ))}
            </div>
         </div>
         
         {/* WIN TYPE SECTION */}
         <div className='win-type main-form'>
            <p className='type header'>Win type:</p>
            <div className="game-options">
               {['best-of', 'first-to'].map((winType) => (
                  <button 
                     key={winType}
                     className={`win-type-button ${gameWin === winType ? 'active' : ''}`} 
                     onClick={() => handleWinTypeChange(winType as GameSettingsStates['gameWin'])}
                  >
                     {winType === 'best-of' ? 'Best Of' : 'First To'}
                  </button>
               ))}
            </div>
         </div>
         
         {/* NUMBER OF LEGS SECTION*/}
         <div className='legs-buttons main-form'>
            <p className='legs header'>Number of legs:</p>
            <div className="game-options">
               {getLegsOptions(gameWin).map((legs) => (
                  <button
                     key={legs}
                     className={`legs-button ${numberOfLegs === legs ? 'active' : ''}`}
                     onClick={() => handleLegsChange(legs)}
                  >
                     {legs}
                  </button>
               ))}
            </div>
         </div>
       
         {/* TO THE GAME BUTTON */}
         <div className='game-start'>
            <Link href={gameUrl}>
               <button 
                  className='game-start-button' 
                  onClick={handleGameStart}
               >
                  To the game!
               </button>
            </Link>
         </div>
         
         {/* ERROR POP UP - rendered only if error*/}
         <ErrorPopUp />

      </div>
   )
}

export default Home

