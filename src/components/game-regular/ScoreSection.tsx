import React from 'react'
import { useSelector} from 'react-redux'
import { RootState } from '@/redux/store'
import ThrowValueSection from './ThrowValueSection'
import KeyboardButtons from '../score-buttons/KeyboardButtons'
import NumberButtons from '../score-buttons/NumberButtons'


const ScoreSection = () => {
   const { showNumberButtons } = useSelector((state: RootState) => state.gameRegular)

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