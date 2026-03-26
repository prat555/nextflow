import Link from "next/link"

export function Hero() {
  return (
    <section
      id="hero-section"
      className="relative flex min-h-screen flex-col items-center pt-24 pb-16 px-4 overflow-hidden"
      style={{
        backgroundImage: "url('https://s.krea.ai/Night_Wide_5K_compressed.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#000000",
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-black/45" />

      {/* Text content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto mt-10 sm:mt-12">
        {/* Main headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6 text-balance">
          <span className="bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">Krea.ai</span>
          <span className="text-white"> is the world&apos;s most powerful creative AI suite.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-white mx-auto mb-10 max-w-2xl text-pretty px-1">
          Generate, enhance, and edit images, videos, or 3D meshes for free with AI.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <button className="flex w-full sm:w-auto justify-center cursor-pointer items-center gap-2 bg-white hover:bg-gray-100 text-black px-8 sm:px-12 py-3 text-[15px] font-medium rounded-full transition-colors">
              Start for free
            </button>
          </Link>
          <Link href="/dashboard" className="w-full sm:w-auto">
            <button className="flex w-full sm:w-auto justify-center cursor-pointer items-center gap-2 bg-white/7 hover:bg-white/12 backdrop-blur-lg border border-white/18 text-white px-8 sm:px-12 py-3 text-[15px] font-medium rounded-full transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.11),0_8px_24px_rgba(0,0,0,0.25)]">
              Launch App
            </button>
          </Link>
        </div>
      </div>

    </section>
  )
}
