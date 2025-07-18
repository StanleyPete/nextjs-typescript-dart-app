import React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
//Redux
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { setIsGameEnd } from '@/redux/slices/gameSlice'
import { selectDataInGameEndPopUp } from '@/redux/selectors/game-cricket/selectDataInGameEndPopUp'
//Controllers
import { handleRestartGameCricket } from '@/controllers/game-cricket/handleRestartGameCricket'
import { handleUndoCricket } from '@/controllers/game-cricket/handleUndoCricket'

const GameEndPopUp = () => {
   const dispatch = useDispatch()
   const router = useRouter()
   const playerNames = useSelector((state: RootState) => state.gameSettings.playerNames)
   const gameType = useSelector((state: RootState) => state.gameSettings.gameType)
   const currentPlayerThrowsCount = useSelector((state: RootState) => state.game?.currentPlayerThrowsCount ?? 0)
   const isGameEnd = useSelector((state: RootState) => state.game?.isGameEnd ?? false)
   const winner = useSelector((state: RootState) => state.game?.winner ?? null)

   //Memoized (@/redux/selectors/game-cricket/selectDataInGameEndPopUp.ts):
   const { playersOrTeams, history } = useSelector(selectDataInGameEndPopUp)
   
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
                        handleRestartGameCricket(
                           gameType, 
                           playerNames, 
                           isGameEnd, 
                           dispatch
                        )
                     }}
                  >
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
                        handleUndoCricket(
                           gameType, 
                           playersOrTeams, 
                           history, 
                           currentPlayerThrowsCount, 
                           dispatch
                        ); dispatch(setIsGameEnd(false))
                     }}
                  > 
                     Undo
                  </button>
               </div>
            </div>
         </div>
      )
   )
}

export default GameEndPopUp