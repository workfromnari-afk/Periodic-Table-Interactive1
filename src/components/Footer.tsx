import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 mt-12 text-center text-xs text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:text-left">
          <p className="font-semibold text-slate-300">
            Periodic Table Interactive — Learning Chemistry Made Easy
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            สื่อการเรียนรู้ตารางธาตุแบบอินเตอร์แอคทีฟ 118 ธาตุ อ้างอิงตามมาตรฐาน IUPAC สากล
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
          <span>กดลูกศร ← / → เพื่อสลับดูธาตุ</span>
          <span>·</span>
          <span>กด Esc เพื่อปิดหน้าต่าง</span>
          <span>·</span>
          <span>สำหรับนักเรียนมัธยมและผู้สนใจวิชาเคมี</span>
        </div>
      </div>
    </footer>
  );
};
