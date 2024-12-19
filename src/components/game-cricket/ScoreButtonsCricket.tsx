import React  from 'react'
import Image from 'next/image'
//Redux
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { selectDataInScoreButtons } from '@/redux/selectors/game-cricket/selectDataInScoreButtons'
//Controllers
import { handleScoreButtons } from '@/controllers/game-cricket/handleScoreButtons'
import { handleMissButton } from '@/controllers/game-cricket/handleMissButton'
//Types
import { PlayerCricket, TeamCricket } from '@/types/redux/gameCricketTypes'
//Lib
import Scores from '@/lib/cricket-scores'

const ScoreButtonsCricket = () => {

   const dispatch = useDispatch()

   const { gameType, gameWin, numberOfLegs } = useSelector((state: RootState) => state.gameSettings)

   const { startIndex, currentPlayerThrowsCount, currentPlayerThrows, isSoundEnabled } = useSelector((state: RootState) => state.game)

   const { completedSectors } = useSelector((state: RootState) => state.gameCricket)

   const { playersOrTeams, playerOrTeamIndex, currentPlayerIndexInTeam, history } = useSelector(selectDataInScoreButtons)
 
   return ( 
      <>
         {playersOrTeams.length === 2 ? (
            <>
               <div className='cricket-score-buttons'>
                  {Scores.map((buttons, index) => (
                     <div  className={`score-row-v2 ${completedSectors[buttons[0] === '25' ? 'Bull' : (buttons[0] as keyof typeof completedSectors)] ? 'completed-sector' : ''}`} key={index}>
                        <div className='player-score'>
                           <span>
                              {(() => {
                                 const scoreValue = playersOrTeams[0].scores[buttons[0] === '25' ? 'Bull' : buttons[0]]
                                 if (scoreValue === 0) {
                                    return ''
                                 } else if (scoreValue === 1) {
                                    return 'I'
                                 } else if (scoreValue === 2) {
                                    return 'II'
                                 } else if (scoreValue === 3) {
                                    return <Image src='/completed.svg' alt='Completed icon' width={16} height={16} />
                                 }
                              })()}
                           </span>
                          
                        </div>
                        <div className='cricket-buttons'>
                           {buttons.map((label, i) => {
                              const isTriple = label.startsWith('T')
                              const isDouble = label.startsWith('D')
                              const sector = (label === '25' || label === '50' ? 'Bull' : label.replace(/[^0-9]/g, '')) as '20' | '19' | '18' | '17' | '16' | '15' | 'Bull'
                              const increment = label === '25' ? 1 : label === '50' ? 2 : isTriple ? 3 : isDouble ? 2 : 1
                              const value = isTriple || isDouble ? parseInt(label.slice(1)) * increment : label === '50' ? 50 : parseInt(label) * increment
                              const isSectorCompleted = completedSectors[sector]
                          
                              return (
                                 <button 
                                    key={i} 
                                    data-sector={sector}
                                    data-value={value} 
                                    data-increment={increment}
                                    onClick={isSectorCompleted 
                                       ? () => {} 
                                       : () => handleScoreButtons(
                                          sector, 
                                          label, 
                                          increment, 
                                          value,
                                          gameType,
                                          gameWin,
                                          numberOfLegs,
                                          isSoundEnabled,
                                          playersOrTeams,
                                          playerOrTeamIndex,
                                          currentPlayerIndexInTeam,
                                          startIndex,
                                          history,
                                          currentPlayerThrowsCount,
                                          currentPlayerThrows,
                                          dispatch
                                       )
                                    }
                                 >
                                    {label}
                                 </button>
                              )

                             
                           })}
                        </div>
                        <div className='player-score'>
                           <span>
                              {(() => {
                                 const scoreValue = 
                                    playersOrTeams[1].scores[buttons[0] === '25' ? 'Bull' : buttons[0]]
                                 if (scoreValue === 0) {
                                    return ''
                                 } else if (scoreValue === 1) {
                                    return 'I'
                                 } else if (scoreValue === 2) {
                                    return 'II'
                                 } else if (scoreValue === 3) {
                                    return <Image src='/completed.svg' alt='Completed icon' width={16} height={16} />
                                 }
                              })()}
                           </span> 
                        </div>
                     </div>
                    
                  ))}
               </div>
               <div className="miss-button">
                  <button 
                     onClick={() => {
                        handleMissButton(
                           gameType,
                           playersOrTeams,
                           playerOrTeamIndex,
                           currentPlayerIndexInTeam,
                           history,
                           currentPlayerThrowsCount,
                           currentPlayerThrows,
                           dispatch
                        )
                     }}
                  >
                    Miss
                  </button>
               </div>
            </>

         ) : (
            <>
               {/*Player row section:*/}
               <div className="players-row">
                  {playersOrTeams.map((playerOrTeam: PlayerCricket | TeamCricket, index: number) => (
                     <span key={index} className="player-name">
                        {playerOrTeam.name}
                     </span>
                  ))}
               </div>
              
               {/* Score buttons for > 2 players */}
               <div className="cricket-score-buttons-v2">
                  {Scores.map((buttons, index) => (
                     <div className={`score-row-v2 ${completedSectors[buttons[0] === '25' ? 'Bull' : (buttons[0] as keyof typeof completedSectors)] ? 'completed-sector' : ''}`} key={index}>
                        {/* Sekcja z player-score dla każdego gracza */}
                        <div className="player-scores-v2">
                           {playersOrTeams.map((_: PlayerCricket | TeamCricket, playerOrTeamIndex: number) => (
                              <div key={playerOrTeamIndex} className="player-score-v2">
                                 {(() => {
                                    const scoreValue = playersOrTeams[playerOrTeamIndex].scores[buttons[0] === '25' ? 'Bull' : buttons[0]]
                                    if (scoreValue === 0) {
                                       return ''
                                    } else if (scoreValue === 1) {
                                       return 'I'
                                    } else if (scoreValue === 2) {
                                       return 'II'
                                    } else if (scoreValue === 3) {
                                       return <Image src='/completed.svg' alt='Completed icon' width={16} height={16} />
                                    }
                                 })()}
                              </div>
                           ))}
                        </div>
                        <div className="cricket-buttons-v2">
                           {buttons.map((label, i) => {
                              const isTriple = label.startsWith('T')
                              const isDouble = label.startsWith('D')
                              const sector = (label === '25' || label === '50' ? 'Bull' : label.replace(/[^0-9]/g, '')) as '20' | '19' | '18' | '17' | '16' | '15' | 'Bull'
                              const increment = label === '25' ? 1 : label === '50' ? 2 : isTriple ? 3 : isDouble ? 2 : 1
                              const value = isTriple || isDouble ? parseInt(label.slice(1)) * increment : label === '50' ? 50 : parseInt(label) * increment
                              const isSectorCompleted = completedSectors[sector]

                              return (
                                 <button 
                                    key={i}
                                    data-sector={sector}
                                    data-value={value} 
                                    data-increment={increment}
                                    onClick={isSectorCompleted ? () => {} : () => handleScoreButtons(
                                       sector, 
                                       label, 
                                       increment, 
                                       value,
                                       gameType,
                                       gameWin,
                                       numberOfLegs,
                                       isSoundEnabled,
                                       playersOrTeams,
                                       playerOrTeamIndex,
                                       currentPlayerIndexInTeam,
                                       startIndex,
                                       history,
                                       currentPlayerThrowsCount,
                                       currentPlayerThrows,
                                       dispatch
                                    )}
                                 >
                                    {label}
                                 </button>
                              )
                           })}
                        </div>
                     </div>
                  ))}
                  <div className="miss-button">
                     <button 
                        onClick={() => {
                           handleMissButton(
                              gameType,
                              playersOrTeams,
                              playerOrTeamIndex,
                              currentPlayerIndexInTeam,
                              history,
                              currentPlayerThrowsCount,
                              currentPlayerThrows,
                              dispatch
                           )
                        }}
                     >
                        Miss
                     </button>
                  </div>
                
               </div>

            </>
         )}
      </>
   )
}

export default ScoreButtonsCricket