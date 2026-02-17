"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type FileSystem, type FileItem, initialFileSystem } from "@/types/file-system"
import { SimpleToast } from "@/components/ui/toast"

interface RepoBeatFile {
  name: string
  path: string
  extension: string
  size: string
}

const BEATS_FOLDER_ID = "desktop-4"
const BEAT_FILE_ID_PREFIX = "beats-file-"

const toBeatItemId = (fileName: string) => `${BEAT_FILE_ID_PREFIX}${encodeURIComponent(fileName).replaceAll("%", "_")}`

interface FileSystemContextType {
  fileSystem: FileSystem
  moveFile: (fileId: string, targetParent: string) => void
  createFile: (name: string, type: "file" | "folder", parent: string, extension?: string) => void
  deleteFile: (fileId: string) => void
  renameFile: (fileId: string, newName: string) => void
  getFilesByParent: (parent: string) => FileItem[]
}

const FileSystemContext = createContext<FileSystemContextType | undefined>(undefined)

export function FileSystemProvider({ children }: { children: ReactNode }) {
  const [fileSystem, setFileSystem] = useState<FileSystem>(initialFileSystem)
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: "", visible: false })

  // Load file system from localStorage on mount
  useEffect(() => {
    const savedFileSystem = localStorage.getItem("macos-file-system")
    if (savedFileSystem) {
      try {
        setFileSystem(JSON.parse(savedFileSystem))
      } catch (error) {
        console.error("Failed to parse saved file system:", error)
      }
    }
  }, [])

  // Save file system to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("macos-file-system", JSON.stringify(fileSystem))
  }, [fileSystem])

  useEffect(() => {
    const syncBeatsFromRepo = async () => {
      try {
        const response = await fetch("/api/beats")
        if (!response.ok) {
          return
        }

        const data = (await response.json()) as { beats?: RepoBeatFile[] }
        const repoBeats = data.beats ?? []

        setFileSystem((prev) => {
          const nextItems: Record<string, FileItem> = { ...prev.items }

          for (const id of Object.keys(nextItems)) {
            if (id.startsWith(BEAT_FILE_ID_PREFIX)) {
              delete nextItems[id]
            }
          }

          const beatIds = repoBeats.map((beat) => {
            const beatId = toBeatItemId(beat.name)
            nextItems[beatId] = {
              id: beatId,
              name: beat.name,
              type: "file",
              parent: "beats",
              extension: beat.extension,
              size: beat.size,
              modified: new Date().toLocaleDateString(),
              path: beat.path,
              icon: "/icons/music.webp",
            }
            return beatId
          })

          const desktopIds = prev.desktop.includes(BEATS_FOLDER_ID) ? prev.desktop : [...prev.desktop, BEATS_FOLDER_ID]

          if (!nextItems[BEATS_FOLDER_ID]) {
            nextItems[BEATS_FOLDER_ID] = {
              id: BEATS_FOLDER_ID,
              name: "Beats",
              type: "folder",
              parent: "desktop",
              modified: new Date().toLocaleDateString(),
              icon: "/icons/music.webp",
            }
          }

          return {
            ...prev,
            items: nextItems,
            desktop: desktopIds,
            beats: beatIds,
          }
        })
      } catch (error) {
        console.error("Failed to sync beats folder:", error)
      }
    }

    syncBeatsFromRepo()
  }, [])

  const moveFile = (fileId: string, targetParent: string) => {
    setFileSystem((prev) => {
      const file = prev.items[fileId]
      if (!file) return prev

      const currentParentItems = prev[file.parent as keyof FileSystem]
      const targetParentItems = prev[targetParent as keyof FileSystem]
      if (!Array.isArray(currentParentItems) || !Array.isArray(targetParentItems)) {
        return prev
      }

      const nextState = {
        ...prev,
        [file.parent]: currentParentItems.filter((id) => id !== fileId),
        [targetParent]: [...targetParentItems, fileId],
        items: {
          ...prev.items,
          [fileId]: {
            ...prev.items[fileId],
            parent: targetParent,
            modified: new Date().toLocaleDateString(),
          },
        },
      } as FileSystem

      // Show toast notification
      setToast({
        message: `Moved "${file.name}" to ${targetParent}`,
        visible: true,
      })

      // Hide toast after 3 seconds
      setTimeout(() => {
        setToast({ message: "", visible: false })
      }, 3000)

      return nextState
    })
  }

  const createFile = (name: string, type: "file" | "folder", parent: string, extension?: string) => {
    setFileSystem((prev) => {
      const newId = `${parent}-${Date.now()}`

      const newFile: FileItem = {
        id: newId,
        name,
        type,
        parent,
        extension,
        modified: new Date().toLocaleDateString(),
        size: type === "file" ? "0 KB" : undefined,
      }

      return {
        ...prev,
        items: {
          ...prev.items,
          [newId]: newFile,
        },
        [parent]: [...(prev[parent as keyof typeof prev] as string[]), newId],
      }
    })
  }

  const deleteFile = (fileId: string) => {
    setFileSystem((prev) => {
      const file = prev.items[fileId]
      if (!file) return prev

      const { [fileId]: _, ...remainingItems } = prev.items

      return {
        ...prev,
        items: remainingItems,
        [file.parent]: (prev[file.parent as keyof FileSystem] as string[]).filter((id) => id !== fileId),
        trash: [...prev.trash, fileId],
      }
    })
  }

  const renameFile = (fileId: string, newName: string) => {
    setFileSystem((prev) => {
      const file = prev.items[fileId]
      if (!file) return prev

      return {
        ...prev,
        items: {
          ...prev.items,
          [fileId]: {
            ...prev.items[fileId],
            name: newName,
            modified: new Date().toLocaleDateString(),
          },
        },
      }
    })
  }

  const getFilesByParent = (parent: string): FileItem[] => {
    const fileIds = fileSystem[parent as keyof typeof fileSystem] as string[] | undefined
    if (!Array.isArray(fileIds)) {
      return []
    }
    return fileIds.map((id) => fileSystem.items[id])
  }

  return (
    <FileSystemContext.Provider
      value={{
        fileSystem,
        moveFile,
        createFile,
        deleteFile,
        renameFile,
        getFilesByParent,
      }}
    >
      {children}
      {toast.visible && <SimpleToast message={toast.message} />}
    </FileSystemContext.Provider>
  )
}

export function useFileSystem() {
  const context = useContext(FileSystemContext)
  if (context === undefined) {
    throw new Error("useFileSystem must be used within a FileSystemProvider")
  }
  return context
}
