import React from 'react'
//Redux
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setCurrentThrow, } from '@/redux/slices/gameClassicSlice'
import { selectDataInKeyboardButtonsOrGameEndPopUp } from '@/redux/memoizedSelectors'
//Controllers
import { handleUndo } from '@/controllers/handleUndo'
//Types
import { 
   PlayerClassic, 
   TeamClassic, 
   HistoryEntryClassicSingle, 
   HistoryEntryClassicTeams 
} from '@/types/types'

const KeyboardButtons = () => {
   const dispatch = useDispatch()
   const {gameType, gameMode} = useSelector((state: RootState) => state.gameSettings)
   const {
      showNumberButtons,
      currentThrow,
      throwValueSum,
      currentPlayerThrowsCount,
      currentPlayerThrows
   } = useSelector((state: RootState) => state.gameClassic)
   //Memoized (@/redux/memoizedSelectors.ts):
   const { 
      playersOrTeams, 
      index,
      history, 
   } = useSelector(selectDataInKeyboardButtonsOrGameEndPopUp)

   return (
      <div className='score-input'>
         {/* Buttons 0-9 */}
         {Array.from({ length: 9 }, (_, i) => (
            <button 
               key={i} 
               onClick={() => {
                  const newValue = Number(`${currentThrow}${i+1}`)
                  dispatch(setCurrentThrow(newValue))
               }}
            >
               {i+1}
            </button>
         ))}
         <button 
            onClick={() => {
               handleUndo(
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
         </button>
         <button
            onClick={() => {
               const newValue = Number(`${currentThrow}${0}`)
               dispatch(setCurrentThrow(newValue))
            }}
         >
            0
         </button>
      </div>
   )
}

export default KeyboardButtons