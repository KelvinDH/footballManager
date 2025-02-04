"use client"

import { useState, useEffect } from "react"
import { useGame } from "../contexts/GameContext"
import { useLanguage } from "../contexts/LanguageContext"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, TrelloIcon as TacticalBoard, Trophy, Users, DollarSign, UserSquare2 } from "lucide-react"
import { PlayerMarket } from "../components/PlayerMarket"
import { Tactics } from "../components/Tactics"
import { TeamSelection } from "../components/TeamSelection"
import { Layout } from "../components/Layout"

export default function MainMenu() {
  const { selectedTeam, selectedSponsor, user, allTeams } = useGame()
  const { t } = useLanguage()
  const router = useRouter()
  const [activeSection, setActiveSection] = useState<"market" | "tactics" | "teamSelection" | null>(null)
  const [updatedTeam, setUpdatedTeam] = useState(selectedTeam)

  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else if (!selectedTeam || !selectedSponsor) {
      router.push("/team-selection")
    } else {
      // Atualiza as informações do time selecionado
      const currentTeam = allTeams.find((team) => team.id === selectedTeam.id)
      if (currentTeam) {
        setUpdatedTeam(currentTeam)
      }
    }
  }, [user, selectedTeam, selectedSponsor, router, allTeams])

  if (!user || !updatedTeam || !selectedSponsor) {
    return null
  }

  const menuItems = [
    { id: 1, title: t("playerMarket"), icon: ShoppingCart, action: () => setActiveSection("market") },
    { id: 2, title: t("tactics"), icon: TacticalBoard, action: () => setActiveSection("tactics") },
    { id: 3, title: t("teamSelection"), icon: UserSquare2, action: () => setActiveSection("teamSelection") },
    { id: 4, title: t("playMatch"), icon: Trophy, action: () => router.push("/dashboard") },
  ]

  return (
    <Layout>
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-white bg-opacity-90 backdrop-blur-md shadow-xl">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center text-green-800">{t("mainMenu")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {menuItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: item.id * 0.1 }}
                  >
                    <Button
                      onClick={item.action}
                      className="w-full h-16 sm:h-24 text-base sm:text-lg font-semibold bg-green-600 hover:bg-green-700 transition-colors duration-300"
                    >
                      <item.icon className="w-6 h-6 sm:w-8 sm:h-8 mr-2" />
                      {item.title}
                    </Button>
                  </motion.div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-center bg-green-100 p-4 rounded-lg">
                <div className="flex items-center mb-2 sm:mb-0">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-green-600" />
                  <span className="font-semibold text-sm sm:text-base">
                    {updatedTeam.fans.toLocaleString()} {t("fans")}
                  </span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-green-600" />
                  <span className="font-semibold text-sm sm:text-base">R$ {updatedTeam.money.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {activeSection === "market" && <PlayerMarket />}
          {activeSection === "tactics" && <Tactics />}
          {activeSection === "teamSelection" && <TeamSelection />}
        </div>
      </div>
    </Layout>
  )
}

