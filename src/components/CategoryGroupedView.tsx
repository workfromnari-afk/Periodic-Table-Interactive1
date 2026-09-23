import React from 'react';
import { ChemicalElement, ElementCategory } from '../types/element';
import { CATEGORIES } from '../data/categories';

interface CategoryGroupedViewProps {
  elements: ChemicalElement[];
  selectedElement: ChemicalElement | null;
  language: 'th' | 'en';
  onSelectElement: (element: ChemicalElement) => void;
}

export const CategoryGroupedView: React.FC<CategoryGroupedViewProps> = ({
  elements,
  selectedElement,
  language,
  onSelectElement,
}) => {
  // Order of categories for logical chemical progression
  const categoryOrder: ElementCategory[] = [
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
    'unknown',
  ];

  return (
    <div className="w-full space-y-8 pb-12">
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-slate-300 text-sm flex items-center justify-between">
        <div>
          <span className="font-bold text-white">🗂️ มุมมองแยกตามหมวดหมู่ (10 กลุ่มเคมีหลัก)</span>
          <p className="text-xs text-slate-400 mt-0.5">
            ดูธาตุทั้งหมด 118 ธาตุจัดเรียงเป็นกลุ่มชัดเจน พร้อมคำอธิบายคุณสมบัติเคมีและการนำไปใช้
          </p>
        </div>
        <span className="text-xs font-mono bg-slate-800 text-cyan-400 px-2.5 py-1 rounded-lg border border-slate-700">
          ครบทั้ง 118 ธาตุ
        </span>
      </div>

      {categoryOrder.map((catKey) => {
        const catInfo = CATEGORIES[catKey];
        if (!catInfo) return null;

        const groupElements = elements.filter((el) => el.category === catKey);
        if (groupElements.length === 0) return null;

        return (
          <section
            key={catKey}
            className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden shadow-lg"
          >
            {/* Category Header Banner */}
            <div
              className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b"
              style={{
                backgroundColor: catInfo.bgColor,
                borderColor: catInfo.borderColor,
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{catInfo.icon}</span>
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <span>{catInfo.nameTh}</span>
                    <span className="text-xs font-normal text-slate-300 font-mono">
                      ({catInfo.nameEn})
                    </span>
                  </h3>
                  <p className="text-xs text-slate-200 mt-0.5 max-w-2xl">
                    {catInfo.descriptionTh}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm border border-white/20"
                  style={{ backgroundColor: catInfo.color }}
                >
                  {groupElements.length} ธาตุ
                </span>
              </div>
            </div>

            {/* Elements Grid in this category */}
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {groupElements.map((el) => {
                const isSelected = selectedElement?.atomicNumber === el.atomicNumber;
                const stateIcon =
                  el.state === 'gas'
                    ? '💨 แก๊ส'
                    : el.state === 'liquid'
                    ? '💧 ของเหลว'
                    : el.state === 'synthetic'
                    ? '⚗️ สังเคราะห์'
                    : '🪨 ของแข็ง';

                return (
                  <button
                    key={el.atomicNumber}
                    type="button"
                    onClick={() => onSelectElement(el)}
                    style={{
                      backgroundColor: isSelected ? catInfo.color : catInfo.solidBg,
                      borderColor: isSelected ? '#FFFFFF' : catInfo.borderColor,
                    }}
                    className={`group relative text-left p-3 rounded-xl border-2 transition-all duration-150 cursor-pointer flex flex-col justify-between h-36 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                      isSelected
                        ? 'ring-2 ring-white scale-105 shadow-xl text-white'
                        : 'hover:scale-[1.03] hover:border-white/90 hover:shadow-lg'
                    }`}
                  >
                    {/* Top bar */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-amber-300">
                        #{el.atomicNumber}
                      </span>
                      <span className="text-[10px] font-medium text-slate-200/90 bg-black/30 px-1.5 py-0.5 rounded">
                        {stateIcon}
                      </span>
                    </div>

                    {/* Chemical Symbol & Name */}
                    <div className="my-auto py-1">
                      <div className="font-mono font-black text-2xl sm:text-3xl text-white group-hover:scale-105 transition-transform">
                        {el.symbol}
                      </div>
                      <div className="font-bold text-xs sm:text-sm text-slate-100 truncate">
                        {language === 'th' ? el.nameTh : el.nameEn}
                      </div>
                      <div className="text-[11px] text-slate-300/80 truncate">
                        {language === 'th' ? el.nameEn : el.nameTh}
                      </div>
                    </div>

                    {/* Bottom row: Atomic mass and Period/Group */}
                    <div className="flex items-center justify-between text-[10px] font-mono border-t border-white/10 pt-1.5 text-slate-300">
                      <span>มวล {el.atomicMass}</span>
                      <span>
                        {el.group ? `ม.${el.group}` : 'f-block'} ค.{el.period}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
};
