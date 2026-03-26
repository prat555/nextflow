"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight, Check, Download, Gauge, Maximize2, MoreVertical, Pause, Play, Volume2, VolumeX } from "lucide-react"

const demoVideos = [
  "https://s.krea.ai/imageToolDemo_lowBitrate.mp4",
  "https://s.krea.ai/enhancerToolDemo_lowBitrate.mp4",
  "https://s.krea.ai/realtimeToolDemo_lowBitrate.mp4",
]

const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2]

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00"
  }

  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)

  return `${mins}:${secs.toString().padStart(2, "0")}`
}

function KreaStyleVideoPlayer() {
  const [activeVideo, setActiveVideo] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSpeedMenuOpen, setIsSpeedMenuOpen] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const playerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const syncDurationFromVideo = () => {
    const video = videoRef.current
    if (!video) {
      return
    }

    const nextDuration = video.duration
    if (Number.isFinite(nextDuration) && nextDuration > 0) {
      setDuration(nextDuration)
    }
  }

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!menuRef.current) {
        return
      }

      if (!menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
        setIsSpeedMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", onClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", onClickOutside)
    }
  }, [isMenuOpen])

  useEffect(() => {
    const video = videoRef.current
    if (!video) {
      return
    }

    video.muted = isMuted
    video.playbackRate = playbackRate
  }, [isMuted, playbackRate, activeVideo])

  useEffect(() => {
    const video = videoRef.current
    if (!video) {
      return
    }

    if (isPlaying) {
      video.play().catch(() => {
        setIsPlaying(false)
      })
    } else {
      video.pause()
    }
  }, [isPlaying, activeVideo])

  const handleMetadata = () => {
    const video = videoRef.current
    if (!video) {
      return
    }

    syncDurationFromVideo()
    setCurrentTime(video.currentTime || 0)
  }

  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (!video) {
      return
    }

    setCurrentTime(video.currentTime)
    if (duration <= 0) {
      syncDurationFromVideo()
    }
  }

  const handleEnded = () => {
    setActiveVideo((prev) => (prev + 1) % demoVideos.length)
    setCurrentTime(0)
    setDuration(0)
    setIsPlaying(true)
  }

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) {
      return
    }

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {
        setIsPlaying(false)
      })
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  const toggleMute = () => {
    setIsMuted((prev) => !prev)
  }

  const toggleFullscreen = async () => {
    const player = playerRef.current
    if (!player) {
      return
    }

    if (!document.fullscreenElement) {
      await player.requestFullscreen().catch(() => undefined)
      return
    }

    await document.exitFullscreen().catch(() => undefined)
  }

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video || duration <= 0) {
      return
    }

    const nextProgress = Number(event.target.value)
    const nextTime = (nextProgress / 100) * duration
    video.currentTime = nextTime
    setCurrentTime(nextTime)
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div ref={playerRef} className="relative overflow-hidden rounded-[14px] aspect-[16/10] bg-black">
      <video
        ref={videoRef}
        key={demoVideos[activeVideo]}
        autoPlay
        muted
        preload="metadata"
        playsInline
        onLoadedMetadata={handleMetadata}
        onDurationChange={syncDurationFromVideo}
        onLoadedData={syncDurationFromVideo}
        onCanPlay={syncDurationFromVideo}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        className="h-full w-full object-cover"
      >
        <source src={demoVideos[activeVideo]} type="video/mp4" />
      </video>

      <div className="pointer-events-none absolute left-3 right-3 top-2 h-1 rounded-full bg-white/35">
        <div className="h-full rounded-full bg-white transition-[width] duration-100" style={{ width: `${progress}%` }} />
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-3 pb-3 pt-16">
        <div className="flex items-center gap-2 text-white">
          <button
            type="button"
            onClick={togglePlay}
            className="rounded-md p-1.5 hover:bg-white/15 transition-colors"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </button>

          <span className="text-[15px] font-medium">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={toggleMute}
              className="rounded-md p-1.5 hover:bg-white/15 transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="rounded-md p-1.5 hover:bg-white/15 transition-colors"
              aria-label="Toggle fullscreen"
            >
              <Maximize2 className="h-5 w-5" />
            </button>

            <div ref={menuRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen((prev) => {
                    const next = !prev
                    if (!next) {
                      setIsSpeedMenuOpen(false)
                    }
                    return next
                  })
                }}
                className="rounded-md p-1.5 hover:bg-white/15 transition-colors"
                aria-label="Open menu"
              >
                <MoreVertical className="h-5 w-5" />
              </button>

              {isMenuOpen && (
                <div className="absolute bottom-10 right-0 w-48 rounded-xl border border-gray-200 bg-white p-2 text-gray-900 shadow-xl">
                  <a
                    href={demoVideos[activeVideo]}
                    download
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
                  >
                    <Download className="h-4 w-4" />
                    Download video
                  </a>

                  <button
                    type="button"
                    onClick={() => setIsSpeedMenuOpen((prev) => !prev)}
                    className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
                  >
                    <Gauge className="h-4 w-4" />
                    Playback speed
                  </button>

                  {isSpeedMenuOpen && (
                    <div className="mt-1 border-t border-gray-100 pt-1">
                      {playbackRates.map((rate) => (
                        <button
                          key={rate}
                          type="button"
                          onClick={() => setPlaybackRate(rate)}
                          className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
                        >
                          <span>{rate}x</span>
                          {playbackRate === rate ? <Check className="h-4 w-4" /> : null}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={handleSeek}
          className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/35 seek-slider"
          aria-label="Seek video"
        />

        <style jsx>{`
          .seek-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 10px;
            height: 10px;
            border-radius: 999px;
            background: #ffffff;
            border: none;
          }

          .seek-slider::-moz-range-thumb {
            width: 10px;
            height: 10px;
            border-radius: 999px;
            background: #ffffff;
            border: none;
          }
        `}</style>
      </div>
    </div>
  )
}

const useCases = [
  {
    id: "image-gen",
    title: "AI Image Generation",
    description:
      "Generate images with a simple text description. Control your compositions precisely with over 1000 styles, 20 different models, native 4K, image prompts, and image style transfer through exceptionally simple interfaces.",
    cta: "Try AI Image Generation",
    href: "https://www.krea.ai/image",
    media: "https://assets.mixkit.co/videos/preview/mixkit-woman-standing-on-the-edge-of-a-lake-31822-large.mp4",
  },
  {
    id: "upscaling",
    title: "Image Upscaling",
    description:
      "Enhance and upscale images up to a 22K resolution. Make blurry photos razor-sharp, turn simple 3D renders into photo-like architecture visualizations, restore old film scans, or add ultra-fine skin textures to your portraits.",
    cta: "Try Image Upscaling",
    href: "https://www.krea.ai/enhancer",
    media: "https://assets.mixkit.co/videos/preview/mixkit-video-of-a-man-in-a-flower-field-1513-large.mp4",
  },
  {
    id: "realtime",
    title: "Real-time rendering",
    description:
      "Turn easy-to-control primitives into photorealistic images in less than 50ms. Or try out the revolutionary Video Realtime with full frame consistency.",
    cta: "Try Real-time rendering",
    href: "https://www.krea.ai/realtime",
    media: "https://assets.mixkit.co/videos/preview/mixkit-abstract-video-of-colorful-liquid-forms-4358-large.mp4",
  },
  {
    id: "video-gen",
    title: "AI Video Generation",
    description:
      "Access all of the most powerful AI video models. Generate viral videos for social media, animate static images, or add new details to existing videos.",
    cta: "Try AI Video Generation",
    href: "https://www.krea.ai/video",
    media: "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4",
  },
  {
    id: "lora",
    title: "LoRA Fine-tuning",
    description:
      "Train your own model. Upload just a few images of the same face, product, or visual style and teach the AI to generate it on demand.",
    cta: "Try LoRA Fine-tuning",
    href: "https://www.krea.ai/train",
    media: "https://assets.mixkit.co/videos/preview/mixkit-computer-screen-with-a-lot-of-data-41916-large.mp4",
  },
  {
    id: "video-upscale",
    title: "Video Upscaling",
    description:
      "Upscale Videos up to 8K and interpolate frames to 120fps. Restore old videos, turn phone captures into professional footage, or make regular videos ultra slow-mo.",
    cta: "Try Video Upscaling",
    href: "https://www.krea.ai/enhancer",
    media: "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-water-drops-4478-large.mp4",
  },
  {
    id: "editing",
    title: "Generative Editing",
    description:
      "Choose from multiple editing models to edit images with generative AI. Add or remove objects, merge images, change expressions, or lighting in an exceptionally simple interface.",
    cta: "Try Generative Editing",
    href: "https://www.krea.ai/edit",
    media: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-beautiful-beach-on-a-sunny-day-1208-large.mp4",
  },
]

export function UseCases() {
  const [activeCase, setActiveCase] = useState(0)

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-[1320px] mx-auto">
        {/* Section header */}
        <div className="text-left mb-12">
          <p className="text-lg font-bold text-gray-500 mb-2">
            Use cases
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-black leading-tight max-w-4xl">
            Generate or edit high quality images, videos, and 3D objects with AI
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-10 lg:gap-14 items-start">
          <div className="pt-2">
            {useCases.map((useCase, index) => (
              <button
                key={useCase.id}
                onClick={() => setActiveCase(index)}
                className={`group w-full text-left py-7 transition-colors ${
                  activeCase === index
                    ? "cursor-default opacity-100 rounded-xl bg-gray-100/80 px-4 py-5"
                    : "cursor-pointer opacity-100 px-4 py-5 hover:bg-gray-50/70 rounded-xl"
                }`}
              >
                <h3 className={`text-[20px] leading-tight font-semibold ${activeCase === index ? "cursor-default text-gray-900" : "cursor-pointer text-gray-500"}`}>
                  {useCase.title}
                </h3>
                <p className={`mt-3 max-w-2xl pr-4 text-sm leading-relaxed text-gray-500 ${activeCase === index ? "cursor-default" : "cursor-pointer"}`}>
                  {useCase.description}
                </p>
                <a
                  href={useCase.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className={`mt-4 inline-flex cursor-pointer items-center gap-2 text-sm font-medium transition-all duration-300 ${
                    activeCase === index
                      ? "text-gray-700 opacity-100 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200"
                      : "opacity-0 pointer-events-none h-0 mt-0"
                  }`}
                >
                  {useCase.cta}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </button>
            ))}
          </div>

          <div className="relative lg:sticky lg:top-24 h-fit">
            <div className="rounded-2xl border border-gray-300 bg-[#d6d6d6] p-2 shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
              <KreaStyleVideoPlayer />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
