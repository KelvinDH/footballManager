'use client'

import { useLanguage } from '../contexts/LanguageContext'
import { Button } from "@/components/ui/button"
import { Globe } from 'lucide-react'

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === 'pt' ? 'en' : 'pt')
  }

  return (
    <Button
      onClick={toggleLanguage}
      className="bg-white text-green-800 hover:bg-green-100 rounded-full w-14 h-14 p-0 flex items-center justify-center"
    >
      <Globe className="w-4 h-4 mr-1" />
      <span className="text-xs font-bold">{language.toUpperCase()}</span>
    </Button>
  )
}

