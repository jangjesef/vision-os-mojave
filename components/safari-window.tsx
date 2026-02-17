"use client"

import type React from "react"

import { useState, useRef, useEffect, type MouseEvent } from "react"
import { DraggableWindow } from "./draggable-window"
import {
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Shield,
  Star,
  Plus,
  SidebarClose,
  Search,
  X,
  ChevronDown,
  Copy,
  ExternalLink,
  Code,
  ShoppingCart,
  Calendar,
  Camera,
  Video,
  Palette,
  Globe,
  Smartphone,
  Megaphone,
  Check,
  CreditCard,
} from "lucide-react"
import { useContextMenu } from "./context-menu/context-menu-provider"

interface SafariWindowProps {
  zIndex: number
  position: { x: number; y: number }
  size: { width: number; height: number }
  onClose: () => void
  onFocus: () => void
  onDrag: (x: number, y: number) => void
  onResize: (width: number, height: number) => void
  onMaximize: () => void
  isMaximized?: boolean
}

interface Tab {
  id: string
  title: string
  url: string
  favicon?: string
  isActive: boolean
}

interface Service {
  id: string
  name: string
  description: string
  image: string
  category: string
  leasePrice: string
  exclusivePrice: string
}

interface CartItem extends Service {
  cartId: string
  selectedLicense: "Lease" | "Exclusive"
  price: string
}

interface RepoBeatFile {
  name: string
  path: string
  extension: string
  size: string
  title?: string
  artist?: string
  album?: string
  price?: string
  leasePrice?: string
  exclusivePrice?: string
  category?: string
  bpm?: number
  key?: string
  mood?: string
  cover?: string
  description?: string
}

// Add a tooltip component for guiding users
const ServiceTooltip = ({
  message,
  onClose,
}: {
  message: string
  onClose: () => void
}) => {
  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg z-50 animate-in fade-in slide-in-from-top-4 duration-300 max-w-md">
      <div className="flex items-start gap-2">
        <div className="flex-1 text-sm">{message}</div>
        <button onClick={onClose} className="text-white/80 hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

// Add a beat category explanation component
const CategoryExplanation = ({
  category,
}: {
  category: string
}) => {
  const getCategoryInfo = () => {
    switch (category) {
      case "trap":
        return {
          title: "Trap Beats",
          description:
            "Heavy 808s, dark melodies, and hard drums built for aggressive flows and club energy.",
          icon: <Camera className="h-6 w-6" />,
        }
      case "drill":
        return {
          title: "Drill Beats",
          description:
            "Sliding bass, menacing bounce, and raw textures inspired by UK/NY drill movement.",
          icon: <Palette className="h-6 w-6" />,
        }
      case "rnb":
        return {
          title: "R&B Vibes",
          description:
            "Smooth chord progressions, warm bass, and late-night bounce for melodic records.",
          icon: <Video className="h-6 w-6" />,
        }
      case "boom-bap":
        return {
          title: "Boom Bap",
          description:
            "Dusty drums, soul chops, and classic head-nod grooves for timeless rap cuts.",
          icon: <Globe className="h-6 w-6" />,
        }
      case "afro":
        return {
          title: "Afro Bounce",
          description:
            "Rhythmic bounce, bright percussion, and melodic pockets for global crossover records.",
          icon: <Megaphone className="h-6 w-6" />,
        }
      default:
        return {
          title: "All Beats",
          description: "Browse the full YUNG98 catalog, filter by vibe, and build your crate.",
          icon: <Smartphone className="h-6 w-6" />,
        }
    }
  }

  const info = getCategoryInfo()

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 mb-6 border border-white/10">
      <div className="flex items-center gap-3">
        <div className="bg-blue-500/20 p-3 rounded-full text-blue-400">{info.icon}</div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">{info.title}</h3>
          <p className="text-sm text-white/70">{info.description}</p>
        </div>
      </div>
    </div>
  )
}

