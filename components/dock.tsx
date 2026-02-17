"use client"

import { useContextMenu } from "./context-menu/context-menu-provider"
import { Play, X, FolderOpen } from "lucide-react"

interface DockProps {
  onFinderClick: () => void
  onPreferencesClick: () => void
  onSafariClick: () => void
  onTerminalClick: () => void
  onMusicPlayerClick: () => void
  onContactFormClick: () => void
  activeWindows: {
    finder: boolean
    systemPreferences: boolean
    safari: boolean
    terminal: boolean
    musicPlayer: boolean
    contactForm: boolean
  }
}

export function Dock({
  onFinderClick,
  onPreferencesClick,
  onSafariClick,
  onTerminalClick,
  onMusicPlayerClick,
  onContactFormClick,
  activeWindows,
}: DockProps) {
  const { showContextMenu } = useContextMenu()

  const dockIcons = [
    {
      icon: "/icons/finder.webp",
      name: "Finder",
      onClick: onFinderClick,
      isActive: activeWindows.finder,
      contextMenu: (x: number, y: number) => {
        showContextMenu({
          items: [
            {
              label: "Open",
              icon: <Play className="h-4 w-4" />,
              onClick: onFinderClick,
            },
            { divider: true },
            {
              label: "Hide",
              icon: <X className="h-4 w-4" />,
              onClick: () => console.log("Hide Finder"),
              disabled: !activeWindows.finder,
            },
            {
              label: "Quit",
              icon: <X className="h-4 w-4" />,
              onClick: () => console.log("Quit Finder"),
              disabled: true, // Finder can't be quit in macOS
            },
          ],
          x,
          y,
          title: "Finder",
        })
      },
    },
    {
      icon: "/icons/safari.webp",
      name: "Services",
      onClick: onSafariClick,
      isActive: activeWindows.safari,
      contextMenu: (x: number, y: number) => {
        showContextMenu({
          items: [
            {
              label: "Open",
              icon: <Play className="h-4 w-4" />,
              onClick: onSafariClick,
            },
            { divider: true },
            {
              label: "Hide",
              icon: <X className="h-4 w-4" />,
              onClick: () => console.log("Hide Safari"),
              disabled: !activeWindows.safari,
            },
            {
              label: "Quit",
              icon: <X className="h-4 w-4" />,
              onClick: () => console.log("Quit Safari"),
              disabled: !activeWindows.safari,
            },
            { divider: true },
            {
              label: "Show in Finder",
              icon: <FolderOpen className="h-4 w-4" />,
              onClick: () => console.log("Show Safari in Finder"),
            },
          ],
          x,
          y,
          title: "Services",
        })
      },
    },
    {
      icon: "/icons/music.webp",
      name: "Music Player",
      onClick: onMusicPlayerClick,
      isActive: activeWindows.musicPlayer,
      contextMenu: (x: number, y: number) => {
        showContextMenu({
          items: [
            {
              label: "Open",
              icon: <Play className="h-4 w-4" />,
              onClick: onMusicPlayerClick,
            },
            { divider: true },
            {
              label: "Hide",
              icon: <X className="h-4 w-4" />,
              onClick: () => console.log("Hide Music Player"),
              disabled: !activeWindows.musicPlayer,
            },
            {
              label: "Quit",
              icon: <X className="h-4 w-4" />,
              onClick: () => console.log("Quit Music Player"),
              disabled: !activeWindows.musicPlayer,
            },
            { divider: true },
            {
              label: "Show in Finder",
              icon: <FolderOpen className="h-4 w-4" />,
              onClick: () => console.log("Show Music Player in Finder"),
            },
          ],
          x,
          y,
          title: "Music Player",
        })
      },
    },
    {
      icon: "/icons/terminal.webp",
      name: "Terminal",
      onClick: onTerminalClick,
      isActive: activeWindows.terminal,
      contextMenu: (x: number, y: number) => {
        showContextMenu({
          items: [
            {
              label: "Open",
              icon: <Play className="h-4 w-4" />,
              onClick: onTerminalClick,
            },
            { divider: true },
            {
              label: "Hide",
              icon: <X className="h-4 w-4" />,
              onClick: () => console.log("Hide Terminal"),
              disabled: !activeWindows.terminal,
            },
            {
              label: "Quit",
              icon: <X className="h-4 w-4" />,
              onClick: () => console.log("Quit Terminal"),
              disabled: !activeWindows.terminal,
            },
            { divider: true },
            {
              label: "Show in Finder",
              icon: <FolderOpen className="h-4 w-4" />,
              onClick: () => console.log("Show Terminal in Finder"),
            },
          ],
          x,
          y,
          title: "Terminal",
        })
      },
    },
    {
      icon: "/icons/mail.webp",
      name: "Contact Us",
      onClick: onContactFormClick,
      isActive: activeWindows.contactForm,
      contextMenu: (x: number, y: number) => {
        showContextMenu({
          items: [
            {
              label: "Open",
              icon: <Play className="h-4 w-4" />,
              onClick: onContactFormClick,
            },
            { divider: true },
            {
              label: "Hide",
              icon: <X className="h-4 w-4" />,
              onClick: () => console.log("Hide Contact Form"),
              disabled: !activeWindows.contactForm,
            },
            {
              label: "Quit",
              icon: <X className="h-4 w-4" />,
              onClick: () => console.log("Quit Contact Form"),
              disabled: !activeWindows.contactForm,
            },
            { divider: true },
            {
              label: "Show in Finder",
              icon: <FolderOpen className="h-4 w-4" />,
              onClick: () => console.log("Show Contact Form in Finder"),
            },
          ],
          x,
          y,
          title: "Contact Us",
        })
      },
    },
    {
      icon: "/icons/system-preferences.webp",
      name: "System Preferences",
      onClick: onPreferencesClick,
      isActive: activeWindows.systemPreferences,
      contextMenu: (x: number, y: number) => {
        showContextMenu({
          items: [
            {
              label: "Open",
              icon: <Play className="h-4 w-4" />,
              onClick: onPreferencesClick,
            },
            { divider: true },
            {
              label: "Hide",
              icon: <X className="h-4 w-4" />,
              onClick: () => console.log("Hide System Preferences"),
              disabled: !activeWindows.systemPreferences,
            },
            {
              label: "Quit",
              icon: <X className="h-4 w-4" />,
              onClick: () => console.log("Quit System Preferences"),
              disabled: !activeWindows.systemPreferences,
            },
            { divider: true },
            {
              label: "Show in Finder",
              icon: <FolderOpen className="h-4 w-4" />,
              onClick: () => console.log("Show System Preferences in Finder"),
            },
          ],
          x,
          y,
          title: "System Preferences",
        })
      },
    },
  ]

  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 p-2 rounded-2xl bg-black/20 backdrop-blur-lg border border-white/10 shadow-xl z-50">
      <div className="flex items-end gap-2 h-16 px-2 py-2">
        {dockIcons.map((icon, index) => (
          <div key={index} className="relative group">
            <button
              onClick={icon.onClick}
              onContextMenu={(e) => {
                e.preventDefault()
                icon.contextMenu(e.clientX, e.clientY)
              }}
              className="relative flex items-center justify-center transition-all duration-200 hover:scale-110 hover:-translate-y-1"
              title={icon.name}
            >
              <img src={icon.icon || "/placeholder.svg"} alt={icon.name} className="w-12 h-12 object-contain" />
              {icon.isActive && <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-white"></div>}
            </button>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <div className="px-3 py-1 rounded-md bg-black/80 text-white text-xs whitespace-nowrap shadow-lg">
                {icon.name}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

