'use client'
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setInitialSoundPlayed } from '@/redux/slices/gameSlice'
import { selectDataInGameCricketPage } from '@/redux/selectors/game-cricket/selectDataInGameCricketPage'
import GameCricketSinglePlayersSection from '@/components/game-cricket/GameCricketSinglePlayersSection'
import GameCricketTeamsPlayersSection from '@/components/game-cricket/GameCricketTeamsPlayersSection'
import ErrorPopUp from '@/components/ErrorPopUp'
import GameEndPopUp from '@/components/game-cricket/GameEndPopUp'
import ThrowValueSectionCricket from '@/components/game-cricket/ThrowValueSectionCricket'
import ScoreButtonsCricket from '@/components/game-cricket/ScoreButtonsCricket'
import CurrentPlayerThrowSection from '@/components/CurrentPlayerThrowSection'
import Footer from '@/components/Footer'
import { playSound } from '@/controllers/playSound'
import NavigationPanel from '@/components/NavigationPanel'

const GameCricket = () => {
   const dispatch = useDispatch()
   const { gameType } = useSelector((state: RootState) => state.gameSettings)
   const { isSoundEnabled, initialSoundPlayed } = useSelector((state: RootState) => state.game)
   const { completedSectors } = useSelector((state: RootState) => state.gameCricket)
   //Memoized (@redux/selectors/game-cricket/selectDataInGameCricketPage)
   const { playersOrTeams, history } = useSelector(selectDataInGameCricketPage)

   useEffect(() => {
      //Initial sound played only once (when game start)
      if(!initialSoundPlayed){
         playSound('game-is-on', isSoundEnabled)
         dispatch(setInitialSoundPlayed(true))
      }

      console.log(completedSectors)
      //Only for the purpose of reviewing players/teams and history states in console
      console.log('Players: ', playersOrTeams)
      console.log('History: ', history)

   }, [playersOrTeams, history, initialSoundPlayed, dispatch, isSoundEnabled, completedSectors])


   return (    
      <div className='game-container'>
         <NavigationPanel />
         {gameType === 'single' 
            ? (<GameCricketSinglePlayersSection />) 
            : (<GameCricketTeamsPlayersSection />)
         }
         <CurrentPlayerThrowSection />
         <ThrowValueSectionCricket />
         <ScoreButtonsCricket />
         <Footer githubLogoSrc='/github-mark-white.svg' />
         <ErrorPopUp />
         <GameEndPopUp />
      </div>
   )
}

export default GameCricket
