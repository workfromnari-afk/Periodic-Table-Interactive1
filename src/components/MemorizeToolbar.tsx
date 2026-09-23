import React from 'react';
import { Eye, EyeOff, BookOpen, Check } from 'lucide-react';

interface MemorizeToolbarProps {
  hideSymbol: boolean;
  setHideSymbol: (val: boolean) => void;
  hideName: boolean;
  setHideName: (val: boolean) => void;
  hideNumber: boolean;
  setHideNumber: (val: boolean) => void;
  onReset: () => void;
}

export const MemorizeToolbar: React.FC<MemorizeToolbarProps> = ({
  hideSymbol,
  setHideSymbol,
  hideName,
  setHideName,
  hideNumber,
  setHideNumber,
  onReset,
}) => {
  return (
    <div className="w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 sm:p-4 mb-4 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-emerald-400">
          <BookOpen className="w-4 h-4 shrink-0" />
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-emerald-300">
              โหมดฝึกท่องจำตารางธาตุ (Study & Memory Mode)
            </h4>
            <p className="text-[11px] text-emerald-400/80">
              เลือกซ่อนข้อมูลที่ต้องการทดสอบ แล้วลองคลิกหรือชี้ที่ธาตุเพื่อทดสอบความจำ
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Toggle Hide Name */}
          <button
            type="button"
            onClick={() => setHideName(!hideName)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              hideName
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-emerald-500/50'
            }`}
          >
            {hideName ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>ซ่อนชื่อธาตุ</span>
          </button>

          {/* Toggle Hide Symbol */}
          <button
            type="button"
            onClick={() => setHideSymbol(!hideSymbol)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              hideSymbol
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-emerald-500/50'
            }`}
          >
            {hideSymbol ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>ซ่อนสัญลักษณ์</span>
          </button>

          {/* Toggle Hide Number */}
          <button
            type="button"
            onClick={() => setHideNumber(!hideNumber)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              hideNumber
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-emerald-500/50'
            }`}
          >
            {hideNumber ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>ซ่อนเลขอะตอม</span>
          </button>

          {(hideName || hideSymbol || hideNumber) && (
            <button
              type="button"
              onClick={onReset}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 underline"
            >
              แสดงทั้งหมด
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
