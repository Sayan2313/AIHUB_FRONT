import { AppShell } from "@/components/AppShell"
import { ModelsSection } from "@/components/ModelsSection"
import { RobotShowcase } from "@/components/RobotShowcase"

export default function Home() {
  return (
    <AppShell>
      <RobotShowcase />
      <ModelsSection />
    </AppShell>
  )
}
