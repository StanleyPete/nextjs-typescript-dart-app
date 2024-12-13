import React from 'react'
import Image from 'next/image'
//Redux
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
//Types
import { TeamClassic } from '@/types/types'
//Lib
import checkoutArray from '@/lib/checkout-table'

const GameTeamsPlayersSection = () => {
   const { teams, currentTeamIndex, currentPlayerIndexInTeam } = useSelector((state: RootState) => state.gameClassicTeams)

   return (
      <div className="game-players-section">
         <div className='teams-preview'>

            {teams.map((team: TeamClassic, teamIndex: number) => (
               <div key={teamIndex} className={`team-section ${currentTeamIndex === teamIndex ? 'current-active-team' : ''}`}>

                  {/* Team header */}
                  <div className="team-header">
                     <p>TEAM {teamIndex + 1}:</p>
                     <div className="team-legs">
                        {team.legs}
                     </div>
                  </div>

                  {/* Team players */}
                  {team.members.map((player, playerIndex) => (
                     <div className="team-player" key={playerIndex}>
                        <div className="team-player-name">
                           {player === teams[currentTeamIndex].members[currentPlayerIndexInTeam] && (
                              <Image 
                                 src="/active-dot.svg" 
                                 alt="Active dot icon" 
                                 width={6} 
                                 height={6} 
                              />
                           )}
                           <Image
                              src={player === teams[currentTeamIndex].members[currentPlayerIndexInTeam] 
                                 ? '/game-user-throw.svg' 
                                 : '/game-user.svg'}
                              alt="User icon"
                              width={16}
                              height={16}
                           />
                           {player}
                        </div>
                     </div>
                  ))}

                  {/* Team points left */}
                  <p className="team-points-left">{team.pointsLeft}</p>

                  {/* Team checkout options */}
                  {team.pointsLeft <= 170 && (<p className="checkout-options">{checkoutArray[team.pointsLeft - 2]}</p>)}

                  {/* Team stats */}
                  <div className="team-stats">
                  3-DART AVERAGE:
                     <p>{team.average.toFixed(2)}</p>
                  </div>
                  <div className="team-stats">
                  LAST SCORE:
                     <p>{team.lastScore}</p>
                  </div>
               </div>
            ))}

         </div>
         
      </div>
   )
}

export default GameTeamsPlayersSection