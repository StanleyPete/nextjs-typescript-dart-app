import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setMultiplier, setShowNumberButtons } from '@/redux/slices/game-classic/gameClassicSlice'
import { selectDataInScoreSection } from '@/redux/selectors/game-classic/selectDataInScoreSection'
import ThrowValueSection from './ThrowValueSection'
import KeyboardButtons from './KeyboardButtons'
import NumberButtons from './NumberButtons'
import { setFocusedSection } from '@/redux/slices/gameSettingsSlice'

const ScoreSection = () => {
   const dispatch = useDispatch()
   const showNumberButtons = useSelector((state: RootState) => state.gameClassic.showNumberButtons)
   const focusedSection = useSelector((state: RootState) => state.gameSettings.focusedSection)

   //Memoized (@/redux/selectors/game-classic/selectDataInScoreSection.ts)
   const { playersOrTeams, index } = useSelector(selectDataInScoreSection)

   useEffect(() => {
      const isInputPreferred = playersOrTeams[index].isInputPreffered
      if (isInputPreferred) {
         dispatch(setShowNumberButtons(false))
         dispatch(setFocusedSection(null))
         dispatch(setMultiplier(1))
      } else {
         dispatch(setShowNumberButtons(true))
         if ( 
            focusedSection === 'number-buttons-1-to-5' ||
            focusedSection === 'number-buttons-6-to-10' ||
            focusedSection === 'number-buttons-11-to-15' ||
            focusedSection === 'number-buttons-16-to-20' ||
            focusedSection === 'special-buttons'
         ) return
         dispatch(setFocusedSection('multiplier-buttons'))
         
      }
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