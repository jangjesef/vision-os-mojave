"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { DraggableWindow } from "./draggable-window"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle } from "lucide-react"

interface MusicPlayerWindowProps {
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

interface Song {
  id: number
  title: string
  artist: string
  album: string
  duration: number
  cover: string
  audioSrc: string
}

interface RepoBeatFile {
  name: string
  path: string
  extension: string
  size: string
  title?: string
  artist?: string
  album?: string
  cover?: string
}

export function MusicPlayerWindow({
  zIndex,
  position,
  size,
  onClose,
  onFocus,
  onDrag,
  onResize,
  onMaximize,
  isMaximized,
}: MusicPlayerWindowProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [songs, setSongs] = useState<Song[]>([])
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [currentDuration, setCurrentDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)

  const currentSong = songs[currentSongIndex] ?? null

  const toTitle = (fileName: string) => {
    const baseName = fileName.replace(/\.[^.]+$/, "")
    return baseName
      .replace(/[._-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase())
  }

  useEffect(() => {
    const loadRepoBeats = async () => {
      try {
        const response = await fetch("/api/beats")
        if (!response.ok) return

        const data = (await response.json()) as { beats?: RepoBeatFile[] }
        const repoBeats = data.beats ?? []

        const mappedSongs: Song[] = repoBeats.map((beat, index) => ({
          id: index + 1,
          title: beat.title || toTitle(beat.name),
          artist: beat.artist || "YUNG98",
          album: beat.album || "YUNG98 Beat Vault",
          duration: 0,
          cover: beat.cover || `/images/album-cover-${(index % 4) + 1}.jpg`,
          audioSrc: beat.path,
        }))

        setSongs(mappedSongs)
      } catch (error) {
        console.error("Failed to load beats:", error)
      }
    }

    loadRepoBeats()
  }, [])

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio()
    audioRef.current.volume = volume

    // Set up event listeners
    const audio = audioRef.current

    const updateTime = () => {
      if (audio) {
        setCurrentTime(audio.currentTime)
      }
    }

    const handleEnded = () => {
      if (isRepeat) {
        playCurrentSong()
      } else {
        handleNext()
      }
    }

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.pause()
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  useEffect(() => {
    if (!currentSong) {
      setCurrentTime(0)
      setCurrentDuration(0)
      setIsPlaying(false)
      return
    }

    loadSong(currentSong)
    if (isPlaying) {
      playCurrentSong()
    }
  }, [currentSong])

  const loadSong = (song: Song) => {
    if (audioRef.current) {
      audioRef.current.src = song.audioSrc
      audioRef.current.load()
      audioRef.current.onloadedmetadata = () => {
        const resolvedDuration = Number.isFinite(audioRef.current?.duration) ? (audioRef.current?.duration ?? 0) : 0
        setCurrentDuration(resolvedDuration)
      }
      setCurrentTime(0)
    }
  }

  const playCurrentSong = () => {
    if (audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const pauseCurrentSong = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const togglePlay = () => {
    if (isPlaying) {
      pauseCurrentSong()
    } else {
      playCurrentSong()
    }
  }

  const handlePrevious = () => {
    if (songs.length === 0) return
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * songs.length)
      setCurrentSongIndex(randomIndex)
    } else {
      setCurrentSongIndex((prevIndex) => (prevIndex === 0 ? songs.length - 1 : prevIndex - 1))
    }
  }

  const handleNext = () => {
    if (songs.length === 0) return
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * songs.length)
      setCurrentSongIndex(randomIndex)
    } else {
      setCurrentSongIndex((prevIndex) => (prevIndex === songs.length - 1 ? 0 : prevIndex + 1))
    }
  }

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current && audioRef.current) {
      const progressBar = progressBarRef.current
      const rect = progressBar.getBoundingClientRect()
      const percent = (e.clientX - rect.left) / rect.width
      const newTime = percent * currentDuration

      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  return (
    <DraggableWindow
      title="YUNG98 Player"
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
      <div className="flex flex-col h-full bg-gradient-to-b from-[#1a1a1a] to-[#2a2a2a] text-white p-4">
        {!currentSong ? (
          <div className="flex-1 flex items-center justify-center text-white/70 text-sm text-center px-8">
            Add audio files to `public/beats` and refresh. They will appear here automatically.
          </div>
        ) : (
          <>
        {/* Now Playing */}
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-xl font-semibold mb-2">Now Playing</h2>
          <div className="w-48 h-48 rounded-lg overflow-hidden shadow-lg mb-4">
            <img
              src={currentSong.cover || "/placeholder.svg?height=192&width=192"}
              alt={currentSong.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/images/album-cover-1.jpg"
              }}
            />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-medium">{currentSong.title}</h3>
            <p className="text-sm text-white/70">{currentSong.artist}</p>
            <p className="text-xs text-white/50">{currentSong.album}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div
            ref={progressBarRef}
            className="h-1 bg-white/20 rounded-full cursor-pointer"
            onClick={handleProgressBarClick}
          >
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${currentDuration > 0 ? (currentTime / currentDuration) * 100 : 0}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-white/50 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(currentDuration || currentSong.duration)}</span>
            </div>
          </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button className="p-2 rounded-full hover:bg-white/10" onClick={() => setIsShuffle(!isShuffle)}>
            <Shuffle className={`h-5 w-5 ${isShuffle ? "text-blue-500" : "text-white/70"}`} />
          </button>

          <button className="p-2 rounded-full hover:bg-white/10" onClick={handlePrevious}>
            <SkipBack className="h-5 w-5 text-white/70" />
          </button>

          <button className="p-3 rounded-full bg-blue-500 hover:bg-blue-600" onClick={togglePlay}>
            {isPlaying ? <Pause className="h-6 w-6 text-white" /> : <Play className="h-6 w-6 text-white" />}
          </button>

          <button className="p-2 rounded-full hover:bg-white/10" onClick={handleNext}>
            <SkipForward className="h-5 w-5 text-white/70" />
          </button>

          <button className="p-2 rounded-full hover:bg-white/10" onClick={() => setIsRepeat(!isRepeat)}>
            <Repeat className={`h-5 w-5 ${isRepeat ? "text-blue-500" : "text-white/70"}`} />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2 mb-6">
          <button className="p-1 rounded-full hover:bg-white/10" onClick={() => setIsMuted(!isMuted)}>
            {isMuted ? <VolumeX className="h-4 w-4 text-white/70" /> : <Volume2 className="h-4 w-4 text-white/70" />}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(Number.parseFloat(e.target.value))}
            className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
          />
        </div>

        {/* Playlist */}
        <div className="flex-1 overflow-auto">
          <h3 className="text-sm font-medium mb-2">Beat Crate</h3>
          <div className="space-y-1">
            {songs.map((song, index) => (
              <div
                key={song.id}
                className={`flex items-center p-2 rounded-md cursor-pointer ${
                  index === currentSongIndex ? "bg-blue-500/20 text-blue-400" : "hover:bg-white/10"
                }`}
                onClick={() => {
                  setCurrentSongIndex(index)
                  setIsPlaying(true)
                }}
              >
                <div className="w-8 h-8 rounded overflow-hidden mr-3">
                  <img
                    src={song.cover || "/placeholder.svg?height=32&width=32"}
                    alt={song.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/images/album-cover-1.jpg"
                    }}
                  />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{song.title}</div>
                <div className="text-xs text-white/50">{song.artist}</div>
                </div>
                <div className="text-xs text-white/50">{song.duration > 0 ? formatTime(song.duration) : "--:--"}</div>
              </div>
            ))}
          </div>
        </div>
          </>
        )}
      </div>
    </DraggableWindow>
  )
}
