import React from 'react'
//Redux
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { selectDataInThrowValueSection } from '@/redux/selectors/game-cricket/selectDataInThrowValueSection'
//Controllers
import { handleUndoCricket } from '@/controllers/game-cricket/handleUndoCricket'
import { handleSubmitScoreButton } from '@/controllers/game-cricket/handleSubmitScoreButton'

const ThrowValueSectionCricket = () => {

   const dispatch = useDispatch()

   const { gameType } = useSelector((state: RootState) => state.gameSettings)

   const {currentPlayerThrows, currentPlayerThrowsCount } = useSelector((state: RootState) => state.gameCricket)

   //Memoized (@/redux/memoizedSelectors.ts):
   const { 
      playersOrTeams, 
      index, 
      currentPlayerIndexInTeam, 
      history 
   } = useSelector(selectDataInThrowValueSection)
   
   return (
      <>
         <div className="throw-value-section">
            {/*Undo button:*/}
            <button 
               className="input-toggle" 
               onClick={() => {
                  handleUndoCricket(
                     gameType, 
                     playersOrTeams, 
                     history, 
                     currentPlayerThrowsCount, 
                     dispatch
                  )
               }}>
                Undo
            </button>

            {/* Throw details*/}
            <div className="current-player-throws">
               {Array.from({ length: 3 }, (_, i) => (
                  <div className='current-throw' key={i}>
                     {currentPlayerThrows[i] !== undefined ? currentPlayerThrows[i] : '-'}
                  </div>
               ))}
            </div>

            {/* Submit score button*/}
            <button 
               className='submit-score' 
               onClick={() => {
                  handleSubmitScoreButton(
                     gameType, 
                     playersOrTeams, 
                     index, 
                     currentPlayerIndexInTeam as number, 
                     history, 
                     currentPlayerThrowsCount, 
                     currentPlayerThrows, 
                     dispatch
                  )
               }}
            >
               Submit Score
            </button>
         </div>

      </>
   )
}

export default ThrowValueSectionCricket