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
              direction: "rtl", // For Persian text which is right-to-left
            }}
          >
            <div className="p-8 h-full overflow-auto text-black" style={{ fontSize: `${zoom / 100}rem` }}>
              {/* Display different content based on current page */}
              {currentPage === 1 && (
                <div className="font-serif text-right" style={{ lineHeight: 1.8 }}>
                  <h1 className="text-xl font-bold mb-4">سخن ناشر</h1>
                  <p className="mb-3">
                    هنگام جسـتار را ادبیـات بی‌قرار خوانده‌اند. تعریف جسـتار روایی برای هـر خواننده خوانـدن متن، شـکل
                    می‌گیـرد، فرو می‌ریزد و دوباره سـاخته می‌شـود. قواعد ثابتی در میـان نیسـت و بـه قول انَی دیـارد،
                    جسـتارنویس هر بار باید فـرم خودش را بسـازد.
                  </p>
                  <p className="mb-3">
                    اما نویسـندگانی کـه بـا ایـن ژانـر دسـت‌وپنجه نـرم کرده‌اند بـدون ادعـای ارائـه‌ی تعریـف نظـری برای
                    ایـن قالب نوشـتن، تعبیرهای قابل‌تأملـی دربارهی جسـتار دارند که کنار هـم دیدن‌شـان تصویـر ذهنی مـا از
                    این ژانـر را روشـن‌تر می‌کند.
                  </p>
                  <p className="mb-3">
                    جستارنویسان، این ژانر را فرمی گریزپا می‌دانند؛ فرمی سـیال برای گفتن از رخدادهایی که بر منِ نویسـنده
                    گذشـته و ردپای‌شـان نه در زندگی او که بر هویتش به جا مانده؛ رخدادهایی که راوی می‌کوشد به مددشان تکه‌ای
                    شخصی و خاص را در جورچین مفاهیم کیهانی، جهانی و عام جا دهد.
                  </p>
                </div>
              )}

              {currentPage === 2 && (
                <div className="font-serif text-right" style={{ lineHeight: 1.8 }}>
                  <h1 className="text-xl font-bold mb-4">فصل اول</h1>
                  <p className="mb-3">
                    در این فصل به بررسی مفهوم ادبیات معاصر و تأثیر آن بر فرهنگ ایرانی می‌پردازیم. ادبیات معاصر ایران با
                    تحولات اجتماعی و سیاسی قرن بیستم پیوندی ناگسستنی دارد و بازتاب‌دهنده‌ی دگرگونی‌های عمیق جامعه‌ی ایرانی
                    است.
                  </p>
                  <p className="mb-3">
                    نویسندگان این دوره با بهره‌گیری از سنت‌های ادبی کهن و آشنایی با جریان‌های ادبی جهان، زبان و بیانی نو در
                    ادبیات فارسی پدید آوردند که هم ریشه در گذشته داشت و هم به نیازهای زمانه پاسخ می‌داد.
                  </p>
                  <p className="mb-3">
                    در این میان، داستان‌نویسی به عنوان قالبی مدرن، جایگاه ویژه‌ای یافت و به ابزاری برای بازنمایی واقعیت‌های
                    اجتماعی و انسانی تبدیل شد. نویسندگانی چون صادق هدایت، بزرگ علوی و صادق چوبک با آثار خود مسیر تازه‌ای
                    را در ادبیات داستانی ایران گشودند.
                  </p>
                </div>
              )}

              {currentPage === 3 && (
                <div className="font-serif text-right" style={{ lineHeight: 1.8 }}>
                  <h1 className="text-xl font-bold mb-4">فصل دوم</h1>
                  <p className="mb-3">
                    شعر معاصر فارسی با نوآوری‌های نیما یوشیج دگرگون شد. او با شکستن قالب‌های سنتی و ایجاد زبانی نو، افق‌های
                    تازه‌ای را پیش روی شاعران گشود. پس از او، شاعرانی چون احمد شاملو، فروغ فرخزاد، مهدی اخوان ثالث و
                    سهراب سپهری هر یک به شیوه‌ی خود این راه را ادامه دادند.
                  </p>
                  <p className="mb-3">
                    شعر نو فارسی توانست بسیاری از مفاهیم و تجربه‌های انسان معاصر را که در قالب‌های سنتی نمی‌گنجید، بیان
                    کند. این شعر با زبانی ساده‌تر و نزدیک‌تر به زبان گفتار، اما غنی از تصاویر و استعاره‌های بدیع، توانست با
                    مخاطب ارتباطی عمیق‌تر برقرار کند.
                  </p>
                  <p className="mb-3">
                    در این دوره، شعر از حالت تغزلی صرف خارج شد و به مسائل اجتماعی، سیاسی و فلسفی پرداخت. شاعران با نگاهی
                    انتقادی به جامعه و تاریخ، تلاش کردند تصویری واقع‌بینانه از شرایط انسان معاصر ارائه دهند.
                  </p>
                </div>
              )}

              {currentPage > 3 && (
                <div className="font-serif text-right" style={{ lineHeight: 1.8 }}>
                  <h1 className="text-xl font-bold mb-4">صفحه {currentPage}</h1>
                  <p className="mb-3">
                    این صفحه در حال آماده‌سازی است. لطفاً به صفحات قبلی مراجعه کنید یا به صفحات بعدی بروید.
                  </p>
                  <p className="mb-3">محتوای کتاب در حال تکمیل است. با تشکر از صبر و شکیبایی شما.</p>
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

