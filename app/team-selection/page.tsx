"use client"

import { useGame } from "../contexts/GameContext"
import { useLanguage } from "../contexts/LanguageContext"
import { teams, type Team } from "../data/gameData"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Shield, Swords } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useCallback, useEffect } from "react"
import { Layout } from "../components/Layout"

export default function TeamSelectionPage() {
  const { setSelectedTeam, user, saveGame } = useGame()
  const { t } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  const handleTeamSelect = useCallback(
    (team: Team) => {
      setSelectedTeam(team)
      saveGame()
      router.push("/sponsor")
    },
    [setSelectedTeam, saveGame, router],
  )

  if (!user) return null

  return (
    <Layout>
      <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-center text-white mb-2 sm:mb-4">
            {t("hello")}, {user}!
          </h1>
          <h2 className="text-xl sm:text-3xl font-extrabold text-center text-white mb-6 sm:mb-12">{t("selectTeam")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {teams.map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card
                  className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
                  onClick={() => handleTeamSelect(team)}
                >
                  <CardContent className="p-4">
                    <div className="relative w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4">
                      <Image
                        src={team.logo || "/placeholder.svg"}
                        alt={team.name}
                        layout="fill"
                        objectFit="contain"
                        className="rounded-full"
                      />
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-center mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
                      {team.name}
                    </h2>
                    <div className="flex items-center justify-center mb-4">
                      <Users className="w-4 h-4 mr-2 text-gray-500" />
                      <Badge variant="secondary" className="text-xs sm:text-sm">
                        {team.fans.toLocaleString()} {t("fans")}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Swords className="w-4 h-4 mr-2 text-red-500" />
                        <span className="text-xs sm:text-sm font-medium mr-2">{t("attack")}:</span>
                        <Progress value={team.attack} className="flex-grow h-2 bg-red-200 [&>div]:bg-red-500" />
                      </div>
                      <div className="flex items-center">
                        <Shield className="w-4 h-4 mr-2 text-blue-500" />
                        <span className="text-xs sm:text-sm font-medium mr-2">{t("defense")}:</span>
                        <Progress value={team.defense} className="flex-grow h-2 bg-blue-200 [&>div]:bg-blue-500" />
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

