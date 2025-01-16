import { useState } from 'react'
import { useGame } from '../contexts/GameContext'
import { useLanguage } from '../contexts/LanguageContext'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { CreditCard } from 'lucide-react'

export function TeamSelection() {
  const { players, updatePlayer, selectedTeam } = useGame()
  const { t } = useLanguage()
  const teamPlayers = players.filter(player => player.teamId === selectedTeam?.id)
  const [selectedPlayer, setSelectedPlayer] = useState<any | null>(null)

  const handleStarterChange = (player: any) => {
    const updatedPlayer = { ...player, isStarter: !player.isStarter }
    updatePlayer(updatedPlayer)
  }

  return (
    <Card className="mt-8 bg-white bg-opacity-90 backdrop-blur-md shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-green-800">{t('teamSelection')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('name')}</TableHead>
              <TableHead>{t('position')}</TableHead>
              <TableHead>{t('status')}</TableHead>
              <TableHead>{t('action')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamPlayers.map((player) => (
              <TableRow key={player.id}>
                <TableCell>{player.name}</TableCell>
                <TableCell>{t(player.position.toLowerCase())}</TableCell>
                <TableCell>
                  <Badge variant={player.isStarter ? "default" : "secondary"}>
                    {player.isStarter ? t('starter') : t('reserve')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button onClick={() => setSelectedPlayer(player)}>{t('details')}</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{player.name}</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p><strong>{t('position')}:</strong> {t(player.position.toLowerCase())}</p>
                            <p><strong>{t('attack')}:</strong> {player.attack}</p>
                            <p><strong>{t('defense')}:</strong> {player.defense}</p>
                          </div>
                          <div>
                            <p><strong>{t('goals')}:</strong> {player.goals}</p>
                            <p><strong>{t('yellowCards')}:</strong> {player.yellowCards}</p>
                            <p><strong>{t('redCards')}:</strong> {player.redCards}</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <p><strong>{t('cardHistory')}:</strong></p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {player.cardsHistory && player.cardsHistory.map((card, index) => (
                              <CreditCard 
                                key={index} 
                                className={`w-6 h-6 ${card === 'yellow' ? 'text-yellow-500' : 'text-red-500'}`} 
                                fill="currentColor"
                              />
                            ))}
                          </div>
                        </div>
                        {player.isSuspended && (
                          <Badge variant="destructive" className="mt-4">
                            {t('suspended')}
                          </Badge>
                        )}
                      </DialogContent>
                    </Dialog>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`starter-${player.id}`}
                        checked={player.isStarter}
                        onCheckedChange={() => handleStarterChange(player)}
                      />
                      <Label htmlFor={`starter-${player.id}`}>
                        {player.isStarter ? t('starter') : t('reserve')}
                      </Label>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

