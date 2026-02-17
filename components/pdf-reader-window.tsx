"use client"

import { useState } from "react"
import { DraggableWindow } from "./draggable-window"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Printer, Download, Search } from "lucide-react"

interface PDFReaderWindowProps {
  zIndex: number
  position: { x: number; y: number }
  size: { width: number; height: number }
  filePath: string
  fileName: string
  onClose: () => void
  onFocus: () => void
  onDrag: (x: number, y: number) => void
  onResize: (width: number, height: number) => void
  onMaximize: () => void
  isMaximized?: boolean
}

export function PDFReaderWindow({
  zIndex,
  position,
  size,
  filePath,
  fileName,
  onClose,
  onFocus,
  onDrag,
  onResize,
  onMaximize,
  isMaximized,
}: PDFReaderWindowProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages] = useState(30) // Assuming 30 pages for this example
  const [zoom, setZoom] = useState(100)

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 10, 200))
  }

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 10, 50))
  }

  return (
    <DraggableWindow
      title={`Preview - ${fileName}`}
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
      <div className="flex flex-col h-full">
        {/* Toolbar */}
        <div className="flex items-center gap-2 p-2 bg-[#2d2d2d] border-b border-[#3a3a3a]">
          <div className="flex items-center gap-1">
            <button
              className={`w-8 h-8 rounded-full ${
                currentPage > 1 ? "hover:bg-white/10 text-white/70" : "text-white/30"
              } flex items-center justify-center`}
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="text-white/70 text-sm">
              Page {currentPage} of {totalPages}
            </div>
            <button
              className={`w-8 h-8 rounded-full ${
                currentPage < totalPages ? "hover:bg-white/10 text-white/70" : "text-white/30"
              } flex items-center justify-center`}
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="h-5 w-px bg-white/20 mx-2"></div>

          <div className="flex items-center gap-1">
            <button
              className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70"
              onClick={handleZoomOut}
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <div className="text-white/70 text-sm">{zoom}%</div>
            <button
              className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70"
              onClick={handleZoomIn}
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <div className="h-5 w-px bg-white/20 mx-2"></div>

          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70">
              <Printer className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70">
              <Download className="w-4 h-4" />
            </button>
          </div>

          <div className="ml-auto relative">
            <Search className="absolute left-2 top-1.5 w-4 h-4 text-white/50" />
            <input
              type="text"
              placeholder="Search"
              className="h-7 w-48 bg-[#1d1d1d] rounded-md pl-8 pr-2 text-sm text-white/80 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* PDF Content */}
        <div className="flex-1 bg-[#1a1a1a] overflow-auto flex items-center justify-center p-4">
          <div
            className="bg-white shadow-lg"
            style={{
              width: `${(8.5 * zoom) / 100}in`,
              height: `${(11 * zoom) / 100}in`,
            }}
          >
            <div className="p-8 h-full overflow-auto text-black" style={{ fontSize: `${zoom / 100}rem` }}>
              {/* Display different content based on current page */}
              {currentPage === 1 && (
                <div className="font-serif" style={{ lineHeight: 1.8 }}>
                  <h1 className="text-xl font-bold mb-4">YUNG98 OS - Licensing Guide</h1>
                  <p className="mb-3">
                    Thanks for checking out YUNG98 beats. This document explains how licensing works and what each
                    option includes for release usage.
                  </p>
                  <p className="mb-3">
                    All beats are available in two formats: Lease and Exclusive. Lease is best for fast releases and
                    testing new material. Exclusive is for full ownership rights based on agreed terms.
                  </p>
                  <p className="mb-3">
                    Need custom production, mix/master, or stems? Use the Contact window and include track name,
                    timeline, and release plan.
                  </p>
                </div>
              )}

              {currentPage === 2 && (
                <div className="font-serif" style={{ lineHeight: 1.8 }}>
                  <h1 className="text-xl font-bold mb-4">Lease Terms</h1>
                  <p className="mb-3">
                    Lease lets multiple artists license the same beat. Typical use includes streaming platforms,
                    YouTube, and live performance within the agreed limits.
                  </p>
                  <p className="mb-3">
                    Lease price: $99. Delivery includes high-quality audio file and licensing proof.
                  </p>
                  <p className="mb-3">
                    If you need stems, custom arrangement, or higher usage limits, request an upgrade.
                  </p>
                </div>
              )}

              {currentPage === 3 && (
                <div className="font-serif" style={{ lineHeight: 1.8 }}>
                  <h1 className="text-xl font-bold mb-4">Exclusive Terms</h1>
                  <p className="mb-3">
                    Exclusive license removes the beat from public catalog after purchase and grants priority rights
                    based on contract terms.
                  </p>
                  <p className="mb-3">
                    Exclusive price: $249. Recommended for official singles, videos, and long-term catalog releases.
                  </p>
                  <p className="mb-3">
                    For fully custom records, use Contact and include references, BPM range, and delivery target.
                  </p>
                </div>
              )}

              {currentPage > 3 && (
                <div className="font-serif" style={{ lineHeight: 1.8 }}>
                  <h1 className="text-xl font-bold mb-4">Page {currentPage}</h1>
                  <p className="mb-3">
                    Additional notes are being prepared for this section.
                  </p>
                  <p className="mb-3">Open Contact to request custom licensing terms for your release plan.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div className="h-6 bg-[#2d2d2d] border-t border-[#3a3a3a] flex items-center px-4 text-xs text-white/60">
          <span>PDF Document • {fileName}</span>
          <span className="ml-auto">
            {zoom}% • Page {currentPage} of {totalPages}
          </span>
        </div>
      </div>
    </DraggableWindow>
  )
}
