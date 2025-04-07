import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setPlayerNames, setFocusedSection } from '../../redux/slices/gameSettingsSlice'

const GameOnlinePlayerNameInput = () => {
   const dispatch = useDispatch()
   const playerNames = useSelector((state: RootState) => state.gameSettings.playerNames)
   const focusedSection = useSelector((state: RootState) => state.gameSettings.focusedSection)
   const previousFocusedSection = useSelector((state: RootState) => state.gameSettings.previousFocusedSection)
   const inputRefs = useRef<(HTMLInputElement | null)[]>([])

   const handleNameChange = (index: number, value: string) => {
      const newNames = [...playerNames]
      newNames[index] = value
      dispatch(setPlayerNames(newNames))
   }

   const handleChangeFocusedInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (focusedSection !== 'gameOnlinePlayerNameInput') return
      
      if(event.key === 'Tab'){
         event.preventDefault()
         event.stopPropagation()
      }

      if ((event.key === 'ArrowDown' || event.key === 'Tab') && !event.shiftKey ) {
         if (document.activeElement === inputRefs.current[0]) {
            if (document.activeElement instanceof HTMLElement) {
               document.activeElement.blur()
            }
            dispatch(setFocusedSection('gameMode'))
            event.stopPropagation()
            return  
         } 
                        
      } else if (event.key === 'ArrowUp' || (event.key === 'Tab' && event.shiftKey)) {
         if (document.activeElement === inputRefs.current[0]) {
            if (document.activeElement instanceof HTMLElement) {
               document.activeElement.blur()
            }
            dispatch(setFocusedSection('numberOfPlayers'))
            event.stopPropagation()
            return
         } 
      }
   }

   useEffect(() => {
      if (focusedSection === 'gameOnlinePlayerNameInput' && previousFocusedSection === 'numberOfPlayers') {
         if (inputRefs.current[0]) {
            inputRefs.current[0]?.focus()
         }
      } else if (focusedSection === 'gameOnlinePlayerNameInput' && previousFocusedSection === 'gameMode') {
         if (inputRefs.current[0]) {
            inputRefs.current[0]?.focus()
         }
      }
   }, [focusedSection, previousFocusedSection])

 

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
                     className={`${index === 0 ? 'full-width' : ''} ${focusedSection === 'gameOnlinePlayerNameInput' ? 'focused' : ''}`}
                     id={`player-${index}`}
                     value={name}
                     placeholder='Enter your name here...'
                     onChange={(event) => handleNameChange(index, event.target.value)}
                     onKeyDown={(e) => handleChangeFocusedInput(e)}
                     ref={(el) => {(inputRefs.current[index] = el)}}
                     autoComplete="off"
                  />
               </div>
            ))}
         </div>
      </>
   )
}

export default GameOnlinePlayerNameInput