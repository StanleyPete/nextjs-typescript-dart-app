import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, addGameClassicSingleStates, addGameClassicTeamsStates, addGameCricketSingleStates, addGameCricketTeamsStates, } from '@/redux/store'
import { initializePlayers } from '@/redux/slices/game-classic/gameClassicSingleSlice'
import { initializeTeams } from '@/redux/slices/game-classic/gameClassicTeamsSlice'
import { initializeCricketPlayers } from '@/redux/slices/game-cricket/gameCricketSingleSlice'
import { initializeCricketTeams,  } from '@/redux/slices/game-cricket/gameCricketTeamsSlice'
import { setError } from '@/redux/slices/gameSettingsSlice'

const ToTheGameButton = () => {
   const dispatch = useDispatch()
   const router = useRouter()
   const focusedSection = useSelector((state: RootState) => state.gameSettings.focusedSection)
   const gameType = useSelector((state: RootState) => state.gameSettings.gameType)
   const playerNames = useSelector((state: RootState) => state.gameSettings.playerNames)
   const gameMode = useSelector((state: RootState) => state.gameSettings.gameMode)

   //Validate player names
   const validatePlayerNames = () => {
      if (playerNames.some((name: string) => name.trim() === '')) {
         dispatch(setError({ isError: true, errorMessage: 'Each player name input must be filled out!' }))
         return false
      }
      return true
   }

   const handleGameStart = async (event: React.MouseEvent<HTMLButtonElement> | KeyboardEvent) => {
      console.log('test')
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

      if (gameMode === 'Cricket') {
         sessionStorage.setItem('cricket-allowed', 'true')
         router.replace('/game-cricket')
      } else {
         sessionStorage.setItem('classic-allowed', 'true')
         router.replace('/game-classic')
      }
      


   }

   useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
         if (focusedSection === 'gameStart' && event.key === 'Enter') {
            handleGameStart(event)
         }
      }

      window.addEventListener('keydown', handleKeyDown)

      return () => { window.removeEventListener('keydown', handleKeyDown) }
   }, [focusedSection])
  
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