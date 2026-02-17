"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useFileSystem } from "@/contexts/file-system-context"
import type { FileItem } from "@/types/file-system"
import { Folder, FileText, File, Music } from "lucide-react"

interface DesktopIconProps {
  file: FileItem
  onDoubleClick?: () => void
}

export function DesktopIcon({ file, onDoubleClick }: DesktopIconProps) {
  const { moveFile } = useFileSystem()
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [iconLoadFailed, setIconLoadFailed] = useState(false)

  useEffect(() => {
    setIconLoadFailed(false)
  }, [file.id, file.icon])

  const getIcon = () => {
    if (file.icon && !iconLoadFailed) {
      return (
        <img
          src={file.icon || "/placeholder.svg"}
          alt={file.name}
          className="w-10 h-10 object-contain"
          onError={() => setIconLoadFailed(true)}
        />
      )
    }

    if (file.type === "folder") {
      return <Folder className="w-10 h-10 text-blue-400" />
    } else if (file.type === "file") {
      if (file.extension === "txt") {
        return <FileText className="w-10 h-10 text-gray-400" />
      } else if (file.extension === "pdf") {
        return <FileText className="w-10 h-10 text-red-400" />
      } else if (["mp3", "wav", "m4a", "ogg", "flac", "aiff", "aac"].includes(file.extension || "")) {
        return <Music className="w-10 h-10 text-orange-400" />
      } else if (["jpg", "png", "gif"].includes(file.extension || "")) {
        return <File className="w-10 h-10 text-purple-400" />
      }
    }

    return <File className="w-10 h-10 text-gray-400" />
  }

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true)

    // Set drag image
    const dragImage = new Image()
    dragImage.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" // Transparent image
    e.dataTransfer.setDragImage(dragImage, 0, 0)

    // Store the file ID in the drag data
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        fileId: file.id,
        fileType: file.type,
        fileName: file.name,
      }),
    )

    // Calculate offset from the cursor to the top-left of the element
    const rect = e.currentTarget.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })

    // Set the drag effect
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  return (
    <div
      className={`flex flex-col items-center gap-1 p-2 rounded-md hover:bg-white/10 cursor-default ${
        isDragging ? "opacity-50" : ""
      }`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDoubleClick={onDoubleClick}
    >
      {getIcon()}
      <span className="text-white text-xs font-medium text-center drop-shadow-md max-w-[80px] truncate">
        {file.name}
      </span>
    </div>
  )
}
