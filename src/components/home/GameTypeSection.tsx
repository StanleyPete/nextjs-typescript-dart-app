import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setGameType, setPlayerNames } from '../../redux/slices/gameSettingsSlice'
import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'

const GameTypeSection = () => {

   const dispatch = useDispatch()
   
   const gameType = useSelector((state: RootState) => state.gameSettings.gameType)

   const handleGameTypeChange = (type: GameSettingsStates['gameType']) => {
      dispatch(setGameType(type))
      if (type === 'teams') {
         dispatch(setPlayerNames(['', '', '', '']))
      } else if (type === 'single') {
         dispatch(setPlayerNames(['', '']))
      } else if (type === 'online') {
         dispatch(setPlayerNames(['']))
      }
   }

   return (
      <div className='game-type main-form'>
         <p className='type header'>Game type:</p>
         <div className='game-options'>
            {['single', 'teams', 'online'].map((type) => (
               <button
                  key={type}
                  className={`game-type-button ${gameType === type ? 'active' : ''}`}
                  onClick={() => handleGameTypeChange(type as GameSettingsStates['gameType'])}
               >
                  {type.charAt(0).toUpperCase() + type.slice(1)} 
               </button>
            ))}
         </div>
      </div>
   )
}

export default GameTypeSection