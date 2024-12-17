import React  from 'react'
//Redux
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'

import { selectDataInScoreSection } from '@/redux/memoizedSelectors'
//Components
import ThrowValueSectionCricket from './ThrowValueSectionCricket'


const ScoreSectionCricket = () => {
   const dispatch = useDispatch()
 
   //Memoized (@/redux/memoizedSelectors.ts):
   const { playersOrTeams, index } = useSelector(selectDataInScoreSection)

   return (
      <div className='score-section'> 
         <ThrowValueSectionCricket />
         {/*Score buttons:*/}
         {players.length === 2 ? (
            <>
               <div className='cricket-score-buttons'>
                  {Scores.map((buttons, index) => (
                     <div  className={`score-row-v2 ${completedSectors[buttons[0] === '25' ? 'Bull' : buttons[0]] ? 'completed-sector' : ''}`} key={index}>
                        <div className='player-score'>
                           <span>
                              {(() => {
                                 const scoreValue = players[0].scores[buttons[0] === '25' ? 'Bull' : buttons[0]]
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
                              const sector = label === '25' || label === '50' ? 'Bull' : label.replace(/[^0-9]/g, '')
                              const increment = label === '25' ? 1 : label === '50' ? 2 : isTriple ? 3 : isDouble ? 2 : 1
                              const value = isTriple || isDouble ? parseInt(label.slice(1)) * increment : label === '50' ? 50 : parseInt(label) * increment
                              const isSectorCompleted = completedSectors[sector]
                              
                              return (
                                 <button 
                                    key={i} 
                                    data-sector={sector}
                                    data-value={value} 
                                    data-increment={increment}
                                    onClick={isSectorCompleted ? () => {} : () => handleScoreButtons(sector, label, increment, value)}
                                 >
                                    {label}
                                 </button>
                              )

                                 
                           })}
                        </div>
                        <div className='player-score'>
                           <span>
                              {(() => {
                                 const scoreValue = players[1].scores[buttons[0] === '25' ? 'Bull' : buttons[0]]
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
                  <button onClick={handleMissButton}>Miss</button>
               </div>
            </>

         ) : (
            <>
               {/*Player row section:*/}
               <div className="players-row">
                  {players.map((player, index) => (
                     <span key={index} className="player-name">
                        {player.name}
                     </span>
                  ))}
               </div>
                  
               {/* Score buttons for > 2 players */}
               <div className="cricket-score-buttons-v2">
                  {Scores.map((buttons, index) => (
                     <div className={`score-row-v2 ${completedSectors[buttons[0] === '25' ? 'Bull' : buttons[0]] ? 'completed-sector' : ''}`} key={index}>
                        {/* Sekcja z player-score dla każdego gracza */}
                        <div className="player-scores-v2">
                           {players.map((_, playerIndex) => (
                              <div key={playerIndex} className="player-score-v2">
                                 {(() => {
                                    const scoreValue = players[playerIndex].scores[buttons[0] === '25' ? 'Bull' : buttons[0]]
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
                              const sector = label === '25' || label === '50' ? 'Bull' : label.replace(/[^0-9]/g, '')
                              const increment = label === '25' ? 1 : label === '50' ? 2 : isTriple ? 3 : isDouble ? 2 : 1
                              const value = isTriple || isDouble ? parseInt(label.slice(1)) * increment : label === '50' ? 50 : parseInt(label) * increment
                              const isSectorCompleted = completedSectors[sector]

                              return (
                                 <button 
                                    key={i}
                                    data-sector={sector}
                                    data-value={value} 
                                    data-increment={increment}
                                    onClick={isSectorCompleted ? () => {} : () => handleScoreButtons(sector, label, increment, value)}
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
                        onClick={handleMissButton}>
                              Miss
                     </button>
                  </div>
                    
               </div>

            </>
         )}

      </div>
   )
}

export default ScoreSectionCricket