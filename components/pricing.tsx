"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Free",
    description: "Get free daily credits to try basic features.",
    price: { monthly: 0, yearly: 0 },
    features: [
      "100 compute units / day",
      "No credit card required",
      "Full access to real-time models",
      "Limited access to image, video, 3D models",
      "Limited access to image upscaling",
    ],
    cta: "Start for Free",
    popular: false,
  },
  {
    name: "Basic",
    description: "Access our most popular features",
    price: { monthly: 12, yearly: 10 },
    features: [
      "3,000 compute units / month",
      "Full access to all generation models",
      "Full access to upscaling (up to 4K)",
      "Priority queue access",
      "LoRA training (2 per month)",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    description: "For power users and professionals",
    price: { monthly: 36, yearly: 30 },
    features: [
      "10,000 compute units / month",
      "Everything in Basic",
      "Full access to upscaling (up to 22K)",
      "Unlimited LoRA training",
      "API access",
      "Priority support",
    ],
    cta: "Get Pro",
    popular: false,
  },
  {
    name: "Enterprise",
    description: "For teams and organizations",
    price: { monthly: null, yearly: null },
    features: [
      "Unlimited compute units",
      "Everything in Pro",
      "Custom model training",
      "Dedicated support",
      "SLA guarantees",
      "On-premise deployment",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

export function Pricing() {
  const [isYearly, setIsYearly] = useState(true)
  const [priceAnimating, setPriceAnimating] = useState(false)

  useEffect(() => {
    setPriceAnimating(true)
    const timer = setTimeout(() => setPriceAnimating(false), 150)
    return () => clearTimeout(timer)
  }, [isYearly])

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-left mb-12">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            <span className="block">Trusted by over 30,000,000 users</span>
            <span className="block">From 191 countries.</span>
            <span className="block">We&apos;ve got a plan for everybody...</span>
          </h2>
        </div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center bg-gray-100 p-1 rounded-md shadow-sm">
            <button
              onClick={() => setIsYearly(false)}
              className={`cursor-pointer px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                !isYearly
                  ? "bg-white text-gray-900 shadow"
                  : "text-gray-500"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`flex cursor-pointer items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                isYearly
                  ? "bg-white text-gray-900 shadow"
                  : "text-gray-500"
              }`}
            >
              Yearly
              <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
                -20% off
              </span>
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex h-full flex-col rounded-2xl border p-6 transition-all ${
                plan.popular
                  ? "border-gray-900 bg-white scale-105"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-medium px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {plan.name}
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {plan.description}
              </p>

              <div className="mb-6">
                {plan.price.monthly !== null ? (
                  <>
                    <span 
                      className={`inline-block text-4xl font-bold text-gray-900 transition-all duration-150 ${
                        priceAnimating && plan.price.monthly !== plan.price.yearly ? 'opacity-70' : 'opacity-100'
                      }`}
                    >
                      ${isYearly ? plan.price.yearly : plan.price.monthly}
                    </span>
                    <span className="text-gray-500">/month</span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-gray-900">
                    Custom
                  </span>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-500">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`mt-auto w-full whitespace-nowrap rounded-full ${
                  plan.popular
                    ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
