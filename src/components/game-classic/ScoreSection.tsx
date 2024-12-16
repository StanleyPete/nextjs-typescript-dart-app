import React, { useEffect } from 'react'
//Redux
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setShowNumberButtons } from '@/redux/slices/gameClassicSlice'
import { selectDataInScoreSection } from '@/redux/memoizedSelectors'
//Components
import ThrowValueSection from './ThrowValueSection'
import KeyboardButtons from './KeyboardButtons'
import NumberButtons from './NumberButtons'

const ScoreSection = () => {
   const dispatch = useDispatch()
   const showNumberButtons = useSelector((state: RootState) => state.gameClassic.showNumberButtons)
   //Memoized (@/redux/memoizedSelectors.ts):
   const { playersOrTeams, index } = useSelector(selectDataInScoreSection)

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