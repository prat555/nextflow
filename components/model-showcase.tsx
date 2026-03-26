"use client"

import { useEffect, useState } from "react"
import { useAnimationFrame } from "framer-motion"
import { useRef } from "react"

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

function TextTo3DMotion() {
  const cubeRef = useRef<HTMLDivElement>(null)

  useAnimationFrame((t) => {
    if (!cubeRef.current) return

    // Faster, smoother 3D motion based on animation frames.
    const rotateX = (t / 10) % 360
    const rotateY = (t / 7) % 360
    const y = Math.sin(t / 220) * -6

    cubeRef.current.style.transform = `translateY(${y}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  })

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-between overflow-hidden rounded-3xl">
      <p className="text-gray-900 text-base font-bold pt-2">Text to 3D</p>

      <div className="flex-1 flex items-center justify-center w-full">
        <div className="cube-container">
          <div className="cube" ref={cubeRef}>
            <div className="cube-face cube-front"></div>
            <div className="cube-face cube-back"></div>
            <div className="cube-face cube-right"></div>
            <div className="cube-face cube-left"></div>
            <div className="cube-face cube-top"></div>
            <div className="cube-face cube-bottom"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .cube-container {
          perspective: 1000px;
          width: 100px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cube {
          position: relative;
          width: 60px;
          height: 60px;
          transform-style: preserve-3d;
          will-change: transform;
        }

        .cube-face {
          position: absolute;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          font-weight: bold;
          border: 2px solid rgba(0, 0, 0, 0.2);
          opacity: 0.9;
        }

        .cube-front {
          background: linear-gradient(135deg, #ffffff 0%, #e5e5e5 100%);
          transform: translateZ(30px);
        }

        .cube-back {
          background: linear-gradient(135deg, #4b4b4b 0%, #000000 100%);
          transform: translateZ(-30px) rotateY(180deg);
        }

        .cube-right {
          background: linear-gradient(135deg, #d4d4d4 0%, #999999 100%);
          transform: rotateY(90deg) translateZ(30px);
        }

        .cube-left {
          background: linear-gradient(135deg, #808080 0%, #2a2a2a 100%);
          transform: rotateY(-90deg) translateZ(30px);
        }

        .cube-top {
          background: linear-gradient(135deg, #ffffff 0%, #b3b3b3 100%);
          transform: rotateX(90deg) translateZ(30px);
        }

        .cube-bottom {
          background: linear-gradient(135deg, #1a1a1a 0%, #000000 100%);
          transform: rotateX(-90deg) translateZ(30px);
        }
      `}</style>
    </div>
  )
}

