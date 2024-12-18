'use client'
import React, { useEffect } from 'react'
//Redux
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setInitialSoundPlayed } from '@/redux/slices/game-cricket/gameCricketSlice'
import { selectDataInGameCricketPage } from '@/redux/selectors/game-cricket/selectDataInGameCricketPage'
//Components
import GameCricketSinglePlayersSection from '@/components/game-cricket/GameCricketSinglePlayersSection'
import GameCricketTeamsPlayersSection from '@/components/game-cricket/GameCricketTeamsPlayersSection'
import SettingsButtons from '@/components/SettingsButtons'
import ErrorPopUp from '@/components/ErrorPopUp'
import GameEndPopUp from '@/components/game-cricket/GameEndPopUp'
import ThrowValueSectionCricket from '@/components/game-cricket/ThrowValueSectionCricket'
import ScoreButtonsCricket from '@/components/game-cricket/ScoreButtonsCricket'
import CurrentPlayerThrowSection from '@/components/CurrentPlayerThrowSection'
//Controllers
import { playSound } from '@/controllers/playSound'

const GameCricket = () => {
   const dispatch = useDispatch()
   const { gameType } = useSelector((state: RootState) => state.gameSettings)
   const { isSoundEnabled, initialSoundPlayed } = useSelector((state: RootState) => state.gameCricket)
   //Memoized (@redux/selectors/game-cricket/selectDataInGameCricketPage)
   const { playersOrTeams, history } = useSelector(selectDataInGameCricketPage)

   
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
            ? (<GameCricketSinglePlayersSection />) 
            : (<GameCricketTeamsPlayersSection />)
         }
         <CurrentPlayerThrowSection />
         <ThrowValueSectionCricket />
         <ScoreButtonsCricket />
         <SettingsButtons />
         <ErrorPopUp />
         <GameEndPopUp />
      </div>
   )
}

export default GameCricket
