import './globals.css'
import NavMenu from '@/components/NavMenu'

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">
        <NavMenu />
        {children}
      </body>
    </html>
  )
}
