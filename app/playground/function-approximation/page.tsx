import { FunctionApproximationPlayground } from "@/components/FunctionApproximationPlayground"
import { Navbar } from "@/components/Navbar"

export default function FunctionApproximationPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <FunctionApproximationPlayground />
    </main>
  )
}
