import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setCurrentThrow, } from '@/redux/slices/game-classic/gameClassicSlice'
import { selectDataInKeyboardButtonsAndGameEndPopUp } from '@/redux/selectors/game-classic/selectDataInKeyboardButtonsAndGameEndPopUp'
import { handleUndoClassic } from '@/controllers/game-classic/handleUndoClassic'
import { PlayerClassic, TeamClassic, HistoryEntryClassicSingle, HistoryEntryClassicTeams } from '@/types/redux/gameClassicTypes'

const KeyboardButtons = () => {
   const dispatch = useDispatch()
   const [activeButton, setActiveButton] = useState<number | string | null>(null)
   const gameType = useSelector((state: RootState) => state.gameSettings.gameType)
   const gameMode = useSelector((state: RootState) => state.gameSettings.gameMode)
   const { isError } = useSelector((state: RootState) => state.gameSettings.error)
   const isGameEnd = useSelector((state: RootState) => state.game?.isGameEnd ?? false)
   const currentPlayerThrowsCount = useSelector((state: RootState) => state.game?.currentPlayerThrowsCount ?? 0)
   const currentPlayerThrows = useSelector((state: RootState) => state.game?.currentPlayerThrows ?? [])
   const showNumberButtons = useSelector((state: RootState) => state.gameClassic?.showNumberButtons ?? false)
   const currentThrow = useSelector((state: RootState) => state.gameClassic?.currentThrow ?? 0)
   const throwValueSum = useSelector((state: RootState) => state.gameClassic?.throwValueSum ?? 0)

   //Memoized (@/redux/selectors/game-classic/selectDataInKeyboardButtonsAndGameEndPopUp.ts):
   const { playersOrTeams, index, history } = useSelector(selectDataInKeyboardButtonsAndGameEndPopUp)

   const handleButtonClick = (number: number) => {
      const newValueString = `${currentThrow}${number}`
      if (newValueString.length > 3) return
      const newValue = Number(newValueString)
      dispatch(setCurrentThrow(newValue))
   }

   useEffect(() => {
      if (isGameEnd || isError) return
      const handleKeyDown = (event: KeyboardEvent) => {
         const key = event.key
         if (key >= '0' && key <= '9') {
            const num = Number(key)
            handleButtonClick(num)
            setActiveButton(num)
            setTimeout(() => setActiveButton(null), 100)
         }

         if (event.ctrlKey && event.key === 'z') {
            event.preventDefault()
            setActiveButton('undo')
            setTimeout(() => setActiveButton(null), 100)
            handleUndoClassic(
               gameType,
               playersOrTeams as PlayerClassic[] | TeamClassic[], 
               index, 
               history as HistoryEntryClassicSingle[] | HistoryEntryClassicTeams[], 
               showNumberButtons, 
               throwValueSum,
               currentPlayerThrows, 
               currentPlayerThrowsCount, 
               gameMode as unknown as number | string, 
               dispatch, 
            ) 
         }
      }

      window.addEventListener('keydown', handleKeyDown)

      return () => { window.removeEventListener('keydown', handleKeyDown) }
   }, [currentThrow, dispatch, gameType, gameMode, playersOrTeams, index, history, showNumberButtons, throwValueSum, currentPlayerThrows, currentPlayerThrowsCount, isError, isGameEnd])


   return (
      <div className='score-input'>
         {/* Buttons 0-9 */}
         {Array.from({ length: 9 }, (_, i) => (
            <button 
               key={i} 
               className={activeButton === i + 1 ? 'clicked' : ''}
               onClick={() => {
                  handleButtonClick(i + 1)
                  setActiveButton(i + 1)
                  setTimeout(() => setActiveButton(null), 100)
               }}
            >
               {i+1}
            </button>
         ))}
         <button
            className={activeButton === 'undo' ? 'clicked' : ''} 
            onClick={() => {
               handleUndoClassic(
                  gameType,
                  playersOrTeams as PlayerClassic[] | TeamClassic[], 
                  index, 
                  history as HistoryEntryClassicSingle[] | HistoryEntryClassicTeams[], 
                  showNumberButtons, 
                  throwValueSum,
                  currentPlayerThrows, 
                  currentPlayerThrowsCount, 
                  gameMode as unknown as number | string, 
                  dispatch, 
               ) 
            }}
         >
            Undo
            <span>(Ctrl + z)</span>
         </button>
         <button 
            className={activeButton === 0 ? 'clicked' : ''}
            onClick={() => {
               handleButtonClick(0)
               setActiveButton(0)
               setTimeout(() => setActiveButton(null), 100)
            }}
         >
            0
         </button>
      </div>
   )
}

export default KeyboardButtons