import React, { useRef, useState } from 'react';
import { ChemicalElement, ElementCategory } from '../types/element';
import { ElementTile } from './ElementTile';
import { CATEGORIES } from '../data/categories';
import { ZoomIn, ZoomOut, Maximize2, Sparkles, SlidersHorizontal } from 'lucide-react';

interface PeriodicTableGridProps {
  elements: ChemicalElement[];
  selectedElement: ChemicalElement | null;
  hoveredElement: ChemicalElement | null;
  matchedElementIds: Set<number>;
  hasActiveFilter: boolean;
  language: 'th' | 'en';
  memorizeConfig?: {
    hideSymbol: boolean;
    hideName: boolean;
    hideNumber: boolean;
  };
  onSelectElement: (element: ChemicalElement) => void;
  onHoverElement: (element: ChemicalElement | null) => void;
  onFilterCategory?: (category: ElementCategory) => void;
}

export const PeriodicTableGrid: React.FC<PeriodicTableGridProps> = ({
  elements,
  selectedElement,
  hoveredElement,
  matchedElementIds,
  hasActiveFilter,
  language,
  memorizeConfig,
  onSelectElement,
  onHoverElement,
  onFilterCategory,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [tileSize, setTileSize] = useState<'normal' | 'large' | 'xlarge'>('large');
  const [contrastMode, setContrastMode] = useState<'solid' | 'glass'>('solid');
  const [hoveredCategory, setHoveredCategory] = useState<ElementCategory | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Active element preview for HUD
  const activePreview = hoveredElement || selectedElement || elements[0];
  const previewCategory = activePreview
    ? CATEGORIES[activePreview.category]
    : CATEGORIES['reactive-nonmetal'];

  const categoryList: ElementCategory[] = [
    'alkali-metal',
    'alkaline-earth',
    'transition-metal',
    'post-transition',
    'metalloid',
    'reactive-nonmetal',
    'halogen',
    'noble-gas',
    'lanthanide',
    'actinide',
  ];

  return (
    <div className="relative w-full rounded-2xl border border-slate-800 bg-slate-900/40 p-3 sm:p-5 backdrop-blur-sm shadow-2xl">
      {/* Visual Category Legend Bar with interactive hover highlight */}
      <div className="mb-4 p-3 rounded-xl border border-slate-800 bg-slate-950/60">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <span>🎨</span>
            <span>หมวดหมู่ธาตุ (ชี้เมาส์หรือแตะเพื่อเน้นธาตุกลุ่มนั้นทันที):</span>
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            คลิกเพื่อกรองเฉพาะกลุ่ม
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {categoryList.map((catKey) => {
            const cat = CATEGORIES[catKey];
            const isHovered = hoveredCategory === catKey;
            return (
              <button
                key={catKey}
                type="button"
                onMouseEnter={() => setHoveredCategory(catKey)}
                onMouseLeave={() => setHoveredCategory(null)}
                onClick={() => onFilterCategory && onFilterCategory(catKey)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                  isHovered
                    ? 'ring-2 ring-white scale-105 shadow-md text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
                style={{
                  backgroundColor: isHovered ? cat.color : cat.bgColor,
                  borderColor: cat.color,
                }}
              >
                <span>{cat.icon}</span>
                <span>{language === 'th' ? cat.nameTh : cat.nameEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Controls Header: Tile Size Selector, Contrast Mode, Zoom */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80 px-1">
        {/* Left: Tile size selection */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span>ขนาดช่องธาตุ:</span>
          </span>
          <div className="flex items-center rounded-lg border border-slate-700 bg-slate-950 p-0.5">
            <button
              type="button"
              onClick={() => setTileSize('normal')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                tileSize === 'normal'
                  ? 'bg-cyan-500 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ปกติ
            </button>
            <button
              type="button"
              onClick={() => setTileSize('large')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                tileSize === 'large'
                  ? 'bg-cyan-500 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ใหญ่ (สบายตา)
            </button>
            <button
              type="button"
              onClick={() => setTileSize('xlarge')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                tileSize === 'xlarge'
                  ? 'bg-cyan-500 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ใหญ่พิเศษ 🔎
            </button>
          </div>
        </div>

        {/* Middle & Right: Contrast Mode & Zoom controls */}
        <div className="flex items-center gap-2.5">
          {/* Contrast Mode Selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <span className="hidden sm:inline text-slate-400 font-medium">สี:</span>
            <button
              type="button"
              onClick={() =>
                setContrastMode((c) => (c === 'solid' ? 'glass' : 'solid'))
              }
              className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                contrastMode === 'solid'
                  ? 'border-amber-500/60 bg-amber-500/20 text-amber-300'
                  : 'border-slate-700 bg-slate-800 text-slate-300'
              }`}
              title="สลับโหมดสีชัดเจน/สีกระจก"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{contrastMode === 'solid' ? 'สีสดคมชัด (Solid)' : 'สีกระจก (Glass)'}</span>
            </button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-slate-950 rounded-lg p-1 border border-slate-700/80">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
              className="p-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
              title="ย่อขนาดตาราง"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-mono tabular-nums px-1.5 text-slate-200 font-bold min-w-[42px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.1))}
              className="p-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
              title="ขยายขนาดตาราง"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(1)}
              className="px-1.5 py-0.5 text-[11px] text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors ml-0.5 font-medium"
              title="รีเซ็ตขนาด 100%"
            >
              100%
            </button>
          </div>
        </div>
      </div>

      {/* Overflow Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="w-full overflow-x-auto pb-4 pt-1 transition-transform origin-top-left"
      >
        <div
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top left',
            minWidth: tileSize === 'xlarge' ? '1800px' : tileSize === 'large' ? '1500px' : '1240px',
          }}
          className="relative"
        >
          {/* Group numbers Header (1 to 18) */}
          <div
            className={`grid grid-cols-[36px_repeat(18,1fr)] gap-1 mb-1.5 text-center font-mono font-bold text-slate-300 select-none ${
              tileSize === 'xlarge'
                ? 'text-xs sm:text-sm'
                : tileSize === 'large'
                ? 'text-xs'
                : 'text-[11px]'
            }`}
          >
            <div className="text-slate-500 py-1">คาบ</div>
            {Array.from({ length: 18 }, (_, i) => (
              <div
                key={i + 1}
                className="py-1 rounded-md bg-slate-950/80 text-cyan-300/90 border border-slate-800"
              >
                หมู่ {i + 1}
              </div>
            ))}
          </div>

          {/* Main Grid area with period numbers on the left */}
          <div className="grid grid-cols-[36px_1fr] gap-1">
            {/* Period numbers (1 to 7, plus gap and 9, 10 for f-block) */}
            <div
              className={`grid ${
                tileSize === 'xlarge'
                  ? 'grid-rows-[repeat(7,minmax(106px,auto))_20px_repeat(2,minmax(106px,auto))]'
                  : tileSize === 'large'
                  ? 'grid-rows-[repeat(7,minmax(90px,auto))_18px_repeat(2,minmax(90px,auto))]'
                  : 'grid-rows-[repeat(7,minmax(74px,auto))_16px_repeat(2,minmax(74px,auto))]'
              } gap-1 text-center font-mono font-bold text-slate-400 select-none pt-1`}
            >
              <div className="flex items-center justify-center rounded bg-slate-950/50 border border-slate-800/80">1</div>
              <div className="flex items-center justify-center rounded bg-slate-950/50 border border-slate-800/80">2</div>
              <div className="flex items-center justify-center rounded bg-slate-950/50 border border-slate-800/80">3</div>
              <div className="flex items-center justify-center rounded bg-slate-950/50 border border-slate-800/80">4</div>
              <div className="flex items-center justify-center rounded bg-slate-950/50 border border-slate-800/80">5</div>
              <div className="flex items-center justify-center rounded bg-slate-950/50 border border-slate-800/80">6</div>
              <div className="flex items-center justify-center rounded bg-slate-950/50 border border-slate-800/80">7</div>
              <div className="text-slate-600 flex items-center justify-center">•••</div>
              <div className="text-[10px] text-pink-400 font-bold flex items-center justify-center rounded bg-pink-950/20 border border-pink-900/40">
                La*
              </div>
              <div className="text-[10px] text-rose-400 font-bold flex items-center justify-center rounded bg-rose-950/20 border border-rose-900/40">
                Ac**
              </div>
            </div>

            {/* Periodic Elements Container */}
            <div className={`relative periodic-grid grid-size-${tileSize}`}>
              {/* Central Dynamic Element HUD Showcase (in the empty space: rows 1-3, cols 3-12) */}
              {activePreview && (
                <div
                  style={{
                    gridRow: '1 / span 3',
                    gridColumn: '3 / span 10',
                  }}
                  className="hidden md:flex flex-row items-center justify-between p-4 rounded-2xl border-2 border-slate-700 bg-slate-950/90 backdrop-blur-md shadow-2xl my-1 mx-1 pointer-events-none"
                >
                  {/* Left: Giant Symbol & Atomic Number */}
                  <div className="flex items-center gap-5">
                    <div
                      className="flex flex-col justify-between w-24 h-28 rounded-xl p-2.5 border-2 shadow-2xl shrink-0"
                      style={{
                        backgroundColor: previewCategory?.solidBg || previewCategory?.color,
                        borderColor: previewCategory?.color,
                      }}
                    >
                      <div className="flex justify-between items-center text-xs font-mono font-bold text-white">
                        <span>#{activePreview.atomicNumber}</span>
                        <span>{activePreview.stateTh}</span>
                      </div>
                      <div className="text-center font-mono text-4xl font-black text-white drop-shadow">
                        {activePreview.symbol}
                      </div>
                      <div className="text-[11px] text-center font-mono font-semibold text-slate-200 truncate">
                        {activePreview.atomicMass}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-black text-white">
                          {activePreview.nameTh}
                        </h3>
                        <span className="text-base text-slate-300 font-semibold">
                          ({activePreview.nameEn})
                        </span>
                        <span
                          className="text-xs px-3 py-1 rounded-full font-bold text-white shadow-sm border border-white/20 flex items-center gap-1.5"
                          style={{
                            backgroundColor: previewCategory?.color,
                          }}
                        >
                          <span>{previewCategory?.icon}</span>
                          <span>{activePreview.categoryTh}</span>
                        </span>
                      </div>

                      <div className="text-xs text-slate-200 flex flex-wrap items-center gap-3 font-mono bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                        <span>หมู่: <strong className="text-white">{activePreview.group ?? '-'}</strong></span>
                        <span>·</span>
                        <span>คาบ: <strong className="text-white">{activePreview.period}</strong></span>
                        <span>·</span>
                        <span>บล็อก: <strong className="text-cyan-400">{activePreview.block}</strong></span>
                        <span>·</span>
                        <span>การจัดเรียง e⁻: <strong className="text-amber-300">{activePreview.electronConfig}</strong></span>
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-2 max-w-xl">
                        💡 <strong className="text-cyan-400">การใช้งานจริง:</strong>{' '}
                        {activePreview.uses}
                      </p>
                    </div>
                  </div>

                  <div className="text-right text-xs text-slate-400 space-y-1 shrink-0 pl-4 border-l border-slate-800">
                    <div className="text-cyan-400 font-bold text-sm">คลิกที่ธาตุเพื่อเจาะลึก ↗</div>
                    <div className="text-slate-400">ครบทั้ง 118 ธาตุ</div>
                    <div className="text-[11px] text-slate-400">รองรับภาษาไทย/EN</div>
                  </div>
                </div>
              )}

              {/* Lanthanide placeholder box (Row 6, Col 3) */}
              <button
                type="button"
                onClick={() => onFilterCategory && onFilterCategory('lanthanide')}
                style={{
                  gridRow: 6,
                  gridColumn: 3,
                  backgroundColor: '#831843',
                  borderColor: '#EC4899',
                }}
                className="flex flex-col items-center justify-center p-1 rounded-lg border-2 text-center transition-all hover:scale-105 text-pink-100 cursor-pointer shadow-md"
                title="คลิกเพื่อกรองกลุ่มธาตุแลนทาไนด์ (57-71)"
              >
                <span className="font-mono font-bold text-[10px] sm:text-xs text-pink-300">
                  57-71
                </span>
                <span className="font-black text-sm sm:text-base text-white">
                  La-Lu
                </span>
                <span className="text-[9px] sm:text-[10px] text-pink-200 font-bold truncate">
                  💎 แลนทาไนด์*
                </span>
              </button>

              {/* Actinide placeholder box (Row 7, Col 3) */}
              <button
                type="button"
                onClick={() => onFilterCategory && onFilterCategory('actinide')}
                style={{
                  gridRow: 7,
                  gridColumn: 3,
                  backgroundColor: '#881337',
                  borderColor: '#F43F5E',
                }}
                className="flex flex-col items-center justify-center p-1 rounded-lg border-2 text-center transition-all hover:scale-105 text-rose-100 cursor-pointer shadow-md"
                title="คลิกเพื่อกรองกลุ่มธาตุแอกทิไนด์ (89-103)"
              >
                <span className="font-mono font-bold text-[10px] sm:text-xs text-rose-300">
                  89-103
                </span>
                <span className="font-black text-sm sm:text-base text-white">
                  Ac-Lr
                </span>
                <span className="text-[9px] sm:text-[10px] text-rose-200 font-bold truncate">
                  ☢️ แอกทิไนด์**
                </span>
              </button>

              {/* Spacer Row 8 between main table and f-block */}
              <div
                style={{
                  gridRow: 8,
                  gridColumn: '1 / span 18',
                  height: tileSize === 'xlarge' ? '20px' : tileSize === 'large' ? '18px' : '14px',
                }}
                aria-hidden="true"
              />

              {/* Render all 118 Elements */}
              {elements.map((element) => {
                const isSelected =
                  selectedElement?.atomicNumber === element.atomicNumber;
                const isMatched = matchedElementIds.has(element.atomicNumber);

                // Highlight by hovered category if active
                const isCategoryHovered = hoveredCategory !== null;
                const isDimmedByCategory =
                  isCategoryHovered && element.category !== hoveredCategory;

                const isDimmed = (hasActiveFilter && !isMatched) || isDimmedByCategory;

                return (
                  <ElementTile
                    key={element.atomicNumber}
                    element={element}
                    isSelected={isSelected}
                    isDimmed={isDimmed}
                    isMatchedSearch={hasActiveFilter && isMatched}
                    language={language}
                    tileSize={tileSize}
                    contrastMode={contrastMode}
                    memorizeConfig={memorizeConfig}
                    onClick={onSelectElement}
                    onHover={onHoverElement}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
