'use client'

import { useGame } from '../contexts/GameContext'
import { useLanguage } from '../contexts/LanguageContext'
import { sponsors } from '../data/gameData'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Users, CheckCircle, XCircle } from 'lucide-react'
import { Layout } from '../components/Layout'

export default function SponsorPage() {
  const { selectedTeam, setSelectedSponsor, user, saveGame } = useGame()
  const { t } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    if (!user || !selectedTeam) {
      router.push('/login')
    }
  }, [user, selectedTeam, router])

  if (!selectedTeam) {
    return null
  }

  const handleSponsorSelect = (sponsor: any) => {
    if (selectedTeam.fans >= sponsor.minFans) {
      setSelectedSponsor(sponsor)
      saveGame() // Salva o jogo após selecionar o patrocinador
      router.push('/main-menu')
    }
  }

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold text-center text-white mb-6">{t('selectSponsor')}</h1>
          <p className="text-xl text-center text-white mb-12">{t('selectedTeam')}: {selectedTeam.name}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {sponsors.map((sponsor, index) => (
              <motion.div
                key={sponsor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card 
                  className={`overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    selectedTeam.fans >= sponsor.minFans ? 'hover:scale-105' : 'opacity-50'
                  }`}
                  onClick={() => handleSponsorSelect(sponsor)}
                >
                  <CardContent className="p-6">
                    <div className="relative w-full h-24 mb-4">
                      <Image 
                        src={sponsor.logo} 
                        alt={sponsor.name} 
                        layout="fill" 
                        objectFit="contain"
                      />
                    </div>
                    <h2 className="text-xl font-bold text-center mb-4">{sponsor.name}</h2>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          R$ {sponsor.value.toLocaleString()}
                        </Badge>
                        <Badge variant="secondary" className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {sponsor.minFans.toLocaleString()}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-center">
                        {selectedTeam.fans >= sponsor.minFans ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 mr-2" />
                        )}
                        <span className="text-sm">
                          {selectedTeam.fans >= sponsor.minFans
                            ? t('availableForYourTeam')
                            : t('insufficientFans')}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

