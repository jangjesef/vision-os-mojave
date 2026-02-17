import { readdir, readFile, stat } from "node:fs/promises"
import path from "node:path"
import { NextResponse } from "next/server"

interface BeatFile {
  name: string
  path: string
  extension: string
  size: string
  title?: string
  artist?: string
  album?: string
  price?: string
  leasePrice?: string
  exclusivePrice?: string
  category?: string
  bpm?: number
  key?: string
  mood?: string
  cover?: string
  description?: string
  preset?: string
}

interface BeatMetadata {
  title?: string
  artist?: string
  album?: string
  price?: string
  leasePrice?: string
  exclusivePrice?: string
  category?: string
  bpm?: number
  key?: string
  mood?: string
  cover?: string
  description?: string
  preset?: string
}

const AUDIO_EXTENSIONS = new Set([".wav", ".mp3", ".m4a", ".ogg", ".flac", ".aiff", ".aac"])

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export async function GET() {
  const beatsDirectory = path.join(process.cwd(), "public", "beats")
  const metadataPath = path.join(beatsDirectory, "beats.json")

  try {
    let metadataMap: Record<string, BeatMetadata> = {}
    try {
      const metadataRaw = await readFile(metadataPath, "utf-8")
      metadataMap = JSON.parse(metadataRaw) as Record<string, BeatMetadata>
    } catch {
      metadataMap = {}
    }

    const entries = await readdir(beatsDirectory, { withFileTypes: true })

    const files = await Promise.all(
      entries
        .filter((entry) => entry.isFile())
        .map(async (entry) => {
          const extension = path.extname(entry.name).toLowerCase()
          if (!AUDIO_EXTENSIONS.has(extension)) {
            return null
          }

          const filePath = path.join(beatsDirectory, entry.name)
          const fileStats = await stat(filePath)
          const metadata = metadataMap[entry.name] ?? {}

          return {
            name: entry.name,
            path: `/beats/${entry.name}`,
            extension: extension.slice(1),
            size: formatFileSize(fileStats.size),
            title: metadata.title,
            artist: metadata.artist,
            album: metadata.album,
            price: metadata.price,
            leasePrice: metadata.leasePrice,
            exclusivePrice: metadata.exclusivePrice,
            category: metadata.category,
            bpm: metadata.bpm,
            key: metadata.key,
            mood: metadata.mood,
            cover: metadata.cover,
            description: metadata.description,
            preset: metadata.preset,
          } satisfies BeatFile
        }),
    )

    const beats = files
      .filter((file): file is NonNullable<typeof file> => file !== null)
      .sort((a, b) => a.name.localeCompare(b.name, "en", { numeric: true }))

    return NextResponse.json({ beats })
  } catch {
    return NextResponse.json({ beats: [] })
  }
}
