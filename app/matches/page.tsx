'use client'

import { useGame } from '../contexts/GameContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from 'lucide-react'

export default function MatchesPage() {
  const { selectedTeam, selectedSponsor, allTeams, matches, currentRound } = useGame()
  const router = useRouter()

  useEffect(() => {
    if (!selectedTeam || !selectedSponsor) {
      router.push('/')
    }
  }, [selectedTeam, selectedSponsor, router])

  if (!selectedTeam || !selectedSponsor) {
    return null
  }

  const rounds = Array.from({ length: 38 }, (_, i) => i + 1)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">Todas as Partidas</h1>
        {rounds.map(round => (
          <div key={round} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">Rodada {round}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {matches
                .filter(match => Math.floor((match.id - 1) / 10) + 1 === round)
                .map(match => {
                  const homeTeam = allTeams.find(team => team.id === match.homeTeam)
                  const awayTeam = allTeams.find(team => team.id === match.awayTeam)
                  return (
                    <Card key={match.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center space-y-2">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center space-x-2">
                              <div className="relative w-8 h-8">
                                <Image
                                  src={homeTeam?.logo || '/placeholder.svg'}
                                  alt={homeTeam?.name || 'Home Team'}
                                  layout="fill"
                                  objectFit="contain"
                                />
                              </div>
                              <span className="font-semibold">{homeTeam?.name}</span>
                            </div>
                            <Badge variant={match.played ? "secondary" : "outline"}>
                              {match.played ? match.homeScore : '-'}
                            </Badge>
                          </div>
                          <div className="w-full border-t border-gray-200 my-2"></div>
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center space-x-2">
                              <div className="relative w-8 h-8">
                                <Image
                                  src={awayTeam?.logo || '/placeholder.svg'}
                                  alt={awayTeam?.name || 'Away Team'}
                                  layout="fill"
                                  objectFit="contain"
                                />
                              </div>
                              <span className="font-semibold">{awayTeam?.name}</span>
                            </div>
                            <Badge variant={match.played ? "secondary" : "outline"}>
                              {match.played ? match.awayScore : '-'}
                            </Badge>
                          </div>
                          {!match.played && round === currentRound && (
                            <div className="w-full text-center mt-2">
                              <Badge variant="outline" className="animate-pulse">
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Aguardando
                              </Badge>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
            </div>
          </div>
        ))}
        <div className="mt-6 text-center">
          <Link href="/dashboard" className="text-white hover:underline">
            Voltar para o Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

