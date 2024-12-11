import React, { useEffect } from 'react'
import ThrowValueSection from './ThrowValueSection'
import KeyboardButtons from './KeyboardButtons'
import NumberButtons from './NumberButtons'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setShowNumberButtons } from '@/redux/slices/gameRegularSlice'
import { setShowNumberButtons as setShowNumberButtonsTeams } from '@/redux/slices/gameRegularTeamsSlice'
import { GameContextProps, ScoreSectionDataType } from '@/types/types'

const ScoreSection: React.FC<GameContextProps> = ({ context }) => {
   const dispatch = useDispatch()

   const { 
      playersOrTeams, 
      index, 
      showNumberButtons 
   } = useSelector<RootState, ScoreSectionDataType>((state) => 
      context === 'gameRegular' 
         ? {
            playersOrTeams: state.gameRegular.players,
            index: state.gameRegular.currentPlayerIndex,
            showNumberButtons: state.gameRegular.showNumberButtons,
        
         }
         : {
            playersOrTeams: state.gameRegularTeams.teams,
            index: state.gameRegularTeams.currentPlayerIndex,
            showNumberButtons: state.gameRegularTeams.showNumberButtons,
         }
   )

   useEffect(() => {
      const isInputPreferred = playersOrTeams[index].isInputPreffered
      if (context === 'gameRegular'){
         if (isInputPreferred) {
            dispatch(setShowNumberButtons(false))
         } else {
            dispatch(setShowNumberButtons(true))
         }
      } else {
         if (isInputPreferred) {
            dispatch(setShowNumberButtonsTeams(false))
         } else {
            dispatch(setShowNumberButtonsTeams(true))
         }
      }
   }, [playersOrTeams, index, dispatch])

   return (
      <div className='score-section'> 
      
         <ThrowValueSection context={context}/>

         {/* Score buttons section*/}
         <div className="score-buttons-section">
            { !showNumberButtons 
               ? ( <KeyboardButtons context={context}/> ) 
               : ( <NumberButtons context={context} /> ) }  
         </div>

      </div>
   )
}

export default ScoreSection