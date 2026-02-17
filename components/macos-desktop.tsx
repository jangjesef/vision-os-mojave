"use client"

import type React from "react"

import { type ReactNode, useCallback, useState, useEffect } from "react"
import { DesktopIcon } from "./desktop-icon"
import { FolderPlus, RefreshCw, Settings, Image, Info } from "lucide-react"
import { useContextMenu } from "./context-menu/context-menu-provider"
import { useFileSystem } from "@/contexts/file-system-context"

interface MacOSDesktopProps {
  children: ReactNode
}

export function MacOSDesktop({ children }: MacOSDesktopProps) {
  const { showContextMenu } = useContextMenu()
  const { getFilesByParent, moveFile } = useFileSystem()
  const [isDragOver, setIsDragOver] = useState(false)
  const [showWelcomeTooltip, setShowWelcomeTooltip] = useState(true)

  const desktopFiles = getFilesByParent("desktop")

  // Hide welcome tooltip after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomeTooltip(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      showContextMenu({
        items: [
          {
            label: "New Folder",
            icon: <FolderPlus className="h-4 w-4" />,
            onClick: () => console.log("New Folder clicked"),
          },
          {
            label: "Change Wallpaper",
            icon: <Image className="h-4 w-4" />,
            onClick: () => console.log("Change Wallpaper clicked"),
          },
          { divider: true },
          {
            label: "Refresh",
            icon: <RefreshCw className="h-4 w-4" />,
            onClick: () => console.log("Refresh clicked"),
          },
          {
            label: "Show View Options",
            icon: <Settings className="h-4 w-4" />,
            onClick: () => console.log("Show View Options clicked"),
          },
          { divider: true },
          {
            label: "About Studio Vision",
            icon: <Info className="h-4 w-4" />,
            onClick: () => console.log("About Studio Vision clicked"),
          },
        ],
        x: e.clientX,
        y: e.clientY,
      })
    },
    [showContextMenu],
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"))
      if (data.fileId) {
        moveFile(data.fileId, "desktop")
      }
    } catch (error) {
      console.error("Error handling drop:", error)
    }
  }

  return (
    <div
      className={`relative h-screen w-screen overflow-hidden bg-cover bg-center bg-no-repeat ${
        isDragOver ? "bg-blue-500/10" : ""
      }`}
      style={{
        backgroundImage:
          "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mojave.jpg-hdg3vqcacn0TYgsBwdpHZ5QOOvX6he.jpeg')",
        backgroundColor: "#1a1a1a",
      }}
      onContextMenu={handleContextMenu}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Welcome tooltip */}
      {showWelcomeTooltip && (
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-md text-white px-6 py-4 rounded-lg shadow-xl border border-white/20 z-40 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-start gap-3">
            <div className="bg-blue-500/20 rounded-full p-2">
              <Info className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Welcome to Studio Vision</h3>
              <p className="text-sm text-white/80 max-w-md">
                Click on the Finder icon in the dock to browse our portfolio, or use Safari to explore our services.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="absolute right-6 top-6 grid grid-cols-1 gap-4">
        <DesktopIcon
          file={{
            id: "macintosh-hd",
            name: "Studio Vision",
            type: "folder",
            parent: "root",
            icon: "/icons/studio-vision-icon.webp",
          }}
        />
      </div>

      <div className="absolute left-6 top-6 grid grid-cols-1 gap-6">
        {desktopFiles.map((file) => (
          <DesktopIcon key={file.id} file={file} onDoubleClick={() => console.log(`Open ${file.name}`)} />
        ))}
      </div>

      {children}
    </div>
  )
}

