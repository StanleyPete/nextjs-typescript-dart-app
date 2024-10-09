'use client'
import React from 'react'
import Link from 'next/link'

const Home = () => {
   return (
      <div>
         <h1>Welcome to the dart app</h1>
         <div className='game-mode'>
            <p>Please select the game you want to play:</p>
            <div className='game-mode-buttons'>
               <Link href="/game-settings?mode=501">
                  <button>501</button>
               </Link>
               <Link href="/game-settings?mode=301">
                  <button>301</button>
               </Link>
               <Link href="/game-settings?mode=Cricket">
                  <button>Cricket</button>
               </Link>
            </div>
         </div>
         <p className='copyright'>© StanleyPete 2024</p>
      </div>
   )
}

export default Home

         


