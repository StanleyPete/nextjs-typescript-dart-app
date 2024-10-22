import type { Metadata } from 'next'
import './styles/globals.scss'
import  localFont  from 'next/font/local'

const exoRegular = localFont({
   src: './fonts/Exo-Regular.ttf',
   variable: '--font-exo-regular',
   weight: '100 900',
})

export const metadata: Metadata = {
   title: 'Dart Score App',
   description: 'Dart Score application',
}

export default function RootLayout({
   children,
}: Readonly<{
  children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <body className={`${exoRegular.variable}`}>
            {children}
         </body>
      </html>
   )
}
