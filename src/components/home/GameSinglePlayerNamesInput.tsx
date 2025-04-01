import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setPlayerNames, setFocusedSection, setPreviousFocusedSection} from '../../redux/slices/gameSettingsSlice'
import { PlayerNamesInputProps } from '@/types/components/componentsTypes'

const GameSinglePlayerNamesInput = ({ maxPlayers }: PlayerNamesInputProps) => {
   const dispatch = useDispatch()
   const playerNames = useSelector((state: RootState) => state.gameSettings.playerNames)
   const focusedSection = useSelector((state: RootState) => state.gameSettings.focusedSection)
   const previousFocusedSection = useSelector((state: RootState) => state.gameSettings.previousFocusedSection)
   const inputRefs = useRef<(HTMLInputElement | null)[]>([])
   const [ currentInputIndex, setCurrentInputIndex ] = useState<number|null>(null) 

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

   const handleArrowNavigation = (event: KeyboardEvent) => {
      if (focusedSection !== 'gameSinglePlayerNameInput') return
  
      event.preventDefault()
      event.stopPropagation()

      if (event.key === 'ArrowDown' || event.key === 'Tab') {
       
         const lastIndex = playerNames.length - 1
         if (document.activeElement === inputRefs.current[lastIndex]) {
            dispatch(setFocusedSection('gameMode'))
            if (document.activeElement instanceof HTMLElement) {
               document.activeElement.blur()
            }
            return
         } else {
            // Jeśli nie jesteś na ostatnim inpucie, przenieś do następnego inputu
            const nextIndex = (currentInputIndex as number + 1) % playerNames.length
            setCurrentInputIndex(nextIndex)
            inputRefs.current[nextIndex]?.focus()
            return
         }
      } else if (event.key === 'ArrowUp' || (event.key === 'Tab' && event.shiftKey)) {
         if (document.activeElement === inputRefs.current[0]) {
            dispatch(setFocusedSection('gameType'))
            if (document.activeElement instanceof HTMLElement) {
               document.activeElement.blur()
            }
            return
           
         } else {
            // Jeśli nie jesteś na pierwszym inpucie, przenieś do poprzedniego inputu
            const prevIndex = (currentInputIndex as number - 1 + playerNames.length) % playerNames.length
            setCurrentInputIndex(prevIndex)
            inputRefs.current[prevIndex]?.focus()
            return
         }
      }
   }

   useEffect(() => {
      if (focusedSection === 'gameSinglePlayerNameInput' && previousFocusedSection === 'gameType') {
         dispatch(setPreviousFocusedSection('gameSinglePlayerNameInput'))
         setCurrentInputIndex(0)
         if (inputRefs.current[0]) {
            inputRefs.current[0]?.focus()
         }
      } else if (focusedSection === 'gameSinglePlayerNameInput' && previousFocusedSection === 'gameMode') {
         const lastIndex = playerNames.length - 1
         dispatch(setPreviousFocusedSection('gameSinglePlayerNameInput'))
         setCurrentInputIndex(lastIndex)
         if (inputRefs.current[lastIndex]) {
            inputRefs.current[lastIndex]?.focus()
         }
      }
   }, [focusedSection, playerNames, previousFocusedSection])

   

   return (
      <div className="players-section main-form" >
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
                  onKeyUp={(e) => handleArrowNavigation(e)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  autoComplete="off"
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

export default GameSinglePlayerNamesInput