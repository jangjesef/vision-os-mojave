"use client"

import { Check, ChevronRight } from "lucide-react"

export interface MenuItem {
  id: string
  label: string
  shortcut?: string
  action?: () => void
  submenu?: MenuItem[]
  divider?: boolean
  checked?: boolean
  disabled?: boolean
}

interface MenuDropdownProps {
  items: MenuItem[]
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  isSubmenu?: boolean
  parentWidth?: number
}

export function MenuDropdown({
  items,
  onMouseEnter,
  onMouseLeave,
  isSubmenu = false,
  parentWidth = 0,
}: MenuDropdownProps) {
  const handleItemClick = (item: MenuItem) => {
    if (item.action && !item.disabled) {
      item.action()
    }
  }

  return (
    <div
      className={`absolute left-0 mt-1 py-1 bg-[#2a2a2a]/95 backdrop-blur-md rounded-md shadow-xl border border-[#3a3a3a]/50 min-w-[200px] animate-in fade-in zoom-in-95 duration-100 ${
        isSubmenu ? "top-0 left-full -ml-1" : "top-full"
      }`}
      style={isSubmenu ? { marginLeft: parentWidth - 5 } : {}}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {items.map((item, index) => (
        <div key={`${item.id}-${index}`}>
          {item.divider ? (
            <div className="h-px bg-[#3a3a3a]/50 my-1 mx-1" />
          ) : (
            <div className="relative group">
              <button
                className={`w-full text-left px-4 py-1 flex items-center justify-between ${
                  item.disabled ? "text-white/40 cursor-not-allowed" : "hover:bg-blue-500/90 text-white/90"
                }`}
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
              >
                <div className="flex items-center gap-2">
                  {item.checked && <Check className="h-3.5 w-3.5" />}
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center">
                  {item.shortcut && <span className="text-xs text-white/50 ml-8">{item.shortcut}</span>}
                  {item.submenu && <ChevronRight className="h-3.5 w-3.5 ml-2" />}
                </div>
              </button>

              {item.submenu && (
                <div className="hidden group-hover:block">
                  <MenuDropdown
                    items={item.submenu}
                    isSubmenu={true}
                    parentWidth={200}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

