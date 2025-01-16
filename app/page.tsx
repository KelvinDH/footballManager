'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGame } from './contexts/GameContext'
import { useLanguage } from './contexts/LanguageContext'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Trophy, Users } from 'lucide-react'
import { Layout } from './components/Layout'

export default function Home() {
  const { user, loadGame } = useGame()
  const { t } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    const initializeGame = async () => {
      await loadGame()
    }
    initializeGame()
  }, [loadGame])

  const handleNewGame = () => {
    router.push('/register')
  }

  const handleContinue = () => {
    router.push('/login')
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[url('/stadium-background.jpg')] bg-cover bg-center bg-fixed flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="z-10"
        >
          <Card className="w-full max-w-md bg-white bg-opacity-90 backdrop-blur-md">
            <CardHeader className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
              >
                <svg
                  className="w-16 h-16 mx-auto text-green-600 mb-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <circle cx="12" cy="12" r="2" />
                  <path d="M2 9h2" />
                  <path d="M2 15h2" />
                  <path d="M20 9h2" />
                  <path d="M20 15h2" />
                  <path d="M6 5v2" />
                  <path d="M6 17v2" />
                  <path d="M18 5v2" />
                  <path d="M18 17v2" />
                </svg>
              </motion.div>
              <CardTitle className="text-3xl font-bold text-green-800">{t('title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-center text-gray-600">{t('subtitle')}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <Trophy className="w-8 h-8 mx-auto text-yellow-500 mb-2" />
                  <p className="text-sm font-medium">20 {t('teams')}</p>
                </div>
                <div className="text-center">
                  <Users className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                  <p className="text-sm font-medium">{t('fans')}</p>
                </div>
              </div>
              <div className="space-y-4">
                <Button onClick={handleNewGame} className="w-full bg-green-600 hover:bg-green-700 transition-colors duration-300">
                  {t('newGame')}
                </Button>
                <Button onClick={handleContinue} variant="outline" className="w-full hover:bg-green-100 transition-colors duration-300">
                  {t('continue')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  )
}

