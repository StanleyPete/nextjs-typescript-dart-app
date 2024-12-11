'use client'
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import ErrorPopUp from '@/components/ErrorPopUp'
import GameEndPopUp from '@/components/GameEndPopUp'
import { setInitialSoundPlayed,} from '@/redux/slices/gameRegularTeamsSlice'
import CurrentPlayerThrowParagraph from '@/components/CurrentPlayerThrowParagraph'
import GameTeamsPlayersSection from '@/components/game-regular-teams/GameTeamsPlayersSection'
import SettingsButtons from '@/components/SettingsButtons'
import ScoreSection from '@/components/game-regular-teams/ScoreSection'
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