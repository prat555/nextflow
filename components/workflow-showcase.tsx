"use client"

import { useState } from "react"
import { ImageIcon, Video, Wand2, Sparkles, ArrowRight } from "lucide-react"

const workflows = [
  {
    id: 1,
    title: "Generate image",
    prompt: "Cinematic photo of a person in a linen jacket",
    icon: ImageIcon,
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: 2,
    title: "Generate video",
    prompt: "An animated capybara talking about AI",
    icon: Video,
    color: "from-pink-500/20 to-rose-500/20",
  },
  {
    id: 3,
    title: "Upscale image",
    prompt: "512px → 8K",
    icon: Wand2,
    color: "from-emerald-500/20 to-teal-500/20",
  },
  {
    id: 4,
    title: "Animate image",
    prompt: "Advertisement shot of a sandwich vertically exploding",
    icon: Sparkles,
    color: "from-amber-500/20 to-orange-500/20",
  },
]

export function WorkflowShowcase() {
  const [activeWorkflow, setActiveWorkflow] = useState(0)

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Workflow cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {workflows.map((workflow, index) => (
            <div
              key={workflow.id}
              onMouseEnter={() => setActiveWorkflow(index)}
              className={`group relative p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                activeWorkflow === index
                  ? "border-gray-300 bg-gray-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${workflow.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                    <workflow.icon className="w-5 h-5 text-gray-900" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{workflow.title}</span>
                </div>
                <div className="bg-gray-100 rounded-lg p-3">
                  <p className="text-xs text-gray-500 font-mono">Prompt</p>
                  <p className="text-sm text-gray-900 mt-1 line-clamp-2">{`"${workflow.prompt}"`}</p>
                </div>
                <div className="mt-4 flex items-center text-xs text-gray-500 group-hover:text-gray-900 transition-colors">
                  <span>Try it</span>
                  <ArrowRight className="ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
