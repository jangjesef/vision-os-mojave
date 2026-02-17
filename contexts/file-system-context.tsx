"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type FileSystem, type FileItem, initialFileSystem } from "@/types/file-system"
import { SimpleToast } from "@/components/ui/toast"

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

  const moveFile = (fileId: string, targetParent: string) => {
    setFileSystem((prev) => {
      const file = prev.items[fileId]
      if (!file) return prev

      const currentParent = file.parent

      // Remove from current parent array
      const updatedPrev = {
        ...prev,
        [currentParent]: prev[currentParent as keyof typeof prev].filter((id) => id !== fileId) as string[],
      }

      // Add to new parent array
      updatedPrev[targetParent as keyof typeof updatedPrev] = [
        ...(updatedPrev[targetParent as keyof typeof updatedPrev] as string[]),
        fileId,
      ]

      // Update file's parent reference
      updatedPrev.items = {
        ...updatedPrev.items,
        [fileId]: {
          ...updatedPrev.items[fileId],
          parent: targetParent,
          modified: new Date().toLocaleDateString(),
        },
      }

      // Show toast notification
      setToast({
        message: `Moved "${file.name}" to ${targetParent}`,
        visible: true,
      })

      // Hide toast after 3 seconds
      setTimeout(() => {
        setToast({ message: "", visible: false })
      }, 3000)

      return updatedPrev
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
        [file.parent]: prev[file.parent as keyof typeof prev].filter((id) => id !== fileId) as string[],
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
    const fileIds = fileSystem[parent as keyof typeof fileSystem] as string[]
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

