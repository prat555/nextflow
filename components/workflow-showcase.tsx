"use client"

import { useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useIsMobile } from "@/hooks/use-mobile"

const DESKTOP_CARD_GAP = 48
const MOBILE_CARD_GAP = 16
const DESKTOP_LEFT_PADDING = 64
const MOBILE_LEFT_PADDING = 16

const cards = [
  {
    id: 1,
    badge: "Krea 1",
    badgeIcon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: "PROMPT",
    quote: '"Cinematic photo of a person in a linen jacket"',
    image: "https://s.krea.ai/landingPhotorealExamplePortrait.webp",
    mediaType: "image",
    buttonLabel: "Generate image",
  },
  {
    id: 2,
    badge: "Veo 3",
    badgeIcon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
        <circle cx="12" cy="12" r="4" fill="white"/>
      </svg>
    ),
    label: "PROMPT",
    quote: '"An animated capybara talking about Krea.ai"',
    image:
      "https://customer-fz5oh80x9qirexi3.cloudflarestream.com/96c1ff6b6334070fdd26fc37f8a5d1d6/iframe?muted=true&loop=true&autoplay=true&poster=https%3A%2F%2Fcustomer-fz5oh80x9qirexi3.cloudflarestream.com%2F96c1ff6b6334070fdd26fc37f8a5d1d6%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600?autoplay=false&controls=false&loop=true&muted=true&preload=auto&responsive=true",
    mediaType: "iframe",
    buttonLabel: "Generate video",
  },
  {
    id: 3,
    badge: "Topaz Upscaler",
    badgeIcon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    ),
    label: "PROMPT",
    quote: "Upscale image 512px → 8K",
    image: "https://s.krea.ai/landingEnhancerExampleSwordBloomCentered.webp",
    mediaType: "image",
    buttonLabel: "Upscale image",
  },
  {
    id: 4,
    badge: "Hailuo",
    badgeIcon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
        <path d="M8 12a4 4 0 0 1 8 0" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    label: "PROMPT",
    quote: '"Advertisement shot of a sandwich vertically exploding into different layers"',
    image:
      "https://customer-fz5oh80x9qirexi3.cloudflarestream.com/25ea2f5507c04b1f4d5f1fa6dda573b6/iframe?muted=true&loop=true&autoplay=true&poster=https%3A%2F%2Fcustomer-fz5oh80x9qirexi3.cloudflarestream.com%2F25ea2f5507c04b1f4d5f1fa6dda573b6%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600?autoplay=false&controls=false&loop=true&muted=true&preload=auto&responsive=true",
    mediaType: "iframe",
    buttonLabel: "Generate video",
  },
  {
    id: 5,
    badge: "Krea 1",
    badgeIcon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: "PROMPT",
    quote: '"Dramatic photo of an old offroad truck racing through the desert"',
    image: "https://s.krea.ai/landingPageTruckKrea1.webp",
    mediaType: "image",
    buttonLabel: "Generate image",
  },
]

export function WorkflowShowcase() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const isMobile = useIsMobile()

  const cardGap = isMobile ? MOBILE_CARD_GAP : DESKTOP_CARD_GAP
  const leftPadding = isMobile ? MOBILE_LEFT_PADDING : DESKTOP_LEFT_PADDING
  const cardsVisible = isMobile ? 1.15 : 3.7

  const getCardWidth = () => {
    if (!scrollRef.current) return 0
    const containerWidth = scrollRef.current.offsetWidth
    const gapsAcrossView = Math.max(cardsVisible - 1, 0)
    return (containerWidth - leftPadding - gapsAcrossView * cardGap) / cardsVisible
  }

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return
    const cardWidth = getCardWidth()
    const amount = cardWidth + cardGap
    scrollRef.current.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" })
  }

  return (
    <section className="bg-white pt-16 sm:pt-24 pb-12 sm:pb-16 overflow-hidden">
      {/* Left padding only — right edge is flush so last card touches the scrollbar */}
      <div className="pl-4 sm:pl-16 pr-0 relative">
        {/* Scrollable row */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto"
          style={{
            gap: cardGap,
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            scrollSnapType: "x mandatory",
            scrollPaddingLeft: leftPadding,
            paddingRight: isMobile ? "16px" : "64px",
          }}
        >
          {cards.map((card) => (
            <div
              key={card.id}
              className="relative shrink-0 rounded-2xl overflow-hidden cursor-pointer group"
              style={{
                width: `calc((100vw - ${leftPadding}px - ${(cardsVisible - 1).toFixed(2)} * ${cardGap}px) / ${cardsVisible})`,
                aspectRatio: "9/11",
                scrollSnapAlign: "start",
              }}
              onMouseEnter={() => setHoveredId(card.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Background media */}
              {card.mediaType === "iframe" ? (
                <div className="absolute inset-0 overflow-hidden">
                  <iframe
                    src={card.image}
                    title={card.quote}
                    className="absolute top-1/2 left-1/2 h-[130%] w-[231.11%] -translate-x-1/2 -translate-y-1/2 border-0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    loading="lazy"
                  />
                </div>
              ) : (
                <Image
                  src={card.image}
                  alt={card.quote}
                  fill
                  priority={card.id === 1}
                  {...(card.id !== 1 && { loading: "lazy" })}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 82vw, 30vw"
                  unoptimized
                />
              )}

              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/10 to-transparent" />

              {/* Badge top-left — no background, just text+icon with drop shadow */}
              <div className="absolute top-4 left-4 flex items-center gap-1.5 drop-shadow-lg">
                {card.badgeIcon}
                <span className="text-white text-sm font-semibold" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
                  {card.badge}
                </span>
              </div>

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 flex flex-col gap-3">
                <div
                  className="transition-transform duration-300 ease-out"
                  style={{
                    transform: !isMobile && hoveredId === card.id ? "translateY(-8px)" : "translateY(0)",
                  }}
                >
                  <p className="text-[10px] font-bold tracking-widest text-white/60 uppercase mb-1.5">
                    {card.label}
                  </p>
                  <p className="text-white font-bold text-lg sm:text-2xl leading-snug">{card.quote}</p>
                </div>

                {/* Generate button — appears on hover, rectangular */}
                <div
                  className="transition-all duration-300 overflow-hidden"
                  style={{
                    maxHeight: isMobile || hoveredId === card.id ? "56px" : "0px",
                    opacity: isMobile || hoveredId === card.id ? 1 : 0,
                  }}
                >
                  <button className="cursor-pointer bg-[#1c1c1e] hover:bg-[#2a2a2a] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap">
                    {card.buttonLabel}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Nav arrows — bottom right inside padded wrapper */}
        {!isMobile ? (
          <div className="flex justify-end gap-2 mt-5 pr-16">
          <button
            onClick={() => scroll("left")}
            className="cursor-pointer w-12 h-12 rounded-full bg-gray-300 border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-400 transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="cursor-pointer w-12 h-12 rounded-full bg-gray-300 border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-400 transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
        ) : null}
      </div>
    </section>
  )
}
