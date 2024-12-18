import React from 'react'
import Image from 'next/image'
//Redux
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
//Types
import { TeamCricket } from '@/types/redux/gameCricketTypes'

const GameCricketTeamsPlayersSection = () => {

   const { 
      teams, 
      currentTeamIndex, 
      currentPlayerIndexInTeam 
   } = useSelector((state: RootState) => state.gameCricketTeams)

   return (
      <div className="game-players-section">
         <div className="teams-preview">
            {teams.map((team: TeamCricket, teamIndex: number) => (
               <div key={teamIndex} className={`team-section ${currentTeamIndex === teamIndex ? 'current-active-team' : ''}`}>
                  {/* Team header */}
                  <div className="team-header">
                     <p>{team.name.toUpperCase()}:</p>
                     <div className="team-legs">{team.legs}</div>
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
                              src={
                                 player === teams[currentTeamIndex].members[currentPlayerIndexInTeam]
                                    ? '/game-user-throw.svg'
                                    : '/game-user.svg'
                              }
                              alt="User icon"
                              width={16}
                              height={16}
                           />
                           {player}
                        </div>
                     </div>
                  ))}

                  {/* Team points */}
                  <p className="team-points-left">{team.points}</p>
               </div>
            ))}
         </div>
      </div>
   )
}

export default GameCricketTeamsPlayersSection