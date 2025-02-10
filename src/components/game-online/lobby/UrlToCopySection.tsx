'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'


const UrlToCopySection = () => {
   const [currentUrl, setCurrentUrl] = useState<string | null>(null)

   const handleCopy = () => {
      if (currentUrl) {
         navigator.clipboard.writeText(currentUrl)
            .catch((err) => {
               console.error('Failed to copy URL: ', err)
               alert('Failed to copy URL. Try to copy URL manually')
            })
      }
   }

   useEffect(() => {
      if (typeof window !== 'undefined') {
         const url = window.location.href.replace('/lobby', '')
         setCurrentUrl(url)
      }
   }, [])

   return (
      <div className='main-form'>
         <p className='header'>Send the below URL to your friend:</p>
         <div className="game-options url-section"> 
            <p className='url'>{currentUrl}</p>
            <Image
               src='/copy.svg'
               alt="Copy icon"
               width={16}
               height={16}
               className='copy-icon'
               onClick={handleCopy}
               title='Copy URL'
            />
         </div>
      </div>
   )
}

export default UrlToCopySection