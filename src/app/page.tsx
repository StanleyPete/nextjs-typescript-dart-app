'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

const Home = () => {
   const router = useRouter()

   //Game mode handler
   const handlePlayGameMode = (mode: string) => {     
      router.push(`/game-settings?mode=${mode}`)
   }

   return (
      <div>
         <h1>Welcome to the dart app</h1>
         <div className='game-mode'>
            <p>Please select the game you want to play:</p>
            <div className='game-mode-buttons'>
               <button onClick={() => handlePlayGameMode('501')}>501</button>
               <button onClick={() => handlePlayGameMode('301')}>301</button>
               <button onClick={() => handlePlayGameMode('Cricket')}>Cricket</button>
            </div>
         </div>
         <p className='copyright'>© StanleyPete 2024</p>
      </div>
   )
}

export default Home

         


