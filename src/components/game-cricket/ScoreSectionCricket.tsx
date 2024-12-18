import React  from 'react'
//Components
import ThrowValueSectionCricket from './ThrowValueSectionCricket'
import ScoreButtonsCricket from './ScoreButtonsCricket'


const ScoreSectionCricket = () => {
   return (
      <div className='score-section'> 
         <ThrowValueSectionCricket />
         <ScoreButtonsCricket />
      </div>
   )
}

export default ScoreSectionCricket