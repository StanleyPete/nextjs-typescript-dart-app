import React from 'react'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { setPlayerNames } from '../../redux/slices/gameSettingsSlice'
import { TeamsPlayerInput } from '@/types/components/componentsTypes'

const GameTeamsPlayerNamesInput = ({ teamIndex, playerIndexes }: TeamsPlayerInput) => {

   const dispatch = useDispatch()
   
   const { playerNames } = useSelector((state: RootState) => state.gameSettings)

   const handleNameChange = (index: number, value: string) => {
      const newNames = [...playerNames]
      newNames[index] = value
      dispatch(setPlayerNames(newNames))
   }

   return (
      <div className={`team-${teamIndex + 1}-section`}>

         <div className="team-header-image">
            <Image
               src={`/team-${teamIndex + 1}-icon.svg`}
               alt={`Team ${teamIndex + 1} icon`}
               width={16}
               height={16}
            />
            <p className={`team-${teamIndex + 1} header`}>Team {teamIndex + 1}:</p>
         </div>

         <div className="team-player-input">
            {playerIndexes.map((index) => (
               <input
                  key={index}
                  type="text"
                  placeholder={`T${teamIndex + 1}: Player ${index + 1} name`}
                  value={playerNames[index]}
                  onChange={(event) => handleNameChange(index, event.target.value)}
               />
            ))}
         </div>

      </div>
   )
}

export default GameTeamsPlayerNamesInput
