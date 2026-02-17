"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"

export interface ContextMenuItem {
  label?: string
  icon?: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  danger?: boolean
  divider?: boolean
}

interface ContextMenuProps {
  items: ContextMenuItem[]
  x: number
  y: number
  onClose: () => void
  title?: string
  width?: number
}

export function ContextMenu({ items, x, y, onClose, title, width = 220 }: ContextMenuProps) {
  const [position, setPosition] = useState({ x, y })
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Adjust position if menu would go off screen
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect()
      const newPosition = { ...position }

      if (rect.right > window.innerWidth) {
        newPosition.x = window.innerWidth - rect.width - 10
      }

      if (rect.bottom > window.innerHeight) {
        newPosition.y = window.innerHeight - rect.height - 10
      }

      if (newPosition.x !== position.x || newPosition.y !== position.y) {
        setPosition(newPosition)
      }
    }
  }, [position])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [onClose])

  // Animation classes
  const animationClasses = "animate-in fade-in zoom-in-95 duration-100"

  return createPortal(
    <div
      ref={menuRef}
      className={`fixed z-[1000] rounded-md bg-[#2a2a2a]/90 backdrop-blur-md shadow-xl border border-[#3a3a3a]/50 text-white/90 overflow-hidden ${animationClasses}`}
      style={{
        left: position.x,
        top: position.y,
        width: width,
      }}
    >
      {title && (
        <div className="px-3 py-2 text-xs font-medium text-white/60 border-b border-[#3a3a3a]/50 flex items-center justify-between">
          <span>{title}</span>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
      <div className="py-1">
        {items.map((item, index) => (
          <div key={index}>
            {item.divider ? (
              <div className="h-px bg-[#3a3a3a]/50 my-1 mx-1" />
            ) : (
              <button
                onClick={() => {
                  if (!item.disabled && item.onClick) {
                    item.onClick()
                    onClose()
                  }
                }}
                disabled={item.disabled}
                className={`w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 ${
                  item.disabled
                    ? "text-white/40 cursor-not-allowed"
                    : item.danger
                      ? "text-red-400 hover:bg-red-500/20"
                      : "hover:bg-blue-500/30"
                }`}
              >
                {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                <span className="flex-1">{item.label}</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>,
    document.body,
  )
}
