'use client'
import React, { useEffect, useState} from 'react'
import { RootState } from '@/redux/store'
import { useSelector, useDispatch } from 'react-redux'
import JoinLeaveNotification from './JoinLeaveNotification'
import { setPlayerNames } from '@/redux/slices/gameSettingsSlice'


const GameLobbyHeader = () => {
   const dispatch = useDispatch()
   const [showNotification, setShowNotification] = useState(false)
   const [notificationType, setNotificationType] = useState<'joined' | 'left' | null>(null)
   const [playerJoinedLeftName, setPlayerJoinedLeftName] = useState<string>('')
   const { socket, role } = useSelector((state: RootState) => state.socket)
   const { playerNames } = useSelector((state: RootState) => state.gameSettings)

   useEffect(() => {
      if (role === 'host' && socket) {
         socket.on('guest-joined-lobby', ({ guestName }) => {
            const updatedPlayerNames = [...playerNames, guestName]
            dispatch(setPlayerNames(updatedPlayerNames))
            setPlayerJoinedLeftName(guestName)
            setNotificationType('joined')
            setShowNotification(true) 
            const timer = setTimeout(() => {
               setShowNotification(false) 
            }, 5000)
            return () => clearTimeout(timer)
         })

         socket.on('guest-left-lobby', ({ guestName }) => {
            const updatedPlayerNames = [playerNames[0]]
            dispatch(setPlayerNames(updatedPlayerNames))
            setPlayerJoinedLeftName(guestName)
            setNotificationType('left')
            setShowNotification(true) 
            const timer = setTimeout(() => {
               setShowNotification(false) 
            }, 5000)
            return () => clearTimeout(timer)
         })
            
         return () => {
            socket.off('guest-joined-lobby')
            socket.off('guest-left-lobby')
         }
      }
   }, [socket, role, playerNames, dispatch])
      
   useEffect(() => {
      console.log(playerNames)
   }, [playerNames])
   


   return (
      <div className="game-lobby-header">
         <h1 className='game-header'>
            GAME LOBBY
         </h1>
         {showNotification && <JoinLeaveNotification type={ notificationType } playerName={playerJoinedLeftName} />}
      </div>
   )
}

export default GameLobbyHeader