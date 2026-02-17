"use client"

import { type ReactNode, useRef, useState, useEffect, type MouseEvent } from "react"
import { WindowControls } from "./window-controls"
import { useContextMenu } from "./context-menu/context-menu-provider"
import { Minimize2, Maximize2, X, ArrowDown } from "lucide-react"

interface DraggableWindowProps {
  title: string
  children: ReactNode
  width: string | number
  height: string | number
  zIndex: number
  position: { x: number; y: number }
  onClose: () => void
  onFocus: () => void
  onDrag: (x: number, y: number) => void
  onResize?: (width: number, height: number) => void
  onMaximize?: () => void
  isMaximized?: boolean
}

export function DraggableWindow({
  title,
  children,
  width,
  height,
  zIndex,
  position,
  onClose,
  onFocus,
  onDrag,
  onResize,
  onMaximize,
  isMaximized = false,
}: DraggableWindowProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState<string | null>(null)
  const dragRef = useRef<{ startX: number; startY: number }>()
  const resizeRef = useRef<{ startX: number; startY: number; startWidth: number; startHeight: number }>()
  const windowRef = useRef<HTMLDivElement>(null)
  const { showContextMenu } = useContextMenu()

  const handleMouseDown = (e: MouseEvent) => {
    // Don't allow dragging when maximized
    if (isMaximized) return

    onFocus()
    setIsDragging(true)
    dragRef.current = {
      startX: e.clientX - position.x,
      startY: e.clientY - position.y,
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && dragRef.current) {
      const newX = e.clientX - dragRef.current.startX
      const newY = e.clientY - dragRef.current.startY
      onDrag(newX, newY)
    } else if (isResizing && resizeRef.current && resizeDirection) {
      const currentWidth = typeof width === "string" ? Number.parseInt(width) : width
      const currentHeight = typeof height === "string" ? Number.parseInt(height) : height

      let newWidth = currentWidth
      let newHeight = currentHeight
      let newX = position.x
      let newY = position.y

      if (resizeDirection.includes("e")) {
        newWidth = resizeRef.current.startWidth + (e.clientX - resizeRef.current.startX)
      }
      if (resizeDirection.includes("s")) {
        newHeight = resizeRef.current.startHeight + (e.clientY - resizeRef.current.startY)
      }
      if (resizeDirection.includes("w")) {
        const deltaX = e.clientX - resizeRef.current.startX
        newWidth = resizeRef.current.startWidth - deltaX
        newX = position.x + deltaX
      }
      if (resizeDirection.includes("n")) {
        const deltaY = e.clientY - resizeRef.current.startY
        newHeight = resizeRef.current.startHeight - deltaY
        newY = position.y + deltaY
      }

      // Minimum window size
      newWidth = Math.max(300, newWidth)
      newHeight = Math.max(200, newHeight)

      if (onResize) {
        onResize(newWidth, newHeight)
      }
      if (resizeDirection.includes("w") || resizeDirection.includes("n")) {
        onDrag(newX, newY)
      }
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsResizing(false)
    setResizeDirection(null)
  }

  const handleResizeStart = (e: MouseEvent, direction: string) => {
    // Don't allow resizing when maximized
    if (isMaximized) return

    e.stopPropagation()
    e.preventDefault()
    onFocus()
    setIsResizing(true)
    setResizeDirection(direction)

    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: typeof width === "string" ? Number.parseInt(width) : width,
      startHeight: typeof height === "string" ? Number.parseInt(height) : height,
    }
  }

  const handleTitleDoubleClick = () => {
    if (onMaximize) {
      onMaximize()
    }
  }

  const handleTitlebarContextMenu = (e: MouseEvent) => {
    e.preventDefault()
    showContextMenu({
      items: [
        {
          label: "Minimize",
          icon: <Minimize2 className="h-4 w-4" />,
          onClick: () => console.log("Minimize window"),
        },
        {
          label: "Zoom",
          icon: <Maximize2 className="h-4 w-4" />,
          onClick: onMaximize,
        },
        {
          label: "Close",
          icon: <X className="h-4 w-4" />,
          onClick: onClose,
          danger: true,
        },
        { divider: true },
        {
          label: "Move to Desktop",
          icon: <ArrowDown className="h-4 w-4" />,
          onClick: () => console.log("Move to Desktop"),
        },
      ],
      x: e.clientX,
      y: e.clientY,
    })
  }

  // Clean up event listeners
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
    }

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging && dragRef.current) {
        const newX = e.clientX - dragRef.current.startX
        const newY = e.clientY - dragRef.current.startY
        onDrag(newX, newY)
      }
    }

    window.addEventListener("mouseup", handleGlobalMouseUp)
    window.addEventListener("mousemove", handleGlobalMouseMove as any)

    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp)
      window.removeEventListener("mousemove", handleGlobalMouseMove as any)
    }
  }, [isDragging, onDrag])

  // Calculate styles based on maximized state
  const windowStyle = isMaximized
    ? {
        width: "100%",
        height: "calc(100vh - 80px)", // Leave space for menu bar and dock
        left: 0,
        top: 28, // Menu bar height
        zIndex,
        transition: "all 0.3s ease",
        borderRadius: "0.5rem 0.5rem 0 0", // Only round the top corners when maximized
      }
    : {
        width: typeof width === "string" ? width : `${width}px`,
        height: typeof height === "string" ? height : `${height}px`,
        left: position.x,
        top: position.y,
        zIndex,
        transition: "all 0.3s ease",
      }

  return (
    <div
      ref={windowRef}
      className="absolute rounded-lg shadow-2xl overflow-hidden bg-[#2a2a2a] border border-[#3a3a3a] transition-all"
      style={windowStyle}
      onClick={onFocus}
    >
      <div
        className="h-10 bg-[#323232] flex items-center cursor-move select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDoubleClick={handleTitleDoubleClick}
        onContextMenu={handleTitlebarContextMenu}
      >
        <WindowControls onClose={onClose} onMaximize={onMaximize} />
        <div className="flex-1 text-center text-white/80 text-sm font-medium">{title}</div>
        <div className="w-16"></div>
      </div>

      <div
        className="overflow-auto"
        style={{
          height: `calc(${isMaximized ? "100vh - 80px - 2.5rem" : typeof height === "string" ? height : `${height}px`} - 2.5rem)`,
        }}
      >
        {children}
      </div>

      {/* Resize handles - only show when not maximized */}
      {!isMaximized && (
        <>
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
            onMouseDown={(e) => handleResizeStart(e, "se")}
          />
          <div
            className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize"
            onMouseDown={(e) => handleResizeStart(e, "sw")}
          />
          <div
            className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize"
            onMouseDown={(e) => handleResizeStart(e, "ne")}
          />
          <div
            className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize"
            onMouseDown={(e) => handleResizeStart(e, "nw")}
          />
          <div
            className="absolute right-0 top-0 w-2 h-full cursor-e-resize"
            onMouseDown={(e) => handleResizeStart(e, "e")}
          />
          <div
            className="absolute left-0 top-0 w-2 h-full cursor-w-resize"
            onMouseDown={(e) => handleResizeStart(e, "w")}
          />
          <div
            className="absolute bottom-0 left-0 h-2 w-full cursor-s-resize"
            onMouseDown={(e) => handleResizeStart(e, "s")}
          />
          <div
            className="absolute top-0 left-0 h-2 w-full cursor-n-resize"
            onMouseDown={(e) => handleResizeStart(e, "n")}
          />
        </>
      )}
    </div>
  )
}

