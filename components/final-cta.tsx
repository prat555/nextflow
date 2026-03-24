import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function FinalCTA() {
  return (
    <section className="py-32 px-4 bg-white relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent pointer-events-none" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 text-balance">
          Start creating with AI today
        </h2>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto text-pretty">
          Join over 30 million creatives using Krea to generate stunning images, videos, and 3D content.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            size="lg" 
            className="bg-gray-900 text-white hover:bg-gray-800 px-8 py-6 text-lg rounded-full"
          >
            Sign up for free
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-gray-300 text-gray-900 hover:bg-gray-100 px-8 py-6 text-lg rounded-full"
          >
            Contact Sales
          </Button>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          No credit card required. 100 free credits daily.
        </p>
      </div>
    </section>
  )
}
