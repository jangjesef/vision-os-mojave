"use client"

import { useState, useRef, useEffect, type KeyboardEvent, type MouseEvent } from "react"
import { DraggableWindow } from "./draggable-window"
import { useContextMenu } from "./context-menu/context-menu-provider"
import { Clipboard, Trash2, Copy, CheckSquare, Plus } from "lucide-react"

interface TerminalWindowProps {
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

interface TerminalEntry {
  type: "input" | "output"
  content: string
}

export function TerminalWindow({
  zIndex,
  position,
  size,
  onClose,
  onFocus,
  onDrag,
  onResize,
  onMaximize,
  isMaximized,
}: TerminalWindowProps) {
  const [history, setHistory] = useState<TerminalEntry[]>([
    { type: "output", content: "Last login: " + new Date().toLocaleString() + " on ttys001" },
  ])
  const [currentInput, setCurrentInput] = useState("")
  const [currentDirectory, setCurrentDirectory] = useState("~")
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { showContextMenu } = useContextMenu()

  // Mock file system
  const fileSystem: Record<string, string[]> = {
    "~": ["Documents", "Downloads", "Desktop", "Applications", ".bash_profile", ".zshrc"],
    "~/Documents": ["work", "personal", "report.pdf", "notes.txt"],
    "~/Downloads": ["image.png", "archive.zip", "installer.dmg"],
    "~/Desktop": ["screenshot.png", "project.txt"],
  }

  const getPrompt = () => {
    return `amirsalmani@macos ${currentDirectory} % `
  }

  const handleCommand = (command: string) => {
    const args = command.trim().split(" ")
    const cmd = args[0].toLowerCase()

    let output = ""

    switch (cmd) {
      case "ls":
        const dir =
          currentDirectory === "~"
            ? "~"
            : currentDirectory.startsWith("~/")
              ? currentDirectory
              : `~/${currentDirectory}`
        if (fileSystem[dir]) {
          output = fileSystem[dir].join("\n")
        } else {
          output = `ls: ${dir}: No such file or directory`
        }
        break

      case "cd":
        if (args.length === 1 || args[1] === "~") {
          setCurrentDirectory("~")
        } else if (args[1] === "..") {
          if (currentDirectory === "~") {
            output = "cd: cannot go above home directory"
          } else {
            const parts = currentDirectory.split("/")
            parts.pop()
            setCurrentDirectory(parts.join("/") || "~")
          }
        } else {
          const targetDir = args[1].startsWith("~/")
            ? args[1]
            : currentDirectory === "~"
              ? `~/${args[1]}`
              : `${currentDirectory}/${args[1]}`

          const simplifiedTarget = targetDir.replace(/\/\//g, "/")

          if (fileSystem[simplifiedTarget]) {
            setCurrentDirectory(simplifiedTarget)
          } else {
            output = `cd: ${args[1]}: No such file or directory`
          }
        }
        break

      case "clear":
        setHistory([])
        return

      case "echo":
        output = args.slice(1).join(" ")
        break

      case "pwd":
        output = currentDirectory
        break

      case "date":
        output = new Date().toString()
        break

      case "whoami":
        output = "amirsalmani"
        break

      case "":
        // Empty command, just show a new prompt
        break

      default:
        output = `zsh: command not found: ${cmd}`
    }

    // Add command to history
    const nextEntries: TerminalEntry[] = [{ type: "input", content: getPrompt() + command }]
    if (output) {
      nextEntries.push({ type: "output", content: output })
    }
    setHistory((prev) => [...prev, ...nextEntries])

    setCurrentInput("")
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(currentInput)
    }
  }

  const handleTerminalContextMenu = (e: MouseEvent) => {
    e.preventDefault()
    showContextMenu({
      items: [
        {
          label: "Clear Console",
          icon: <Trash2 className="h-4 w-4" />,
          onClick: () => handleCommand("clear"),
        },
        {
          label: "Paste",
          icon: <Clipboard className="h-4 w-4" />,
          onClick: async () => {
            try {
              const text = await navigator.clipboard.readText()
              setCurrentInput((prev) => prev + text)
              if (inputRef.current) {
                inputRef.current.focus()
              }
            } catch (err) {
              console.error("Failed to read clipboard contents: ", err)
            }
          },
        },
        {
          label: "Copy",
          icon: <Copy className="h-4 w-4" />,
          onClick: () => {
            const selection = window.getSelection()?.toString()
            if (selection) {
              navigator.clipboard.writeText(selection)
            }
          },
        },
        {
          label: "Select All",
          icon: <CheckSquare className="h-4 w-4" />,
          onClick: () => {
            if (terminalRef.current) {
              const range = document.createRange()
              range.selectNodeContents(terminalRef.current)
              const selection = window.getSelection()
              if (selection) {
                selection.removeAllRanges()
                selection.addRange(range)
              }
            }
          },
        },
        { divider: true },
        {
          label: "New Terminal Tab",
          icon: <Plus className="h-4 w-4" />,
          onClick: () => console.log("New Terminal Tab"),
        },
      ],
      x: e.clientX,
      y: e.clientY,
    })
  }

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  // Focus input when terminal is focused
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <DraggableWindow
      title="Terminal"
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
      <div
        className="flex flex-col h-full bg-black text-white font-mono text-sm p-2 overflow-hidden"
        onClick={() => {
          if (inputRef.current) {
            inputRef.current.focus()
          }
        }}
        onContextMenu={handleTerminalContextMenu}
      >
        <div ref={terminalRef} className="flex-1 overflow-auto whitespace-pre-wrap">
          {history.map((entry, index) => (
            <div key={index} className={entry.type === "input" ? "text-green-400" : "text-white"}>
              {entry.content}
            </div>
          ))}
        </div>

        <div className="flex items-center">
          <span className="text-green-400">{getPrompt()}</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-white caret-white"
            autoFocus
          />
        </div>
      </div>
    </DraggableWindow>
  )
}
