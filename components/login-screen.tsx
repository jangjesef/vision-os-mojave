"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Lock, ChevronRight } from "lucide-react"

interface LoginScreenProps {
  onLogin: (username: string, password: string) => void
  error: string | null
}

export function LoginScreen({ onLogin, error }: LoginScreenProps) {
  const [username, setUsername] = useState("yung98")
  const [password, setPassword] = useState("")
  const [shake, setShake] = useState(false)
  const [currentTime, setCurrentTime] = useState("")
  const [currentDate, setCurrentDate] = useState("")

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: "numeric",
        minute: "2-digit",
      }
      const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: "long",
        month: "long",
        day: "numeric",
      }
      setCurrentTime(now.toLocaleString("en-US", timeOptions))
      setCurrentDate(now.toLocaleString("en-US", dateOptions))
    }

    updateDateTime()
    const interval = setInterval(updateDateTime, 60000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (error) {
      setShake(true)
      const timer = setTimeout(() => setShake(false), 500)
      return () => clearTimeout(timer)
    }
  }, [error])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin(username, password)
  }

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/apple-macbook-pro-stock-2021-apple-event-2021-dark-mode-6016x5468-6759.jpg-OszWN0T7VqImNbo7NSwFeiJT4D0kYk.jpeg')",
        backgroundColor: "#1a1a1a",
      }}
    >
      <div className="text-center mb-auto mt-8">
        <div className="text-white/90 text-5xl font-light">{currentTime}</div>
        <div className="text-white/80 text-xl mt-1">{currentDate}</div>
      </div>

      <div
        className={`bg-black/40 backdrop-blur-xl rounded-xl shadow-2xl w-80 p-8 flex flex-col items-center ${
          shake ? "animate-shake" : ""
        }`}
      >
        <div className="w-48 h-16 mb-6 flex items-center justify-center">
          <svg width="100%" height="100%" viewBox="0 0 237 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M4.83048 10.2151C7.51408 15.8218 12.7279 26.8817 16.485 34.7926L23.309 49.1551L28.1394 49.232H32.9699L37.0337 40.6298C39.3339 35.8679 44.6244 24.7312 48.8415 15.9754L56.5856 0L46.6179 0.460832L37.6471 20.5837C32.7399 31.7204 28.5228 40.7834 28.2928 40.7834C27.9861 40.7834 23.6923 31.6436 18.7085 20.4301L9.73763 0.0768061H0L4.83048 10.2151Z"
              fill="white"
            />
            <path d="M62.7962 6.98924H70.4636V0.0768013H62.7962V6.98924Z" fill="white" />
            <path d="M127.969 6.98924H135.637V0.0768013H127.969V6.98924Z" fill="white" />
            <path
              d="M91.3956 13.0568C85.2617 14.6697 81.0446 18.894 81.0446 23.4255C81.0446 28.6482 84.3416 30.5684 98.143 33.4101C103.51 34.4854 108.034 35.4071 108.264 35.4071C108.571 35.4071 109.337 36.2519 110.027 37.3272C111.178 39.0937 111.178 39.4009 110.104 41.0906C106.654 46.3902 89.0187 45.2381 87.6386 39.6313C87.1786 37.9416 86.7952 37.7112 83.4215 37.7112C79.2044 37.7112 78.8211 38.4793 80.8146 42.2427C82.6548 45.7757 86.1818 48.3103 90.9356 49.3088C96.5328 50.4608 106.577 49.8464 110.948 48.0799C116.928 45.6221 119.842 40.2458 117.772 35.2535C116.315 31.7204 113.324 30.4147 101.9 28.1106C92.0857 26.1905 88.8654 24.808 88.8654 22.427C88.8654 20.0461 91.549 18.4332 96.3028 17.9724C101.9 17.4347 106.73 18.7404 108.647 21.1982C109.874 22.7343 110.871 23.1183 113.785 23.1183C117.158 23.1183 117.312 23.0415 116.775 21.3518C115.011 15.6682 110.104 13.0568 100.52 12.6728C96.8395 12.5192 92.7758 12.6728 91.3956 13.0568Z"
              fill="white"
            />
            <path
              d="M158.486 13.3641C150.818 15.5914 146.141 20.6605 144.684 28.1874C142.384 40.7066 151.355 50 165.846 50C175.507 50 183.021 46.3134 186.472 39.7849C187.775 37.2504 188.159 35.2535 188.159 30.2611C188.159 24.5008 188.005 23.7327 185.858 20.6605C182.331 15.6682 176.581 13.0568 168.53 12.6728C164.543 12.5192 160.709 12.7496 158.486 13.3641ZM174.664 19.7389C179.954 22.8879 181.488 31.2596 178.114 38.0952C175.737 43.0107 173.284 44.2396 166.306 44.2396C159.176 44.2396 156.952 43.0108 154.192 37.6344C150.818 31.1828 153.272 22.6574 159.482 19.4316C162.243 17.9723 163.699 17.6651 167.533 17.9723C170.217 18.2028 173.36 18.9708 174.664 19.7389Z"
              fill="white"
            />
            <path
              d="M213.538 13.4409C211.851 14.0553 209.551 15.2842 208.401 16.129C205.564 18.2028 205.41 18.2028 205.41 15.4378C205.41 13.2104 205.257 13.1336 201.96 13.1336H198.51V49.232H206.177V37.4808C206.177 27.1121 206.33 25.4992 207.71 23.2719C211.544 16.9739 224.579 15.8218 227.646 21.5054C228.106 22.3502 228.412 28.5714 228.412 36.0983V49.232H237L236.693 34.7158C236.463 18.51 236.157 17.5115 230.713 14.3625C227.416 12.3656 217.755 11.9048 213.538 13.4409Z"
              fill="white"
            />
            <path d="M62.7962 49.232H70.4636V13.1336H62.7962V49.232Z" fill="white" />
            <path d="M127.969 49.232H135.637V13.1336H127.969V49.232Z" fill="white" />
          </svg>
        </div>

        <div className="text-white text-xl font-medium mb-6">YUNG98 OS</div>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="relative mb-5">
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-white/20 backdrop-blur border ${
                error ? "border-red-500" : "border-white/20"
              } rounded-md px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              autoFocus
            />
            {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <Lock className="w-4 h-4" />
               <span>Hint: yung98</span>
            </div>

            <button
              type="submit"
              className="rounded-full w-8 h-8 bg-white/20 hover:bg-white/30 flex items-center justify-center text-white/80"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      <div className="mt-auto mb-6 flex items-center gap-4">
        <button className="text-white/70 hover:text-white text-sm flex items-center gap-1">
          <Sleep className="w-4 h-4" />
          <span>Sleep</span>
        </button>
        <button className="text-white/70 hover:text-white text-sm flex items-center gap-1">
          <RefreshCw className="w-4 h-4" />
          <span>Restart</span>
        </button>
        <button className="text-white/70 hover:text-white text-sm flex items-center gap-1">
          <Power className="w-4 h-4" />
          <span>Shut Down</span>
        </button>
      </div>
    </div>
  )
}

function Sleep(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z" />
      <path d="M9 9h.01" />
    </svg>
  )
}

function Power(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 3v10" />
      <path d="M8 13a5 5 0 1 0 8 0" />
    </svg>
  )
}

function RefreshCw(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 3v7h-7" />
      <path d="M3 21v-7h7" />
      <path d="M18 8.3A9 9 0 1 0 5.7 16" />
    </svg>
  )
}
