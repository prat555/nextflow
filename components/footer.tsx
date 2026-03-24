import Link from "next/link"
import { Twitter, Youtube, Github } from "lucide-react"

const footerLinks = {
  Product: [
    { name: "Image Generation", href: "#" },
    { name: "Video Generation", href: "#" },
    { name: "3D Generation", href: "#" },
    { name: "Image Upscaling", href: "#" },
    { name: "Video Upscaling", href: "#" },
    { name: "Real-time Canvas", href: "#" },
  ],
  Resources: [
    { name: "Documentation", href: "#" },
    { name: "API Reference", href: "#" },
    { name: "Tutorials", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Changelog", href: "#" },
  ],
  Company: [
    { name: "About", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Press", href: "#" },
    { name: "Contact", href: "#" },
  ],
  Legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Logo and social */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="font-semibold text-xl text-gray-900">krea</span>
            </Link>
            <p className="text-sm text-gray-500 mb-6">
              The most powerful AI suite for creatives.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="#"
                className="text-gray-400 hover:text-gray-900 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-gray-900 transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-gray-900 transition-colors"
              >
                <Github className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-gray-900 mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Krea AI. All rights reserved.
          </p>
          <p className="text-sm text-gray-500">
            Made with AI for creatives everywhere.
          </p>
        </div>
      </div>
    </footer>
  )
}
