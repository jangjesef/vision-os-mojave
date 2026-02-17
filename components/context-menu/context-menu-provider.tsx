"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { ContextMenu, type ContextMenuItem } from "./context-menu"

interface ContextMenuContextType {
  showContextMenu: (params: {
    items: ContextMenuItem[]
    x: number
    y: number
    title?: string
    width?: number
  }) => void
  hideContextMenu: () => void
}

const ContextMenuContext = createContext<ContextMenuContextType | undefined>(undefined)

export function ContextMenuProvider({ children }: { children: ReactNode }) {
  const [contextMenu, setContextMenu] = useState<{
    items: ContextMenuItem[]
    x: number
    y: number
    title?: string
    width?: number
    visible: boolean
  } | null>(null)

  const showContextMenu = ({
    items,
    x,
    y,
    title,
    width,
  }: {
    items: ContextMenuItem[]
    x: number
    y: number
    title?: string
    width?: number
  }) => {
    setContextMenu({ items, x, y, title, width, visible: true })
  }

  const hideContextMenu = () => {
    setContextMenu(null)
  }

  return (
    <ContextMenuContext.Provider value={{ showContextMenu, hideContextMenu }}>
      {children}
      {contextMenu && contextMenu.visible && (
        <ContextMenu
          items={contextMenu.items}
          x={contextMenu.x}
          y={contextMenu.y}
          title={contextMenu.title}
          width={contextMenu.width}
          onClose={hideContextMenu}
        />
      )}
    </ContextMenuContext.Provider>
  )
}

export function useContextMenu() {
  const context = useContext(ContextMenuContext)
  if (!context) {
    throw new Error("useContextMenu must be used within a ContextMenuProvider")
  }
  return context
}

