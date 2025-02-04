"use client"

import { useGame } from "../contexts/GameContext"
import { useLanguage } from "../contexts/LanguageContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Loader2, Trophy, Users, DollarSign, Calendar, ArrowRight, Save, LogOut, Menu } from "lucide-react"
import { ResultModal } from "../components/ResultModal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ResourceUpdateModal } from "../components/ResourceUpdateModal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { Layout } from "../components/Layout"

interface MatchStats {
  homeTeam: string
  awayTeam: string
  homeScore: number
  awayScore: number
  homeScorers: string[]
  awayScorers: string[]
  homeYellowCards: string[]
  awayYellowCards: string[]
  homeRedCards: string[]
  awayRedCards: string[]
}

export default function DashboardPage() {
  const {
    selectedTeam,
    selectedSponsor,
    allTeams,
    matches,
    currentRound,
    startNewSeason,
    playNextRound,
    playMatch,
    isCurrentRoundComplete,
    saveGame,
    logoutUser,
    players,
  } = useGame()
  const { t } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  const [isPlaying, setIsPlaying] = useState(false)
  const [playedMatches, setPlayedMatches] = useState<number[]>([])
  const [matchResult, setMatchResult] = useState<"win" | "draw" | "loss" | null>(null)
  const [currentTeamMatch, setCurrentTeamMatch] = useState<any | null>(null)
  const [updatedTeam, setUpdatedTeam] = useState(selectedTeam)
  const [showResourceModal, setShowResourceModal] = useState(false)
  const [moneyChange, setMoneyChange] = useState(0)
  const [fansChange, setFansChange] = useState(0)
  const [playerUpdates, setPlayerUpdates] = useState<
    Array<{ name: string; goals: number; yellowCards: number; redCards: number; isSuspended: boolean }>
  >([])
  const [matchStats, setMatchStats] = useState<MatchStats | null>(null)

  useEffect(() => {
    if (!selectedTeam || !selectedSponsor) {
      router.push("/")
    }
  }, [selectedTeam, selectedSponsor, router])

  useEffect(() => {
    setPlayedMatches(matches.filter((match) => match.played).map((match) => match.id))
  }, [matches])

  useEffect(() => {
    if (matches.length === 0) {
      startNewSeason()
    } else {
      setPlayedMatches(matches.filter((match) => match.played).map((match) => match.id))
    }
  }, [matches, startNewSeason])

  useEffect(() => {
    if (selectedTeam) {
      const updatedSelectedTeam = allTeams.find((team) => team.id === selectedTeam.id)
      if (updatedSelectedTeam) {
        setUpdatedTeam(updatedSelectedTeam)
      }
    }
  }, [allTeams, selectedTeam])

  useEffect(() => {
    console.log(`Current round updated to ${currentRound}`)
    setPlayedMatches([])
  }, [currentRound])

  const handlePlayClick = async () => {
    setIsPlaying(true)
    let totalMoneyChange = 0
    let totalFansChange = 0
    let roundPlayerUpdates: Array<{
      name: string
      goals: number
      yellowCards: number
      redCards: number
      isSuspended: boolean
    }> = []
    let currentMatchStats: MatchStats | null = null
    try {
      console.log("Starting handlePlayClick")
      const currentRoundMatches = matches.filter((match) => Math.floor((match.id - 1) / 10) + 1 === currentRound)
      console.log("Current round matches:", currentRoundMatches)

      for (const match of currentRoundMatches) {
        if (!match.played) {
          console.log(`Playing match ${match.id}`)
          await new Promise((resolve) => setTimeout(resolve, 1000))
          try {
            const updatedMatch = await playMatch(match.id)
            console.log("Updated match:", updatedMatch)

            if (updatedMatch) {
              setPlayedMatches((prev) => [...prev, updatedMatch.id])

              if (updatedMatch.homeTeam === selectedTeam?.id || updatedMatch.awayTeam === selectedTeam?.id) {
                setCurrentTeamMatch(updatedMatch)
                const isHomeTeam = updatedMatch.homeTeam === selectedTeam?.id
                const teamScore = isHomeTeam ? updatedMatch.homeScore : updatedMatch.awayScore
                const opponentScore = isHomeTeam ? updatedMatch.awayScore : updatedMatch.homeScore

                if (teamScore !== undefined && opponentScore !== undefined) {
                  if (teamScore > opponentScore) {
                    totalMoneyChange += Math.floor(updatedTeam!.money * 0.05)
                    totalFansChange += Math.floor(updatedTeam!.fans * 0.02)
                    setMatchResult("win")
                  } else if (teamScore === opponentScore) {
                    totalMoneyChange += Math.floor(updatedTeam!.money * 0.01)
                    totalFansChange += Math.floor(updatedTeam!.fans * 0.005)
                    setMatchResult("draw")
                  } else {
                    totalMoneyChange -= Math.floor(updatedTeam!.money * 0.01)
                    totalFansChange -= Math.floor(updatedTeam!.fans * 0.005)
                    setMatchResult("loss")
                  }
                }

                // Atualizar matchStats
                const homeTeam = allTeams.find((team) => team.id === updatedMatch.homeTeam)
                const awayTeam = allTeams.find((team) => team.id === updatedMatch.awayTeam)
                currentMatchStats = {
                  homeTeam: homeTeam?.name || t("home"),
                  awayTeam: awayTeam?.name || t("away"),
                  homeScore: updatedMatch.homeScore || 0,
                  awayScore: updatedMatch.awayScore || 0,
                  homeScorers: updatedMatch.homeTeamStats?.scorers.map((player) => player.name) || [],
                  awayScorers: updatedMatch.awayTeamStats?.scorers.map((player) => player.name) || [],
                  homeYellowCards: updatedMatch.homeTeamStats?.yellowCards.map((player) => player.name) || [],
                  awayYellowCards: updatedMatch.awayTeamStats?.yellowCards.map((player) => player.name) || [],
                  homeRedCards: updatedMatch.homeTeamStats?.redCards.map((player) => player.name) || [],
                  awayRedCards: updatedMatch.awayTeamStats?.redCards.map((player) => player.name) || [],
                }

                // Collect player updates
                const teamPlayers = players.filter((p) => p.teamId === selectedTeam.id)
                roundPlayerUpdates = teamPlayers
                  .filter((p) => p.goals > 0 || p.yellowCards > 0 || p.redCards > 0 || p.isSuspended)
                  .map((p) => ({
                    name: p.name,
                    goals: p.goals,
                    yellowCards: p.yellowCards,
                    redCards: p.redCards,
                    isSuspended: p.isSuspended,
                  }))
              }
            } else {
              console.error(`Failed to update match ${match.id}`)
            }
          } catch (matchError) {
            console.error(`Error playing match ${match.id}:`, matchError)
          }
        }
      }
    } catch (error) {
      console.error("Error playing matches:", error)
      toast({
        title: t("errorPlayingMatches"),
        description: t("errorPlayingMatchesDescription"),
        variant: "destructive",
      })
    } finally {
      setIsPlaying(false)
      setMoneyChange(totalMoneyChange)
      setFansChange(totalFansChange)
      setPlayerUpdates(roundPlayerUpdates)
      setMatchStats(currentMatchStats)
      setShowResourceModal(true)
      console.log("Final match stats:", currentMatchStats)
      console.log("Final player updates:", roundPlayerUpdates)
    }
  }

  const handleSaveGame = () => {
    saveGame()
    toast({
      title: t("gameSaved"),
      description: t("gameSavedDescription"),
    })
  }

  const handleLogout = () => {
    logoutUser()
    router.push("/")
  }

  if (!selectedTeam || !selectedSponsor) {
    return null
  }

  const sortedTeams = [...allTeams].sort(
    (a, b) => b.points - a.points || b.goalsFor - b.goalsAgainst - (a.goalsFor - a.goalsAgainst),
  )

  const currentRoundMatches = matches.filter((match) => Math.floor((match.id - 1) / 10) + 1 === currentRound)

  const MobileLeagueTable = ({ teams }: { teams: any[] }) => (
    <div className="space-y-2">
      {teams.map((team, index) => (
        <div key={team.id} className={`p-2 rounded-lg ${team.id === selectedTeam?.id ? "bg-yellow-100" : "bg-white"}`}>
          <div className="flex justify-between items-center">
            <span className="font-medium">
              {index + 1}. {team.name}
            </span>
            <span className="font-bold">{team.points} pts</span>
          </div>
          <div className="text-sm text-gray-600 flex justify-between mt-1">
            <span>J: {team.wins + team.draws + team.losses}</span>
            <span>V: {team.wins}</span>
            <span>E: {team.draws}</span>
            <span>D: {team.losses}</span>
            <span>SG: {team.goalsFor - team.goalsAgainst}</span>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <Layout>
      <div className="min-h-screen bg-[url('/stadium-background.jpg')] bg-cover bg-center bg-fixed">
        <div className="min-h-screen bg-black bg-opacity-70">
          <nav className="bg-green-800 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16 sm:h-20">
                <div className="flex items-center space-x-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="bg-white p-2 rounded-full cursor-pointer transition-transform hover:scale-110">
                        <Avatar className="h-8 w-8 sm:h-12 sm:w-12">
                          <AvatarImage src={updatedTeam.logo} alt={updatedTeam.name} />
                          <AvatarFallback>{updatedTeam.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={handleSaveGame} className="hover:bg-green-100">
                        <Save className="mr-2 h-4 w-4" />
                        <span>{t("save")}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout} className="hover:bg-red-100">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>{t("logout")}</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <div className="hidden sm:block">
                    <p className="font-bold text-white text-sm sm:text-lg">{updatedTeam.name}</p>
                    <div className="flex items-center space-x-3">
                      <p className="text-xs sm:text-sm text-green-200">
                        <Users className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                        {updatedTeam.fans.toLocaleString()}
                      </p>
                      <p className="text-xs sm:text-sm text-green-200">
                        <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                        {updatedTeam.money.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="h-8 w-0.5 bg-green-600 mx-2 sm:mx-4 hidden sm:block"></div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <div className="bg-white p-1 sm:p-2 rounded-lg">
                    <Image
                      src={selectedSponsor.logo || "/placeholder.svg"}
                      alt={selectedSponsor.name}
                      width={40}
                      height={20}
                      className="object-contain"
                    />
                  </div>
                  <div className="hidden sm:block">
                    <p className="font-semibold text-white text-sm">{selectedSponsor.name}</p>
                    <p className="text-xs text-green-200">
                      <DollarSign className="w-3 h-3 inline mr-1" />
                      {selectedSponsor.value.toLocaleString()}
                    </p>
                  </div>
                </div>
                <Link href="/main-menu" className="text-white hover:text-green-200 transition-colors duration-300">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="sr-only">{t("mainMenu")}</span>
                  </Button>
                </Link>
              </div>
            </div>
          </nav>

          <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
            <div className="bg-white bg-opacity-90 rounded-lg shadow-xl p-4 sm:p-6 mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-center text-green-800 mb-4 flex items-center justify-center">
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 mr-2 text-green-600"
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
                {t("title")}
              </h1>
              <p className="text-center text-gray-600 text-sm sm:text-base mb-6 sm:mb-8">{t("subtitle")}</p>
              <div className="space-y-6 sm:space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg sm:text-xl">
                      <Trophy className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-yellow-500" />
                      {t("leagueTable")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="hidden sm:block overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">{t("position")}</TableHead>
                            <TableHead>{t("team")}</TableHead>
                            <TableHead className="text-right">{t("points")}</TableHead>
                            <TableHead className="text-right">{t("played")}</TableHead>
                            <TableHead className="text-right">{t("wins")}</TableHead>
                            <TableHead className="text-right">{t("draws")}</TableHead>
                            <TableHead className="text-right">{t("losses")}</TableHead>
                            <TableHead className="text-right">{t("goalDifference")}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sortedTeams.map((team, index) => (
                            <TableRow key={team.id} className={team.id === selectedTeam.id ? "bg-yellow-100" : ""}>
                              <TableCell className="font-medium">{index + 1}</TableCell>
                              <TableCell>{team.name}</TableCell>
                              <TableCell className="text-right">{team.points}</TableCell>
                              <TableCell className="text-right">{team.wins + team.draws + team.losses}</TableCell>
                              <TableCell className="text-right">{team.wins}</TableCell>
                              <TableCell className="text-right">{team.draws}</TableCell>
                              <TableCell className="text-right">{team.losses}</TableCell>
                              <TableCell className="text-right">{team.goalsFor - team.goalsAgainst}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="sm:hidden">
                      <MobileLeagueTable teams={sortedTeams} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg sm:text-xl">
                      <Calendar className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-500" />
                      {t("round")} {currentRound}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
                      {currentRoundMatches.map((match) => {
                        const homeTeam = allTeams.find((team) => team.id === match.homeTeam)
                        const awayTeam = allTeams.find((team) => team.id === match.awayTeam)
                        const isMatchPlayed = playedMatches.includes(match.id)
                        return (
                          <Card
                            key={match.id}
                            className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                          >
                            <CardContent className="p-3 sm:p-4">
                              <div className="flex flex-col items-center space-y-2">
                                <div className="flex items-center justify-between w-full">
                                  <div className="flex items-center space-x-2">
                                    <div className="relative w-6 h-6 sm:w-8 sm:h-8">
                                      <Image
                                        src={homeTeam?.logo || "/placeholder.svg"}
                                        alt={homeTeam?.name || t("home")}
                                        layout="fill"
                                        objectFit="contain"
                                      />
                                    </div>
                                    <span className="font-semibold text-xs sm:text-sm">{homeTeam?.name}</span>
                                  </div>
                                  <Badge
                                    variant={isMatchPlayed ? "secondary" : "outline"}
                                    className="text-xs sm:text-sm"
                                  >
                                    {isMatchPlayed && match.homeScore !== undefined ? match.homeScore : "-"}
                                  </Badge>
                                </div>
                                <div className="w-full border-t border-gray-200 my-1 sm:my-2"></div>
                                <div className="flex items-center justify-between w-full">
                                  <div className="flex items-center space-x-2">
                                    <div className="relative w-6 h-6 sm:w-8 sm:h-8">
                                      <Image
                                        src={awayTeam?.logo || "/placeholder.svg"}
                                        alt={awayTeam?.name || t("away")}
                                        layout="fill"
                                        objectFit="contain"
                                      />
                                    </div>
                                    <span className="font-semibold text-xs sm:text-sm">{awayTeam?.name}</span>
                                  </div>
                                  <Badge
                                    variant={isMatchPlayed ? "secondary" : "outline"}
                                    className="text-xs sm:text-sm"
                                  >
                                    {isMatchPlayed && match.awayScore !== undefined ? match.awayScore : "-"}
                                  </Badge>
                                </div>
                                {!isMatchPlayed && (
                                  <div className="w-full text-center mt-2">
                                    <Badge variant="outline" className="animate-pulse text-xs sm:text-sm">
                                      <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin" />
                                      {t("waiting")}
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                    {currentRound <= 38 && (
                      <div className="mt-4 sm:mt-6 flex justify-between">
                        <Button
                          onClick={handlePlayClick}
                          disabled={isPlaying || isCurrentRoundComplete()}
                          className="bg-blue-500 hover:bg-blue-700 transition-colors duration-300 text-xs sm:text-sm"
                        >
                          {isPlaying ? t("playing") : t("play")}
                        </Button>
                        <Button
                          onClick={() => {
                            console.log("Próxima Rodada clicked")
                            playNextRound()
                            setPlayedMatches([])
                          }}
                          disabled={!isCurrentRoundComplete() || currentRound >= 38}
                          className="bg-green-500 hover:bg-green-700 transition-colors duration-300 text-xs sm:text-sm"
                        >
                          {t("nextRound")}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="text-center">
                  <Link
                    href="/matches"
                    className="text-white hover:underline flex items-center justify-center text-sm sm:text-base"
                  >
                    {t("viewAllMatches")}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </main>
          <ResultModal
            result={matchResult}
            onClose={() => {
              setMatchResult(null)
              setCurrentTeamMatch(null)
            }}
          />
          <ResourceUpdateModal
            isOpen={showResourceModal}
            onClose={() => setShowResourceModal(false)}
            moneyChange={moneyChange}
            fansChange={fansChange}
            playerUpdates={playerUpdates}
            matchStats={matchStats}
          />
        </div>
      </div>
    </Layout>
  )
}

