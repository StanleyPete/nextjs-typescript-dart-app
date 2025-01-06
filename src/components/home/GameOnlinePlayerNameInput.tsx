import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setPlayerNames } from '../../redux/slices/gameSettingsSlice'

const GameOnlinePlayerNameInput = () => {

   const dispatch = useDispatch()
   
   const playerNames = useSelector((state: RootState) => state.gameSettings.playerNames)

   const handleNameChange = (index: number, value: string) => {
      const newNames = [...playerNames]
      newNames[index] = value
      dispatch(setPlayerNames(newNames))
   }

   return (
      <>
         <div className="players-section main-form">
            <p className="players header">
               Player name:
            </p>
            {playerNames.map((name: string, index: number) => (
               <div className="player-input" key={index}>
                  <input
                     type="text"
                     className={index === 0 ? 'full-width' : ''}
                     id={`player-${index}`}
                     value={name}
                     placeholder='Enter your name here...'
                     onChange={(event) => handleNameChange(index, event.target.value)}
                  />
               </div>
            ))}
         </div>
      </>
   )
}

export default GameOnlinePlayerNameInput