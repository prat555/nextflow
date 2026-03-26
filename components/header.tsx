"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Boxes, ChevronDown, FolderOpen, Menu, Sparkles, Workflow, X } from "lucide-react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLightHeader, setIsLightHeader] = useState(false)
  const [featuresOpen, setFeaturesOpen] = useState(false)
  const closeFeaturesTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const updateHeaderMode = () => {
      const switchLine = document.getElementById("hero-switch-line")

      if (!switchLine) {
        setIsLightHeader(window.scrollY > 80)
        return
      }

      const switchLineRect = switchLine.getBoundingClientRect()
      const headerHeight = 64
      setIsLightHeader(switchLineRect.bottom <= headerHeight)
    }

    updateHeaderMode()
    window.addEventListener("scroll", updateHeaderMode, { passive: true })
    window.addEventListener("resize", updateHeaderMode)

    return () => {
      window.removeEventListener("scroll", updateHeaderMode)
      window.removeEventListener("resize", updateHeaderMode)
    }
  }, [])

  const desktopNavClass = isLightHeader
    ? "rounded-full border-none bg-transparent text-gray-900 shadow-none hover:bg-[#2f2f2f] hover:text-white data-[state=open]:bg-[#2f2f2f] data-[state=open]:text-white focus-visible:border-transparent focus-visible:ring-0"
    : "rounded-full border-none bg-transparent text-white shadow-none hover:bg-[#2f2f2f] hover:text-white data-[state=open]:bg-[#2f2f2f] data-[state=open]:text-white focus-visible:border-transparent focus-visible:ring-0"

  const mobileIconClass = isLightHeader ? "text-gray-800" : "text-white"

  const clearFeaturesCloseTimeout = () => {
    if (!closeFeaturesTimeoutRef.current) return
    clearTimeout(closeFeaturesTimeoutRef.current)
    closeFeaturesTimeoutRef.current = null
  }

  const openFeaturesMenu = () => {
    clearFeaturesCloseTimeout()
    setFeaturesOpen(true)
  }

  const scheduleFeaturesClose = () => {
    clearFeaturesCloseTimeout()
    closeFeaturesTimeoutRef.current = setTimeout(() => {
      setFeaturesOpen(false)
    }, 120)
  }

  useEffect(() => {
    return () => {
      clearFeaturesCloseTimeout()
    }
  }, [])

  const navItems = [
    { label: "App", href: "/dashboard" },
    { label: "Features", href: "/#" },
    { label: "Image Generator", href: "/#" },
    { label: "Video Generator", href: "/#" },
    { label: "Upscaler", href: "/#" },
    { label: "API", href: "/#" },
    { label: "Pricing", href: "/#" },
    { label: "Enterprise", href: "/#" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl transition-colors duration-300 ${
        isLightHeader
          ? "bg-white/88 border-b border-gray-200/80"
          : "bg-black/35 border-b border-white/20"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <svg 
              aria-label="Krea Logo" 
              role="img" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24"
              className={isLightHeader ? "text-gray-900" : "text-white"}
            >
              <path d="M8.34057 1.26646C10.1061 1.14218 11.6638 2.37142 11.8911 4.06824C12.1069 5.68015 11.0037 7.23915 9.34608 7.60419C8.93062 7.69566 8.46886 7.67023 8.02919 7.72601C6.95925 7.86191 6.04308 8.30843 5.2807 9.06558L5.27279 9.06966L5.26385 9.0689L5.2568 9.06354L5.25394 9.05533C5.25366 9.04931 5.25521 9.04398 5.25861 9.03933C5.26343 9.03249 5.26583 9.02497 5.26583 9.01677C5.25535 7.76661 5.2521 6.253 5.25606 4.47593C5.25946 2.79675 6.58613 1.38951 8.34057 1.26646Z" fill="currentColor"></path><path d="M8.5264 15.3045C6.27918 15.2869 4.66832 13.0758 5.44996 11.0041C5.88114 9.86055 6.9457 9.0267 8.20737 8.89545C8.59097 8.85566 9.05188 8.86591 9.42189 8.79701C11.322 8.44386 12.7897 6.99068 13.0867 5.14047C13.1525 4.7299 13.1181 4.24058 13.215 3.805C13.6636 1.78908 15.9736 0.657869 17.9137 1.56924C18.9252 2.04502 19.6032 2.94326 19.771 4.01623C19.8055 4.23634 19.8167 4.50896 19.8045 4.83408C19.5845 10.6755 14.5956 15.3529 8.5264 15.3045Z" fill="currentColor"></path><path d="M11.3567 16.2337C11.3465 16.229 11.3396 16.2222 11.3359 16.2132C11.3352 16.2114 11.3349 16.2094 11.335 16.2075C11.3351 16.2056 11.3356 16.2037 11.3366 16.202C11.3375 16.2003 11.3388 16.1988 11.3403 16.1976C11.3419 16.1964 11.3437 16.1956 11.3457 16.1951C13.6512 15.6674 15.6487 14.6058 17.338 13.0102C17.3683 12.9815 17.3959 12.9837 17.4208 13.0168C17.6918 13.3736 17.9748 13.7571 18.2016 14.1234C19.1336 15.6279 19.6617 17.2574 19.7857 19.0121C19.8106 19.3659 19.8184 19.6392 19.8091 19.832C19.7254 21.537 18.2985 22.9126 16.4998 22.9229C14.9072 22.9315 13.5071 21.845 13.2046 20.325C13.1333 19.9653 13.1553 19.4669 13.0946 19.0867C12.9071 17.9169 12.3355 16.9702 11.3797 16.2464C11.3754 16.2428 11.3678 16.2386 11.3567 16.2337Z" fill="currentColor"></path><path d="M7.98752 22.874C6.63495 22.6386 5.5466 21.5882 5.30446 20.2814C5.27132 20.1026 5.25476 19.8301 5.25476 19.464C5.25447 18.0227 5.25419 16.5813 5.25391 15.1397C5.25391 15.1255 5.25929 15.1232 5.27005 15.1327C6.15449 15.919 7.08397 16.3993 8.29806 16.4793C8.29919 16.4795 8.40794 16.4831 8.62431 16.4899C10.205 16.5404 11.544 17.5764 11.8528 19.0813C12.3099 21.3064 10.2955 23.2756 7.98752 22.874Z" fill="currentColor"></path>
            </svg>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              if (item.label === "Features") {
                return (
                  <DropdownMenu
                    key={item.label}
                    modal={false}
                    open={featuresOpen}
                    onOpenChange={setFeaturesOpen}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className={desktopNavClass}
                        onMouseEnter={openFeaturesMenu}
                        onMouseLeave={scheduleFeaturesClose}
                      >
                        Features <ChevronDown className="ml-1 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      sideOffset={8}
                      className="w-64 rounded-xl border border-black/10 bg-white p-2 text-gray-900 shadow-2xl"
                      onMouseEnter={openFeaturesMenu}
                      onMouseLeave={scheduleFeaturesClose}
                    >
                      <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900">
                        <Sparkles className="mr-2 h-4 w-4" /> Realtime Canvas
                      </DropdownMenuItem>
                      <div className="mx-3 my-1 h-px bg-black/10" />
                      <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900">
                        <FolderOpen className="mr-2 h-4 w-4" /> Asset Manager
                      </DropdownMenuItem>
                      <div className="mx-3 my-1 h-px bg-black/10" />
                      <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900">
                        <Boxes className="mr-2 h-4 w-4" /> Model Library
                      </DropdownMenuItem>
                      <div className="mx-3 my-1 h-px bg-black/10" />
                      <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900">
                        <Workflow className="mr-2 h-4 w-4" /> Workflow Builder
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )
              }

              return (
                <Link key={item.label} href={item.href}>
                  <Button variant="ghost" className={desktopNavClass}>
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/?auth=signup" scroll={false}>
              <Button className="bg-white text-black hover:bg-gray-100 rounded-full border border-gray-200">
                Sign up for free
              </Button>
            </Link>
            <Link href="/?auth=signin" scroll={false}>
              <Button variant="ghost" className="text-white hover:text-white bg-[#2f2f2f] hover:bg-[#3a3a3a] rounded-full">
                Log in
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className={`md:hidden ${mobileIconClass}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link key={item.label} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="justify-start w-full text-muted-foreground">
                    {item.label}
                  </Button>
                </Link>
              ))}
              <div className="border-t border-border my-2" />
              <Link href="/?auth=signup" scroll={false}>
                <Button className="justify-start w-full bg-foreground text-background hover:bg-foreground/90">
                  Sign up for free
                </Button>
              </Link>
              <Link href="/?auth=signin" scroll={false}>
                <Button variant="ghost" className="justify-start w-full text-muted-foreground">
                  Log in
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
