'use client'
import React from 'react'
import { RootState } from '@/redux/store'
import { useSelector} from 'react-redux'
import GameOnlinePlayersSection from '@/components/game-online/game/GameOnlinePlayersSection'
import CurrentPlayerThrowOnlineSection from '@/components/game-online/game/CurrentPlayerThrowOnlineSection'
import OpponentTurnToThrow from '@/components/game-online/game/OpponentTurnToThrowSection'
import NumberButtonsOnline from '@/components/game-online/game/NumberButtonsOnline'
import KeyboardButtonsOnline from '@/components/game-online/game/KeyboardButtonsOnline'
import ErrorPopUp from '@/components/ErrorPopUp'
import ButtonToggleScoreSubmitMethod from '@/components/game-online/game/ButtonToggleScoreSubmitMethod'
import CurrentPlayerThrowsOnline from '@/components/game-online/game/CurrentPlayerThrows'
import ScoreValueOnline from '@/components/game-online/game/ScoreValue'
import ButtonSubmitScoreOnline from '@/components/game-online/game/ButtonSubmitScore'
import ButtonsMultiplierOnline from '@/components/game-online/game/ButtonsMultiplier'
import ButtonDoubleOnline from '@/components/game-online/game/ButtonDouble'

const GameOnline = () => {
   const isItYourTurn = useSelector((state: RootState) => state.gameOnline.isItYourTurn)
   const showNumberButtons = useSelector((state: RootState) => state.gameOnline.showNumberButtons)
   const ThrowValue = showNumberButtons ? <CurrentPlayerThrowsOnline /> : <ScoreValueOnline />
   const MultiplierSection = showNumberButtons ? <ButtonsMultiplierOnline /> : <ButtonDoubleOnline />
   const InputMethod = showNumberButtons ? <NumberButtonsOnline /> : <KeyboardButtonsOnline />

   return (
      <div className='game-container'>
         <GameOnlinePlayersSection />
         <CurrentPlayerThrowOnlineSection />
         <div className="score-section">
            { isItYourTurn 
               ? (
                  <> 
                     <div className="throw-value-section">
                        <ButtonToggleScoreSubmitMethod />
                        { ThrowValue }
                        <ButtonSubmitScoreOnline />
                     </div>

                     <div className='multiplier-section'> 
                        { MultiplierSection } 
                     </div>

                     { InputMethod }
                     
                  </> ) 
               : ( <OpponentTurnToThrow /> )
            }
         </div>
         <ErrorPopUp />
      </div>
   )
}

export default GameOnline



