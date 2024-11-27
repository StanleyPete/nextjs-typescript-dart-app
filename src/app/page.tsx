'use client'

import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, addGameRegularReducer } from '@/redux/store'
import { 
   setGameType, 
   setPlayerNames, 
   setGameMode, 
   setGameWin, 
   setNumberOfLegs, 
   setError 
} from '../redux/slices/gameSettingsSlice'
import { initializePlayers } from '../redux/slices/gameRegularSlice'
import ErrorPopUp from '@/components/ErrorPopUp'
import PlayerNamesInput from '@/components/game-settings/PlayerNamesInput'
import TeamsPlayerInput from '@/components/game-settings/TeamsPlayerNamesInput'
import Link from 'next/link'
import './styles/home.scss'

const Home = () => {

   const dispatch = useDispatch()
   
   const { 
      gameType, 
      playerNames, 
      gameMode, 
      gameWin, 
      numberOfLegs
   } = useSelector((state: RootState) => state.gameSettings)
   
   //Game type handler
   const handleGameTypeChange = (type: 'regular' | 'teams' | 'online') => {
      dispatch(setGameType(type))
      if (type === 'teams') {
         dispatch(setPlayerNames(['', '', '', '']))
      } else if (type === 'regular') {
         dispatch(setPlayerNames(['', '']))
      }
   }

   //Validate player names
   const validatePlayerNames = () => {
      if (playerNames.some(name => name.trim() === '')) {
         dispatch(setError({ isError: true, errorMessage: 'Each player name input must be filled out!' }))
         return false
      }
      return true
   }

   //Game mode handler
   const handleGameMode = (mode: number | string) => {
      dispatch(setGameMode(mode))
   }
   
   //Win type handler
   const handleWinTypeChange = (winType: 'best-of' | 'first-to') => {
      dispatch(setGameWin(winType))
   }

   //Legs options based on gameWin type
   const getLegsOptions = (gameWin: 'best-of' | 'first-to') => {
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
      addGameRegularReducer()
      dispatch(initializePlayers({ playerNames, gameMode }))
   }
   
   //Preparing URL
   const gameFolders = {
      regular: 'game-regular',
      teams: 'game-teams',
      online: 'game-online'
   }
   const gameFolder = gameFolders[gameType]
   const isCricketMode = gameMode === 'Cricket'
   const gameUrl = isCricketMode 
      ? `/${gameFolder}/game-cricket` 
      : `/${gameFolder}`
   
   return (
      <div className='main-container form'>

         {/* GAME TYPE SECTION */}
         <div className='game-type main-form'>
            <p className='type header'>Game type:</p>
            <div className='game-options'>
               {['regular', 'teams', 'online'].map((type) => (
                  <button
                     key={type}
                     className={`game-type-button ${gameType === type ? 'active' : ''}`}
                     onClick={() => handleGameTypeChange(type as 'regular' | 'teams' | 'online')}
                  >
                     {type.charAt(0).toUpperCase() + type.slice(1)} 
                  </button>
               ))}
            </div>
         </div>
         
         {/* PLAYER NAMES INPUT SECTION*/}
         {
            // Player names input section for regular game type
            gameType === 'regular' ? (
               <PlayerNamesInput maxPlayers={4} />
            ) : 
               //Player names input section for teams game type
               gameType === 'teams' ? (
                  <div className='players-section main-form team-section'>
                     {/* Team 1 */}
                     <TeamsPlayerInput teamIndex={0} playerIndexes={[0, 1]} />
                     {/* Team 2 */}
                     <TeamsPlayerInput teamIndex={1} playerIndexes={[2, 3]} />
                  </div>

               ) : gameType === 'online' ? (
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
                     onClick={() => handleWinTypeChange(winType as 'best-of' | 'first-to')}
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
         
         {/* ERROR POP UP*/}
         <ErrorPopUp />

      </div>
   )
}

export default Home

