import React, { useEffect } from 'react'
//Redux
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setShowNumberButtons } from '@/redux/slices/game-online/gameOnlineSlice'
//Components
import ThrowValueSectionOnline from './ThrowValueSectionOnline'
import KeyboardButtonsOnline from './KeyboardButtonsOnline'
import NumberButtonsOnline from './NumberButtonsOnline'

const ScoreSectionOnline = () => {
   const dispatch = useDispatch()
   const { showNumberButtons, isInputPreffered } = useSelector((state: RootState) => state.gameOnline)

   useEffect(() => {
      if (isInputPreffered) {
         dispatch(setShowNumberButtons(false))
      } else {
         dispatch(setShowNumberButtons(true))
      }
   }, [dispatch, isInputPreffered])

   return (
      <div className='score-section'> 
         <ThrowValueSectionOnline />

         {/* Score buttons section*/}
         <div className="score-buttons-section">
            { !showNumberButtons 
               ? ( <KeyboardButtonsOnline /> ) 
               : ( <NumberButtonsOnline /> ) 
            }  
         </div>

      </div>
   )
}

export default ScoreSectionOnline