'use client'
import React  from 'react'
import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'
import { RootState } from '@/redux/store'
import { useSelector, useDispatch } from 'react-redux'
import { 
   setGameMode, 
   setGameWin, 
   setNumberOfLegs,
} from '../../../redux/slices/gameSettingsSlice'

const Lobby = () => {
   const dispatch = useDispatch()

   const {  gameMode, gameWin, numberOfLegs } = useSelector((state: RootState) => state.gameSettings)

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
   
   return (
      <div className='main-container form'>
         <h3>GAME LOBBY</h3>

         
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
      </div>
   )
}

export default Lobby

