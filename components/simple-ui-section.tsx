import { ImageIcon, Sparkles } from "lucide-react"

export function SimpleUISection() {
  return (
    <section className="relative w-full bg-[#f2f2f2] px-6 py-20">
      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
        <h2 className="text-4xl font-bold leading-tight text-black md:text-6xl">
          Dead simple UI.
          <br />
          No tutorials needed.
        </h2>

        <p className="mt-6 max-w-2xl text-lg text-gray-600">
          Krea offers the simplest interfaces. Skip dry tutorials and get right
          into your creative flow with minimal distraction, even if you or your
          team has never worked with AI tools before.
        </p>

        <div className="mt-12 w-full max-w-3xl rounded-3xl border border-white bg-[#e6e6e6] p-6 shadow-sm">
          <p className="text-left text-gray-500">
            Describe any visual you want to create. Krea will generate an image
            for free. You can write in any language.
          </p>

          <div className="mt-6 flex w-full flex-wrap items-center justify-between gap-4 md:flex-nowrap">
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-black">
                3:4
              </span>
              <span className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-black">
                Style
              </span>
              <span className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-black">
                1K
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-black">
                <ImageIcon className="h-3.5 w-3.5" />
                Image prompt
              </span>
            </div>

            <button className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 font-semibold text-black transition hover:bg-gray-50">
              <Sparkles className="h-4 w-4" />
              Generate
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 flex w-fit flex-wrap justify-center gap-3 rounded-2xl border border-white bg-[#e6e6e6] p-3 shadow md:absolute md:left-6 md:top-1/2 md:mt-0 md:-translate-y-1/2 md:flex-col md:gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg border text-xl font-semibold text-black">
          +
        </div>

        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-12 w-12 rounded-lg bg-[#c2c2c2]" />
        ))}
      </div>
    </section>
  )
}
