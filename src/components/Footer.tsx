import React from 'react'
import Image from 'next/image'
import '../app/styles/footer.scss'

const Footer = ({ githubLogoSrc }: { githubLogoSrc: string }) => {
  
   return (
      <div className="footer">
         <a href="https://github.com/stanleypete" target="_blank" rel="noopener noreferrer">
            <p>&copy; Stanley Pete</p>
         </a>
         <Image 
            src={githubLogoSrc}
            alt='Github logo' 
            width={14} 
            height={14} 
         />
      </div>

       
   )
}

export default Footer
