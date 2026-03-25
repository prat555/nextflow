"use client"

import { useState } from "react"
import { GitBranch, ArrowRight, Search, ChevronDown, Grid3X3, Plus, ExternalLink } from "lucide-react"

const tabs = ["Projects", "Apps", "Examples", "Templates"]

// Sample workflows - set to empty array to see empty state
const workflows = [
  { id: "1", name: "Untitled", editedAt: "6 seconds ago", hasPreview: true },
]

export default function NodeEditorPage() {
  const [activeTab, setActiveTab] = useState("Projects")
  const [searchQuery, setSearchQuery] = useState("")
  
  // Toggle this to see empty state
  const hasWorkflows = workflows.length > 0

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      {/* Hero Banner */}
      <div className="relative h-[320px] overflow-hidden">
        {/* Background with gradient and blur effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-400/90 via-gray-500/90 to-gray-600/90">
          {/* Decorative blurred node cards */}
          <div className="absolute inset-0 opacity-60">
            <div className="absolute top-8 left-[20%] w-32 h-40 bg-white/20 rounded-xl blur-sm transform -rotate-6" />
            <div className="absolute top-12 left-[28%] w-28 h-36 bg-white/30 rounded-xl blur-sm" />
            <div className="absolute top-4 right-[30%] w-36 h-44 bg-white/25 rounded-xl blur-sm transform rotate-3" />
            <div className="absolute top-16 right-[20%] w-40 h-48 bg-white/20 rounded-xl blur-sm transform rotate-6" />
            <div className="absolute top-24 right-[10%] w-44 h-52 bg-white/15 rounded-xl blur-sm" />
            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full">
              <path d="M400 150 Q 500 100 600 180" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="2" fill="none" />
              <path d="M600 180 Q 700 200 800 160" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="2" fill="none" />
              <path d="M800 160 Q 900 120 1000 200" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 px-8 pt-8">
          {/* Title row */}
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-500 rounded-xl p-2">
              <GitBranch className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Node Editor</h1>
          </div>

          {/* Subtitle */}
          <p className="text-white/90 text-sm max-w-md mb-6">
            Nodes is the most powerful way to operate Krea. Connect every tool and model into complex automated pipelines.
          </p>

          {/* New Workflow button */}
          <button className="flex items-center gap-2 bg-white text-black rounded-full px-6 py-2.5 font-medium hover:bg-gray-100 transition-colors">
            New Workflow
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Projects Section */}
      <div className="px-8 py-5">
        {/* Tabs and Search Row */}
        <div className="flex items-center justify-between mb-4">
          {/* Tabs */}
          <div className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-[#2a2a2a] text-white"
                    : "text-[#888] hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search and filters */}
          <div className="flex items-center gap-3">
            {/* Search input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#1a1a1a] border border-[#333] rounded-lg pl-9 pr-3 py-1.5 text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#555] w-48"
              />
            </div>

            {/* Last viewed dropdown */}
            <button className="flex items-center gap-2 bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-1.5 text-sm text-white hover:bg-[#222] transition-colors">
              Last viewed
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* Grid toggle */}
            <button className="bg-[#1a1a1a] border border-[#333] rounded-lg p-1.5 text-[#888] hover:text-white hover:bg-[#222] transition-colors">
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-b border-[#222] mb-6" />

        {hasWorkflows ? (
          /* Projects Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* New Workflow Card */}
            <div>
              <div className="bg-[#1a1a1a] rounded-2xl aspect-video flex items-center justify-center cursor-pointer hover:bg-[#222] transition-colors">
                <div className="bg-white rounded-full p-3">
                  <Plus className="w-6 h-6 text-black" />
                </div>
              </div>
              <p className="text-white text-sm font-medium mt-2">New Workflow</p>
            </div>

            {/* Workflow Cards */}
            {workflows.map((workflow) => (
              <div key={workflow.id}>
                <div className="bg-[#1a1a1a] rounded-2xl aspect-video overflow-hidden relative cursor-pointer hover:ring-1 hover:ring-[#444] transition-all">
                  {workflow.hasPreview && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {/* Simple workflow preview */}
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-20 bg-[#2a2a2a] rounded-lg border border-[#333]" />
                        <svg width="40" height="20">
                          <path d="M0 10 Q 20 0 40 10" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="2" fill="none" />
                        </svg>
                        <div className="w-12 h-14 bg-[#2a2a2a] rounded-lg border border-[#333]" />
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-white text-sm font-medium mt-2">{workflow.name}</p>
                <p className="text-[#888] text-xs">Edited {workflow.editedAt}</p>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24">
            {/* Blue icon */}
            <div className="bg-blue-500 rounded-xl p-3 mb-4">
              <GitBranch className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-white text-xl font-semibold mb-2">No Workflows Yet</h2>
            <p className="text-[#888] text-sm text-center max-w-xs mb-6">
              You haven&apos;t created any workflows yet. Get started by creating your first one.
            </p>

            {/* New Workflow button */}
            <button className="bg-white text-black rounded-full px-6 py-2.5 font-medium hover:bg-gray-100 transition-colors mb-4">
              New Workflow
            </button>

            {/* Learn More link */}
            <a href="#" className="flex items-center gap-1 text-[#888] text-sm hover:text-white transition-colors">
              Learn More
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
