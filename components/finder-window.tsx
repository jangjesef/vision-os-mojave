"use client"

import type React from "react"

import { useState } from "react"
import { DraggableWindow } from "./draggable-window"
import {
  Search,
  Grid3X3,
  List,
  ChevronRight,
  Clock,
  Cloud,
  Home,
  Download,
  ComputerIcon as Desktop,
  FileIcon as Document,
  Image,
  Film,
  Music,
  ArrowUpDown,
  Eye,
  FolderIcon,
  Camera,
  Palette,
  Video,
  Globe,
  Megaphone,
} from "lucide-react"
import { useFileSystem } from "@/contexts/file-system-context"
import type { FileItem } from "@/types/file-system"

interface FinderWindowProps {
  zIndex: number
  position: { x: number; y: number }
  size: { width: number; height: number }
  onClose: () => void
  onFocus: () => void
  onDrag: (x: number, y: number) => void
  onResize: (width: number, height: number) => void
  onMaximize: () => void
  isMaximized?: boolean
  onOpenFile?: (file: FileItem) => void
}

interface SidebarItem {
  id: string
  name: string
  icon: React.ReactNode
  isActive?: boolean
  location: string
}

type ViewMode = "icon" | "list" | "column"

export function FinderWindow({
  zIndex,
  position,
  size,
  onClose,
  onFocus,
  onDrag,
  onResize,
  onMaximize,
  isMaximized,
  onOpenFile,
}: FinderWindowProps) {
  const { getFilesByParent, moveFile } = useFileSystem()
  const [viewMode, setViewMode] = useState<ViewMode>("icon")
  const [currentLocation, setCurrentLocation] = useState("desktop")
  const [searchQuery, setSearchQuery] = useState("")
  const [isDragOver, setIsDragOver] = useState(false)
  const [dragOverItem, setDragOverItem] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)

  const favoriteItems: SidebarItem[] = [
    { id: "recents", name: "Recents", icon: <Clock className="w-4 h-4 text-blue-400" />, location: "recents" },
    { id: "airdrop", name: "AirDrop", icon: <Cloud className="w-4 h-4 text-blue-400" />, location: "airdrop" },
    {
      id: "applications",
      name: "Applications",
      icon: <Grid3X3 className="w-4 h-4 text-blue-400" />,
      location: "applications",
    },
    {
      id: "desktop",
      name: "Desktop",
      icon: <Desktop className="w-4 h-4 text-blue-400" />,
      isActive: currentLocation === "desktop",
      location: "desktop",
    },
    {
      id: "documents",
      name: "Documents",
      icon: <Document className="w-4 h-4 text-blue-400" />,
      isActive: currentLocation === "documents",
      location: "documents",
    },
    {
      id: "downloads",
      name: "Downloads",
      icon: <Download className="w-4 h-4 text-blue-400" />,
      isActive: currentLocation === "downloads",
      location: "downloads",
    },
    {
      id: "beats",
      name: "Beats",
      icon: <Music className="w-4 h-4 text-blue-400" />,
      isActive: currentLocation === "beats",
      location: "beats",
    },
    { id: "home", name: "Home", icon: <Home className="w-4 h-4 text-blue-400" />, location: "home" },
  ]

  const locationItems: SidebarItem[] = [
    { id: "icloud", name: "iCloud Drive", icon: <Cloud className="w-4 h-4 text-gray-400" />, location: "icloud" },
    { id: "macintosh", name: "Macintosh HD", icon: <Home className="w-4 h-4 text-gray-400" />, location: "macintosh" },
  ]

  // Get files for current location
  const files = getFilesByParent(currentLocation)

  const resolveFolderLocation = (file: FileItem) => {
    const normalizedName = file.name.toLowerCase()
    const locationByName: Record<string, string> = {
      photography: "photography",
      "graphic design": "design",
      "video production": "video",
      "web development": "web",
      marketing: "marketing",
      portfolio: "portfolio",
      documents: "documents",
      downloads: "downloads",
      applications: "applications",
      desktop: "desktop",
      beats: "beats",
    }

    if (locationByName[normalizedName]) {
      return locationByName[normalizedName]
    }

    const locationFiles = getFilesByParent(file.id)
    if (locationFiles.length > 0) {
      return file.id
    }

    return null
  }

  const getFileIcon = (file: FileItem) => {
    if (file.icon) {
      return <img src={file.icon || "/placeholder.svg"} alt={file.name} className="w-10 h-10" />
    }

    if (file.type === "folder") {
      return (
        <div className="w-10 h-10 text-blue-400">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2v11z" />
          </svg>
        </div>
      )
    } else if (file.type === "file") {
      if (file.extension === "txt") {
        return <Document className="w-10 h-10 text-blue-500" />
      } else if (file.extension === "pdf") {
        return <Document className="w-10 h-10 text-red-500" />
      } else if (["jpg", "png", "gif", "webp"].includes(file.extension || "")) {
        return <Image className="w-10 h-10 text-purple-400" />
      } else if (["mp4", "mov", "avi"].includes(file.extension || "")) {
        return <Film className="w-10 h-10 text-pink-500" />
      } else if (["mp3", "wav", "m4a"].includes(file.extension || "")) {
        return <Music className="w-10 h-10 text-red-500" />
      }
    }

    return <Document className="w-10 h-10 text-gray-400" />
  }

  // Add a file preview component to show when a file is selected
  const FilePreview = ({ file }: { file: FileItem | null }) => {
    if (!file) return null

    return (
      <div className="w-64 border-l border-[#3a3a3a] bg-[#262626] p-4 flex flex-col">
        <div className="flex justify-center mb-4">
          <div className="w-32 h-32 flex items-center justify-center">{getFileIcon(file)}</div>
        </div>
        <h3 className="text-white font-medium mb-2">{file.name}</h3>
        <div className="text-white/70 text-sm space-y-2">
          <div>
            <span className="text-white/50">Type:</span>{" "}
            {file.type === "folder" ? "Folder" : file.extension?.toUpperCase() || "File"}
          </div>
          {file.size && (
            <div>
              <span className="text-white/50">Size:</span> {file.size}
            </div>
          )}
          {file.modified && (
            <div>
              <span className="text-white/50">Modified:</span> {file.modified}
            </div>
          )}
          {file.description && (
            <div className="mt-4 pt-4 border-t border-[#3a3a3a]">
              <span className="text-white/50 block mb-1">Description:</span>
              <p className="text-white/80">{file.description}</p>
            </div>
          )}
        </div>
        {file.type === "file" && file.extension !== "txt" && (
          <button
            className="mt-auto bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md text-sm flex items-center justify-center gap-2 transition-colors"
            onClick={() => console.log("Open file:", file.name)}
          >
            <Eye className="h-4 w-4" />
            <span>Quick Look</span>
          </button>
        )}
      </div>
    )
  }

  // Add a breadcrumb navigation component
  const BreadcrumbNavigation = ({
    currentLocation,
    onNavigate,
  }: {
    currentLocation: string
    onNavigate: (location: string) => void
  }) => {
    const getPathParts = () => {
      if (
        currentLocation === "desktop" ||
        currentLocation === "documents" ||
        currentLocation === "downloads" ||
        currentLocation === "applications" ||
        currentLocation === "beats"
      ) {
        return [currentLocation]
      }

      if (
        currentLocation === "portfolio" ||
        currentLocation === "photography" ||
        currentLocation === "design" ||
        currentLocation === "video" ||
        currentLocation === "web" ||
        currentLocation === "marketing"
      ) {
        return ["portfolio", currentLocation]
      }

      return [currentLocation]
    }

    const pathParts = getPathParts()

    return (
      <div className="flex items-center text-xs text-white/70 px-4 py-1">
        <Home className="h-3 w-3 mr-1" />
        {pathParts.map((part, index) => (
          <div key={part} className="flex items-center">
            {index > 0 && <ChevronRight className="h-3 w-3 mx-1" />}
            <button className="hover:text-white capitalize" onClick={() => onNavigate(part)}>
              {part}
            </button>
          </div>
        ))}
      </div>
    )
  }

  // Add a sidebar navigation component with visual indicators
  const SidebarNavigation = ({
    currentLocation,
    onNavigate,
    favoriteItems,
  }: {
    currentLocation: string
    onNavigate: (location: string) => void
    favoriteItems: SidebarItem[]
  }) => {
    return (
      <div className="w-48 bg-[#252525] p-2 text-white/80 text-sm">
        <div className="mb-4">
          <h3 className="text-xs uppercase text-white/50 px-2 py-1">Favorites</h3>
          <div className="space-y-1">
            {favoriteItems.map((item) => (
              <div
                key={item.id}
                className={`px-2 py-1 rounded cursor-default flex items-center gap-2 ${
                  item.isActive || currentLocation === item.location ? "bg-blue-500/30" : "hover:bg-white/10"
                }`}
                onClick={() => onNavigate(item.location)}
              >
                {item.icon}
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-xs uppercase text-white/50 px-2 py-1">YUNG98 OS</h3>
          <div className="space-y-1">
            <div
              className={`px-2 py-1 rounded cursor-default flex items-center gap-2 ${
                currentLocation === "portfolio" ? "bg-blue-500/30" : "hover:bg-white/10"
              }`}
              onClick={() => onNavigate("portfolio")}
            >
              <FolderIcon className="h-4 w-4 text-blue-400" />
              <span>Portfolio</span>
            </div>
            <div
              className={`px-2 py-1 rounded cursor-default flex items-center gap-2 ${
                currentLocation === "photography" ? "bg-blue-500/30" : "hover:bg-white/10"
              }`}
              onClick={() => onNavigate("photography")}
            >
              <Camera className="h-4 w-4 text-purple-400" />
              <span>Photography</span>
            </div>
            <div
              className={`px-2 py-1 rounded cursor-default flex items-center gap-2 ${
                currentLocation === "design" ? "bg-blue-500/30" : "hover:bg-white/10"
              }`}
              onClick={() => onNavigate("design")}
            >
              <Palette className="h-4 w-4 text-green-400" />
              <span>Graphic Design</span>
            </div>
            <div
              className={`px-2 py-1 rounded cursor-default flex items-center gap-2 ${
                currentLocation === "video" ? "bg-blue-500/30" : "hover:bg-white/10"
              }`}
              onClick={() => onNavigate("video")}
            >
              <Video className="h-4 w-4 text-red-400" />
              <span>Video Production</span>
            </div>
            <div
              className={`px-2 py-1 rounded cursor-default flex items-center gap-2 ${
                currentLocation === "web" ? "bg-blue-500/30" : "hover:bg-white/10"
              }`}
              onClick={() => onNavigate("web")}
            >
              <Globe className="h-4 w-4 text-blue-400" />
              <span>Web Development</span>
            </div>
            <div
              className={`px-2 py-1 rounded cursor-default flex items-center gap-2 ${
                currentLocation === "marketing" ? "bg-blue-500/30" : "hover:bg-white/10"
              }`}
              onClick={() => onNavigate("marketing")}
            >
              <Megaphone className="h-4 w-4 text-yellow-400" />
              <span>Marketing</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const filteredFiles = searchQuery
    ? files.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : files

  const handleSidebarItemClick = (location: string) => {
    setCurrentLocation(location)
  }

  const handleDragOver = (e: React.DragEvent, folderId?: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setIsDragOver(true)
    if (folderId) {
      setDragOverItem(folderId)
    }
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
    setDragOverItem(null)
  }

  const handleDrop = (e: React.DragEvent, targetFolder?: string) => {
    e.preventDefault()
    setIsDragOver(false)
    setDragOverItem(null)

    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"))
      if (data.fileId) {
        const targetFolderItem = targetFolder ? files.find((item) => item.id === targetFolder) : null
        const mappedTarget = targetFolderItem ? resolveFolderLocation(targetFolderItem) : null

        if (targetFolder) {
          // Move to specific folder
          moveFile(data.fileId, mappedTarget || currentLocation)
        } else {
          // Move to current location
          moveFile(data.fileId, currentLocation)
        }
      }
    } catch (error) {
      console.error("Error handling drop:", error)
    }
  }

  const handleFileDragStart = (e: React.DragEvent, file: FileItem) => {
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        fileId: file.id,
        fileType: file.type,
        fileName: file.name,
      }),
    )
    e.dataTransfer.effectAllowed = "move"
  }

  const handleFileDoubleClick = (file: FileItem) => {
    if (file.type === "folder") {
      const nextLocation = resolveFolderLocation(file)
      if (nextLocation) {
        setCurrentLocation(nextLocation)
      }
    } else if (onOpenFile) {
      // Open the file
      onOpenFile(file)
    }
  }

  const handleFileClick = (file: FileItem) => {
    setSelectedFile(file)
  }

  const handleLocationChange = (location: string) => {
    setCurrentLocation(location)
    setSelectedFile(null)
  }

  return (
    <DraggableWindow
      title="Finder"
      width={size.width}
      height={size.height}
      zIndex={zIndex}
      position={position}
      onClose={onClose}
      onFocus={onFocus}
      onDrag={onDrag}
      onResize={onResize}
      onMaximize={onMaximize}
      isMaximized={isMaximized}
    >
      <div className="flex h-full">
        {/* Sidebar */}
        <SidebarNavigation
          currentLocation={currentLocation}
          onNavigate={handleLocationChange}
          favoriteItems={favoriteItems}
        />

        {/* Main content */}
        <div
          className={`flex-1 flex flex-col ${isDragOver && !dragOverItem ? "bg-blue-500/10" : ""}`}
          onDragOver={(e) => handleDragOver(e)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e)}
        >
          {/* Path Bar */}
          <div className="h-8 bg-[#2d2d2d] border-b border-[#3a3a3a] flex items-center px-4">
            <BreadcrumbNavigation currentLocation={currentLocation} onNavigate={handleLocationChange} />
          </div>

          {/* Toolbar */}
          <div className="h-10 bg-[#2d2d2d] border-b border-[#3a3a3a] flex items-center px-4 gap-4">
            <div className="flex items-center gap-1">
              <button
                className={`w-8 h-8 rounded hover:bg-white/10 flex items-center justify-center ${
                  viewMode === "icon" ? "bg-white/20" : ""
                }`}
                onClick={() => setViewMode("icon")}
              >
                <Grid3X3 className="w-4 h-4 text-white/70" />
              </button>
              <button
                className={`w-8 h-8 rounded hover:bg-white/10 flex items-center justify-center ${
                  viewMode === "list" ? "bg-white/20" : ""
                }`}
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4 text-white/70" />
              </button>
              <button className="w-8 h-8 rounded hover:bg-white/10 flex items-center justify-center">
                <Eye className="w-4 h-4 text-white/70" />
              </button>
              <button className="w-8 h-8 rounded hover:bg-white/10 flex items-center justify-center">
                <ArrowUpDown className="w-4 h-4 text-white/70" />
              </button>
            </div>

            <div className="ml-auto relative">
              <Search className="absolute left-2 top-1.5 w-4 h-4 text-white/50" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-7 w-48 bg-[#1d1d1d] rounded-md pl-8 pr-2 text-sm text-white/80 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Files area */}
          {viewMode === "icon" ? (
            <div className="flex-1 p-4 grid grid-cols-4 gap-4 overflow-auto">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className={`flex flex-col items-center justify-between w-24 h-24 gap-1 p-2 rounded ${
                    dragOverItem === file.id && file.type === "folder" ? "bg-blue-500/30" : "hover:bg-white/10"
                  } cursor-default`}
                  draggable
                  onDragStart={(e) => handleFileDragStart(e, file)}
                  onDragOver={(e) => (file.type === "folder" ? handleDragOver(e, file.id) : undefined)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => (file.type === "folder" ? handleDrop(e, file.id) : undefined)}
                  onDoubleClick={() => handleFileDoubleClick(file)}
                  onClick={() => handleFileClick(file)}
                >
                  {getFileIcon(file)}
                  <span className="text-white text-xs text-center">{file.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 overflow-auto">
              <table className="w-full text-sm text-white/80">
                <thead className="sticky top-0 bg-[#2d2d2d]">
                  <tr className="border-b border-[#3a3a3a]">
                    <th className="text-left py-2 px-4 font-medium">Name</th>
                    <th className="text-left py-2 px-4 font-medium">Date Modified</th>
                    <th className="text-left py-2 px-4 font-medium">Size</th>
                    <th className="text-left py-2 px-4 font-medium">Kind</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.map((file) => (
                    <tr
                      key={file.id}
                      className={`border-b border-[#3a3a3a] ${
                        dragOverItem === file.id && file.type === "folder" ? "bg-blue-500/30" : "hover:bg-white/5"
                      }`}
                      draggable
                      onDragStart={(e) => handleFileDragStart(e, file)}
                      onDragOver={(e) => (file.type === "folder" ? handleDragOver(e, file.id) : undefined)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => (file.type === "folder" ? handleDrop(e, file.id) : undefined)}
                      onDoubleClick={() => handleFileDoubleClick(file)}
                      onClick={() => handleFileClick(file)}
                    >
                      <td className="py-2 px-4 flex items-center gap-2">
                        <div className="w-5 h-5">{getFileIcon(file)}</div>
                        <span>{file.name}</span>
                      </td>
                      <td className="py-2 px-4">{file.modified}</td>
                      <td className="py-2 px-4">{file.size || "--"}</td>
                      <td className="py-2 px-4">
                        {file.type === "folder"
                          ? "Folder"
                          : file.type === "app"
                            ? "Application"
                            : file.extension
                              ? file.extension.toUpperCase()
                              : "File"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Status bar */}
          <div className="h-6 bg-[#2d2d2d] border-t border-[#3a3a3a] flex items-center px-4 text-xs text-white/60">
            <span>{filteredFiles.length} items</span>
            <span className="ml-auto">42.5 GB available</span>
          </div>
        </div>
        <FilePreview file={selectedFile} />
      </div>
    </DraggableWindow>
  )
}
