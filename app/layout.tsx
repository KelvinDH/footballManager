import { GameProvider } from './contexts/GameContext'
import { LanguageProvider } from './contexts/LanguageContext'
import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Futebol Manager',
  description: 'Gerencie seu time no Campeonato Brasileiro',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} grass-texture`}>
        <LanguageProvider>
          <GameProvider>
            <main className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 bg-opacity-90">
              {children}
            </main>
            <Toaster />
          </GameProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}

