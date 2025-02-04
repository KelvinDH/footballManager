import { LanguageSelector } from "./LanguageSelector"

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative bg-[url('/stadium-background.jpg')] bg-cover bg-center bg-fixed">
      <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-500 opacity-80"></div>
      <div className="relative z-10 min-h-screen">
        <div className="absolute top-4 right-4 z-50">
          <LanguageSelector />
        </div>
        {children}
      </div>
    </div>
  )
}

