interface FolderIconProps {
  name: string
  color: "blue" | "green" | "red" | "yellow" | "purple"
}

export function FolderIcon({ name, color = "blue" }: FolderIconProps) {
  const colorMap = {
    blue: "text-blue-400",
    green: "text-green-400",
    red: "text-red-400",
    yellow: "text-yellow-400",
    purple: "text-purple-400",
  }

  return (
    <div className="flex flex-col items-center gap-1 p-2 rounded hover:bg-white/10 cursor-default">
      <div className={`w-12 h-10 ${colorMap[color]}`}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2v11z" />
        </svg>
      </div>
      <span className="text-white text-xs text-center">{name}</span>
    </div>
  )
}