// Add a checkout step indicator
const CheckoutSteps = ({
  currentStep,
}: {
  currentStep: "cart" | "checkout" | "confirmation"
}) => {
  return (
    <div className="flex items-center justify-center mb-6">
      <div className="flex items-center">
        <div
          className={`flex flex-col items-center ${currentStep === "cart" ? "text-blue-500" : (currentStep === "checkout" || currentStep === "confirmation") ? "text-green-500" : "text-gray-400"}`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "cart" ? "bg-blue-500 text-white" : (currentStep === "checkout" || currentStep === "confirmation") ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}
          >
            <ShoppingCart className="h-4 w-4" />
          </div>
          <span className="text-xs mt-1">Crate</span>
        </div>

        <div
          className={`w-12 h-0.5 ${currentStep === "checkout" || currentStep === "confirmation" ? "bg-green-500" : "bg-gray-200"}`}
        ></div>

        <div
          className={`flex flex-col items-center ${currentStep === "checkout" ? "text-blue-500" : currentStep === "confirmation" ? "text-green-500" : "text-gray-400"}`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "checkout" ? "bg-blue-500 text-white" : currentStep === "confirmation" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}
          >
            <CreditCard className="h-4 w-4" />
          </div>
          <span className="text-xs mt-1">License</span>
        </div>

        <div className={`w-12 h-0.5 ${currentStep === "confirmation" ? "bg-green-500" : "bg-gray-200"}`}></div>

        <div
          className={`flex flex-col items-center ${currentStep === "confirmation" ? "text-green-500" : "text-gray-400"}`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "confirmation" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}
          >
            <Check className="h-4 w-4" />
          </div>
          <span className="text-xs mt-1">Confirmation</span>
        </div>
      </div>
    </div>
  )
}

