import type { Metadata } from 'next'
import './styles/globals.scss'
import  localFont  from 'next/font/local'
import ReduxProvider from '@/redux/ReduxProvider'


const exoRegular = localFont({
   src: './fonts/Exo-Regular.ttf',
   variable: '--font-exo-regular',
   weight: '100 900',
})

const exoExtraBold = localFont({
   src: './fonts/Exo-ExtraBold.ttf',
   variable: '--font-exo-extra-bold',
   weight: '800 900'
})

export const metadata: Metadata = {
   title: 'Free Darts Online',
   description: 'Dart Score Application',
   icons: {
      icon: '/favicon.ico', 
   },
}

export default function RootLayout({
   children,
}: Readonly<{
  children: React.ReactNode
}>) {
   return (
      <html lang="en">
         <body className={`${exoRegular.variable} ${exoExtraBold.variable}`}>
            <ReduxProvider>
               {children}
            </ReduxProvider>
         </body>
      </html>
   )
}
