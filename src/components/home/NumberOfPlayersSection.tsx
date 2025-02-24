import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'
import { setNumberOfPlayers } from '@/redux/slices/gameSettingsSlice'

const NumberOfPlayersSection = () => {

   const dispatch = useDispatch()
   
   const numberOfPlayersSettings = useSelector((state: RootState) => state.gameSettings.numberOfPlayers)
 
   const handleNumberOfPlayers = (numberOfPlayers: GameSettingsStates['numberOfPlayers']) => {
      dispatch(setNumberOfPlayers(numberOfPlayers))
   }
 
   return (
      <div className='game-numberOfPlayers main-form'>
         <p className='numberOfPlayers header'>Number of players:</p>
         <div className="game-options">
            {[2, 3, 4].map((numberOfPlayers) => (
               <button
                  key={numberOfPlayers}
                  className={`score-button ${numberOfPlayersSettings === numberOfPlayers ? 'active' : ''}`}
                  onClick={() => handleNumberOfPlayers(numberOfPlayers)}
               >
                  {numberOfPlayers}
               </button>
            ))}
         </div>
      </div>
   )
}

export default NumberOfPlayersSection