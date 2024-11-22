import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { setPlayerNames } from '../app/redux/slices/gameSettingsSlice'
import Image from 'next/image'

interface TeamSectionProps {
  teamIndex: number
  playerIndexes: number[]
}

const GameSettingsTeamsSection = ({ teamIndex, playerIndexes }: TeamSectionProps) => {
   const dispatch = useDispatch()
   const { playerNames } = useSelector((state: RootState) => state.game)

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

export default GameSettingsTeamsSection
