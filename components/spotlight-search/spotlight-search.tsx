"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, X, Folder, Globe, Terminal, Settings, Calculator, Mail, Calendar, Music, Image } from "lucide-react"

interface SpotlightSearchProps {
  onClose: () => void
}

interface SearchResult {
  id: string
  name: string
  type: "app" | "file" | "folder" | "website"
  icon: React.ReactNode
  action: () => void
}

export function SpotlightSearch({ onClose }: SpotlightSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const allItems: SearchResult[] = [
    {
      id: "safari",
      name: "Safari",
      type: "app",
      icon: <Globe className="h-6 w-6 text-blue-400" />,
      action: () => console.log("Open Safari"),
    },
    {
      id: "terminal",
      name: "Terminal",
      type: "app",
      icon: <Terminal className="h-6 w-6 text-gray-400" />,
      action: () => console.log("Open Terminal"),
    },
    {
      id: "system-preferences",
      name: "System Preferences",
      type: "app",
      icon: <Settings className="h-6 w-6 text-gray-400" />,
      action: () => console.log("Open System Preferences"),
    },
    {
      id: "calculator",
      name: "Calculator",
      type: "app",
      icon: <Calculator className="h-6 w-6 text-gray-400" />,
      action: () => console.log("Open Calculator"),
    },
    {
      id: "mail",
      name: "Mail",
      type: "app",
      icon: <Mail className="h-6 w-6 text-blue-400" />,
      action: () => console.log("Open Mail"),
    },
    {
      id: "calendar",
      name: "Calendar",
      type: "app",
      icon: <Calendar className="h-6 w-6 text-red-400" />,
      action: () => console.log("Open Calendar"),
    },
    {
      id: "music",
      name: "Music",
      type: "app",
      icon: <Music className="h-6 w-6 text-pink-400" />,
      action: () => console.log("Open Music"),
    },
    {
      id: "photos",
      name: "Photos",
      type: "app",
      icon: <Image className="h-6 w-6 text-purple-400" />,
      action: () => console.log("Open Photos"),
    },
    {
      id: "documents",
      name: "Documents",
      type: "folder",
      icon: <Folder className="h-6 w-6 text-blue-400" />,
      action: () => console.log("Open Documents"),
    },
    {
      id: "downloads",
      name: "Downloads",
      type: "folder",
      icon: <Folder className="h-6 w-6 text-blue-400" />,
      action: () => console.log("Open Downloads"),
    },
  ]

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Filter results based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    const filtered = allItems.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    setResults(filtered)
    setSelectedIndex(0)
  }, [searchQuery])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
    } else if (e.key === "Enter" && results.length > 0) {
      e.preventDefault()
      const selected = results[selectedIndex]
      if (selected) {
        selected.action()
        onClose()
      }
    }
  }

  const handleResultClick = (result: SearchResult) => {
    result.action()
    onClose()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[100] backdrop-blur-sm">
      <div className="w-[600px] bg-[#2a2a2a]/90 backdrop-blur-md rounded-xl shadow-2xl border border-[#3a3a3a]/50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search input */}
        <div className="relative p-4 border-b border-[#3a3a3a]/50">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-white/50" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full h-10 pl-10 pr-10 bg-[#1d1d1d] rounded-md text-white/90 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/70"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-white/50 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="max-h-[400px] overflow-y-auto p-2">
            {results.map((result, index) => (
              <div
                key={result.id}
                className={`flex items-center gap-3 p-3 rounded-md cursor-default ${
                  index === selectedIndex ? "bg-blue-500/70" : "hover:bg-white/10"
                }`}
                onClick={() => handleResultClick(result)}
              >
                <div className="flex-shrink-0">{result.icon}</div>
                <div className="flex-1">
                  <div className="text-white font-medium">{result.name}</div>
                  <div className="text-xs text-white/60 capitalize">{result.type}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No results */}
        {searchQuery && results.length === 0 && (
          <div className="p-6 text-center text-white/60">No results found for "{searchQuery}"</div>
        )}

        {/* Empty state */}
        {!searchQuery && <div className="p-6 text-center text-white/60">Type to search for apps, files, and more</div>}
      </div>
    </div>
  )
}

