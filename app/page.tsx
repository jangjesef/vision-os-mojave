"use client"

import { useState, useEffect } from "react"
import { MacOSDesktop } from "@/components/macos-desktop"
import { MenuBar } from "@/components/menu-bar/menu-bar"
import { Dock } from "@/components/dock"
import { FinderWindow } from "@/components/finder-window"
import { SystemPreferencesWindow } from "@/components/system-preferences-window"
import { SafariWindow } from "@/components/safari-window"
import { TerminalWindow } from "@/components/terminal-window"
import { PDFReaderWindow } from "@/components/pdf-reader-window"
import { BootScreen } from "@/components/boot-screen"
import { LoginScreen } from "@/components/login-screen"
import { ContextMenuProvider } from "@/components/context-menu/context-menu-provider"
import { FileSystemProvider } from "@/contexts/file-system-context"
import { MusicPlayerWindow } from "@/components/music-player-window"
import { ContactFormWindow } from "@/components/contact-form-window"
import type { FileItem } from "@/types/file-system"

// Define the app state interface
interface AppState {
  currentScreen: "boot" | "login" | "desktop"
  windows: {
    finder: {
      open: boolean
      zIndex: number
      position: { x: number; y: number }
      size: { width: number; height: number }
      isMaximized: boolean
      prevState?: { position: { x: number; y: number }; size: { width: number; height: number } }
    }
    systemPreferences: {
      open: boolean
      zIndex: number
      position: { x: number; y: number }
      size: { width: number; height: number }
      isMaximized: boolean
      prevState?: { position: { x: number; y: number }; size: { width: number; height: number } }
    }
    safari: {
      open: boolean
      zIndex: number
      position: { x: number; y: number }
      size: { width: number; height: number }
      isMaximized: boolean
      prevState?: { position: { x: number; y: number }; size: { width: number; height: number } }
    }
    terminal: {
      open: boolean
      zIndex: number
      position: { x: number; y: number }
      size: { width: number; height: number }
      isMaximized: boolean
      prevState?: { position: { x: number; y: number }; size: { width: number; height: number } }
    }
    musicPlayer: {
      open: boolean
      zIndex: number
      position: { x: number; y: number }
      size: { width: number; height: number }
      isMaximized: boolean
      prevState?: { position: { x: number; y: number }; size: { width: number; height: number } }
    }
    contactForm: {
      open: boolean
      zIndex: number
      position: { x: number; y: number }
      size: { width: number; height: number }
      isMaximized: boolean
      prevState?: { position: { x: number; y: number }; size: { width: number; height: number } }
    }
    pdfReader?: {
      open: boolean
      zIndex: number
      position: { x: number; y: number }
      size: { width: number; height: number }
      isMaximized: boolean
      prevState?: { position: { x: number; y: number }; size: { width: number; height: number } }
      file?: FileItem
    }
  }
  activeWindow: keyof typeof initialWindows | "pdfReader" | null
  isLoggedIn: boolean
}

// Initial window state
const initialWindows = {
  finder: {
    open: false,
    zIndex: 1,
    position: { x: 100, y: 80 },
    size: { width: 800, height: 600 },
    isMaximized: false,
  },
  systemPreferences: {
    open: false,
    zIndex: 0,
    position: { x: 150, y: 100 },
    size: { width: 680, height: 500 },
    isMaximized: false,
  },
  safari: {
    open: false,
    zIndex: 0,
    position: { x: 200, y: 120 },
    size: { width: 900, height: 600 },
    isMaximized: false,
  },
  terminal: {
    open: false,
    zIndex: 0,
    position: { x: 250, y: 140 },
    size: { width: 600, height: 400 },
    isMaximized: false,
  },
  musicPlayer: {
    open: false,
    zIndex: 0,
    position: { x: 300, y: 160 },
    size: { width: 400, height: 600 },
    isMaximized: false,
  },
  contactForm: {
    open: false,
    zIndex: 0,
    position: { x: 350, y: 180 },
    size: { width: 500, height: 600 },
    isMaximized: false,
  },
  pdfReader: {
    open: false,
    zIndex: 0,
    position: { x: 300, y: 160 },
    size: { width: 800, height: 700 },
    isMaximized: false,
  },
}

// Initial app state
const initialAppState: AppState = {
  currentScreen: "boot",
  windows: initialWindows,
  activeWindow: null,
  isLoggedIn: false,
}

