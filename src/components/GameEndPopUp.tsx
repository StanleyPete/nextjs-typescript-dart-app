import React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { setIsGameEnd } from '@/redux/slices/gameRegularSlice'
import { handleRestartGame } from '@/lib/handleRestartGame'
import { handleUndo } from '@/lib/handleUndo'


const GameEndPopUp = () => {

   const dispatch = useDispatch()
   const router = useRouter()
   
   const { gameMode } = useSelector((state: RootState) => state.gameSettings)
   const {
      players, 
      history, 
      currentPlayerIndex, 
      showNumberButtons, 
      throwValueSum, 
      currentPlayerThrowsCount, 
      currentPlayerThrows, 
      isGameEnd,
      winner 
   } = useSelector((state: RootState) => state.gameRegular)


   return (
      isGameEnd && (
         <div className="overlay">
            <div className='game-over-popup'>
               <div className='game-over-popup-content'>
                  <Image 
                     src='/winner.svg' 
                     alt='Winner icon' 
                     width={80} 
                     height={80} 
                  />
                  <h3>Winner: {winner?.name}</h3>
                  <button 
                     className='play-again' 
                     onClick={() => {
                        handleRestartGame(dispatch, players, gameMode, isGameEnd)}}>
                        Play Again
                  </button>
                  <button 
                     className='go-back' 
                     onClick={() => router.back()}>
                        Back to Settings
                  </button>
                  <button 
                     className='undo' 
                     onClick={() => {
                        handleUndo(dispatch, history, players, gameMode, showNumberButtons, currentPlayerThrowsCount, currentPlayerThrows, currentPlayerIndex, throwValueSum); dispatch(setIsGameEnd(false))}}>
                        Undo
                  </button>
               </div>
            </div>
         </div>
      )
   )
}

export default GameEndPopUp