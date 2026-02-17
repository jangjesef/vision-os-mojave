"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Calendar, Cloud, Bell, Info, Download, RefreshCw } from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  time: string
  icon: React.ReactNode
  app: string
}

export function NotificationCenter({ onClose }: { onClose: () => void }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "System Update",
      message: "macOS Mojave update is available. Click to install.",
      time: "10:30 AM",
      icon: <RefreshCw className="h-6 w-6 text-blue-400" />,
      app: "System Preferences",
    },
    {
      id: "2",
      title: "iCloud Storage",
      message: "Your iCloud storage is almost full. Manage your storage now.",
      time: "Yesterday",
      icon: <Cloud className="h-6 w-6 text-blue-400" />,
      app: "iCloud",
    },
    {
      id: "3",
      title: "Calendar",
      message: "Meeting with Design Team in 30 minutes",
      time: "Yesterday",
      icon: <Calendar className="h-6 w-6 text-red-400" />,
      app: "Calendar",
    },
    {
      id: "4",
      title: "Download Complete",
      message: "mojave-wallpaper.jpg has been downloaded",
      time: "Monday",
      icon: <Download className="h-6 w-6 text-gray-400" />,
      app: "Safari",
    },
  ])

  const [date, setDate] = useState("")

  useEffect(() => {
    const now = new Date()
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }
    setDate(now.toLocaleDateString("en-US", options))
  }, [])

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  return (
    <div className="fixed top-0 right-0 bottom-0 w-[350px] bg-[#2a2a2a]/95 backdrop-blur-md shadow-xl border-l border-[#3a3a3a]/50 z-[100] animate-in slide-in-from-right duration-300">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-[#3a3a3a]/50 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-white/90">Notification Center</h2>
            <p className="text-sm text-white/60">{date}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Notifications */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {notifications.length > 0 ? (
            <>
              {notifications.map((notification) => (
                <div key={notification.id} className="bg-[#1d1d1d]/80 rounded-xl p-3 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">{notification.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-white/90">{notification.title}</div>
                        <div className="text-xs text-white/60">{notification.time}</div>
                      </div>
                      <div className="text-sm text-white/80 mt-1">{notification.message}</div>
                      <div className="text-xs text-white/60 mt-2">{notification.app}</div>
                    </div>
                    <button
                      onClick={() => removeNotification(notification.id)}
                      className="flex-shrink-0 text-white/50 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              <button onClick={clearAllNotifications} className="w-full py-2 text-sm text-blue-400 hover:text-blue-300">
                Clear All
              </button>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-white/50">
              <Bell className="h-12 w-12 mb-3 opacity-30" />
              <p className="text-sm">No Notifications</p>
            </div>
          )}
        </div>

        {/* Today section */}
        <div className="p-4 border-t border-[#3a3a3a]/50">
          <h3 className="text-sm font-medium text-white/80 mb-3">Today</h3>

          <div className="bg-[#1d1d1d]/80 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-lg font-medium text-white/90">{date.split(",")[0]}</div>
              <div className="text-2xl font-light text-white/90">
                {new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
              </div>
            </div>

            <div className="flex items-center text-white/70 text-sm">
              <Info className="h-4 w-4 mr-2" />
              <span>Weather information unavailable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

