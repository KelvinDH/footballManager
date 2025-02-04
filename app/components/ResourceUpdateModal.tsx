"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "../contexts/LanguageContext"
import { motion, AnimatePresence } from "framer-motion"
import { X, TrendingUp, TrendingDown, Goal, CreditCard, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PlayerUpdate {
  name: string
  goals: number
  yellowCards: number
  redCards: number
  isSuspended: boolean
}

interface MatchStats {
  homeTeam?: string
  awayTeam?: string
  homeScore?: number
  awayScore?: number
  homeScorers?: string[]
  awayScorers?: string[]
  homeYellowCards?: string[]
  awayYellowCards?: string[]
  homeRedCards?: string[]
  awayRedCards?: string[]
}

interface ResourceUpdateModalProps {
  isOpen: boolean
  onClose: () => void
  moneyChange: number
  fansChange: number
  playerUpdates: PlayerUpdate[]
  matchStats?: MatchStats
}

export function ResourceUpdateModal({
  isOpen,
  onClose,
  moneyChange,
  fansChange,
  playerUpdates,
  matchStats,
}: ResourceUpdateModalProps) {
  const [animatedMoney, setAnimatedMoney] = useState(0)
  const [animatedFans, setAnimatedFans] = useState(0)
  const { t } = useLanguage()

  useEffect(() => {
    if (isOpen) {
      const moneyDuration = 2000
      const fansDuration = 2000
      const moneyInterval = 20
      const fansInterval = 20

      const moneyStep = moneyChange / (moneyDuration / moneyInterval)
      const fansStep = fansChange / (fansDuration / fansInterval)

      let currentMoney = 0
      let currentFans = 0

      const moneyTimer = setInterval(() => {
        currentMoney += moneyStep
        setAnimatedMoney(Math.round(currentMoney))
        if (Math.abs(currentMoney) >= Math.abs(moneyChange)) {
          clearInterval(moneyTimer)
          setAnimatedMoney(moneyChange)
        }
      }, moneyInterval)

      const fansTimer = setInterval(() => {
        currentFans += fansStep
        setAnimatedFans(Math.round(currentFans))
        if (Math.abs(currentFans) >= Math.abs(fansChange)) {
          clearInterval(fansTimer)
          setAnimatedFans(fansChange)
        }
      }, fansInterval)

      return () => {
        clearInterval(moneyTimer)
        clearInterval(fansTimer)
      }
    }
  }, [isOpen, moneyChange, fansChange])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-lg mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl sm:text-2xl font-bold">{t("roundSummary")}</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg">{t("money")}:</span>
                <motion.span
                  key={animatedMoney}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-xl font-bold ${moneyChange >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {moneyChange >= 0 ? <TrendingUp className="inline mr-1" /> : <TrendingDown className="inline mr-1" />}
                  R$ {animatedMoney.toLocaleString()}
                </motion.span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg">{t("fans")}:</span>
                <motion.span
                  key={animatedFans}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-xl font-bold ${fansChange >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {fansChange >= 0 ? <TrendingUp className="inline mr-1" /> : <TrendingDown className="inline mr-1" />}
                  {animatedFans.toLocaleString()}
                </motion.span>
              </div>
            </div>
            {matchStats && (
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-2">{t("matchDetails")}</h3>
                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">{matchStats.homeTeam || t("home")}</span>
                    <span className="text-2xl font-bold">
                      {matchStats.homeScore || 0} - {matchStats.awayScore || 0}
                    </span>
                    <span className="font-semibold">{matchStats.awayTeam || t("away")}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-1">{t("scorers")}:</h4>
                      <ul className="list-disc list-inside">
                        {matchStats.homeScorers?.map((scorer, index) => (
                          <li key={index}>{scorer}</li>
                        ))}
                      </ul>
                      <h4 className="font-semibold mb-1 mt-2">{t("cards")}:</h4>
                      <ul className="list-disc list-inside">
                        {matchStats.homeYellowCards?.map((player, index) => (
                          <li key={`yellow-${index}`} className="text-yellow-500">
                            {player} ({t("yellowCards")})
                          </li>
                        ))}
                        {matchStats.homeRedCards?.map((player, index) => (
                          <li key={`red-${index}`} className="text-red-500">
                            {player} ({t("redCards")})
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{t("scorers")}:</h4>
                      <ul className="list-disc list-inside">
                        {matchStats.awayScorers?.map((scorer, index) => (
                          <li key={index}>{scorer}</li>
                        ))}
                      </ul>
                      <h4 className="font-semibold mb-1 mt-2">{t("cards")}:</h4>
                      <ul className="list-disc list-inside">
                        {matchStats.awayYellowCards?.map((player, index) => (
                          <li key={`yellow-${index}`} className="text-yellow-500">
                            {player} ({t("yellowCards")})
                          </li>
                        ))}
                        {matchStats.awayRedCards?.map((player, index) => (
                          <li key={`red-${index}`} className="text-red-500">
                            {player} ({t("redCards")})
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <h3 className="text-xl font-bold mb-2">{t("playerHighlights")}</h3>
            <div className="space-y-2">
              {playerUpdates.map((player, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between bg-gray-100 p-2 rounded"
                >
                  <span>{player.name}</span>
                  <div className="flex items-center space-x-2">
                    {player.goals > 0 && (
                      <span className="flex items-center text-green-600">
                        <Goal className="w-4 h-4 mr-1" />
                        {player.goals}
                      </span>
                    )}
                    {player.yellowCards > 0 && (
                      <span className="flex items-center text-yellow-500">
                        <CreditCard className="w-4 h-4 mr-1" />
                        {player.yellowCards}
                      </span>
                    )}
                    {player.redCards > 0 && (
                      <span className="flex items-center text-red-500">
                        <CreditCard className="w-4 h-4 mr-1" fill="currentColor" />
                        {player.redCards}
                      </span>
                    )}
                    {player.isSuspended && (
                      <span className="flex items-center text-orange-500">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        {t("suspended")}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

