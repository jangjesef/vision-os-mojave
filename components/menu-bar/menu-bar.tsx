"use client"

import { useState, useEffect, useRef } from "react"
import { Wifi, Battery, SearchIcon, Cog, BellDot } from "lucide-react"
import { AppleIcon } from "./apple-icon"
import { MenuDropdown } from "./menu-dropdown"
import { finderMenus, safariMenus, terminalMenus, systemPreferencesMenus, defaultMenus } from "./menu-data"
import { AppleMenu } from "../apple-menu/apple-menu"
import { SpotlightSearch } from "../spotlight-search/spotlight-search"
import { ControlCenter } from "../control-center/control-center"
import { NotificationCenter } from "../notification-center/notification-center"

interface MenuBarProps {
  activeWindow: "finder" | "safari" | "terminal" | "systemPreferences" | "musicPlayer" | "contactForm" | "pdfReader" | null
  onLogout?: () => void
}

export function MenuBar({ activeWindow, onLogout }: MenuBarProps) {
  const [time, setTime] = useState("")
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [isMouseInMenu, setIsMouseInMenu] = useState(false)
  const [isAppleMenuOpen, setIsAppleMenuOpen] = useState(false)
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false)
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false)
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false)

  const appleMenuRef = useRef<HTMLDivElement>(null)
  const controlCenterRef = useRef<HTMLDivElement>(null)
  const notificationCenterRef = useRef<HTMLDivElement>(null)
  const spotlightRef = useRef<HTMLDivElement>(null)

  // Get the appropriate menu data based on the active window
  const getMenuData = () => {
    switch (activeWindow) {
      case "finder":
        return { title: "Finder", menus: finderMenus }
      case "safari":
        return { title: "Safari", menus: safariMenus }
      case "terminal":
        return { title: "Terminal", menus: terminalMenus }
      case "systemPreferences":
        return { title: "System Preferences", menus: systemPreferencesMenus }
      default:
        return { title: "Finder", menus: defaultMenus }
    }
  }

  const { title, menus } = getMenuData()

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const options: Intl.DateTimeFormatOptions = {
        weekday: "short",
        hour: "numeric",
        minute: "2-digit",
      }
      setTime(now.toLocaleString("en-US", options))
    }

    updateTime()
    const interval = setInterval(updateTime, 60000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close Apple Menu if clicked outside
      if (isAppleMenuOpen && appleMenuRef.current && !appleMenuRef.current.contains(event.target as Node)) {
        setIsAppleMenuOpen(false)
      }

      // Close Control Center if clicked outside
      if (isControlCenterOpen && controlCenterRef.current && !controlCenterRef.current.contains(event.target as Node)) {
        setIsControlCenterOpen(false)
      }

      // Close Notification Center if clicked outside
      if (
        isNotificationCenterOpen &&
        notificationCenterRef.current &&
        !notificationCenterRef.current.contains(event.target as Node)
      ) {
        setIsNotificationCenterOpen(false)
      }

      // Close Spotlight if clicked outside
      if (isSpotlightOpen && spotlightRef.current && !spotlightRef.current.contains(event.target as Node)) {
        setIsSpotlightOpen(false)
      }
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsAppleMenuOpen(false)
        setIsControlCenterOpen(false)
        setIsNotificationCenterOpen(false)
        setIsSpotlightOpen(false)
        setActiveMenu(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscapeKey)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [isAppleMenuOpen, isControlCenterOpen, isNotificationCenterOpen, isSpotlightOpen])

  const handleMenuMouseEnter = (menuId: string) => {
    if (activeMenu) {
      setActiveMenu(menuId)
    }
  }

  const handleMenuClick = (menuId: string) => {
    // Close other menus/panels when opening a menu
    setIsAppleMenuOpen(false)
    setIsControlCenterOpen(false)
    setIsNotificationCenterOpen(false)
    setIsSpotlightOpen(false)

    setActiveMenu(activeMenu === menuId ? null : menuId)
  }

  const handleMouseLeave = () => {
    setIsMouseInMenu(false)
    // Add a small delay before closing the menu to make it feel more natural
    setTimeout(() => {
      if (!isMouseInMenu) {
        setActiveMenu(null)
      }
    }, 300)
  }

  const toggleAppleMenu = () => {
    // Close other menus/panels when opening Apple Menu
    setActiveMenu(null)
    setIsControlCenterOpen(false)
    setIsNotificationCenterOpen(false)
    setIsSpotlightOpen(false)

    setIsAppleMenuOpen(!isAppleMenuOpen)
  }

  const toggleSpotlight = () => {
    // Close other menus/panels when opening Spotlight
    setActiveMenu(null)
    setIsAppleMenuOpen(false)
    setIsControlCenterOpen(false)
    setIsNotificationCenterOpen(false)

    setIsSpotlightOpen(!isSpotlightOpen)
  }

  const toggleControlCenter = () => {
    // Close other menus/panels when opening Control Center
    setActiveMenu(null)
    setIsAppleMenuOpen(false)
    setIsNotificationCenterOpen(false)
    setIsSpotlightOpen(false)

    setIsControlCenterOpen(!isControlCenterOpen)
  }

  const toggleNotificationCenter = () => {
    // Close other menus/panels when opening Notification Center
    setActiveMenu(null)
    setIsAppleMenuOpen(false)
    setIsControlCenterOpen(false)
    setIsSpotlightOpen(false)

    setIsNotificationCenterOpen(!isNotificationCenterOpen)
  }

  return (
    <>
      <div
        className="fixed top-0 left-0 right-0 h-7 bg-black/80 backdrop-blur-md text-white/90 flex items-center px-4 z-50 text-sm"
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex items-center gap-4">
          <div ref={appleMenuRef} className="relative">
            <button
              className={`font-bold hover:bg-white/10 rounded px-2 py-0.5 transition-colors ${
                isAppleMenuOpen ? "bg-blue-500 text-white" : ""
              }`}
              onClick={toggleAppleMenu}
            >
              <AppleIcon className="h-4 w-4 fill-current" />
            </button>

            {isAppleMenuOpen && <AppleMenu onLogout={onLogout} />}
          </div>

          <span className="font-semibold">{title}</span>

          {menus.map((menu) => (
            <div key={menu.id} className="relative">
              <button
                className={`px-2 py-0.5 rounded transition-colors ${
                  activeMenu === menu.id ? "bg-blue-500 text-white" : "hover:bg-white/10"
                }`}
                onClick={() => handleMenuClick(menu.id)}
                onMouseEnter={() => handleMenuMouseEnter(menu.id)}
              >
                {menu.label}
              </button>

              {activeMenu === menu.id && (
                <MenuDropdown
                  items={menu.items}
                  onMouseEnter={() => setIsMouseInMenu(true)}
                  onMouseLeave={() => setIsMouseInMenu(false)}
                />
              )}
            </div>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div ref={controlCenterRef} className="relative">
            <button
              className={`flex items-center justify-center w-6 h-6 rounded-full ${
                isControlCenterOpen ? "bg-blue-500 text-white" : "hover:bg-white/10"
              }`}
              onClick={toggleControlCenter}
            >
              <Cog className="h-4 w-4" />
            </button>

            {isControlCenterOpen && <ControlCenter />}
          </div>

          <div ref={notificationCenterRef} className="relative">
            <button
              className={`flex items-center justify-center w-6 h-6 rounded-full ${
                isNotificationCenterOpen ? "bg-blue-500 text-white" : "hover:bg-white/10"
              }`}
              onClick={toggleNotificationCenter}
            >
              <BellDot className="h-4 w-4" />
            </button>
          </div>

          <Wifi className="h-4 w-4" />
          <Battery className="h-4 w-4" />

          <div ref={spotlightRef} className="relative">
            <button
              className={`flex items-center justify-center w-6 h-6 rounded-full ${
                isSpotlightOpen ? "bg-blue-500 text-white" : "hover:bg-white/10"
              }`}
              onClick={toggleSpotlight}
            >
              <SearchIcon className="h-4 w-4" />
            </button>
          </div>

          <button className="hover:text-white" onClick={toggleNotificationCenter}>
            <span>{time}</span>
          </button>
        </div>
      </div>

      {isSpotlightOpen && <SpotlightSearch onClose={() => setIsSpotlightOpen(false)} />}
      {isNotificationCenterOpen && <NotificationCenter onClose={() => setIsNotificationCenterOpen(false)} />}
    </>
  )
}