function DetailedClockFace() {
  const numbers = Array.from({ length: 12 }, (_, i) => i + 1)
  const minuteTicks = Array.from({ length: 60 }, (_, i) => i)
  const [now, setNow] = useState(new Date())
  const [isMounted, setIsMounted] = useState(false)
  const fmt = (value: number) => value.toFixed(3)

  useEffect(() => {
    setIsMounted(true)
    setNow(new Date())

    const timer = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Keep SSR/initial hydration deterministic; switch to live time after mount.
  const seconds = isMounted ? now.getSeconds() : 0
  const minutes = isMounted ? now.getMinutes() + seconds / 60 : 0
  const hours = isMounted ? (now.getHours() % 12) + minutes / 60 : 0

  const secondAngle = (seconds * 6 - 90) * (Math.PI / 180)
  const minuteAngle = (minutes * 6 - 90) * (Math.PI / 180)
  const hourAngle = (hours * 30 - 90) * (Math.PI / 180)

  const hourX = fmt(100 + 30 * Math.cos(hourAngle))
  const hourY = fmt(100 + 30 * Math.sin(hourAngle))
  const minuteX = fmt(100 + 42 * Math.cos(minuteAngle))
  const minuteY = fmt(100 + 42 * Math.sin(minuteAngle))
  const secondX = fmt(100 + 52 * Math.cos(secondAngle))
  const secondY = fmt(100 + 52 * Math.sin(secondAngle))

  return (
    <svg viewBox="0 0 200 200" className="h-32 w-32" role="img" aria-label="Analog clock">
      <circle cx="100" cy="100" r="92" fill="#ffffff" />

      {minuteTicks.map((tick) => {
        const angle = (tick * 6 - 90) * (Math.PI / 180)
        const isHourTick = tick % 5 === 0
        const outer = 86
        const inner = isHourTick ? 74 : 80
        const x1 = fmt(100 + outer * Math.cos(angle))
        const y1 = fmt(100 + outer * Math.sin(angle))
        const x2 = fmt(100 + inner * Math.cos(angle))
        const y2 = fmt(100 + inner * Math.sin(angle))

        return (
          <line
            key={tick}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#9ca3af"
            strokeWidth={isHourTick ? 2.2 : 1.1}
            strokeLinecap="round"
          />
        )
      })}

      {numbers.map((num) => {
        const angle = (num * 30 - 90) * (Math.PI / 180)
        const radius = 61
        const x = fmt(100 + radius * Math.cos(angle))
        const y = fmt(100 + radius * Math.sin(angle))

        return (
          <text
            key={num}
            x={x}
            y={fmt(Number(y) + 4)}
            textAnchor="middle"
            fontSize="13"
            fontWeight="700"
            fill="#6b7280"
          >
            {num}
          </text>
        )
      })}

      <line x1="100" y1="100" x2={hourX} y2={hourY} stroke="#6b7280" strokeWidth="3" strokeLinecap="round" />
      <line x1="100" y1="100" x2={minuteX} y2={minuteY} stroke="#6b7280" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="100" y1="100" x2={secondX} y2={secondY} stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="100" cy="100" r="3.8" fill="#6b7280" />
    </svg>
  )
}

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
    <section className="pt-12 pb-24 px-4 overflow-hidden bg-white">
      <div className="max-w-[80rem] mx-auto">
        {/* Heading */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-2 text-left">
          The industry&apos;s best{" "}
          <span
            className={`inline-block transition-all duration-500 ease-out ${
              isMounted && isAnimating 
                ? "opacity-0 blur-sm scale-95" 
                : "opacity-100 blur-0 scale-100"
            }`}
          >
            {rotatingWords[currentWordIndex]}
          </span>
          {" "}models.
        </h2>
        <p className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-12 text-left">In one subscription.</p>

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
        <div className="grid grid-cols-6 gap-4 w-full">
          {/* Row 1 */}
          <div className="col-span-6 md:col-span-3 bg-gray-900 rounded-3xl p-6 h-40 flex items-center justify-center relative overflow-hidden">
            <img src="https://s.krea.ai/light-streak.webp" alt="Light streak" className="absolute inset-0 w-full h-full object-cover" />
            <div className="relative z-10">
              <p className="text-white text-2xl md:text-3xl font-bold text-center">Industry-leading<br />inference speed</p>
            </div>
          </div>
          <div className="col-span-3 md:col-span-2 bg-gray-100 rounded-3xl p-6 h-40 flex flex-col items-center justify-center">
            <p className="text-5xl md:text-6xl font-bold bg-linear-to-b from-gray-900 to-gray-600 bg-clip-text text-transparent">22K</p>
            <p className="text-black font-bold text-sm mt-1">Pixels upscaling</p>
          </div>
          <div className="col-span-3 md:col-span-1 bg-gray-100 rounded-3xl p-6 h-40 flex flex-col items-center justify-center">
            <p className="text-3xl md:text-4xl font-bold bg-linear-to-b from-gray-900 to-gray-600 bg-clip-text text-transparent">Train</p>
            <p className="text-black font-bold text-xs text-center mt-1">Fine-tune models with your own data</p>
          </div>
        </div>

        {/* Middle Section - 4K, Krea1, Do not train / Minimalist UI, 64+ */}
        <div className="grid grid-cols-6 gap-4 w-full mt-4">
          {/* Left column - 4K and Minimalist UI stacked */}
          <div className="col-span-6 md:col-span-2 flex flex-col gap-4">
            <div className="bg-gray-200 rounded-3xl p-6 h-52 flex flex-col items-center justify-center relative overflow-hidden">
              <img src="https://s.krea.ai/eye-macro.webp" alt="Eye macro" className="absolute inset-0 w-full h-full object-cover" />
              <div className="relative z-10 text-center">
                <p className="text-5xl md:text-6xl font-bold text-white">4K</p>
                <p className="text-white text-sm">Native image generation</p>
              </div>
            </div>
            <div className="bg-gray-200 rounded-3xl p-6 h-32 flex flex-col items-center justify-center relative overflow-hidden">
              <img src="https://s.krea.ai/minimalistBase.webp" alt="Minimalist UI" className="absolute inset-0 w-full h-full object-cover" />
              <div className="relative z-10 text-center">
                <p className="text-2xl font-bold text-white">Minimalist UI</p>
              </div>
            </div>
          </div>

          {/* Center - Krea 1 */}
          <div className="col-span-6 md:col-span-3 bg-gray-900 rounded-3xl p-6 flex flex-col items-center justify-end relative overflow-hidden h-[360px]">
            <img src="https://s.krea.ai/krea1-example.webp" alt="Krea 1 example" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
              <p className="text-5xl md:text-6xl font-bold text-white">Krea 1</p>
            </div>
            <div className="relative z-10 text-center pb-4">
              <p className="text-white text-base md:text-lg mt-2">Ultra-realistic flagship model</p>
            </div>
          </div>

          {/* Right column - Do not train and 64+ stacked */}
          <div className="col-span-6 md:col-span-1 flex flex-col gap-4">
            <div className="bg-gray-100 rounded-3xl p-4 h-44 flex flex-col items-center justify-center">
              <p className="text-xl font-bold bg-linear-to-b from-gray-900 to-gray-600 bg-clip-text text-transparent">Do not train</p>
              <p className="text-black font-bold text-xs text-center mt-1">Safely generate proprietary data</p>
            </div>
            <div className="bg-gray-100 rounded-3xl p-4 h-44 flex flex-col items-center justify-center">
              <p className="text-4xl font-bold bg-linear-to-b from-gray-900 to-gray-600 bg-clip-text text-transparent">64+</p>
              <p className="text-black font-bold text-sm">Models</p>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-6 gap-4 w-full mt-4">
          <div className="col-span-3 md:col-span-1 bg-gray-900 rounded-3xl p-4 h-48 flex flex-col justify-start relative overflow-hidden">
            <img src="https://s.krea.ai/asset-manager.webp" alt="Asset manager" className="absolute inset-0 w-full h-full object-cover" />
            <p className="relative z-10 text-white text-sm font-bold">Full-fledged asset<br />manager</p>
          </div>
          <div className="col-span-3 md:col-span-1 bg-gray-100 rounded-3xl p-4 h-48 flex flex-col items-center justify-between py-4">
            <p className="text-lg font-semibold text-gray-900 italic mb-1">Bleeding Edge</p>
            <DetailedClockFace />
            <p className="text-black text-xs text-center mt-1 leading-tight">Access the latest models directly on release day</p>
          </div>
          <div className="col-span-2 md:col-span-1 bg-gray-900 rounded-3xl p-4 h-48 flex flex-col justify-start relative overflow-hidden">
            <img src="https://s.krea.ai/isometricPromptStyles.webp" alt="Styles" className="absolute inset-0 w-full h-full object-cover" />
            <p className="relative z-10 text-white text-2xl font-bold">1000+</p>
            <p className="relative z-10 text-white text-sm">styles</p>
          </div>
          <div className="col-span-2 md:col-span-1 bg-gray-200 rounded-3xl p-4 h-48 flex flex-col items-center justify-center relative overflow-hidden">
            <img
              src="https://s.krea.ai/isometricEditExample.webp"
              alt="Image Editor"
              className="absolute inset-0 h-full w-full scale-150 object-cover object-center"
            />
            <div className="relative z-10 text-center">
              <p className="text-3xl font-bold text-white">Image</p>
              <p className="text-3xl font-bold text-white">Editor</p>
            </div>
          </div>
          <div className="col-span-2 md:col-span-1 bg-gray-100 rounded-3xl p-4 h-48 flex flex-col items-center justify-center">
            <p className="text-lg font-semibold text-gray-900 mb-4">Lipsync</p>
            <div className="flex items-center gap-1 sm:gap-2 h-20 sm:h-28">
              {[3, 5, 7, 4, 6, 3.1].map((totalHeight, i) => (
                <div key={i} className="relative w-1.5 sm:w-2 h-full flex items-center justify-center">
                  <div 
                    className="w-full rounded-full"
                    style={{ 
                      height: `${totalHeight}rem`,
                      background: 'linear-gradient(180deg, #474747 0%, #000000 100%)',
                      animation: `wavePulse 0.6s ease-in-out infinite`,
                      animationDelay: `${i * 0.08}s`
                    }}
                  />
                </div>
              ))}
            </div>
            <style jsx>{`
              @keyframes wavePulse {
                0%, 100% {
                  transform: scaleY(1);
                }
                50% {
                  transform: scaleY(0.4);
                }
              }
            `}</style>
          </div>
          <div className="col-span-3 md:col-span-1 flex flex-col gap-4">
            <div className="bg-gray-900 rounded-3xl p-4 h-[88px] flex items-start justify-center pt-3 relative overflow-hidden">
              <img
                src="https://s.krea.ai/realtimeBase.webp"
                alt="Realtime Canvas"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <p className="relative z-10 text-white text-lg font-semibold">Realtime Canvas</p>
              <img
                src="https://www.krea.ai/_app/a499afd030e01d06/immutable/assets/realtimeOverlay.Dw-O4V0Z.png"
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-20 h-full w-full object-cover"
              />
            </div>
            <div className="bg-gray-100 rounded-3xl p-2 h-[88px] relative overflow-hidden">
              <TextTo3DMotion />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
