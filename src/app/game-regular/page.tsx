'use client'

import React, { useEffect } from 'react'
import GameRegularPlayersSection from '@/components/game-regular/GameRegularPlayersSection'
import CurrentPlayerThrowParagraph from '@/components/CurrentPlayerThrowParagraph'
import ScoreSection from '@/components/game-regular/ScoreSection'
import SettingsButtons from '@/components/SettingsButtons'
import ErrorPopUp from '@/components/ErrorPopUp'
import GameEndPopUp from '@/components/GameEndPopUp'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setShowNumberButtons, setInitialSoundPlayed, } from '@/redux/slices/gameRegularSlice'
import { playSound } from '@/lib/playSound'

const Game = () => {
   const dispatch = useDispatch()
   
   const { 
      players, 
      history, 
      currentPlayerIndex, 
      isSoundEnabled, 
      initialSoundPlayed 
   } = useSelector((state: RootState) => state.gameRegular)
    
   useEffect(() => {
      const isInputPreferred = players[currentPlayerIndex].isInputPreffered
      if (isInputPreferred) {
         dispatch(setShowNumberButtons(false))
      } else {
         dispatch(setShowNumberButtons(true))
      }

      if(!initialSoundPlayed){
         playSound('game-is-on', isSoundEnabled)
         dispatch(setInitialSoundPlayed(true))
      }

      console.log('History: ', history)
      console.log('Players: ', players)
   }, [players, history, currentPlayerIndex, initialSoundPlayed, dispatch, playSound])

   
   return (
      <div className='game-container'>
         <GameRegularPlayersSection />
         <CurrentPlayerThrowParagraph />
         <ScoreSection />
         <SettingsButtons />
         <ErrorPopUp />
         <GameEndPopUp />
      </div>
   )
}
 
export default Game