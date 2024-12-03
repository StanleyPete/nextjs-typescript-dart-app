import React, { useEffect } from 'react'
import ThrowValueSection from './ThrowValueSection'
import KeyboardButtons from '../score-buttons/KeyboardButtons'
import NumberButtons from '../score-buttons/NumberButtons'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setShowNumberButtons } from '@/redux/slices/gameRegularSlice'

const ScoreSection = () => {
   const dispatch = useDispatch()
   const { players, currentPlayerIndex, showNumberButtons } = useSelector((state: RootState) => state.gameRegular)

   useEffect(() => {
      const isInputPreferred = players[currentPlayerIndex].isInputPreffered
      if (isInputPreferred) {
         dispatch(setShowNumberButtons(false))
      } else {
         dispatch(setShowNumberButtons(true))
      }
   }, [players, currentPlayerIndex, dispatch])

   return (
      <div className='score-section'> 
      
         <ThrowValueSection />

         {/* Score buttons section*/}
         <div className="score-buttons-section">
            { !showNumberButtons ? ( <KeyboardButtons /> ) : ( <NumberButtons /> ) }  
         </div>

      </div>
   )
}

export default ScoreSection