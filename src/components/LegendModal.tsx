import React from 'react';
import { X, HelpCircle, BookOpen, Layers } from 'lucide-react';
import { CATEGORIES } from '../data/categories';

interface LegendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LegendModal: React.FC<LegendModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 text-slate-100 shadow-2xl p-6 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">คู่มือวิธีอ่านตารางธาตุ (Periodic Table Guide)</h2>
              <p className="text-xs text-slate-400">เข้าใจโครงสร้างอะตอม หมู่ คาบ และการจำแนกประเภท</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Anatomy of an Element Tile */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>🔍 ส่วนประกอบในแต่ละช่องธาตุ</span>
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-6 justify-center py-2">
            {/* Sample Tile Diagram */}
            <div className="w-28 h-32 rounded-xl border border-cyan-500/50 bg-cyan-950/30 p-2.5 flex flex-col justify-between shadow-lg relative">
              <div className="flex justify-between items-center text-xs font-mono text-cyan-400">
                <span className="font-bold">8</span>
                <span className="text-[10px]">💨</span>
              </div>
              <div className="text-center font-mono text-3xl font-extrabold text-white">
                O
              </div>
              <div className="text-center">
                <div className="text-[11px] font-semibold text-slate-200">ออกซิเจน</div>
                <div className="text-[10px] font-mono text-slate-400">15.999</div>
              </div>
            </div>

            {/* Labels explanation */}
            <div className="space-y-1.5 text-xs text-slate-300">
              <div>
                <strong className="text-cyan-400">8 (เลขบนซ้าย):</strong> เลขอะตอม (Atomic Number) = จำนวนโปรตอนในนิวเคลียส
              </div>
              <div>
                <strong className="text-white font-mono text-sm">O (ตรงกลาง):</strong> สัญลักษณ์ธาตุ (Chemical Symbol)
              </div>
              <div>
                <strong className="text-slate-200 font-semibold">ออกซิเจน:</strong> ชื่อธาตุภาษาไทย (หรือสลับเป็นภาษาอังกฤษ)
              </div>
              <div>
                <strong className="text-slate-400 font-mono">15.999 (ด้านล่าง):</strong> มวลอะตอม (Atomic Mass)
              </div>
              <div>
                <strong className="text-amber-400">💨 (มุมบนขวา):</strong> สัญลักษณ์สถานะที่อุณหภูมิห้อง (ของแข็ง/ของเหลว/แก๊ส/สังเคราะห์)
              </div>
            </div>
          </div>
        </div>

        {/* Group and Period Explained */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40 space-y-1.5">
            <h4 className="font-bold text-white text-sm text-cyan-400">หมู่ (Group: 1 - 18)</h4>
            <p className="text-slate-300 leading-relaxed">
              แถวในแนวตั้ง ธาตุที่อยู่ในหมู่เดียวกันจะมีจำนวนเวเลนซ์อิเล็กตรอนเท่ากัน ทำให้มีสมบัติทางเคมีคล้ายคลึงกันอย่างยิ่ง
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40 space-y-1.5">
            <h4 className="font-bold text-white text-sm text-cyan-400">คาบ (Period: 1 - 7)</h4>
            <p className="text-slate-300 leading-relaxed">
              แถวในแนวนอน ธาตุในคาบเดียวกันจะมีจำนวนระดับพลังงานของอิเล็กตรอน (Shells) เท่ากัน เริ่มต้นจากหมู่ 1 ไปสิ้นสุดที่แก๊สมีตระกูลหมู่ 18
            </p>
          </div>
        </div>

        {/* Category List */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-400">หมวดหมู่และสีของธาตุ (10 กลุ่มหลัก)</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {Object.values(CATEGORIES).map((cat) => (
              <div
                key={cat.id}
                className="flex items-start gap-2 p-2 rounded-lg border border-slate-800/80 bg-slate-950/40"
              >
                <span className="text-base shrink-0 mt-0.5">{cat.icon}</span>
                <div>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span>{cat.nameTh}</span>
                    <span className="text-slate-400 font-normal">({cat.nameEn})</span>
                  </div>
                  <div className="text-[11px] text-slate-400 leading-tight mt-0.5">
                    {cat.descriptionTh}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
