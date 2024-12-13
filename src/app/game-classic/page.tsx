'use client'
import React, { useEffect } from 'react'
//Redux
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setInitialSoundPlayed, } from '@/redux/slices/gameClassicSlice'
//Components
import GameClassicSinglePlayersSection from '@/components/game-classic/GameClassicSinglePlayersSection'
import GameClassicTeamsPlayersSection from '@/components/game-classic/GameClassicTeamsPlayersSection'
import CurrentPlayerThrowSection from '@/components/CurrentPlayerThrowSection'
import ScoreSection from '@/components/game-classic/ScoreSection'
import SettingsButtons from '@/components/SettingsButtons'
import ErrorPopUp from '@/components/ErrorPopUp'
import GameEndPopUp from '@/components/GameEndPopUp'
//Controllers
import { playSound } from '@/controllers/playSound'
//Types
import { GameSettingsStates, GameClassicPageSelectorTypes } from '@/types/types'

/* 
   GAME CLASSIC: 
      - only for 301, 501, 701, 1001 modes
      - used for both single and teams game types 
*/

const GameClassic = () => {
   const dispatch = useDispatch()

   const gameType = useSelector((state: RootState) => state.gameSettings.gameType) as GameSettingsStates['gameType']

   const { isSoundEnabled, initialSoundPlayed } = useSelector((state: RootState) => state.gameClassic)

   //Destructured only for the purpose of reviewing states in console
   const { playersOrTeams, history } = useSelector<RootState, GameClassicPageSelectorTypes>((state) => {
      if (gameType === 'single') return {
         playersOrTeams: state.gameClassicSingle.players,
         history: state.gameClassicSingle.historyClassicSingle,
      }
      
      if (gameType === 'teams') return {
         playersOrTeams: state.gameClassicTeams.teams,
         history: state.gameClassicTeams.historyClassicTeams,
      }
      
      return {
         playersOrTeams: [],
         history: [],
      }
   })
 
    
   useEffect(() => { 
      //Initial sound played only once (when game start)
      if(!initialSoundPlayed){
         playSound('game-is-on', isSoundEnabled)
         dispatch(setInitialSoundPlayed(true))
      }

      //Only for the purpose of reviewing players/teams and history states in console
      console.log('Players: ', playersOrTeams)
      console.log('History: ', history)

   }, [playersOrTeams, history, initialSoundPlayed, dispatch, isSoundEnabled, gameType])

   
   return (
      <div className='game-container'>
         {gameType === 'single' ? (
            <GameClassicSinglePlayersSection />
         ) : (
            <GameClassicTeamsPlayersSection />
         )}
         <CurrentPlayerThrowSection />
         <ScoreSection />
         <SettingsButtons />
         <ErrorPopUp />
         <GameEndPopUp />
      </div>
   )
}
 
export default GameClassic