export default function Home() {
  const [startBoot, setStartBoot] = useState(false)
  const [appState, setAppState] = useState<AppState>(initialAppState)
  const [loginError, setLoginError] = useState<string | null>(null)

  // Load saved state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem("studio-vision-desktop")
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState) as AppState

        // If user was logged in, restore desktop state
        if (parsedState.isLoggedIn) {
          setAppState({
            ...parsedState,
            currentScreen: "desktop", // Always start at desktop if logged in
          })
        } else {
          // Otherwise start at boot screen
          setAppState({
            ...initialAppState,
            currentScreen: "boot",
          })
        }
      } catch (error) {
        console.error("Failed to parse saved state:", error)
      }
    }
  }, [])

  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("studio-vision-desktop", JSON.stringify(appState))
  }, [appState])

  const toggleWindow = (window: keyof typeof initialWindows) => {
    setAppState((prev) => {
      const isOpening = !prev.windows[window].open
      let newActiveWindow = prev.activeWindow

      if (isOpening) {
        newActiveWindow = window
      } else if (window === prev.activeWindow) {
        // Find the next highest z-index window to activate
        const sortedWindows = Object.entries(prev.windows)
          .filter(([key, val]) => val.open && key !== window)
          .sort((a, b) => b[1].zIndex - a[1].zIndex)

        newActiveWindow =
          sortedWindows.length > 0 ? (sortedWindows[0][0] as keyof typeof initialWindows | "pdfReader") : null
      }

      return {
        ...prev,
        windows: {
          ...prev.windows,
          [window]: {
            ...prev.windows[window],
            open: !prev.windows[window].open,
            zIndex: prev.windows[window].open ? prev.windows[window].zIndex : getHighestZIndex(prev.windows) + 1,
          },
        },
        activeWindow: newActiveWindow,
      }
    })
  }

  const openPDFReader = (file: FileItem) => {
    setAppState((prev) => {
      return {
        ...prev,
        windows: {
          ...prev.windows,
          pdfReader: {
            ...prev.windows.pdfReader!,
            open: true,
            zIndex: getHighestZIndex(prev.windows) + 1,
            file: file,
          },
        },
        activeWindow: "pdfReader",
      }
    })
  }

  const closePDFReader = () => {
    setAppState((prev) => {
      // Find the next highest z-index window to activate
      const sortedWindows = Object.entries(prev.windows)
        .filter(([key, val]) => val.open && key !== "pdfReader")
        .sort((a, b) => b[1].zIndex - a[1].zIndex)

      const newActiveWindow =
        sortedWindows.length > 0 ? (sortedWindows[0][0] as keyof typeof initialWindows | "pdfReader") : null

      return {
        ...prev,
        windows: {
          ...prev.windows,
          pdfReader: {
            ...prev.windows.pdfReader!,
            open: false,
          },
        },
        activeWindow: newActiveWindow,
      }
    })
  }

  const bringToFront = (window: keyof typeof initialWindows | "pdfReader") => {
    setAppState((prev) => {
      if (!prev.windows[window]?.open) return prev

      return {
        ...prev,
        windows: {
          ...prev.windows,
          [window]: {
            ...prev.windows[window]!,
            zIndex: getHighestZIndex(prev.windows) + 1,
          },
        },
        activeWindow: window,
      }
    })
  }

  const updatePosition = (window: keyof typeof initialWindows | "pdfReader", x: number, y: number) => {
    setAppState((prev) => ({
      ...prev,
      windows: {
        ...prev.windows,
        [window]: {
          ...prev.windows[window]!,
          position: { x, y },
        },
      },
    }))
  }

  const updateSize = (window: keyof typeof initialWindows | "pdfReader", width: number, height: number) => {
    setAppState((prev) => ({
      ...prev,
      windows: {
        ...prev.windows,
        [window]: {
          ...prev.windows[window]!,
          size: { width, height },
        },
      },
    }))
  }

  const getHighestZIndex = (windows: AppState["windows"]) => {
    return Math.max(
      windows.finder.zIndex,
      windows.systemPreferences.zIndex,
      windows.safari.zIndex,
      windows.terminal.zIndex,
      windows.musicPlayer.zIndex,
      windows.contactForm.zIndex,
      windows.pdfReader?.zIndex || 0,
    )
  }

  const handleBootComplete = () => {
    setAppState((prev) => ({
      ...prev,
      currentScreen: prev.isLoggedIn ? "desktop" : "login",
    }))
  }

  const handleLogin = (username: string, password: string) => {
    if ((username === "studio" && password === "vision") || password === "vision") {
      setLoginError(null)
      setAppState((prev) => ({
        ...prev,
        currentScreen: "desktop",
        isLoggedIn: true,
      }))
    } else {
      setLoginError("Invalid username or password")
    }
  }

  const handleLogout = () => {
    setAppState((prev) => ({
      ...prev,
      isLoggedIn: false,
      currentScreen: "login",
    }))
  }

  const maximizeWindow = (window: keyof typeof initialWindows | "pdfReader") => {
    setAppState((prev) => {
      const currentWindow = prev.windows[window]!

      // If already maximized, restore to previous state
      if (currentWindow.isMaximized) {
        const prevState = currentWindow.prevState || {
          position: {
            x: 100 + Object.keys(initialWindows).indexOf(window as keyof typeof initialWindows) * 50,
            y: 80 + Object.keys(initialWindows).indexOf(window as keyof typeof initialWindows) * 20,
          },
          size: {
            width:
              window === "finder"
                ? 800
                : window === "systemPreferences"
                  ? 680
                  : window === "safari"
                    ? 900
                    : window === "musicPlayer"
                      ? 400
                      : window === "contactForm"
                        ? 500
                        : window === "pdfReader"
                          ? 800
                          : 600,
            height:
              window === "finder"
                ? 600
                : window === "systemPreferences"
                  ? 500
                  : window === "safari"
                    ? 600
                    : window === "musicPlayer"
                      ? 600
                      : window === "contactForm"
                        ? 600
                        : window === "pdfReader"
                          ? 700
                          : 400,
          },
        }

        return {
          ...prev,
          windows: {
            ...prev.windows,
            [window]: {
              ...prev.windows[window]!,
              position: prevState.position,
              size: prevState.size,
              isMaximized: false,
              prevState: undefined,
            },
          },
        }
      }
      // Otherwise, maximize and save current state
      else {
        return {
          ...prev,
          windows: {
            ...prev.windows,
            [window]: {
              ...prev.windows[window]!,
              prevState: {
                position: { ...currentWindow.position },
                size: { ...currentWindow.size },
              },
              isMaximized: true,
            },
          },
        }
      }
    })
  }

  return (
    <ContextMenuProvider>
      <FileSystemProvider>
        <div className="dark">
          {appState.currentScreen === "boot" && (
            <>
              {!startBoot ? (
                <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
                  <div className="flex flex-col items-center">
                    <svg className="w-20 h-20 text-white mb-8" viewBox="0 0 1024 1024" fill="currentColor">
                      <path d="M747.4 535.7c-.4-68.2 30.5-119.6 92.9-157.5-34.9-50-87.7-77.5-157.3-82.8-65.9-5.2-138 38.4-164.4 38.4-27.9 0-91.7-36.6-150.5-35.6-77.1 1.1-147.7 46.4-187.3 117.4-81.3 144.2-20.7 355.9 57.4 472.3 38.5 55.8 83.9 118.2 143.9 115.9 58.1-2.2 79.8-36.9 149.6-36.9 69.9 0 90.1 36.9 151.3 35.6 62.5-1.3 102-56.4 140-112.5 43.6-64.6 61.7-127.8 62.7-131-1.4-.6-120.4-47.3-121.7-188.3zm-121.6-349.2c31.5-39.8 52.8-94.9 46.9-150.5-45.3 6-101.9 34.1-134.7 75.3-29.5 35.8-54.1 95.1-47.5 150.7 50.3 4.1 101.6-25.8 135.3-75.5z" />
                    </svg>
                    <button
                      onClick={() => setStartBoot(true)}
                      className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full transition-colors"
                    >
                      Click to Start
                    </button>
                  </div>
                </div>
              ) : (
                <BootScreen onBootComplete={handleBootComplete} startBoot={startBoot} />
              )}
            </>
          )}

          {appState.currentScreen === "login" && <LoginScreen onLogin={handleLogin} error={loginError} />}

          {appState.currentScreen === "desktop" && (
            <MacOSDesktop>
              <MenuBar activeWindow={appState.activeWindow} onLogout={handleLogout} />

              {appState.windows.finder.open && (
                <FinderWindow
                  zIndex={appState.windows.finder.zIndex}
                  position={appState.windows.finder.position}
                  size={appState.windows.finder.size}
                  onClose={() => toggleWindow("finder")}
                  onFocus={() => bringToFront("finder")}
                  onDrag={(x, y) => updatePosition("finder", x, y)}
                  onResize={(width, height) => updateSize("finder", width, height)}
                  onMaximize={() => maximizeWindow("finder")}
                  isMaximized={appState.windows.finder.isMaximized}
                  onOpenFile={openPDFReader}
                />
              )}

              {appState.windows.systemPreferences.open && (
                <SystemPreferencesWindow
                  zIndex={appState.windows.systemPreferences.zIndex}
                  position={appState.windows.systemPreferences.position}
                  size={appState.windows.systemPreferences.size}
                  onClose={() => toggleWindow("systemPreferences")}
                  onFocus={() => bringToFront("systemPreferences")}
                  onDrag={(x, y) => updatePosition("systemPreferences", x, y)}
                  onResize={(width, height) => updateSize("systemPreferences", width, height)}
                  onMaximize={() => maximizeWindow("systemPreferences")}
                  isMaximized={appState.windows.systemPreferences.isMaximized}
                />
              )}

              {appState.windows.safari.open && (
                <SafariWindow
                  zIndex={appState.windows.safari.zIndex}
                  position={appState.windows.safari.position}
                  size={appState.windows.safari.size}
                  onClose={() => toggleWindow("safari")}
                  onFocus={() => bringToFront("safari")}
                  onDrag={(x, y) => updatePosition("safari", x, y)}
                  onResize={(width, height) => updateSize("safari", width, height)}
                  onMaximize={() => maximizeWindow("safari")}
                  isMaximized={appState.windows.safari.isMaximized}
                />
              )}

              {appState.windows.terminal.open && (
                <TerminalWindow
                  zIndex={appState.windows.terminal.zIndex}
                  position={appState.windows.terminal.position}
                  size={appState.windows.terminal.size}
                  onClose={() => toggleWindow("terminal")}
                  onFocus={() => bringToFront("terminal")}
                  onDrag={(x, y) => updatePosition("terminal", x, y)}
                  onResize={(width, height) => updateSize("terminal", width, height)}
                  onMaximize={() => maximizeWindow("terminal")}
                  isMaximized={appState.windows.terminal.isMaximized}
                />
              )}

              {appState.windows.musicPlayer.open && (
                <MusicPlayerWindow
                  zIndex={appState.windows.musicPlayer.zIndex}
                  position={appState.windows.musicPlayer.position}
                  size={appState.windows.musicPlayer.size}
                  onClose={() => toggleWindow("musicPlayer")}
                  onFocus={() => bringToFront("musicPlayer")}
                  onDrag={(x, y) => updatePosition("musicPlayer", x, y)}
                  onResize={(width, height) => updateSize("musicPlayer", width, height)}
                  onMaximize={() => maximizeWindow("musicPlayer")}
                  isMaximized={appState.windows.musicPlayer.isMaximized}
                />
              )}

              {appState.windows.contactForm.open && (
                <ContactFormWindow
                  zIndex={appState.windows.contactForm.zIndex}
                  position={appState.windows.contactForm.position}
                  size={appState.windows.contactForm.size}
                  onClose={() => toggleWindow("contactForm")}
                  onFocus={() => bringToFront("contactForm")}
                  onDrag={(x, y) => updatePosition("contactForm", x, y)}
                  onResize={(width, height) => updateSize("contactForm", width, height)}
                  onMaximize={() => maximizeWindow("contactForm")}
                  isMaximized={appState.windows.contactForm.isMaximized}
                />
              )}

              {appState.windows.pdfReader?.open && appState.windows.pdfReader.file && (
                <PDFReaderWindow
                  zIndex={appState.windows.pdfReader.zIndex}
                  position={appState.windows.pdfReader.position}
                  size={appState.windows.pdfReader.size}
                  filePath={appState.windows.pdfReader.file.path || ""}
                  fileName={appState.windows.pdfReader.file.name}
                  onClose={closePDFReader}
                  onFocus={() => bringToFront("pdfReader")}
                  onDrag={(x, y) => updatePosition("pdfReader", x, y)}
                  onResize={(width, height) => updateSize("pdfReader", width, height)}
                  onMaximize={() => maximizeWindow("pdfReader")}
                  isMaximized={appState.windows.pdfReader.isMaximized}
                />
              )}

              <Dock
                onFinderClick={() => toggleWindow("finder")}
                onPreferencesClick={() => toggleWindow("systemPreferences")}
                onSafariClick={() => toggleWindow("safari")}
                onTerminalClick={() => toggleWindow("terminal")}
                onMusicPlayerClick={() => toggleWindow("musicPlayer")}
                onContactFormClick={() => toggleWindow("contactForm")}
                activeWindows={{
                  finder: appState.windows.finder.open,
                  systemPreferences: appState.windows.systemPreferences.open,
                  safari: appState.windows.safari.open,
                  terminal: appState.windows.terminal.open,
                  musicPlayer: appState.windows.musicPlayer.open,
                  contactForm: appState.windows.contactForm.open,
                }}
              />
            </MacOSDesktop>
          )}
        </div>
      </FileSystemProvider>
    </ContextMenuProvider>
  )
}

