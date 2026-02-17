"use client"

import { Info, Settings, ShoppingBag, Clock, XCircle, Moon, RefreshCw, Power, LogOut, ChevronRight } from "lucide-react"

interface AppleMenuProps {
  onLogout?: () => void
}

export function AppleMenu({ onLogout }: AppleMenuProps) {
  const menuItems = [
    {
      id: "about",
      label: "About This Mac",
      icon: <Info className="h-4 w-4" />,
      action: () => console.log("About This Mac"),
    },
    { id: "divider1", divider: true },
    {
      id: "preferences",
      label: "System Preferences...",
      icon: <Settings className="h-4 w-4" />,
      action: () => console.log("System Preferences"),
    },
    {
      id: "appstore",
      label: "App Store...",
      icon: <ShoppingBag className="h-4 w-4" />,
      action: () => console.log("App Store"),
    },
    { id: "divider2", divider: true },
    {
      id: "recent",
      label: "Recent Items",
      icon: <Clock className="h-4 w-4" />,
      hasSubmenu: true,
      action: () => console.log("Recent Items"),
    },
    { id: "divider3", divider: true },
    {
      id: "forcequit",
      label: "Force Quit...",
      icon: <XCircle className="h-4 w-4" />,
      shortcut: "⌥⌘⎋",
      action: () => console.log("Force Quit"),
    },
    { id: "divider4", divider: true },
    { id: "sleep", label: "Sleep", icon: <Moon className="h-4 w-4" />, action: () => console.log("Sleep") },
    {
      id: "restart",
      label: "Restart...",
      icon: <RefreshCw className="h-4 w-4" />,
      action: () => console.log("Restart"),
    },
    {
      id: "shutdown",
      label: "Shut Down...",
      icon: <Power className="h-4 w-4" />,
      action: () => console.log("Shut Down"),
    },
    { id: "divider5", divider: true },
    {
      id: "logout",
      label: "Log Out Admin...",
      icon: <LogOut className="h-4 w-4" />,
      shortcut: "⇧⌘Q",
      action: onLogout || (() => console.log("Log Out")),
    },
  ]

  return (
    <div className="absolute left-0 top-full mt-1 py-1 bg-[#2a2a2a]/95 backdrop-blur-md rounded-md shadow-xl border border-[#3a3a3a]/50 w-64 animate-in fade-in zoom-in-95 duration-100">
      {menuItems.map((item) => (
        <div key={item.id}>
          {item.divider ? (
            <div className="h-px bg-[#3a3a3a]/50 my-1 mx-1" />
          ) : (
            <button
              className="w-full text-left px-4 py-1.5 flex items-center justify-between hover:bg-blue-500/90 text-white/90"
              onClick={item.action}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              <div className="flex items-center">
                {item.shortcut && <span className="text-xs text-white/50 ml-4">{item.shortcut}</span>}
                {item.hasSubmenu && <ChevronRight className="h-3.5 w-3.5 ml-2" />}
              </div>
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

