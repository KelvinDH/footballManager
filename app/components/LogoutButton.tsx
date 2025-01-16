'use client'

import { useGame } from '../contexts/GameContext'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"

export function LogoutButton() {
  const { user, registerUser } = useGame()
  const router = useRouter()

  if (!user) return null

  const handleLogout = () => {
    localStorage.clear()
    registerUser('')
    router.push('/register')
  }

  return (
    <Button 
      onClick={handleLogout}
      className="fixed top-4 right-4 z-50"
      variant="outline"
    >
      Sair
    </Button>
  )
}

