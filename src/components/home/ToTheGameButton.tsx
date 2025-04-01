import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { 
   RootState,
   addGameClassicSingleStates, 
   addGameClassicTeamsStates,
   addGameCricketSingleStates,
   addGameCricketTeamsStates, 
} from '@/redux/store'
import { initializePlayers } from '@/redux/slices/game-classic/gameClassicSingleSlice'
import { initializeTeams } from '@/redux/slices/game-classic/gameClassicTeamsSlice'
import { initializeCricketPlayers } from '@/redux/slices/game-cricket/gameCricketSingleSlice'
import { initializeCricketTeams } from '@/redux/slices/game-cricket/gameCricketTeamsSlice'
import { setError } from '@/redux/slices/gameSettingsSlice'


const ToTheGameButton = () => {
   const dispatch = useDispatch()
   const { focusedSection, gameType, playerNames, gameMode } = useSelector((state: RootState) => state.gameSettings)

   //Validate player names
   const validatePlayerNames = () => {
      if (playerNames.some((name: string) => name.trim() === '')) {
         dispatch(setError({ isError: true, errorMessage: 'Each player name input must be filled out!' }))
         return false
      }
      return true
   }

   const handleGameStart = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!validatePlayerNames()) {
         event.preventDefault()
         return
      }
   
      //States added added dynamically to the redux store based on gameType and gameMode
      if(gameMode === 'Cricket'){
         if (gameType === 'single'){
            addGameCricketSingleStates()
            dispatch(initializeCricketPlayers({ playerNames }))
         }
   
         if (gameType === 'teams'){
            addGameCricketTeamsStates()
            dispatch(initializeCricketTeams({ playerNames }))
         }
      } else {
         if (gameType === 'single'){
            addGameClassicSingleStates()
            dispatch(initializePlayers({ playerNames, gameMode }))
         }
      
         if (gameType === 'teams'){
            addGameClassicTeamsStates()
            dispatch(initializeTeams({ playerNames, gameMode }))
         }
      }
   }
  
   return (
      <button 
         className={`game-start-button  ${focusedSection === 'gameStart' ? 'focused' : ''}`} 
         onClick={handleGameStart}
      >
            To the game!
      </button> 
 
   )
}

export default ToTheGameButton