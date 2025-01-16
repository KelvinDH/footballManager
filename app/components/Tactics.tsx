import { useGame } from '../contexts/GameContext'
import { useLanguage } from '../contexts/LanguageContext'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

const tactics = [
  { id: '4-3-3', name: '4-3-3', description: 'offensive' },
  { id: '4-4-2', name: '4-4-2', description: 'classic' },
  { id: '3-5-2', name: '3-5-2', description: 'midfield' },
  { id: '5-3-2', name: '5-3-2', description: 'defensive' },
  { id: '4-2-3-1', name: '4-2-3-1', description: 'modern' },
]

export function Tactics() {
  const { selectedTactic, setSelectedTactic } = useGame()
  const { t } = useLanguage()
  const { toast } = useToast()

  const handleApplyTactic = () => {
    setSelectedTactic(selectedTactic)
    toast({
      title: t('tacticApplied'),
      description: t('tacticAppliedDescription', { tactic: selectedTactic }),
    })
  }

  return (
    <Card className="mt-8 bg-white bg-opacity-90 backdrop-blur-md shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-green-800">{t('tactics')}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedTactic} onValueChange={setSelectedTactic}>
          {tactics.map((tactic) => (
            <div key={tactic.id} className="flex items-center space-x-2 mb-4">
              <RadioGroupItem value={tactic.id} id={tactic.id} />
              <Label htmlFor={tactic.id} className="font-medium">
                {tactic.name}
                <p className="text-sm text-gray-500">{t(`tactics.${tactic.description}`)}</p>
              </Label>
            </div>
          ))}
        </RadioGroup>
        <Button className="mt-4 w-full" onClick={handleApplyTactic}>{t('applyTactic')}</Button>
      </CardContent>
    </Card>
  )
}

