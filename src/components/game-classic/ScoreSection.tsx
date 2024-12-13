import React, { useEffect } from 'react'
//Redux
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setShowNumberButtons } from '@/redux/slices/gameClassicSlice'
//Components
import ThrowValueSection from './ThrowValueSection'
import KeyboardButtons from './KeyboardButtons'
import NumberButtons from './NumberButtons'
//Types
import { GameSettingsStates, ScoreSectionComponentSelectorTypes } from '@/types/types'

const ScoreSection = () => {
   const dispatch = useDispatch()

   const gameType = useSelector((state: RootState) => state.gameSettings.gameType) as GameSettingsStates['gameType']

   const showNumberButtons = useSelector((state: RootState) => state.gameClassic.showNumberButtons)

   const { playersOrTeams, index } = useSelector<RootState, ScoreSectionComponentSelectorTypes>((state) => {
      if (gameType === 'single') return {
         playersOrTeams: state.gameClassicSingle.players,
         index: state.gameClassicSingle.currentPlayerIndex,
      }
        
      if (gameType === 'teams') return {
         playersOrTeams: state.gameClassicTeams.teams,
         index: state.gameClassicTeams.currentTeamIndex,
      }
    
      return {
         playersOrTeams: [], 
         index: 0, 
      }
   })

   useEffect(() => {
      const isInputPreferred = playersOrTeams[index].isInputPreffered
      console.log(`isInputPreffered before dispatch: ${isInputPreferred}`)
      console.log(`showNumberButtons before dispatch: ${showNumberButtons}`)
      if (isInputPreferred) {
         dispatch(setShowNumberButtons(false))
      } else {
         dispatch(setShowNumberButtons(true))
      }

      console.log(`isInputPreffered after dispatch: ${isInputPreferred}`)
      console.log(`showNumberButtons after dispatch: ${showNumberButtons}`)
    
   }, [playersOrTeams, index, dispatch])

   return (
      <div className='score-section'> 
         <ThrowValueSection />

         {/* Score buttons section*/}
         <div className="score-buttons-section">
            { !showNumberButtons 
               ? ( <KeyboardButtons /> ) 
               : ( <NumberButtons /> ) 
            }  
         </div>

      </div>
   )
}

export default ScoreSection