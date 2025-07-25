import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setPlayerNames, setFocusedSection } from '../../redux/slices/gameSettingsSlice'
import { PlayerNamesInputProps } from '@/types/components/componentsTypes'

const GameSinglePlayerNamesInput = ({ maxPlayers }: PlayerNamesInputProps) => {
   const dispatch = useDispatch()
   const gameType = useSelector((state: RootState) => state.gameSettings.gameType)
   const playerNames = useSelector((state: RootState) => state.gameSettings.playerNames)
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

   const addPlayerInput = () => {
      dispatch(setPlayerNames([...playerNames, '']))
   }

   const removePlayerInput = (index: number) => {
      const newNames = [...playerNames]
      newNames.splice(index, 1)
      dispatch(setPlayerNames(newNames))
   }

   const handleChangeFocusedInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (focusedSection !== 'gameSinglePlayerNameInput') return
      
      if(event.key === 'Tab'){
         event.preventDefault()
         event.stopPropagation()
      }

      if (event.key === 'Delete' && playerNames.length > 1 && currentInputIndex !== 0) {
         removePlayerInput(currentInputIndex as number)
         const newIndex = currentInputIndex as number - 1
         setCurrentInputIndex(newIndex)
         inputRefs.current[newIndex]?.focus()
         return
      }

      if ((event.key === 'ArrowDown' || event.key === 'Tab') && !event.shiftKey || event.key === 'Enter') {
         const lastIndex = playerNames.length - 1
         // Scenario when last input is focused
         if (document.activeElement === inputRefs.current[lastIndex]) {
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
   }

   // FOCUS SECTION UPDATE WHEN CHANGING FROM GAME TYPE/GAME MODE
   useEffect(() => {
      if (wasFocusedByMouse.current) {
         wasFocusedByMouse.current = false
         return
      }

      if (focusedSection === 'gameSinglePlayerNameInput' && previousFocusedSection === 'gameType') {  
         setCurrentInputIndex(0)
         if (inputRefs.current[0]) {
            inputRefs.current[0]?.focus()
         }
      } else if (focusedSection === 'gameSinglePlayerNameInput' && previousFocusedSection === 'gameMode') {
         const lastIndex = playerNames.length - 1
         setCurrentInputIndex(lastIndex)
         if (inputRefs.current[lastIndex]) {
            inputRefs.current[lastIndex]?.focus()
         }
      }
   }, [focusedSection, previousFocusedSection])

   // REMOVE LAST PLAYER (Keyboard)
   useEffect(() => {
      if (playerNames.length === 1) return

      const handleRemoveLastPlayerKeyboard = (event: KeyboardEvent) => {
         if (gameType === 'single' && event.ctrlKey && event.shiftKey && event.key === '-') {
            if (currentInputIndex === playerNames.length-1){
               const newIndex = currentInputIndex as number - 1
               setCurrentInputIndex(newIndex)
               inputRefs.current[newIndex]?.focus()
            }
            removePlayerInput(playerNames.length - 1)
         }
      }

      window.addEventListener('keydown', handleRemoveLastPlayerKeyboard)

      return () => { window.removeEventListener('keydown', handleRemoveLastPlayerKeyboard)}
   }, [playerNames, gameType, currentInputIndex])

   // ADD PLAYER (Keyboard)
   useEffect(() => {
      if (playerNames.length === 4) return

      const handleAddPlayerKeyboard = (event: KeyboardEvent) => {
         if (gameType === 'single' && event.ctrlKey && event.shiftKey && event.key === '+') {
            addPlayerInput()
         }
      }

      window.addEventListener('keydown', handleAddPlayerKeyboard)

      return () => { window.removeEventListener('keydown', handleAddPlayerKeyboard)}
   }, [playerNames, gameType])

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
                  className={`${index === 0 ? 'full-width' : ''} ${name === '' ? 'italic' : ''}`}
                  id={`player-${index}`}
                  value={name}
                  placeholder={`Player ${index + 1} name`}
                  onChange={(event) => handleNameChange(index, event.target.value)}
                  onKeyDown={(e) => handleChangeFocusedInput(e)}
                  onFocus={() => {
                     wasFocusedByMouse.current = true
                     setCurrentInputIndex(index)
                     dispatch(setFocusedSection('gameSinglePlayerNameInput'))
                  }}
                  ref={(el) => {(inputRefs.current[index] = el)}}
                  autoComplete='off'
               />
               {playerNames.length > 1 && index > 0 && (
                  <button
                     className='remove-player-button'
                     onClick={() => removePlayerInput(index)}
                  >
                     <Image
                        src='/minus.svg'
                        alt='Remove player icon'
                        width={20}
                        height={20}
                        title='Remove player'
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
                  width={18}
                  height={18}
               />
               <span>New player (Ctrl + Shift + &quot;+&quot;) </span>
            </button>
         )}
         {playerNames.length > 1 && (
            <div className="remove-last-player">
               <Image
                  src="/info.svg"
                  alt="Info icon"
                  width={14}
                  height={14}
               />
               <span>Remove last: (Ctrl + Shift + &quot;-&quot;)</span>
            </div>
            
         )}
      </div>
   )
}

export default GameSinglePlayerNamesInput