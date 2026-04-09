import { Navbar } from "@/components/Navbar"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      {children}
    </main>
  )
}
