import React from 'react'
import CurrentPlayerTurnTimeoutSection from './CurrentPlayerTurnTimeoutSection'
import '../../../app/styles/opponent-turn-to-throw.scss'

const OpponentTurnToThrow = () => {
   return (
      <div className='opponent-turn-to-throw'>
         <p>Your opponent turn to throw</p>
         <CurrentPlayerTurnTimeoutSection />
      </div>
   )
}

export default OpponentTurnToThrow