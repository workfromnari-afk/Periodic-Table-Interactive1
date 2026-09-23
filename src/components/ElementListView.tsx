import React, { useState, useMemo } from 'react';
import { ChemicalElement } from '../types/element';
import { CATEGORIES } from '../data/categories';
import { ArrowUpDown } from 'lucide-react';

interface ElementListViewProps {
  elements: ChemicalElement[];
  language: 'th' | 'en';
  onSelectElement: (element: ChemicalElement) => void;
}

type SortKey = 'atomicNumber' | 'symbol' | 'name' | 'atomicMass' | 'group' | 'period';

export const ElementListView: React.FC<ElementListViewProps> = ({
  elements,
  language,
  onSelectElement,
}) => {
  const [sortKey, setSortKey] = useState<SortKey>('atomicNumber');
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const sortedElements = useMemo(() => {
    return [...elements].sort((a, b) => {
      let valA: string | number = a.atomicNumber;
      let valB: string | number = b.atomicNumber;

      if (sortKey === 'atomicNumber') {
        valA = a.atomicNumber;
        valB = b.atomicNumber;
      } else if (sortKey === 'symbol') {
        valA = a.symbol;
        valB = b.symbol;
      } else if (sortKey === 'name') {
        valA = language === 'th' ? a.nameTh : a.nameEn;
        valB = language === 'th' ? b.nameTh : b.nameEn;
      } else if (sortKey === 'atomicMass') {
        valA = parseFloat(a.atomicMass.replace(/[()]/g, '')) || 0;
        valB = parseFloat(b.atomicMass.replace(/[()]/g, '')) || 0;
      } else if (sortKey === 'group') {
        valA = a.group || 99;
        valB = b.group || 99;
      } else if (sortKey === 'period') {
        valA = a.period;
        valB = b.period;
      }

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortAsc ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    });
  }, [elements, sortKey, sortAsc, language]);

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden shadow-xl mb-10">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/80 text-xs font-semibold text-slate-400">
              <th
                onClick={() => handleSort('atomicNumber')}
                className="py-3 px-4 cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  <span>เลขอะตอม</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('symbol')}
                className="py-3 px-3 cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  <span>สัญลักษณ์</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('name')}
                className="py-3 px-4 cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  <span>ชื่อธาตุ</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4">กลุ่มเคมี</th>
              <th className="py-3 px-3">สถานะ</th>
              <th
                onClick={() => handleSort('atomicMass')}
                className="py-3 px-3 cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  <span>มวลอะตอม</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('group')}
                className="py-3 px-3 cursor-pointer hover:text-white text-center"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>หมู่</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('period')}
                className="py-3 px-3 cursor-pointer hover:text-white text-center"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>คาบ</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4">การใช้งานจริง</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {sortedElements.map((el) => {
              const cat = CATEGORIES[el.category] || CATEGORIES.unknown;
              return (
                <tr
                  key={el.atomicNumber}
                  onClick={() => onSelectElement(el)}
                  className="hover:bg-slate-800/60 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-bold text-slate-300">
                    #{el.atomicNumber}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className="font-mono font-black text-lg px-2 py-0.5 rounded border inline-block"
                      style={{
                        backgroundColor: cat.bgColor,
                        borderColor: cat.borderColor,
                        color: cat.color,
                      }}
                    >
                      {el.symbol}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-white text-sm">
                      {language === 'th' ? el.nameTh : el.nameEn}
                    </div>
                    <div className="text-xs text-slate-400">
                      {language === 'th' ? el.nameEn : el.nameTh}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold text-white border"
                      style={{
                        backgroundColor: cat.solidBg,
                        borderColor: cat.color,
                      }}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.nameTh}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 text-xs text-slate-300">
                    {el.stateTh}
                  </td>
                  <td className="py-3 px-3 font-mono text-xs text-slate-300">
                    {el.atomicMass}
                  </td>
                  <td className="py-3 px-3 font-mono text-xs text-center text-slate-300">
                    {el.group ?? 'f-block'}
                  </td>
                  <td className="py-3 px-3 font-mono text-xs text-center text-slate-300">
                    {el.period}
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-300 max-w-xs truncate">
                    {el.uses}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
