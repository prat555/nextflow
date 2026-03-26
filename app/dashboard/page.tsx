"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Image, Video, Wand2, Zap } from "lucide-react"

const heroSlides = [
  {
    title: "Start by generating a free image",
  },
  {
    title: "Create stunning videos with AI",
  },
  {
    title: "Enhance your photos instantly",
  },
]

const toolCards = [
  {
    name: "Image",
    description: "Generate stunning images from text",
    icon: Image,
    iconColor: "text-blue-400",
    cardBg: "bg-gradient-to-br from-yellow-400 to-orange-500",
  },
  {
    name: "Video",
    description: "Create videos from images or text",
    icon: Video,
    iconColor: "text-orange-400",
    cardBg: "bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]",
  },
  {
    name: "Enhancer",
    description: "Upscale and enhance your images",
    icon: Wand2,
    iconColor: "text-pink-400",
    cardBg: "bg-gradient-to-br from-[#1a2a3a] to-[#0a1520]",
  },
  {
    name: "Realtime",
    description: "Generate images in real-time",
    icon: Zap,
    iconColor: "text-purple-400",
    cardBg: "bg-gradient-to-br from-purple-900 to-indigo-950",
  },
]

export default function DashboardPage() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto-advance carousel every 1.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  return (
    <div className="p-6 space-y-6 bg-[#0d0d0d] min-h-screen">
      {/* Hero Banner */}
      <div className="relative">
        <div
          className="relative h-72 rounded-2xl bg-gradient-to-br from-sky-200 via-sky-100 to-white flex items-center justify-center overflow-hidden"
        >
          {heroSlides.map((slide, idx) => (
            <h1
              key={slide.title}
              className={`text-4xl md:text-5xl lg:text-6xl font-serif font-light text-gray-800 text-center px-8 absolute left-0 right-0 top-1/2 -translate-y-1/2 z-10 transition-opacity duration-700 ${currentSlide === idx ? 'opacity-100' : 'opacity-0'}`}
              style={{ pointerEvents: currentSlide === idx ? 'auto' : 'none' }}
            >
              {slide.title}
            </h1>
          ))}
        </div>

        {/* Navigation arrows */}
        <div className="absolute right-4 bottom-4 flex items-center gap-2">
          <button
            onClick={prevSlide}
            className="w-10 h-10 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-gray-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="w-10 h-10 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-gray-700 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>



      {/* Gap between carousel and tool cards */}
      <div className="h-8" />
      {/* Tool Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {toolCards.map((tool, idx) => (
          <div
            key={tool.name}
            className={`group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer ${tool.cardBg}`}
            style={
              idx === 0
                ? { backgroundImage: 'url("/api/img?f=webp&i=https%3A%2F%2Fwww.krea.ai%2Fapi%2Fimg%3Ff%3Dwebp%26i%3Dhttps%253A%252F%252Fapp-uploads.krea.ai%252Fpublic%252F79f68420-3425-4b26-a809-955801865d43-image.jpeg&s=1024")', backgroundSize: 'cover', backgroundPosition: 'center' }
                : undefined
            }
          >
            {/* Centered icon or video/image overlay */}
            {(idx === 1 || idx === 2 || idx === 3) ? (
              <>
                <video
                  src={
                    idx === 1
                      ? "https://s.krea.ai/02%20-%20Video%20Tool_Edited_2.mp4"
                      : idx === 2
                        ? "https://s.krea.ai/03%20-%20Enhancer_Edited_2.mp4"
                        : "https://s.krea.ai/realtimeVideoHandFlowers.mp4"
                  }
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-14 h-14 rounded-xl bg-black/30 backdrop-blur-sm flex items-center justify-center">
                    <tool.icon className={`w-7 h-7 ${tool.iconColor}`} />
                  </div>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-xl bg-black/30 backdrop-blur-sm flex items-center justify-center">
                  <tool.icon className={`w-7 h-7 ${tool.iconColor}`} />
                </div>
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
              <div>
                <h3 className="text-white font-semibold text-lg">
                  {idx === 0
                    ? "Image Generation"
                    : idx === 1
                      ? "Video Generation"
                      : idx === 2
                        ? "Upscale and Enhance"
                        : tool.name}
                </h3>
                <p className="text-gray-300 text-sm">{tool.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent/Suggested section */}
      <div className="pt-6">
        <h2 className="text-lg font-medium text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[ 
            { label: "Text to Image", icon: Image, color: "text-blue-400" },
            { label: "Image to Video", icon: Video, color: "text-orange-400" },
            { label: "Upscale Image", icon: Wand2, color: "text-pink-400" },
            { label: "Realtime Canvas", icon: Zap, color: "text-yellow-400" },
          ].map((action) => (
            <button
              key={action.label}
              className="flex items-center gap-3 p-4 rounded-xl bg-[#1a1a1a] hover:bg-[#222] transition-colors text-left"
            >
              <action.icon className={`w-5 h-5 ${action.color}`} />
              <span className="text-white text-sm font-medium flex items-center gap-2">
                {action.label}
                <ChevronRight className="w-4 h-4 text-[#888] ml-1" />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
