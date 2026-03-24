"use client"

import { useEffect, useState } from "react"

const models = [
  { name: "Veo 3.1", logo: "V" },
  { name: "Ideogram", logo: "I" },
  { name: "Runway", logo: "R" },
  { name: "Luma", logo: "L" },
  { name: "Flux", logo: "F" },
  { name: "Gemini", logo: "G" },
  { name: "Krea 1", logo: "K" },
]

const rotatingWords = ["Image", "Video", "3D", "Creative"]

export function ModelShowcase() {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length)
        setIsAnimating(false)
      }, 300)
    }, 2500)
    return () => clearInterval(interval)
  }, [isMounted])

  useEffect(() => {
    const interval = setInterval(() => {
      setScrollPosition((prev) => prev + 1)
    }, 50)
    return () => clearInterval(interval)
  }, [])


  return (
    <section className="py-24 px-4 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {"The industry's best "}
          <span
            className={`inline-block transition-all duration-500 ease-out ${
              isMounted && isAnimating 
                ? "opacity-0 blur-sm scale-95" 
                : "opacity-100 blur-0 scale-100"
            }`}
          >
            {rotatingWords[currentWordIndex]}
          </span>
          {" models."}
        </h2>
        <p className="text-xl text-gray-500 mb-12">In one subscription.</p>

        {/* Scrolling model logos */}
        <div className="relative mb-16 overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />
          
          <div
            className="flex gap-8 transition-transform duration-100"
            style={{ transform: `translateX(-${scrollPosition * 2}px)` }}
          >
            {[...models, ...models, ...models, ...models].map((model, index) => (
              <div
                key={index}
                className="flex items-center gap-3 px-6 py-3 rounded-full bg-transparent whitespace-nowrap"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-gray-500">
                  {model.logo}
                </div>
                <span className="text-gray-500 font-medium">{model.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-6 gap-4 max-w-6xl mx-auto">
          {/* Row 1 */}
          <div className="col-span-6 md:col-span-3 bg-gray-900 rounded-3xl p-6 h-48 flex items-end relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-white text-xl md:text-2xl font-bold text-left">Industry-leading<br />inference speed</p>
            </div>
            {/* Placeholder for image - you can add image here */}
          </div>
          <div className="col-span-3 md:col-span-2 bg-gray-100 rounded-3xl p-6 h-48 flex flex-col items-center justify-center">
            <p className="text-5xl md:text-6xl font-bold text-gray-900">22K</p>
            <p className="text-gray-500 text-sm mt-1">Pixels upscaling</p>
          </div>
          <div className="col-span-3 md:col-span-1 bg-gray-100 rounded-3xl p-6 h-48 flex flex-col items-center justify-center">
            <p className="text-3xl md:text-4xl font-bold text-gray-900">Train</p>
            <p className="text-gray-500 text-xs text-center mt-1">Fine-tune models with your own data</p>
          </div>

          {/* Row 2 */}
          <div className="col-span-3 md:col-span-2 bg-gray-200 rounded-3xl p-6 h-64 flex flex-col justify-end relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-4xl md:text-5xl font-bold text-white">4K</p>
              <p className="text-white text-sm">Native image generation</p>
            </div>
            {/* Placeholder for image - you can add image here */}
          </div>
          <div className="col-span-3 md:col-span-3 bg-gray-900 rounded-3xl p-6 h-64 flex flex-col items-center justify-end relative overflow-hidden row-span-2">
            <div className="relative z-10 text-center pb-4">
              <p className="text-4xl md:text-5xl font-bold text-white">Krea 1</p>
              <p className="text-gray-400 text-sm mt-2">Ultra-realistic flagship model</p>
            </div>
            {/* Placeholder for image - you can add image here */}
          </div>
          <div className="col-span-3 md:col-span-1 bg-gray-100 rounded-3xl p-4 h-32 flex flex-col items-center justify-center">
            <p className="text-xl font-bold text-gray-900">Do not train</p>
            <p className="text-gray-500 text-xs text-center mt-1">Safely generate proprietary data</p>
          </div>

          {/* Row 2 continued */}
          <div className="col-span-3 md:col-span-2 bg-gray-200 rounded-3xl p-6 h-32 flex flex-col justify-end relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-xl font-bold text-white">Minimalist UI</p>
            </div>
            {/* Placeholder for image - you can add image here */}
          </div>
          <div className="col-span-3 md:col-span-1 bg-gray-100 rounded-3xl p-4 h-32 flex flex-col items-center justify-center">
            <p className="text-4xl font-bold text-gray-900">64+</p>
            <p className="text-gray-500 text-sm">Models</p>
          </div>

          {/* Row 3 */}
          <div className="col-span-3 md:col-span-1 bg-gray-900 rounded-3xl p-4 h-48 flex flex-col justify-start relative overflow-hidden">
            <p className="text-white text-sm font-bold">Full-fledged asset<br />manager</p>
            {/* Placeholder for image - you can add image here */}
          </div>
          <div className="col-span-3 md:col-span-1 bg-gray-100 rounded-3xl p-4 h-48 flex flex-col items-center justify-between py-6">
            <p className="text-lg font-semibold text-gray-900 italic">Bleeding Edge</p>
            <div className="w-20 h-20 rounded-full border-2 border-gray-300 flex items-center justify-center">
              <div className="w-1 h-8 bg-gray-400 origin-bottom -rotate-45"></div>
            </div>
            <p className="text-gray-500 text-xs text-center">Access the latest models directly on release day</p>
          </div>
          <div className="col-span-2 md:col-span-1 bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl p-4 h-48 flex flex-col justify-start relative overflow-hidden">
            <p className="text-white text-2xl font-bold">1000+</p>
            <p className="text-white text-sm">styles</p>
            {/* Placeholder for image - you can add image here */}
          </div>
          <div className="col-span-2 md:col-span-1 bg-gray-200 rounded-3xl p-4 h-48 flex flex-col justify-end relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-2xl font-bold text-white">Image</p>
              <p className="text-2xl font-bold text-white">Editor</p>
            </div>
            {/* Placeholder for image - you can add image here */}
          </div>
          <div className="col-span-2 md:col-span-1 bg-gray-100 rounded-3xl p-4 h-48 flex flex-col items-center justify-center">
            <p className="text-lg font-semibold text-gray-900 mb-2">Lipsync</p>
            <div className="flex items-end gap-1 h-12">
              {[0.4, 0.7, 1, 0.8, 0.5, 0.9, 0.6].map((h, i) => (
                <div key={i} className="w-2 bg-gray-400 rounded-full" style={{ height: `${h * 100}%` }}></div>
              ))}
            </div>
          </div>
          <div className="col-span-3 md:col-span-1 flex flex-col gap-4">
            <div className="bg-gray-900 rounded-3xl p-4 h-[88px] flex items-center justify-center relative overflow-hidden">
              <p className="text-white text-lg font-semibold">Realtime Canvas</p>
            </div>
            <div className="bg-gray-100 rounded-3xl p-4 h-[88px] flex items-center justify-center">
              <p className="text-gray-900 text-lg font-semibold">Text to 3D</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
