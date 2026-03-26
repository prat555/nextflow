import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { WorkflowShowcase } from "@/components/workflow-showcase"
import { ModelShowcase } from "@/components/model-showcase"
import { LogoMarquee } from "@/components/logo-marquee"
import { UseCases } from "@/components/use-cases"
import { Pricing } from "@/components/pricing"
import { SimpleUISection } from "@/components/simple-ui-section"
import { FinalCTA } from "@/components/final-cta"
import { Footer } from "@/components/footer"
import { AuthOverlay } from "@/components/auth-overlay"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function Home() {
  const { userId } = await auth()

  if (userId) {
    redirect("/dashboard")
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <AuthOverlay />
      <Hero />
      <WorkflowShowcase />
      <ModelShowcase />
      <LogoMarquee />
      <UseCases />
      <Pricing />
      <SimpleUISection />
      <FinalCTA />
      <Footer />
    </main>
  )
}
