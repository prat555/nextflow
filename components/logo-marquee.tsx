"use client"

import { Button } from "@/components/ui/button"

const companies = [
  { name: "Lego" },
  { name: "Samsung" },
  { name: "Nike" },
  { name: "Microsoft" },
  { name: "Shopify" },
]

export function LogoMarquee() {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <p className="text-lg font-bold text-gray-500 mb-2 text-left">
          A tool suite for pros and beginners alike
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-12 text-left">
          Krea powers millions of creatives, enterprises, and everyday people.
        </h2>

        {/* Logo scroll */}
        <div className="relative overflow-hidden mb-12">
          <div className="flex animate-marquee gap-16 items-center justify-center">
            {[...companies, ...companies].map((company, index) => (
              <div
                key={index}
                className="text-lg font-bold text-gray-500 whitespace-nowrap"
              >
                {company.name}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="sm"
            className="bg-white text-black hover:bg-gray-50 px-6 rounded-none border-0 shadow-none"
          >
            Sign up for free
          </Button>
          <Button
            size="sm"
            className="bg-black text-white hover:bg-gray-900 px-6 rounded-md"
          >
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  )
}
