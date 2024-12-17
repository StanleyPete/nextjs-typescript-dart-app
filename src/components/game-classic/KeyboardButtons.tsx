import React from 'react'
//Redux
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setCurrentThrow, } from '@/redux/slices/game-classic/gameClassicSlice'
import { selectDataInKeyboardButtonsAndGameEndPopUp } from '@/redux/selectors/game-classic/selectDataInKeyboardButtonsAndGameEndPopUp'
//Controllers
import { handleUndo } from '@/controllers/game-classic/handleUndo'
//Types
import { 
   PlayerClassic, 
   TeamClassic, 
   HistoryEntryClassicSingle, 
   HistoryEntryClassicTeams 
} from '@/types/redux/gameClassicTypes'

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
   //Memoized (@/redux/selectors/game-classic/selectDataInKeyboardButtonsAndGameEndPopUp.ts):
   const { 
      playersOrTeams, 
      index,
      history, 
   } = useSelector(selectDataInKeyboardButtonsAndGameEndPopUp)

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