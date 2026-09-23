import React from 'react';
import { ChemicalElement } from '../types/element';
import { CATEGORIES } from '../data/categories';

interface ElementTileProps {
  element: ChemicalElement;
  isSelected: boolean;
  isDimmed: boolean;
  isMatchedSearch: boolean;
  language: 'th' | 'en';
  tileSize?: 'normal' | 'large' | 'xlarge';
  contrastMode?: 'solid' | 'glass';
  memorizeConfig?: {
    hideSymbol: boolean;
    hideName: boolean;
    hideNumber: boolean;
  };
  onClick: (element: ChemicalElement) => void;
  onHover?: (element: ChemicalElement | null) => void;
}

export const ElementTile: React.FC<ElementTileProps> = ({
  element,
  isSelected,
  isDimmed,
  isMatchedSearch,
  language,
  tileSize = 'large',
  contrastMode = 'solid',
  memorizeConfig,
  onClick,
  onHover,
}) => {
  const categoryInfo = CATEGORIES[element.category] || CATEGORIES.unknown;

  const stateEmoji =
    element.state === 'gas'
      ? '💨'
      : element.state === 'liquid'
      ? '💧'
      : element.state === 'synthetic'
      ? '⚗️'
      : '🪨';

  // Sizing-specific styles
  const isLarge = tileSize === 'large';
  const isXLarge = tileSize === 'xlarge';

  // Styling based on selection, highlight, and contrast mode
  const bg = isSelected
    ? categoryInfo.color
    : isDimmed
    ? 'rgba(15, 23, 42, 0.45)'
    : contrastMode === 'solid'
    ? categoryInfo.solidBg
    : categoryInfo.bgColor;

  const borderColor = isSelected
    ? '#FFFFFF'
    : isMatchedSearch
    ? '#38BDF8'
    : isDimmed
    ? 'rgba(51, 65, 85, 0.4)'
    : categoryInfo.borderColor;

  const style: React.CSSProperties = {
    gridRow: element.gridRow,
    gridColumn: element.gridCol,
    backgroundColor: bg,
    borderColor: borderColor,
  };

  const displayName = language === 'th' ? element.nameTh : element.nameEn;

  return (
    <button
      type="button"
      onClick={() => onClick(element)}
      onMouseEnter={() => onHover && onHover(element)}
      onMouseLeave={() => onHover && onHover(null)}
      style={style}
      className={`group relative flex flex-col justify-between overflow-hidden text-left rounded-lg sm:rounded-xl border-2 transition-all duration-150 select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
        isXLarge
          ? 'p-2 sm:p-2.5'
          : isLarge
          ? 'p-1.5 sm:p-2'
          : 'p-1 sm:p-1.5'
      } ${
        isSelected
          ? 'shadow-xl shadow-cyan-500/30 scale-[1.05] z-30 ring-2 ring-white text-white'
          : isDimmed
          ? 'opacity-20 grayscale-[70%] hover:opacity-80'
          : isMatchedSearch
          ? 'ring-2 ring-cyan-400 scale-[1.03] z-20 shadow-lg shadow-cyan-500/25'
          : 'hover:scale-[1.05] hover:z-20 hover:shadow-lg hover:border-white/80 shadow-sm'
      }`}
      aria-label={`${element.nameEn} (${element.nameTh}), เลขอะตอม ${element.atomicNumber}, สัญลักษณ์ ${element.symbol}`}
    >
      {/* Category Accent Bar at the top of each tile for instant category recognition */}
      <div
        className="absolute top-0 left-0 right-0 h-1 sm:h-1.5 opacity-90 transition-opacity group-hover:opacity-100"
        style={{ backgroundColor: categoryInfo.color }}
        title={`กลุ่ม: ${categoryInfo.nameTh}`}
      />

      {/* Top row: Atomic Number and State Icon */}
      <div className="flex items-center justify-between w-full pt-1 leading-none">
        <span
          className={`font-mono font-bold tabular-nums ${
            isXLarge
              ? 'text-xs sm:text-sm'
              : isLarge
              ? 'text-[11px] sm:text-xs'
              : 'text-[9px] sm:text-[10px]'
          } ${
            isSelected
              ? 'text-white'
              : isDimmed
              ? 'text-slate-500'
              : 'text-amber-200 group-hover:text-white'
          }`}
        >
          {memorizeConfig?.hideNumber ? '?' : element.atomicNumber}
        </span>

        <span
          className={`${
            isXLarge
              ? 'text-xs'
              : isLarge
              ? 'text-[11px]'
              : 'text-[9px]'
          } opacity-85`}
          title={`สถานะ: ${element.stateTh}`}
        >
          {stateEmoji}
        </span>
      </div>

      {/* Center: Large, unmistakable Chemical Symbol */}
      <div className="my-auto text-center w-full py-0.5 sm:py-1">
        <span
          className={`font-mono font-black tracking-tight block drop-shadow-sm transition-transform group-hover:scale-110 ${
            element.symbol.length > 2
              ? isXLarge
                ? 'text-lg sm:text-xl'
                : isLarge
                ? 'text-base sm:text-lg'
                : 'text-sm sm:text-base'
              : isXLarge
              ? 'text-2xl sm:text-3xl'
              : isLarge
              ? 'text-xl sm:text-2xl'
              : 'text-base sm:text-lg'
          } ${
            isSelected
              ? 'text-white'
              : isDimmed
              ? 'text-slate-500'
              : 'text-white'
          }`}
        >
          {memorizeConfig?.hideSymbol ? '?' : element.symbol}
        </span>
      </div>

      {/* Bottom row: Element Name & Atomic Mass */}
      <div className="w-full text-center leading-tight pb-0.5">
        <span
          className={`block font-bold truncate ${
            isXLarge
              ? 'text-xs sm:text-sm'
              : isLarge
              ? 'text-[10px] sm:text-xs'
              : 'text-[9px] sm:text-[10px]'
          } ${
            isSelected
              ? 'text-white'
              : isDimmed
              ? 'text-slate-500'
              : 'text-slate-100 group-hover:text-white'
          }`}
          title={displayName}
        >
          {memorizeConfig?.hideName ? '•••' : displayName}
        </span>

        <span
          className={`block font-mono tabular-nums truncate text-slate-300/90 ${
            isXLarge
              ? 'text-[11px]'
              : isLarge
              ? 'text-[9px] sm:text-[10px]'
              : 'text-[8px] sm:text-[9px]'
          }`}
        >
          {element.atomicMass}
        </span>
      </div>
    </button>
  );
};
