import React from 'react'
import '../../../app/styles/opponent-turn-to-throw.scss'
import CurrentPlayerTurnTimeoutSection from './CurrentPlayerTurnTimeoutSection'

const OpponentTurnToThrow = () => {
   return (
      <div className='opponent-turn-to-throw'>
         <p>Your opponent turn to throw</p>
         <CurrentPlayerTurnTimeoutSection />
      </div>
   )
}

export default OpponentTurnToThrow