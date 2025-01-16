'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGame } from '../contexts/GameContext'
import { useLanguage } from '../contexts/LanguageContext'
import { UserForm } from '../components/UserForm'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Layout } from '../components/Layout'

export default function LoginPage() {
  const [error, setError] = useState('')
  const { loginUser, user } = useGame()
  const { t } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      console.log("Usuário já está logado, redirecionando para o menu principal");
      router.push('/main-menu');
    }
  }, [user, router]);

  const handleSubmit = async (userData: { username: string, password: string }) => {
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')
    const user = existingUsers.find((u: any) => u.username === userData.username)

    if (!user) {
      setError(t('userNotFound'))
      return
    }

    if (user.password !== userData.password) {
      setError(t('incorrectCredentials'))
      return
    }

    console.log("Credenciais válidas, tentando fazer login");
    const gameLoaded = await loginUser(userData.username)
    if (gameLoaded) {
      console.log("Jogo carregado, redirecionando para o menu principal");
      router.push('/main-menu')
    } else {
      console.log("Nenhum jogo salvo, redirecionando para a seleção de time");
      router.push('/team-selection')
    }
  }

  if (user) return null;

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">{t('login')}</CardTitle>
          </CardHeader>
          <CardContent>
            <UserForm onSubmit={handleSubmit} error={error} isRegister={false} />
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

