import { useState } from 'react'
import { useGame } from '../contexts/GameContext'
import { useLanguage } from '../contexts/LanguageContext'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Player } from '../data/playerData'

const samplePlayers: Player[] = [
  { id: 1, name: "Carlos Silva", position: "Atacante", attack: 85, defense: 40, goals: 12, price: 5000000, yellowCards: 0, redCards: 0, isStarter: false, teamId: 0 },
  { id: 2, name: "Pedro Santos", position: "Meio-Campo", attack: 75, defense: 70, goals: 5, price: 4000000, yellowCards: 0, redCards: 0, isStarter: false, teamId: 0 },
  { id: 3, name: "Lucas Oliveira", position: "Zagueiro", attack: 50, defense: 88, goals: 1, price: 3500000, yellowCards: 0, redCards: 0, isStarter: false, teamId: 0 },
  // Add more sample players as needed
]

export function PlayerMarket() {
  const { buyPlayer } = useGame()
  const { t } = useLanguage()
  const { toast } = useToast()
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)

  const handleBuyPlayer = (player: Player) => {
    if (buyPlayer(player)) {
      toast({
        title: t('playerBought'),
        description: t('playerBoughtDescription', { playerName: player.name }),
      })
    } else {
      toast({
        title: t('insufficientFunds'),
        description: t('insufficientFundsDescription'),
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="mt-8 bg-white bg-opacity-90 backdrop-blur-md shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-green-800">{t('playerMarket')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('name')}</TableHead>
              <TableHead>{t('position')}</TableHead>
              <TableHead>{t('goals')}</TableHead>
              <TableHead>{t('price')}</TableHead>
              <TableHead>{t('action')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {samplePlayers.map((player) => (
              <TableRow key={player.id}>
                <TableCell>{player.name}</TableCell>
                <TableCell>{t(player.position.toLowerCase())}</TableCell>
                <TableCell>{player.goals}</TableCell>
                <TableCell>R$ {player.price.toLocaleString()}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button onClick={() => setSelectedPlayer(player)}>{t('viewDetails')}</Button>
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
                          <p><strong>{t('price')}:</strong> R$ {player.price.toLocaleString()}</p>
                        </div>
                      </div>
                      <Button className="mt-4 w-full" onClick={() => handleBuyPlayer(player)}>{t('buyPlayer')}</Button>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

