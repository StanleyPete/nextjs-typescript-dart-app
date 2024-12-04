'use client'
import React, { useEffect } from 'react'
import GameRegularPlayersSection from '@/components/game-regular-teams/GameRegularPlayersSection'
import CurrentPlayerThrowParagraph from '@/components/CurrentPlayerThrowParagraph'
import ScoreSection from '@/components/game-regular-teams/ScoreSection'
import SettingsButtons from '@/components/SettingsButtons'
import ErrorPopUp from '@/components/ErrorPopUp'
import GameEndPopUp from '@/components/GameEndPopUp'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setInitialSoundPlayed, } from '@/redux/slices/gameRegularSlice'
import { playSound } from '@/lib/playSound'

const GameRegular = () => {
   const dispatch = useDispatch()
   const context = 'gameRegular'

   const { 
      players, 
      history, 
      isSoundEnabled, 
      initialSoundPlayed 
   } = useSelector((state: RootState) => state.gameRegular)
    
   useEffect(() => { 
      if(!initialSoundPlayed){
         playSound('game-is-on', isSoundEnabled)
         dispatch(setInitialSoundPlayed(true))
      }

      console.log('History: ', history)
      console.log('Players: ', players)
   }, [players, history, initialSoundPlayed, dispatch, isSoundEnabled])

   
   return (
      <div className='game-container'>
         <GameRegularPlayersSection />
         <CurrentPlayerThrowParagraph  context={context} />
         <ScoreSection />
         <SettingsButtons context={context} />
         <ErrorPopUp />
         <GameEndPopUp context={context} />
      </div>
   )
}
 
export default GameRegular