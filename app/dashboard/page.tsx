"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Image, Video, Wand2, Zap } from "lucide-react"

const heroSlides = [
  {
    title: "Start by generating a free image",
    gradient: "from-sky-300 via-sky-200 to-sky-100",
  },
  {
    title: "Create stunning videos with AI",
    gradient: "from-orange-300 via-amber-200 to-yellow-100",
  },
  {
    title: "Enhance your photos instantly",
    gradient: "from-pink-300 via-rose-200 to-red-100",
  },
]

const toolCards = [
  {
    name: "Image",
    description: "Generate stunning images from text",
    icon: Image,
    iconColor: "text-blue-400",
    bgColor: "bg-blue-500/20",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-03-24%20163522-A7MOK8G34rPxKPIVVsI1UNhFGtSaty.png",
    cardBg: "bg-gradient-to-br from-yellow-400 to-orange-500",
  },
  {
    name: "Video",
    description: "Create videos from images or text",
    icon: Video,
    iconColor: "text-orange-400",
    bgColor: "bg-orange-500/20",
    image: "",
    cardBg: "bg-gradient-to-br from-gray-900 to-black",
  },
  {
    name: "Enhancer",
    description: "Upscale and enhance your images",
    icon: Wand2,
    iconColor: "text-pink-400",
    bgColor: "bg-pink-500/20",
    image: "",
    cardBg: "bg-gradient-to-br from-gray-800 to-gray-900",
  },
  {
    name: "Realtime",
    description: "Generate images in real-time",
    icon: Zap,
    iconColor: "text-blue-400",
    bgColor: "bg-blue-500/20",
    image: "",
    cardBg: "bg-gradient-to-br from-purple-900 to-indigo-900",
  },
]

export default function DashboardPage() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Hero Banner */}
      <div className="relative">
        <div
          className={`relative h-80 rounded-3xl bg-gradient-to-br ${heroSlides[currentSlide].gradient} flex items-center justify-center overflow-hidden`}
        >
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-10 right-20 w-32 h-32 bg-white/50 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-20 w-40 h-40 bg-white/30 rounded-full blur-3xl" />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white text-center px-8 relative z-10 drop-shadow-lg">
            {heroSlides[currentSlide].title}
          </h1>
        </div>

        {/* Navigation arrows */}
        <div className="absolute right-4 bottom-[-50px] flex items-center gap-2">
          <button
            onClick={prevSlide}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* CTA Button */}
      <div className="flex justify-center pt-4">
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full font-medium transition-colors">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          Click here to open the image tool
        </button>
      </div>

      {/* Tool Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        {toolCards.map((tool) => (
          <div
            key={tool.name}
            className={`group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer ${tool.cardBg}`}
          >
            {/* Placeholder content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <tool.icon className={`w-8 h-8 ${tool.iconColor}`} />
              </div>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
              <div>
                <h3 className="text-white font-semibold text-lg">{tool.name}</h3>
                <p className="text-gray-300 text-sm">{tool.description}</p>
              </div>
            </div>

            {/* Tool badge */}
            <div className="absolute bottom-4 right-4">
              <div className={`w-10 h-10 rounded-xl ${tool.bgColor} backdrop-blur-sm flex items-center justify-center`}>
                <tool.icon className={`w-5 h-5 ${tool.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent/Suggested section */}
      <div className="pt-8">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Text to Image", icon: Image, color: "text-blue-400" },
            { label: "Image to Video", icon: Video, color: "text-orange-400" },
            { label: "Upscale Image", icon: Wand2, color: "text-pink-400" },
            { label: "Realtime Canvas", icon: Zap, color: "text-yellow-400" },
          ].map((action) => (
            <button
              key={action.label}
              className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left"
            >
              <action.icon className={`w-5 h-5 ${action.color}`} />
              <span className="text-white text-sm font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
