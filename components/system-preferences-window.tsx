"use client"

import { DraggableWindow } from "./draggable-window"
import { PreferenceIcon } from "./preference-icon"
import { Search } from "lucide-react"

interface SystemPreferencesWindowProps {
  zIndex: number
  position: { x: number; y: number }
  size?: { width: number; height: number }
  onClose: () => void
  onFocus: () => void
  onDrag: (x: number, y: number) => void
  onResize?: (width: number, height: number) => void
  onMaximize?: () => void
  isMaximized?: boolean
}

export function SystemPreferencesWindow({
  zIndex,
  position,
  size,
  onClose,
  onFocus,
  onDrag,
  onResize,
  onMaximize,
  isMaximized,
}: SystemPreferencesWindowProps) {
  const preferences = [
    { name: "General", icon: "general" },
    { name: "Desktop & Screen Saver", icon: "desktop" },
    { name: "Dock", icon: "dock" },
    { name: "Mission Control", icon: "mission" },
    { name: "Siri", icon: "siri" },
    { name: "Spotlight", icon: "spotlight" },
    { name: "Language & Region", icon: "language" },
    { name: "Notifications", icon: "notifications" },
    { name: "Internet Accounts", icon: "internet" },
    { name: "Users & Groups", icon: "users" },
    { name: "Accessibility", icon: "accessibility" },
    { name: "Screen Time", icon: "screentime" },
    { name: "Extensions", icon: "extensions" },
    { name: "Security & Privacy", icon: "security" },
    { name: "Software Update", icon: "update" },
    { name: "Network", icon: "network" },
    { name: "Bluetooth", icon: "bluetooth" },
    { name: "Sound", icon: "sound" },
    { name: "Printers & Scanners", icon: "printers" },
    { name: "Keyboard", icon: "keyboard" },
    { name: "Trackpad", icon: "trackpad" },
    { name: "Mouse", icon: "mouse" },
    { name: "Displays", icon: "displays" },
    { name: "Energy Saver", icon: "energy" },
  ]

  return (
    <DraggableWindow
      title="System Preferences"
      width={size?.width || 680}
      height={size?.height || 500}
      zIndex={zIndex}
      position={position}
      onClose={onClose}
      onFocus={onFocus}
      onDrag={onDrag}
      onResize={onResize}
      onMaximize={onMaximize}
      isMaximized={isMaximized}
    >
      <div className="p-4 h-[calc(500px-2.5rem)]">
        <div className="relative mb-6">
          <Search className="absolute left-2 top-2.5 w-4 h-4 text-white/50" />
          <input
            type="text"
            placeholder="Search"
            className="h-8 w-full bg-[#1d1d1d] rounded-md pl-8 pr-2 text-sm text-white/80 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-4 gap-4 overflow-auto">
          {preferences.map((pref, index) => (
            <PreferenceIcon key={index} name={pref.name} icon={pref.icon} />
          ))}
        </div>
      </div>
    </DraggableWindow>
  )
}

