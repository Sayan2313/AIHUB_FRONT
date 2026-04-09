import { ModelsSection } from "@/components/ModelsSection"
import { Navbar } from "@/components/Navbar"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <ModelsSection />
    </main>
  )
}
