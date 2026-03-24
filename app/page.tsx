import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { WorkflowShowcase } from "@/components/workflow-showcase"
import { ModelShowcase } from "@/components/model-showcase"
import { LogoMarquee } from "@/components/logo-marquee"
import { UseCases } from "@/components/use-cases"
import { Pricing } from "@/components/pricing"
import { FinalCTA } from "@/components/final-cta"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <WorkflowShowcase />
      <ModelShowcase />
      <LogoMarquee />
      <UseCases />
      <Pricing />
      <FinalCTA />
      <Footer />
    </main>
  )
}
