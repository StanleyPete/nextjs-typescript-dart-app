'use client'
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import ErrorPopUp from '@/components/ErrorPopUp'
import GameEndPopUp from '@/components/GameEndPopUp'
import { setInitialSoundPlayed,} from '@/redux/slices/gameClassicTeamsSlice'
import CurrentPlayerThrowParagraph from '@/components/CurrentPlayerThrowSection'
import GameTeamsPlayersSection from '@/components/game-classic/GameClassicTeamsPlayersSection'
import SettingsButtons from '@/components/SettingsButtons'
import ScoreSection from '@/components/game-classic/ScoreSection'
import { playSound } from '@/controllers/playSound'


const GameTeams = () => {
   const dispatch = useDispatch()
   const context = 'gameRegularTeams'
   
   const { 
      teams, 
      history,
      isSoundEnabled, 
      initialSoundPlayed 
   } = useSelector((state: RootState) => state.gameRegularTeams)
    
   useEffect(() => {
      if(!initialSoundPlayed){
         playSound('game-is-on', isSoundEnabled)
         dispatch(setInitialSoundPlayed(true))
      }

      console.log(history)
      console.log(teams)

   }, [teams, history, initialSoundPlayed, dispatch, isSoundEnabled])

   return (
      <div className='game-container'>
         <GameTeamsPlayersSection />
         <CurrentPlayerThrowParagraph context={context} />
         <ScoreSection context={context} />
         <SettingsButtons context={context} />
         <ErrorPopUp />
         <GameEndPopUp context={context}/>
      </div>
   )
}
 
export default GameTeams