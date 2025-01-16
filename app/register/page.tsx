'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGame } from '../contexts/GameContext'
import { useLanguage } from '../contexts/LanguageContext'
import { UserForm } from '../components/UserForm'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Layout } from '../components/Layout'

export default function RegisterPage() {
  const [error, setError] = useState('')
  const { registerUser } = useGame()
  const { t } = useLanguage()
  const router = useRouter()

  const handleSubmit = async (userData: {
    username: string,
    fullName: string,
    email: string,
    password: string
  }) => {
    // Check if username already exists
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')
    if (existingUsers.some((user: any) => user.username === userData.username)) {
      setError(t('usernameExists'))
      return
    }

    // Register new user
    existingUsers.push(userData)
    localStorage.setItem('users', JSON.stringify(existingUsers))
    await registerUser(userData.username)
    router.push('/team-selection')
  }

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">{t('register')}</CardTitle>
          </CardHeader>
          <CardContent>
            <UserForm onSubmit={handleSubmit} error={error} isRegister />
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

