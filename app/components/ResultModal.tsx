import { useEffect, useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { X } from 'lucide-react'

interface ResultModalProps {
  result: 'win' | 'draw' | 'loss' | null
  onClose: () => void
}

export function ResultModal({ result, onClose }: ResultModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    if (result) {
      setIsVisible(true)
    }
  }, [result])

  if (!isVisible) return null

  let message = ''
  let bgColor = ''

  switch (result) {
    case 'win':
      message = t('congratulations')
      bgColor = 'bg-green-500'
      break
    case 'draw':
      message = t('draw')
      bgColor = 'bg-yellow-500'
      break
    case 'loss':
      message = t('loss')
      bgColor = 'bg-red-500'
      break
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className={`${bgColor} p-6 rounded-lg shadow-lg max-w-sm w-full mx-4`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">{t('matchResult')}</h2>
          <button
            onClick={() => {
              setIsVisible(false)
              onClose()
            }}
            className="text-white hover:text-gray-200"
            aria-label={t('close')}
          >
            <X size={24} />
          </button>
        </div>
        <p className="text-white text-lg">{message}</p>
      </div>
    </div>
  )
}

