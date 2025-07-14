import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { setPlayerNames, setFocusedSection, setPreviousFocusedSection } from '../../redux/slices/gameSettingsSlice'
import { TeamsPlayerInput } from '@/types/components/componentsTypes'

const GameTeamsPlayerNamesInput = ({ teamIndex, playerIndexes }: TeamsPlayerInput) => {
   const dispatch = useDispatch()
   const { playerNames } = useSelector((state: RootState) => state.gameSettings)
   const focusedSection = useSelector((state: RootState) => state.gameSettings.focusedSection)
   const previousFocusedSection = useSelector((state: RootState) => state.gameSettings.previousFocusedSection)
   const inputRefs = useRef<(HTMLInputElement | null)[]>([])
   const wasFocusedByMouse = useRef(false)
   const [ currentInputIndex, setCurrentInputIndex ] = useState<number|null>(null)

   const handleNameChange = (index: number, value: string) => {
      const newNames = [...playerNames]
      newNames[index] = value
      dispatch(setPlayerNames(newNames))
   }

   const handleChangeFocusedInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (focusedSection !== 'gameTeamsPlayerNameInputTeam1' && focusedSection !== 'gameTeamsPlayerNameInputTeam2' ) return
   
      if(event.key === 'Tab'){
         event.preventDefault()
         event.stopPropagation()
      }

      if (teamIndex === 0) {
         if ((event.key === 'ArrowDown' || event.key === 'Tab') && !event.shiftKey || event.key === 'Enter' ) {
            // Scenario when last input is focused
            if (document.activeElement === inputRefs.current[1]) {
               dispatch(setFocusedSection('gameTeamsPlayerNameInputTeam2'))
               dispatch(setPreviousFocusedSection('gameTeamsPlayerNameInputTeam1'))
               if (document.activeElement instanceof HTMLElement) {
                  document.activeElement.blur()
               }
               return
   
            // Scenario when last input is NOT focused (moving to the next available input)   
            } else {
               const nextIndex = (currentInputIndex as number + 1) % playerNames.length
               setCurrentInputIndex(nextIndex)
               inputRefs.current[nextIndex]?.focus()
               return
            }
   
         } else if (event.key === 'ArrowUp' || (event.key === 'Tab' && event.shiftKey)) {
            // Scenario when first input is focused
            if (document.activeElement === inputRefs.current[0]) {
               if (document.activeElement instanceof HTMLElement) {
                  document.activeElement.blur()
               }
               dispatch(setFocusedSection('gameType'))
               event.stopPropagation()
               return
            
            // Scenario when first input is NOT focused (moving to the previous input)   
            } else {
               const prevIndex = (currentInputIndex as number - 1 + playerNames.length) % playerNames.length
               setCurrentInputIndex(prevIndex)
               inputRefs.current[prevIndex]?.focus()
               return
            }
         }
      } else if (teamIndex === 1) {
         if ((event.key === 'ArrowDown' || event.key === 'Tab') && !event.shiftKey || event.key === 'Enter' ) {
            // Scenario when last input is focused
            if (document.activeElement === inputRefs.current[3]) {
               if (document.activeElement instanceof HTMLElement) {
                  document.activeElement.blur()
               }
               dispatch(setFocusedSection('gameMode'))
               event.stopPropagation()
               return
            // Scenario when last input is NOT focused (moving to the next available input)   
            } else {
               const nextIndex = (currentInputIndex as number + 1) % playerNames.length
               setCurrentInputIndex(nextIndex)
               inputRefs.current[nextIndex]?.focus()
               return
            }
   
         } else if (event.key === 'ArrowUp' || (event.key === 'Tab' && event.shiftKey)) {
            // Scenario when first input is focused
            if (document.activeElement === inputRefs.current[2]) {
               dispatch(setFocusedSection('gameTeamsPlayerNameInputTeam1'))
               dispatch(setPreviousFocusedSection('gameTeamsPlayerNameInputTeam2'))
               if (document.activeElement instanceof HTMLElement) {
                  document.activeElement.blur()
               }
               return
            
            // Scenario when first input is NOT focused (moving to the previous input)   
            } else {
               const prevIndex = (currentInputIndex as number - 1 + playerNames.length) % playerNames.length
               setCurrentInputIndex(prevIndex)
               inputRefs.current[prevIndex]?.focus()
               return
            }
         }
      }
   }

   useEffect(() => {
      if (wasFocusedByMouse.current) {
         wasFocusedByMouse.current = false
         return
      }

      
      if (teamIndex === 0) {
         if (focusedSection === 'gameTeamsPlayerNameInputTeam1' && previousFocusedSection === 'gameType') {
            setCurrentInputIndex(0)
            if (inputRefs.current[0]) {
               inputRefs.current[0]?.focus()
            }
         } else if (focusedSection === 'gameTeamsPlayerNameInputTeam1' && previousFocusedSection === 'gameTeamsPlayerNameInputTeam2') {
            dispatch(setPreviousFocusedSection('gameTeamsPlayerNameInputTeam1'))
            setCurrentInputIndex(1)
            if (inputRefs.current[1]) {
               inputRefs.current[1]?.focus()
            }
         }

      } else if (teamIndex === 1) {
         if (focusedSection === 'gameTeamsPlayerNameInputTeam2' && previousFocusedSection === 'gameTeamsPlayerNameInputTeam1') {
            dispatch(setPreviousFocusedSection('gameTeamsPlayerNameInputTeam2'))
            setCurrentInputIndex(2)
            if (inputRefs.current[2]) {
               inputRefs.current[2]?.focus()
            }
         } else if (focusedSection === 'gameTeamsPlayerNameInputTeam2' && previousFocusedSection === 'gameMode') {
            setCurrentInputIndex(3)
            if (inputRefs.current[3]) {
               inputRefs.current[3]?.focus()
            }
         }
      }
   }, [focusedSection, previousFocusedSection])


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
                  className={playerNames[index] === '' ? 'italic' : ''}
                  key={index}
                  type="text"
                  placeholder={`T${teamIndex + 1}: Player ${index + 1} name`}
                  value={playerNames[index]}
                  onChange={(event) => handleNameChange(index, event.target.value)}
                  onKeyDown={(e) => handleChangeFocusedInput(e)}
                  onFocus={() => {
                     wasFocusedByMouse.current = true
                     setCurrentInputIndex(index)
                     if(teamIndex === 0){
                        dispatch(setFocusedSection('gameTeamsPlayerNameInputTeam1'))
                     } else {
                        dispatch(setFocusedSection('gameTeamsPlayerNameInputTeam2'))
                     }

                  }}
                  ref={(el) => {(inputRefs.current[index] = el)}}
                  autoComplete="off"
               />
            ))}
         </div>

      </div>
      

   )
}

export default GameTeamsPlayerNamesInput