// Add a beat card component with hover effects
const ServiceCard = ({
  service,
  onAddToCart,
}: {
  service: Service
  onAddToCart: (service: Service, selectedLicense: "Lease" | "Exclusive") => void
}) => {
  const [selectedLicense, setSelectedLicense] = useState<"Lease" | "Exclusive">("Lease")

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "trap":
        return <Camera className="h-5 w-5" />
      case "drill":
        return <Palette className="h-5 w-5" />
      case "rnb":
        return <Video className="h-5 w-5" />
      case "boom-bap":
        return <Globe className="h-5 w-5" />
      case "afro":
        return <Megaphone className="h-5 w-5" />
      default:
        return <Smartphone className="h-5 w-5" />
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:shadow-xl hover:-translate-y-1">
      <div className="h-48 overflow-hidden">
        <img
          src={service.image || "/placeholder.svg?height=192&width=384"}
          alt={service.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
            {getCategoryIcon(service.category)}
          </div>
          <span className="text-sm text-gray-500 capitalize">{service.category}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{service.name}</h3>
        <p className="text-gray-600 mb-4">{service.description}</p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            onClick={() => setSelectedLicense("Lease")}
            className={`px-3 py-2 rounded-md text-sm font-medium border transition-colors ${
              selectedLicense === "Lease"
                ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}
          >
            Lease {service.leasePrice}
          </button>
          <button
            onClick={() => setSelectedLicense("Exclusive")}
            className={`px-3 py-2 rounded-md text-sm font-medium border transition-colors ${
              selectedLicense === "Exclusive"
                ? "bg-amber-100 text-amber-700 border-amber-300"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}
          >
            Exclusive {service.exclusivePrice}
          </button>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-gray-800">
            {selectedLicense === "Lease" ? service.leasePrice : service.exclusivePrice}
          </span>
          <button
            onClick={() => onAddToCart(service, selectedLicense)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 group"
          >
            <ShoppingCart className="h-4 w-4 group-hover:animate-bounce" />
            <span>Add {selectedLicense}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// Add a cart notification component
const CartNotification = ({
  show,
  message,
  onClose,
}: {
  show: boolean
  message: string
  onClose: () => void
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  return (
    <div className="fixed top-20 right-4 bg-green-500 text-white px-4 py-3 rounded-md shadow-lg z-50 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-2">
        <Check className="h-5 w-5" />
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 text-white/80 hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export function SafariWindow({
  zIndex,
  position,
  size,
  onClose,
  onFocus,
  onDrag,
  onResize,
  onMaximize,
  isMaximized,
}: SafariWindowProps) {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: "tab1",
      title: "YUNG98 OS - Beat Store",
      url: "https://yung98.com/beats",
      favicon: "/icons/studio-vision-favicon.png",
      isActive: true,
    },
  ])

  const [inputUrl, setInputUrl] = useState("https://yung98.com/beats")
  const [currentUrl, setCurrentUrl] = useState("https://yung98.com/beats")
  const [canGoBack, setCanGoBack] = useState(false)
  const [canGoForward, setCanGoForward] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [services, setServices] = useState<Service[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [checkoutSuccess, setCheckoutSuccess] = useState(false)
  const [cartNotification, setCartNotification] = useState({ show: false, message: "" })
  const [showTooltip, setShowTooltip] = useState(true)

  const iframeRef = useRef<HTMLIFrameElement>(null)
  const urlHistory = useRef<string[]>([])
  const historyPosition = useRef<number>(0)
  const { showContextMenu } = useContextMenu()

  const parsePrice = (price: string) => Number.parseFloat(price.replace(/[^\d.]/g, "")) || 0
  const defaultLeasePrice = "$99"
  const defaultExclusivePrice = "$249"

  const toBeatTitle = (fileName: string) => {
    const baseName = fileName.replace(/\.[^.]+$/, "")
    return baseName
      .replace(/[._-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase())
  }

  const detectCategory = (fileName: string, index: number) => {
    const name = fileName.toLowerCase()
    if (name.includes("drill")) return "drill"
    if (name.includes("rnb") || name.includes("piano")) return "rnb"
    if (name.includes("boom") || name.includes("bap")) return "boom-bap"
    if (name.includes("afro") || name.includes("dance")) return "afro"
    const fallback = ["trap", "drill", "rnb", "boom-bap", "afro"]
    return fallback[index % fallback.length]
  }

  useEffect(() => {
    const loadBeatsForStore = async () => {
      try {
        const response = await fetch("/api/beats")
        if (!response.ok) {
          return
        }

        const data = (await response.json()) as { beats?: RepoBeatFile[] }
        const beats = data.beats ?? []

        const mapped = beats.map((beat, index) => {
          const fallbackLease = beat.leasePrice || beat.price || defaultLeasePrice
          const fallbackExclusive = beat.exclusivePrice || defaultExclusivePrice

          return {
            id: `beat-${index + 1}`,
            name: beat.title || toBeatTitle(beat.name),
            description:
              beat.description || `${beat.extension.toUpperCase()} preview from /public/beats (${beat.size}).`,
            image: beat.cover || `/images/album-cover-${(index % 4) + 1}.jpg`,
            category: beat.category || detectCategory(beat.name, index),
            leasePrice: beat.leasePrice || fallbackLease,
            exclusivePrice: beat.exclusivePrice || fallbackExclusive,
          }
        })

        setServices(mapped)
      } catch (error) {
        console.error("Failed to load beat store items:", error)
      }
    }

    loadBeatsForStore()
  }, [])

  const filteredServices =
    selectedCategory === "all" ? services : services.filter((service) => service.category === selectedCategory)

  const addTab = () => {
    // Set all tabs to inactive
    const updatedTabs = tabs.map((tab) => ({
      ...tab,
      isActive: false,
    }))

    // Add new active tab
    setTabs([
      ...updatedTabs,
      {
        id: `tab${tabs.length + 1}`,
        title: "New Tab",
        url: "about:blank",
        isActive: true,
      },
    ])

    setInputUrl("about:blank")
    setCurrentUrl("about:blank")
    urlHistory.current = ["about:blank"]
    historyPosition.current = 0
    setCanGoBack(false)
    setCanGoForward(false)
  }

  const closeTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()

    if (tabs.length === 1) {
      // Don't close the last tab
      return
    }

    const tabIndex = tabs.findIndex((tab) => tab.id === id)
    const isActiveTab = tabs[tabIndex].isActive

    // Remove the tab
    const newTabs = tabs.filter((tab) => tab.id !== id)

    // If we closed the active tab, activate another one
    if (isActiveTab && newTabs.length > 0) {
      const newActiveIndex = Math.min(tabIndex, newTabs.length - 1)
      newTabs[newActiveIndex].isActive = true
      setInputUrl(newTabs[newActiveIndex].url)
      setCurrentUrl(newTabs[newActiveIndex].url)

      // Reset history for the newly active tab
      urlHistory.current = [newTabs[newActiveIndex].url]
      historyPosition.current = 0
      setCanGoBack(false)
      setCanGoForward(false)
    }

    setTabs(newTabs)
  }

  const activateTab = (id: string) => {
    const updatedTabs = tabs.map((tab) => ({
      ...tab,
      isActive: tab.id === id,
    }))

    const activeTab = updatedTabs.find((tab) => tab.id === id)
    if (activeTab) {
      setInputUrl(activeTab.url)
      setCurrentUrl(activeTab.url)

      // Reset history for the newly active tab
      urlHistory.current = [activeTab.url]
      historyPosition.current = 0
      setCanGoBack(false)
      setCanGoForward(false)
    }

    setTabs(updatedTabs)
  }

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    let url = inputUrl.trim()

    // Add https:// if missing
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`
      setInputUrl(url)
    }

    // Update the current tab
    const updatedTabs = tabs.map((tab) => {
      if (tab.isActive) {
        return {
          ...tab,
          url,
          title: url.replace(/^https?:\/\//, "").split("/")[0],
        }
      }
      return tab
    })

    setTabs(updatedTabs)
    setCurrentUrl(url)

    // Add to history
    urlHistory.current = urlHistory.current.slice(0, historyPosition.current + 1)
    urlHistory.current.push(url)
    historyPosition.current = urlHistory.current.length - 1

    setCanGoBack(historyPosition.current > 0)
    setCanGoForward(false)

    setIsLoading(true)
  }

  const handleRefresh = () => {
    if (iframeRef.current) {
      setIsLoading(true)
      iframeRef.current.src = currentUrl
    }
  }

  const handleGoBack = () => {
    if (historyPosition.current > 0) {
      historyPosition.current--
      const prevUrl = urlHistory.current[historyPosition.current]

      // Update the current tab
      const updatedTabs = tabs.map((tab) => {
        if (tab.isActive) {
          return {
            ...tab,
            url: prevUrl,
            title: prevUrl.replace(/^https?:\/\//, "").split("/")[0],
          }
        }
        return tab
      })

      setTabs(updatedTabs)
      setInputUrl(prevUrl)
      setCurrentUrl(prevUrl)
      setIsLoading(true)

      setCanGoBack(historyPosition.current > 0)
      setCanGoForward(historyPosition.current < urlHistory.current.length - 1)
    }
  }

  const handleGoForward = () => {
    if (historyPosition.current < urlHistory.current.length - 1) {
      historyPosition.current++
      const nextUrl = urlHistory.current[historyPosition.current]

      // Update the current tab
      const updatedTabs = tabs.map((tab) => {
        if (tab.isActive) {
          return {
            ...tab,
            url: nextUrl,
            title: nextUrl.replace(/^https?:\/\//, "").split("/")[0],
          }
        }
        return tab
      })

      setTabs(updatedTabs)
      setInputUrl(nextUrl)
      setCurrentUrl(nextUrl)
      setIsLoading(true)

      setCanGoBack(historyPosition.current > 0)
      setCanGoForward(historyPosition.current < urlHistory.current.length - 1)
    }
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  const handleSafariContextMenu = (e: MouseEvent) => {
    e.preventDefault()
    showContextMenu({
      items: [
        {
          label: "Reload Page",
          icon: <RefreshCw className="h-4 w-4" />,
          onClick: handleRefresh,
        },
        {
          label: "Copy Link",
          icon: <Copy className="h-4 w-4" />,
          onClick: () => {
            navigator.clipboard.writeText(currentUrl)
          },
        },
        { divider: true },
        {
          label: "Open in New Window",
          icon: <ExternalLink className="h-4 w-4" />,
          onClick: () => console.log("Open in New Window"),
        },
        {
          label: "Inspect",
          icon: <Code className="h-4 w-4" />,
          onClick: () => console.log("Inspect"),
        },
      ],
      x: e.clientX,
      y: e.clientY,
    })
  }

  const addToCart = (service: Service, selectedLicense: "Lease" | "Exclusive") => {
    const selectedPrice = selectedLicense === "Lease" ? service.leasePrice : service.exclusivePrice
    const cartItem: CartItem = {
      ...service,
      cartId: `${service.id}-${selectedLicense}-${Date.now()}`,
      selectedLicense,
      price: selectedPrice,
    }

    setCart((prev) => [...prev, cartItem])
    setCartNotification({ show: true, message: `${service.name} (${selectedLicense}) added to crate!` })
  }

  const removeFromCart = (cartId: string) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId))
  }

  const handleCheckout = () => {
    setShowCheckout(true)
  }

  const completeCheckout = () => {
    // Simulate checkout process
    setTimeout(() => {
      setCheckoutSuccess(true)
      setCart([])
    }, 1500)
  }

  // Initialize history on mount
  useEffect(() => {
    urlHistory.current = [currentUrl]
    historyPosition.current = 0
  }, [])

  const activeTab = tabs.find((tab) => tab.isActive) || tabs[0]

  return (
    <DraggableWindow
      title="Safari"
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
      <div className="flex flex-col h-full">
        {/* Tab Bar */}
        <div className="flex items-center bg-[#2d2d2d] border-b border-[#3a3a3a] px-2 h-9">
          <div className="flex-1 flex items-center overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => activateTab(tab.id)}
                className={`flex items-center gap-1 px-3 py-1 rounded-t-lg mr-1 max-w-[200px] min-w-[100px] cursor-default ${
                  tab.isActive ? "bg-[#3a3a3a]" : "bg-[#323232] hover:bg-[#353535]"
                }`}
              >
                {tab.favicon ? (
                  <img src={tab.favicon || "/placeholder.svg"} alt="" className="w-3 h-3" />
                ) : (
                  <img src="/icons/safari.webp" alt="" className="w-3 h-3" />
                )}
                <span className="text-xs text-white/80 truncate flex-1">{tab.title}</span>
                <button
                  onClick={(e) => closeTab(tab.id, e)}
                  className="w-4 h-4 rounded-full hover:bg-[#4a4a4a] flex items-center justify-center"
                >
                  <X className="w-3 h-3 text-white/60" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addTab}
            className="w-6 h-6 rounded-full hover:bg-[#3a3a3a] flex items-center justify-center ml-1"
          >
            <Plus className="w-4 h-4 text-white/70" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 p-2 bg-[#2d2d2d] border-b border-[#3a3a3a]">
          <div className="flex items-center gap-1">
            <button
              className={`w-8 h-8 rounded-full ${canGoBack ? "hover:bg-white/10 text-white/70" : "text-white/30"} flex items-center justify-center`}
              onClick={handleGoBack}
              disabled={!canGoBack}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              className={`w-8 h-8 rounded-full ${canGoForward ? "hover:bg-white/10 text-white/70" : "text-white/30"} flex items-center justify-center`}
              onClick={handleGoForward}
              disabled={!canGoForward}
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Address Bar */}
          <form onSubmit={handleUrlSubmit} className="flex-1 mx-2">
            <div className="flex items-center bg-[#1d1d1d] rounded-lg h-8 px-3">
              <Shield className="w-4 h-4 text-green-500 mr-2" />
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-white/80 flex-1"
              />
              <button
                type="button"
                onClick={handleRefresh}
                className={`w-6 h-6 flex items-center justify-center rounded-full ${isLoading ? "animate-spin" : "hover:bg-white/10"}`}
              >
                <RefreshCw className="w-4 h-4 text-white/50" />
              </button>
            </div>
          </form>

          <div className="flex items-center gap-1">
            <button
              className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70 relative"
              onClick={() => setShowCart(!showCart)}
            >
              <ShoppingCart className="w-4 h-4" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
            <button className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70">
              <Star className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70">
              <SidebarClose className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bookmarks Bar */}
        <div className="flex items-center px-3 py-1 bg-[#262626] border-b border-[#3a3a3a] text-xs text-white/70">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 hover:text-white cursor-default">
              <img src="/icons/studio-vision-favicon.png" alt="" className="w-3 h-3" />
              <span>YUNG98</span>
            </div>
            <div className="flex items-center gap-1 hover:text-white cursor-default">
              <Camera className="w-3 h-3" />
              <span>Trap</span>
            </div>
            <div className="flex items-center gap-1 hover:text-white cursor-default">
              <Palette className="w-3 h-3" />
              <span>Drill</span>
            </div>
            <div className="flex items-center gap-1 hover:text-white cursor-default">
              <Video className="w-3 h-3" />
              <span>R&B</span>
            </div>
            <div className="flex items-center gap-1 hover:text-white cursor-default">
              <Calendar className="w-3 h-3" />
              <span>License</span>
            </div>
          </div>
          <div className="ml-auto">
            <button className="flex items-center gap-1 hover:text-white">
              <span>More</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Safari Content */}
        <div className="flex-1 bg-white overflow-hidden">
          {activeTab.url === "about:blank" ? (
            <div className="h-full flex flex-col items-center justify-center bg-[#f5f5f7] text-black">
              <div className="w-16 h-16 mb-4">
                <img src="/icons/safari.webp" alt="Safari" className="w-full h-full" />
              </div>
              <h2 className="text-2xl font-semibold mb-6">New Tab</h2>
              <div className="relative w-full max-w-lg">
                <form onSubmit={handleUrlSubmit}>
                  <input
                    type="text"
                    placeholder="Search or enter website name"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    className="w-full h-10 px-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </form>
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-[#f5f5f7] overflow-auto" onContextMenu={handleSafariContextMenu}>
              {/* Beat Store Page Content */}
              <div className="max-w-6xl mx-auto p-6">
                {cartNotification.show && (
                  <CartNotification
                    show={cartNotification.show}
                    message={cartNotification.message}
                    onClose={() => setCartNotification({ ...cartNotification, show: false })}
                  />
                )}
                {showTooltip && (
                  <ServiceTooltip
                    message="Preview beats, filter by vibe, and add favorites to your crate."
                    onClose={() => setShowTooltip(false)}
                  />
                )}
                {showCheckout ? (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <CheckoutSteps currentStep={checkoutSuccess ? "confirmation" : "checkout"} />
                    {checkoutSuccess ? (
                      <div className="flex flex-col items-center justify-center py-10">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                          <Check className="h-8 w-8 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">License Request Received</h2>
                        <p className="text-gray-600 mb-6 text-center">
                          Your beat request is in. I will contact you shortly with license details and delivery info.
                        </p>
                        <button
                          onClick={() => {
                            setShowCheckout(false)
                            setCheckoutSuccess(false)
                          }}
                          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Back to Catalog
                        </button>
                      </div>
                    ) : (
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Licensing Request</h2>

                        <div className="mb-6">
                          <h3 className="text-lg font-semibold mb-3">Beat Summary</h3>
                          <div className="border-t border-b border-gray-200 py-4 mb-4">
                            {cart.map((item) => (
                              <div key={item.cartId} className="flex justify-between items-center mb-2">
                                <span className="text-gray-700">{item.name} ({item.selectedLicense})</span>
                                <span className="font-medium">{item.price}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between items-center font-bold">
                            <span>Total</span>
                            <span>
                              {cart
                                .reduce((total, item) => {
                                  return total + parsePrice(item.price)
                                }, 0)
                                .toLocaleString("en-US", { style: "currency", currency: "USD" })}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                            <div className="space-y-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                  type="email"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="your@email.com"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input
                                  type="tel"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="(123) 456-7890"
                                />
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-semibold mb-3">License Information</h3>
                            <div className="space-y-3">
                              <div>
                                 <label className="block text-sm font-medium text-gray-700 mb-1">Artist Name</label>
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                   placeholder="Your artist name"
                                />
                              </div>
                              <div>
                                 <label className="block text-sm font-medium text-gray-700 mb-1">Preferred License</label>
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                   placeholder="Non-Exclusive / Exclusive"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                   <label className="block text-sm font-medium text-gray-700 mb-1">Release Timeline</label>
                                  <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                     placeholder="This month / Next quarter"
                                  />
                                </div>
                                <div>
                                   <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                  <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                     placeholder="Any details"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <button
                            onClick={() => setShowCheckout(false)}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                          >
                            Back to Cart
                          </button>
                          <button
                            onClick={completeCheckout}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          >
                             Submit Request
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : showCart ? (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <CheckoutSteps currentStep="cart" />
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-800">Your Crate</h2>
                      <button onClick={() => setShowCart(false)} className="text-gray-500 hover:text-gray-700">
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    {cart.length === 0 ? (
                      <div className="text-center py-10">
                        <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-700 mb-2">Your crate is empty</h3>
                        <p className="text-gray-500 mb-6">
                          Add a few beats and build your shortlist.
                        </p>
                        <button
                          onClick={() => setShowCart(false)}
                          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Browse Beats
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="border-t border-b border-gray-200 py-4 mb-6">
                          {cart.map((item) => (
                            <div key={item.cartId} className="flex items-center justify-between py-3">
                              <div className="flex items-center">
                                <div className="w-16 h-16 rounded-md overflow-hidden mr-4">
                                  <img
                                    src={item.image || "/placeholder.svg?height=64&width=64"}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-800">{item.name}</h4>
                                  <p className="text-sm text-gray-500">{item.category}</p>
                                  <p className="text-xs text-gray-500">{item.selectedLicense}</p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <span className="font-medium text-gray-800 mr-4">{item.price}</span>
                                <button
                                  onClick={() => removeFromCart(item.cartId)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center mb-6">
                          <div>
                            <p className="text-gray-600">Total</p>
                            <p className="text-xl font-bold text-gray-800">
                              {cart
                                .reduce((total, item) => {
                                  return total + parsePrice(item.price)
                                }, 0)
                                .toLocaleString("en-US", { style: "currency", currency: "USD" })}
                            </p>
                          </div>
                          <button
                            onClick={handleCheckout}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Continue to Licensing
                          </button>
                        </div>

                        <button
                          onClick={() => setShowCart(false)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          Keep Browsing
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-12">
                      <h1 className="text-4xl font-bold text-gray-800 mb-4">YUNG98 Beat Store</h1>
                      <p className="text-gray-600 max-w-2xl mx-auto">
                        Explore the current catalog, preview standout beats, and request the right license for your next release.
                      </p>
                    </div>

                    <div className="mb-8">
                      <div className="flex flex-wrap justify-center gap-4 mb-8">
                        <button
                          onClick={() => setSelectedCategory("all")}
                          className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                            selectedCategory === "all"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          <Smartphone className="h-4 w-4" />
                           <span>All Beats</span>
                        </button>
                        <button
                           onClick={() => setSelectedCategory("trap")}
                          className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                             selectedCategory === "trap"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          <Camera className="h-4 w-4" />
                           <span>Trap</span>
                        </button>
                        <button
                           onClick={() => setSelectedCategory("drill")}
                          className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                             selectedCategory === "drill"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          <Palette className="h-4 w-4" />
                           <span>Drill</span>
                        </button>
                        <button
                           onClick={() => setSelectedCategory("rnb")}
                          className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                             selectedCategory === "rnb"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          <Video className="h-4 w-4" />
                           <span>R&B</span>
                        </button>
                        <button
                           onClick={() => setSelectedCategory("boom-bap")}
                          className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                             selectedCategory === "boom-bap"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          <Globe className="h-4 w-4" />
                           <span>Boom Bap</span>
                        </button>
                        <button
                           onClick={() => setSelectedCategory("afro")}
                          className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                             selectedCategory === "afro"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          <Megaphone className="h-4 w-4" />
                           <span>Afro</span>
                        </button>
                      </div>

                      <CategoryExplanation category={selectedCategory} />

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredServices.length === 0 ? (
                          <div className="col-span-full bg-white rounded-lg shadow-md p-8 text-center text-gray-600">
                            No beats in this category yet. Add files to `public/beats` or switch filter.
                          </div>
                        ) : (
                          filteredServices.map((service) => (
                            <ServiceCard key={service.id} service={service} onAddToCart={addToCart} />
                          ))
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-100 rounded-lg p-8 text-center">
                      <h2 className="text-2xl font-bold text-gray-800 mb-4">Need a Custom Beat?</h2>
                      <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                        If you need a custom vibe, arrangement, or full production package, send a request and we can
                        build your sound from scratch.
                      </p>
                      <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        Book With YUNG98
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </DraggableWindow>
  )
}
