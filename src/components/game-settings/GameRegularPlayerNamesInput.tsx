import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setPlayerNames } from '../../redux/slices/gameSettingsSlice'
import Image from 'next/image'
import { PlayerNamesInputProps } from '@/types/types'

const GameRegularPlayerNamesInput = ({ maxPlayers }: PlayerNamesInputProps) => {
   const dispatch = useDispatch()
   const playerNames = useSelector((state: RootState) => state.gameSettings.playerNames)

   const handleNameChange = (index: number, value: string) => {
      const newNames = [...playerNames]
      newNames[index] = value
      dispatch(setPlayerNames(newNames))
   }

   const addPlayerInput = () => {
      dispatch(setPlayerNames([...playerNames, '']))
   }

   const removePlayerInput = (index: number) => {
      const newNames = [...playerNames]
      newNames.splice(index, 1)
      dispatch(setPlayerNames(newNames))
   }

   return (
      <div className="players-section main-form">
         <p className="players header">
            {playerNames.length === 1
               ? `${playerNames.length} Player:`
               : `${playerNames.length} Players:`}
         </p>
         {playerNames.map((name: string, index: number) => (
            <div className="player-input" key={index}>
               <input
                  type="text"
                  className={index === 0 ? 'full-width' : ''}
                  id={`player-${index}`}
                  value={name}
                  placeholder={`Player ${index + 1} name`}
                  onChange={(event) => handleNameChange(index, event.target.value)}
               />
               {playerNames.length > 1 && index > 0 && (
                  <button
                     className="remove-player-button"
                     onClick={() => removePlayerInput(index)}
                  >
                     <Image
                        src="/minus.svg"
                        alt="Remove player icon"
                        width={22}
                        height={22}
                     />
                  </button>
               )}
            </div>
         ))}
         {playerNames.length < maxPlayers && (
            <button
               onClick={addPlayerInput}
               className={'add-player-button'}
            >
               <Image
                  src="/plus.svg"
                  alt="Add player icon"
                  width={16}
                  height={16}
               />
               <span>Add new player</span>
            </button>
         )}
      </div>
   )
}

export default GameRegularPlayerNamesInput