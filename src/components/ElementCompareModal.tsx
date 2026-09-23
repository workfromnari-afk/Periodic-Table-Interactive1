import React, { useState } from 'react';
import { ChemicalElement } from '../types/element';
import { ELEMENTS } from '../data/elements';
import { CATEGORIES } from '../data/categories';
import { X, ArrowRightLeft, Thermometer, Layers, Sparkles } from 'lucide-react';

interface ElementCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialElementA?: ChemicalElement | null;
  initialElementB?: ChemicalElement | null;
}

export const ElementCompareModal: React.FC<ElementCompareModalProps> = ({
  isOpen,
  onClose,
  initialElementA,
  initialElementB,
}) => {
  const [elementAId, setElementAId] = useState<number>(
    initialElementA?.atomicNumber || 6 // Carbon default
  );
  const [elementBId, setElementBId] = useState<number>(
    initialElementB?.atomicNumber || 14 // Silicon default
  );

  if (!isOpen) return null;

  const elA = ELEMENTS.find((e) => e.atomicNumber === elementAId) || ELEMENTS[5];
  const elB = ELEMENTS.find((e) => e.atomicNumber === elementBId) || ELEMENTS[13];

  const catA = CATEGORIES[elA.category] || CATEGORIES.unknown;
  const catB = CATEGORIES[elB.category] || CATEGORIES.unknown;

  const swapElements = () => {
    setElementAId(elB.atomicNumber);
    setElementBId(elA.atomicNumber);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 text-slate-100 shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">เปรียบเทียบธาตุเคมีแบบตัวต่อตัว</h2>
              <p className="text-xs text-slate-400">วิเคราะห์ความแตกต่างของสมบัติทางกายภาพและเคมี</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selection Bar */}
        <div className="my-5 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4">
          {/* Element A Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              ธาตุที่ 1:
            </label>
            <select
              value={elementAId}
              onChange={(e) => setElementAId(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
            >
              {ELEMENTS.map((el) => (
                <option key={el.atomicNumber} value={el.atomicNumber}>
                  {el.atomicNumber}. {el.symbol} — {el.nameTh} ({el.nameEn})
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center pt-5">
            <button
              onClick={swapElements}
              className="p-2.5 rounded-full border border-slate-700 bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-colors"
              title="สลับตำแหน่งธาตุ"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Element B Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              ธาตุที่ 2:
            </label>
            <select
              value={elementBId}
              onChange={(e) => setElementBId(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
            >
              {ELEMENTS.map((el) => (
                <option key={el.atomicNumber} value={el.atomicNumber}>
                  {el.atomicNumber}. {el.symbol} — {el.nameTh} ({el.nameEn})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Side-by-Side Comparison Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80">
                <th className="p-3.5 text-slate-400 font-semibold w-1/4">คุณสมบัติ</th>
                <th className="p-3.5 font-bold text-white w-3/8" style={{ color: catA.color }}>
                  {elA.nameTh} ({elA.symbol})
                </th>
                <th className="p-3.5 font-bold text-white w-3/8" style={{ color: catB.color }}>
                  {elB.nameTh} ({elB.symbol})
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {/* Category */}
              <tr>
                <td className="p-3 text-slate-400 font-medium">ประเภทธาตุ</td>
                <td className="p-3 text-slate-200">
                  <span
                    className="px-2 py-0.5 rounded text-xs font-semibold"
                    style={{ backgroundColor: catA.bgColor, color: catA.color }}
                  >
                    {elA.categoryTh}
                  </span>
                </td>
                <td className="p-3 text-slate-200">
                  <span
                    className="px-2 py-0.5 rounded text-xs font-semibold"
                    style={{ backgroundColor: catB.bgColor, color: catB.color }}
                  >
                    {elB.categoryTh}
                  </span>
                </td>
              </tr>

              {/* Atomic Number */}
              <tr>
                <td className="p-3 text-slate-400 font-medium">เลขอะตอม (Z)</td>
                <td className="p-3 font-mono font-bold text-white tabular-nums">
                  {elA.atomicNumber}
                </td>
                <td className="p-3 font-mono font-bold text-white tabular-nums">
                  {elB.atomicNumber}
                </td>
              </tr>

              {/* Atomic Mass */}
              <tr>
                <td className="p-3 text-slate-400 font-medium">มวลอะตอม</td>
                <td className="p-3 font-mono text-slate-300 tabular-nums">
                  {elA.atomicMass} u
                </td>
                <td className="p-3 font-mono text-slate-300 tabular-nums">
                  {elB.atomicMass} u
                </td>
              </tr>

              {/* Group / Period / Block */}
              <tr>
                <td className="p-3 text-slate-400 font-medium">หมู่ / คาบ / บล็อก</td>
                <td className="p-3 font-mono text-slate-300">
                  หมู่ {elA.group ?? '-'} · คาบ {elA.period} · {elA.block}-block
                </td>
                <td className="p-3 font-mono text-slate-300">
                  หมู่ {elB.group ?? '-'} · คาบ {elB.period} · {elB.block}-block
                </td>
              </tr>

              {/* State */}
              <tr>
                <td className="p-3 text-slate-400 font-medium">สถานะที่ 25°C</td>
                <td className="p-3 text-slate-200 font-medium">{elA.stateTh}</td>
                <td className="p-3 text-slate-200 font-medium">{elB.stateTh}</td>
              </tr>

              {/* Electron Configuration */}
              <tr>
                <td className="p-3 text-slate-400 font-medium">การจัดเรียงอิเล็กตรอน</td>
                <td className="p-3 font-mono text-cyan-300 text-xs sm:text-sm">
                  {elA.electronConfig}
                </td>
                <td className="p-3 font-mono text-cyan-300 text-xs sm:text-sm">
                  {elB.electronConfig}
                </td>
              </tr>

              {/* Melting Point */}
              <tr>
                <td className="p-3 text-slate-400 font-medium">จุดหลอมเหลว</td>
                <td className="p-3 font-mono text-slate-300 tabular-nums">
                  {elA.meltingPoint !== null && elA.meltingPoint !== undefined
                    ? `${elA.meltingPoint} °C`
                    : '-'}
                </td>
                <td className="p-3 font-mono text-slate-300 tabular-nums">
                  {elB.meltingPoint !== null && elB.meltingPoint !== undefined
                    ? `${elB.meltingPoint} °C`
                    : '-'}
                </td>
              </tr>

              {/* Boiling Point */}
              <tr>
                <td className="p-3 text-slate-400 font-medium">จุดเดือด</td>
                <td className="p-3 font-mono text-slate-300 tabular-nums">
                  {elA.boilingPoint !== null && elA.boilingPoint !== undefined
                    ? `${elA.boilingPoint} °C`
                    : '-'}
                </td>
                <td className="p-3 font-mono text-slate-300 tabular-nums">
                  {elB.boilingPoint !== null && elB.boilingPoint !== undefined
                    ? `${elB.boilingPoint} °C`
                    : '-'}
                </td>
              </tr>

              {/* Density */}
              <tr>
                <td className="p-3 text-slate-400 font-medium">ความหนาแน่น</td>
                <td className="p-3 font-mono text-slate-300 tabular-nums">
                  {elA.density ? `${elA.density} g/cm³` : '-'}
                </td>
                <td className="p-3 font-mono text-slate-300 tabular-nums">
                  {elB.density ? `${elB.density} g/cm³` : '-'}
                </td>
              </tr>

              {/* Electronegativity */}
              <tr>
                <td className="p-3 text-slate-400 font-medium">อิเล็กโตรเนกาติวิตี</td>
                <td className="p-3 font-mono text-slate-300 tabular-nums">
                  {elA.electronegativity ?? '-'}
                </td>
                <td className="p-3 font-mono text-slate-300 tabular-nums">
                  {elB.electronegativity ?? '-'}
                </td>
              </tr>

              {/* Uses / Applications */}
              <tr>
                <td className="p-3 text-slate-400 font-medium">การใช้งาน / ประโยชน์</td>
                <td className="p-3 text-slate-300 leading-relaxed text-xs">
                  {elA.uses}
                </td>
                <td className="p-3 text-slate-300 leading-relaxed text-xs">
                  {elB.uses}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
