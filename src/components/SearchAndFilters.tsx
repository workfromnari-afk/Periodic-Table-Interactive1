import React from 'react';
import { Search, X, Filter, RotateCcw, Globe, LayoutGrid, Layers, List } from 'lucide-react';
import { ElementCategory, ElementState } from '../types/element';
import { CATEGORIES } from '../data/categories';

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: ElementCategory | 'all';
  onCategoryChange: (cat: ElementCategory | 'all') => void;
  selectedState: ElementState | 'all';
  onStateChange: (state: ElementState | 'all') => void;
  language: 'th' | 'en';
  onLanguageToggle: () => void;
  matchCount: number;
  totalCount: number;
  viewMode: 'grid' | 'grouped' | 'list';
  onViewModeChange: (mode: 'grid' | 'grouped' | 'list') => void;
  onResetFilters: () => void;
}

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedState,
  onStateChange,
  language,
  onLanguageToggle,
  matchCount,
  totalCount,
  viewMode,
  onViewModeChange,
  onResetFilters,
}) => {
  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedCategory !== 'all' ||
    selectedState !== 'all';

  const categoryList: (ElementCategory | 'all')[] = [
    'all',
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

  const stateList: { id: ElementState | 'all'; labelTh: string; labelEn: string; icon: string }[] = [
    { id: 'all', labelTh: 'ทุกสถานะ', labelEn: 'All States', icon: '✨' },
    { id: 'solid', labelTh: 'ของแข็ง', labelEn: 'Solids', icon: '🪨' },
    { id: 'liquid', labelTh: 'ของเหลว', labelEn: 'Liquids', icon: '💧' },
    { id: 'gas', labelTh: 'แก๊ส', labelEn: 'Gases', icon: '💨' },
    { id: 'synthetic', labelTh: 'สังเคราะห์', labelEn: 'Synthetic', icon: '⚗️' },
  ];

  return (
    <section className="w-full space-y-4 mb-6">
      {/* View Mode Switcher + Language Selector Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-md">
        {/* Left: View Mode Selection */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-xs font-bold text-slate-300 pl-1 hidden sm:inline">
            มุมมอง:
          </span>
          <div className="flex items-center rounded-xl bg-slate-950 p-1 border border-slate-800">
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'grid'
                  ? 'bg-cyan-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>ตารางธาตุ 18 หมู่</span>
            </button>

            <button
              type="button"
              onClick={() => onViewModeChange('grouped')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'grouped'
                  ? 'bg-cyan-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>แยกตามหมวดหมู่ (อ่านง่าย)</span>
            </button>

            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'list'
                  ? 'bg-cyan-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>ตารางข้อมูล</span>
            </button>
          </div>
        </div>

        {/* Right: Language switch & Reset */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onLanguageToggle}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-bold text-slate-200 hover:border-cyan-400 hover:text-white transition-colors"
            title="สลับภาษาชื่อธาตุ"
          >
            <Globe className="h-3.5 w-3.5 text-cyan-400" />
            <span>{language === 'th' ? '🇹🇭 ชื่อไทย' : '🇬🇧 English Name'}</span>
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="flex items-center gap-1.5 rounded-xl border border-amber-500/50 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-colors"
              title="ล้างตัวกรองทั้งหมด"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>ล้างตัวกรอง</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Search Bar & State Filter Segmented Control */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-cyan-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ค้นหาชื่อไทย, อังกฤษ, สัญลักษณ์ หรือเลขอะตอม (เช่น ออกซิเจน, Oxygen, Fe, 26)..."
            className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-10 pr-10 text-sm text-slate-100 placeholder-slate-400 shadow-inner focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all font-medium"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white"
              title="ล้างคำค้นหา"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* State filter segmented control */}
        <div className="flex items-center gap-1 overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80 p-1">
          {stateList.map((st) => (
            <button
              key={st.id}
              onClick={() => onStateChange(st.id)}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                selectedState === st.id
                  ? 'bg-slate-800 text-cyan-300 shadow-sm ring-1 ring-cyan-500/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-[12px]">{st.icon}</span>
              <span>{language === 'th' ? st.labelTh : st.labelEn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="flex items-center gap-1 text-xs font-bold text-slate-400 mr-1">
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
          <span>กรองหมวดหมู่:</span>
        </span>

        {categoryList.map((catKey) => {
          const isAll = catKey === 'all';
          const isSelected = selectedCategory === catKey;
          const info = !isAll ? CATEGORIES[catKey] : null;

          return (
            <button
              key={catKey}
              onClick={() => onCategoryChange(catKey)}
              className={`group flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all duration-150 border whitespace-nowrap ${
                isSelected
                  ? 'border-white bg-slate-700 text-white shadow-md ring-2 ring-cyan-400'
                  : 'border-slate-800 bg-slate-900/70 text-slate-300 hover:border-slate-700 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {!isAll && info ? (
                <span className="text-xs">{info.icon}</span>
              ) : (
                <span>✨</span>
              )}
              <span>
                {isAll
                  ? 'ทั้งหมด (118)'
                  : language === 'th'
                  ? info?.nameTh
                  : info?.nameEn}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter result status feedback */}
      <div className="flex items-center justify-between text-xs text-slate-300 pt-1 border-t border-slate-800/80">
        <div className="flex items-center gap-2">
          <span>พบธาตุที่ตรงเงื่อนไข:</span>
          <span className="font-mono font-black text-sm text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/50">
            {matchCount} ธาตุ
          </span>
          <span className="text-slate-400"> (จากทั้งหมด {totalCount} ธาตุ)</span>
        </div>

        {matchCount === 0 && (
          <div className="text-amber-400 font-bold bg-amber-950/50 border border-amber-800/60 px-3 py-1 rounded-lg">
            ⚠️ ไม่พบธาตุที่ตรงกับคำค้นหาหรือตัวกรองที่เลือก
          </div>
        )}
      </div>
    </section>
  );
};
