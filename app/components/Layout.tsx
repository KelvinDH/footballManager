import { LanguageSelector } from './LanguageSelector'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500">
      <div className="absolute top-4 right-4 z-50">
        <LanguageSelector />
      </div>
      {children}
    </div>
  )
}

