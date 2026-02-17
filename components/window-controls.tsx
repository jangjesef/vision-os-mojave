"use client"

interface WindowControlsProps {
  onClose: () => void
  onMaximize?: () => void
}

export function WindowControls({ onClose, onMaximize }: WindowControlsProps) {
  return (
    <div className="flex items-center gap-1.5 ml-2">
      <button
        onClick={onClose}
        className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
        aria-label="Close window"
      />
      <button
        onClick={() => console.log("Minimize")}
        className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"
        aria-label="Minimize window"
      />
      <button
        onClick={onMaximize}
        className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
        aria-label="Maximize window"
      />
    </div>
  )
}

