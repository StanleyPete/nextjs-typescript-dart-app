'use client'
import React, { useEffect } from 'react'
//Redux
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setInitialSoundPlayed } from '@/redux/slices/gameSlice'
import { selectDataInGameClassicPage } from '@/redux/selectors/game-classic/selectDataInGameClassicPage'
//Components
import GameClassicSinglePlayersSection from '@/components/game-classic/GameClassicSinglePlayersSection'
import GameClassicTeamsPlayersSection from '@/components/game-classic/GameClassicTeamsPlayersSection'
import CurrentPlayerThrowSection from '@/components/CurrentPlayerThrowSection'
import ScoreSection from '@/components/game-classic/ScoreSection'
import SettingsButtons from '@/components/SettingsButtons'
import ErrorPopUp from '@/components/ErrorPopUp'
import GameEndPopUp from '@/components/game-classic/GameEndPopUp'
//Controllers
import { playSound } from '@/controllers/playSound'
//Types
import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'

/* 
GAME CLASSIC: 
- only for 301, 501, 701, 1001 modes
- used for both single and teams game types 
*/

const GameClassic = () => {
  
   const dispatch = useDispatch()

   const gameType = useSelector((state: RootState) => state.gameSettings.gameType) as GameSettingsStates['gameType']

   const { isSoundEnabled, initialSoundPlayed } = useSelector((state: RootState) => state.game)
   
   //Memoized (@/redux/selectors/game-classic/selectDataInGameClassicPage.ts):
   const { playersOrTeams, history } = useSelector(selectDataInGameClassicPage)


   useEffect(() => { 
      //Initial sound played only once (when game start)
      if(!initialSoundPlayed){
         playSound('game-is-on', isSoundEnabled)
         dispatch(setInitialSoundPlayed(true))
      }

      //Only for the purpose of reviewing players/teams and history states in console
      console.log('Players: ', playersOrTeams)
      console.log('History: ', history)

   }, [playersOrTeams, history, initialSoundPlayed, dispatch, isSoundEnabled])


   return (
      <div className='game-container'>
         {gameType === 'single' 
            ? (<GameClassicSinglePlayersSection />) 
            : (<GameClassicTeamsPlayersSection />)
         }
         <CurrentPlayerThrowSection />
         <ScoreSection />
         <SettingsButtons />
         <GameEndPopUp />
         <ErrorPopUp />
      </div>
   )
}
 
export default GameClassic