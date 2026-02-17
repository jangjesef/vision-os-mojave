import {
  Monitor,
  Layout,
  Mic,
  Search,
  Globe,
  Users,
  Accessibility,
  Clock,
  Puzzle,
  Shield,
  Download,
  Network,
  Bluetooth,
  Volume2,
  Printer,
  Keyboard,
  MousePointer,
  Battery,
} from "lucide-react"

interface PreferenceIconProps {
  name: string
  icon: string
}

export function PreferenceIcon({ name, icon }: PreferenceIconProps) {
  const getIcon = () => {
    switch (icon) {
      case "general":
        return <Layout className="h-full w-full" />
      case "desktop":
        return <Monitor className="h-full w-full" />
      case "dock":
        return <Layout className="h-full w-full" />
      case "mission":
        return <Layout className="h-full w-full" />
      case "siri":
        return <Mic className="h-full w-full" />
      case "spotlight":
        return <Search className="h-full w-full" />
      case "language":
        return <Globe className="h-full w-full" />
      case "notifications":
        return <Layout className="h-full w-full" />
      case "internet":
        return <Globe className="h-full w-full" />
      case "users":
        return <Users className="h-full w-full" />
      case "accessibility":
        return <Accessibility className="h-full w-full" />
      case "screentime":
        return <Clock className="h-full w-full" />
      case "extensions":
        return <Puzzle className="h-full w-full" />
      case "security":
        return <Shield className="h-full w-full" />
      case "update":
        return <Download className="h-full w-full" />
      case "network":
        return <Network className="h-full w-full" />
      case "bluetooth":
        return <Bluetooth className="h-full w-full" />
      case "sound":
        return <Volume2 className="h-full w-full" />
      case "printers":
        return <Printer className="h-full w-full" />
      case "keyboard":
        return <Keyboard className="h-full w-full" />
      case "trackpad":
        return <MousePointer className="h-full w-full" />
      case "mouse":
        return <MousePointer className="h-full w-full" />
      case "displays":
        return <Monitor className="h-full w-full" />
      case "energy":
        return <Battery className="h-full w-full" />
      default:
        return <Layout className="h-full w-full" />
    }
  }

  return (
    <div className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-white/10 cursor-default">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white p-2">
        {getIcon()}
      </div>
      <span className="text-white text-xs text-center">{name}</span>
    </div>
  )
}

