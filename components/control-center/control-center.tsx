"use client"

import { useState } from "react"
import { Sun, Volume2, Wifi, Bluetooth, BellOff, Share2, MonitorSmartphone, Cast, Keyboard } from "lucide-react"

export function ControlCenter() {
  const [brightness, setBrightness] = useState(80)
  const [volume, setVolume] = useState(60)
  const [wifiEnabled, setWifiEnabled] = useState(true)
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true)
  const [dndEnabled, setDndEnabled] = useState(false)
  const [airdropEnabled, setAirdropEnabled] = useState(true)

  return (
    <div className="absolute right-0 top-full mt-1 p-3 bg-[#2a2a2a]/95 backdrop-blur-md rounded-md shadow-xl border border-[#3a3a3a]/50 w-80 animate-in fade-in zoom-in-95 duration-100">
      <div className="grid grid-cols-2 gap-3">
        {/* Main controls - top row */}
        <div className="col-span-2 grid grid-cols-2 gap-3">
          {/* Brightness control */}
          <div className="bg-[#1d1d1d]/80 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <Sun className="h-5 w-5 text-white/80" />
              <span className="text-xs text-white/80">Display</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={brightness}
              onChange={(e) => setBrightness(Number.parseInt(e.target.value))}
              className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            />
          </div>

          {/* Volume control */}
          <div className="bg-[#1d1d1d]/80 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <Volume2 className="h-5 w-5 text-white/80" />
              <span className="text-xs text-white/80">Sound</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number.parseInt(e.target.value))}
              className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            />
          </div>
        </div>

        {/* Toggle controls - middle row */}
        <div className="col-span-2 grid grid-cols-4 gap-3">
          {/* Wi-Fi toggle */}
          <div
            className={`flex flex-col items-center justify-center p-2 rounded-xl cursor-default ${
              wifiEnabled ? "bg-blue-500/30" : "bg-[#1d1d1d]/80"
            }`}
            onClick={() => setWifiEnabled(!wifiEnabled)}
          >
            <Wifi className={`h-5 w-5 mb-1 ${wifiEnabled ? "text-blue-400" : "text-white/70"}`} />
            <span className="text-xs text-white/80">Wi-Fi</span>
          </div>

          {/* Bluetooth toggle */}
          <div
            className={`flex flex-col items-center justify-center p-2 rounded-xl cursor-default ${
              bluetoothEnabled ? "bg-blue-500/30" : "bg-[#1d1d1d]/80"
            }`}
            onClick={() => setBluetoothEnabled(!bluetoothEnabled)}
          >
            <Bluetooth className={`h-5 w-5 mb-1 ${bluetoothEnabled ? "text-blue-400" : "text-white/70"}`} />
            <span className="text-xs text-white/80">Bluetooth</span>
          </div>

          {/* AirDrop toggle */}
          <div
            className={`flex flex-col items-center justify-center p-2 rounded-xl cursor-default ${
              airdropEnabled ? "bg-blue-500/30" : "bg-[#1d1d1d]/80"
            }`}
            onClick={() => setAirdropEnabled(!airdropEnabled)}
          >
            <Share2 className={`h-5 w-5 mb-1 ${airdropEnabled ? "text-blue-400" : "text-white/70"}`} />
            <span className="text-xs text-white/80">AirDrop</span>
          </div>

          {/* Do Not Disturb toggle */}
          <div
            className={`flex flex-col items-center justify-center p-2 rounded-xl cursor-default ${
              dndEnabled ? "bg-purple-500/30" : "bg-[#1d1d1d]/80"
            }`}
            onClick={() => setDndEnabled(!dndEnabled)}
          >
            <BellOff className={`h-5 w-5 mb-1 ${dndEnabled ? "text-purple-400" : "text-white/70"}`} />
            <span className="text-xs text-white/80">Do Not Disturb</span>
          </div>
        </div>

        {/* Additional controls - bottom row */}
        <div className="col-span-2 grid grid-cols-3 gap-3">
          {/* Screen Mirroring */}
          <div className="bg-[#1d1d1d]/80 rounded-xl p-2 flex flex-col items-center justify-center">
            <Cast className="h-5 w-5 mb-1 text-white/70" />
            <span className="text-xs text-white/80">Screen Mirroring</span>
          </div>

          {/* Display */}
          <div className="bg-[#1d1d1d]/80 rounded-xl p-2 flex flex-col items-center justify-center">
            <MonitorSmartphone className="h-5 w-5 mb-1 text-white/70" />
            <span className="text-xs text-white/80">Display</span>
          </div>

          {/* Keyboard Brightness */}
          <div className="bg-[#1d1d1d]/80 rounded-xl p-2 flex flex-col items-center justify-center">
            <Keyboard className="h-5 w-5 mb-1 text-white/70" />
            <span className="text-xs text-white/80">Keyboard</span>
          </div>
        </div>
      </div>
    </div>
  )
}

