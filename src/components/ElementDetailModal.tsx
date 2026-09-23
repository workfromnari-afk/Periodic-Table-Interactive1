import React, { useEffect, useState } from 'react';
import { ChemicalElement } from '../types/element';
import { CATEGORIES } from '../data/categories';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Layers,
  Thermometer,
  Zap,
  Clock,
  Sparkles,
  Info,
  Square,
} from 'lucide-react';
import {
  getElementPronunciation,
  speakText,
  stopSpeaking,
} from '../utils/pronunciation';

interface ElementDetailModalProps {
  element: ChemicalElement | null;
  onClose: () => void;
  onSelectPrevious: () => void;
  onSelectNext: () => void;
  onAddToCompare?: (element: ChemicalElement) => void;
}

export const ElementDetailModal: React.FC<ElementDetailModalProps> = ({
  element,
  onClose,
  onSelectPrevious,
  onSelectNext,
  onAddToCompare,
}) => {
  // Audio system settings (persisted in localStorage)
  const [audioEnabled, setAudioEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('periodic_audio_enabled');
      return saved !== 'false'; // Default enabled unless explicitly muted
    } catch {
      return true;
    }
  });

  const [activeSpeaking, setActiveSpeaking] = useState<'th' | 'en' | null>(null);

  // Stop speech when closing or changing element
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, [element]);

  // ESC and keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onSelectPrevious();
      if (e.key === 'ArrowRight') onSelectNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onSelectPrevious, onSelectNext]);

  if (!element) return null;

  const category = CATEGORIES[element.category] || CATEGORIES.unknown;
  const pronunciation = getElementPronunciation(
    element.atomicNumber,
    element.nameTh,
    element.nameEn
  );

  const toggleAudioEnabled = () => {
    const nextState = !audioEnabled;
    setAudioEnabled(nextState);
    if (!nextState) {
      stopSpeaking();
      setActiveSpeaking(null);
    }
    try {
      localStorage.setItem('periodic_audio_enabled', String(nextState));
    } catch {
      // ignore
    }
  };

  const handleSpeak = (lang: 'th' | 'en') => {
    if (!audioEnabled) return;

    if (activeSpeaking === lang) {
      stopSpeaking();
      setActiveSpeaking(null);
      return;
    }

    const textToSpeak = lang === 'th' ? element.nameTh : element.nameEn;
    const voiceLang = lang === 'th' ? 'th-TH' : 'en-US';

    speakText(
      textToSpeak,
      voiceLang,
      () => setActiveSpeaking(lang),
      () => setActiveSpeaking(null),
      () => setActiveSpeaking(null)
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl border border-slate-700/80 bg-slate-900 text-slate-100 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Banner with Category Theme */}
        <div
          className="relative px-6 py-5 border-b flex items-start justify-between gap-4"
          style={{
            background: `linear-gradient(to right, ${category.bgColor}, rgba(15, 23, 42, 0.95))`,
            borderColor: category.borderColor,
          }}
        >
          <div className="flex items-center gap-4">
            {/* Atomic Tile Card */}
            <div
              className="flex flex-col justify-between w-20 h-24 rounded-xl p-2.5 border-2 shadow-xl shrink-0"
              style={{
                backgroundColor: category.solidBg,
                borderColor: category.color,
              }}
            >
              <div className="flex justify-between items-center text-xs font-mono font-bold text-amber-300">
                <span>#{element.atomicNumber}</span>
                <span className="text-[10px] text-slate-200">{element.stateTh}</span>
              </div>
              <div className="text-center font-mono text-3xl font-black text-white">
                {element.symbol}
              </div>
              <div className="text-[10px] text-center font-mono tabular-nums text-slate-200">
                {element.atomicMass}
              </div>
            </div>

            {/* Title & Metadata */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  {element.nameTh}
                </h2>
                <span className="text-lg font-medium text-slate-300">
                  {element.nameEn}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span
                  className="px-2.5 py-0.5 rounded-full font-bold border text-white shadow-sm flex items-center gap-1"
                  style={{
                    backgroundColor: category.solidBg,
                    borderColor: category.color,
                  }}
                >
                  <span>{category.icon}</span>
                  <span>{element.categoryTh}</span>
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-300 font-medium">
                  สถานะ: {element.stateTh}
                </span>
              </div>
            </div>
          </div>

          {/* Close & Action Buttons */}
          <div className="flex items-center gap-1.5">
            {/* Audio Master Toggle */}
            <button
              type="button"
              onClick={toggleAudioEnabled}
              className={`p-2 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1 ${
                audioEnabled
                  ? 'border-cyan-500/50 bg-cyan-950/60 text-cyan-300 hover:bg-cyan-900/60'
                  : 'border-slate-700 bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title={audioEnabled ? 'ปิดฟังก์ชันเสียง (Mute Audio)' : 'เปิดฟังก์ชันเสียง (Enable Audio)'}
            >
              {audioEnabled ? (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span className="hidden sm:inline">เปิดเสียง</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-red-400" />
                  <span className="hidden sm:inline">ปิดเสียง</span>
                </>
              )}
            </button>

            {onAddToCompare && (
              <button
                type="button"
                onClick={() => onAddToCompare(element)}
                className="flex items-center gap-1 px-2.5 py-2 rounded-lg border border-slate-700 bg-slate-800/80 text-xs font-medium text-purple-300 hover:bg-slate-700 transition-colors"
                title="เพิ่มธาตุนี้ไปที่ตารางเปรียบเทียบ"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">เปรียบเทียบ</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="ปิด (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 space-y-6">
          {/* Pronunciation & Audio Section */}
          <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Volume2 className="w-4 h-4" />
                <span>การออกเสียงและคำอ่าน (Pronunciation)</span>
              </div>

              <button
                type="button"
                onClick={toggleAudioEnabled}
                className="text-[11px] text-slate-400 hover:text-cyan-300 underline underline-offset-2 transition-colors"
              >
                {audioEnabled ? 'ปิดปุ่มเสียงหากไม่ต้องการฟัง' : 'เปิดปุ่มเสียงอีกครั้ง'}
              </button>
            </div>

            {/* Phonetic Pronunciation Text (Always Visible & Easy to Read) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <div className="text-slate-400 font-medium">คำอ่านภาษาไทย:</div>
                <div className="font-bold text-sm text-cyan-200 mt-0.5">
                  {pronunciation.thaiPhonetic}
                </div>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <div className="text-slate-400 font-medium">คำอ่านสากล (English Phonetics):</div>
                <div className="font-bold text-sm text-slate-200 mt-0.5 font-mono">
                  {pronunciation.englishPhonetic}
                </div>
              </div>
            </div>

            {/* Clear Audio Buttons (if audio is enabled) */}
            {audioEnabled ? (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {/* Thai pronunciation button */}
                <button
                  type="button"
                  onClick={() => handleSpeak('th')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-sm ${
                    activeSpeaking === 'th'
                      ? 'border-cyan-400 bg-cyan-500 text-white animate-pulse'
                      : 'border-slate-700 bg-slate-900 text-slate-200 hover:border-cyan-400 hover:text-cyan-300'
                  }`}
                  title="ฟังการออกเสียงชื่อภาษาไทยแบบชัดเจน"
                >
                  {activeSpeaking === 'th' ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>กำลังเล่นเสียงไทย... (กดเพื่อหยุด)</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>🗣️ ฟังเสียงไทย: {element.nameTh}</span>
                    </>
                  )}
                </button>

                {/* English pronunciation button */}
                <button
                  type="button"
                  onClick={() => handleSpeak('en')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-sm ${
                    activeSpeaking === 'en'
                      ? 'border-amber-400 bg-amber-500 text-white animate-pulse'
                      : 'border-slate-700 bg-slate-900 text-slate-200 hover:border-amber-400 hover:text-amber-300'
                  }`}
                  title="ฟังการออกเสียงชื่อภาษาอังกฤษแบบสากล ชัดเจน"
                >
                  {activeSpeaking === 'en' ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>Playing English... (Click to stop)</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>🗣️ ฟังเสียง English: {element.nameEn}</span>
                    </>
                  )}
                </button>

                {activeSpeaking && (
                  <button
                    type="button"
                    onClick={() => {
                      stopSpeaking();
                      setActiveSpeaking(null);
                    }}
                    className="px-2.5 py-1.5 rounded-lg border border-red-500/40 bg-red-500/10 text-red-300 text-xs font-semibold hover:bg-red-500/20"
                  >
                    หยุดเสียง
                  </button>
                )}
              </div>
            ) : (
              <div className="text-xs text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80 flex items-center justify-between">
                <span>🔇 ปิดเสียงอ่านอยู่ (แสดงเฉพาะคำอ่านข้อความ)</span>
                <button
                  type="button"
                  onClick={toggleAudioEnabled}
                  className="text-cyan-400 font-bold hover:underline"
                >
                  เปิดเสียง
                </button>
              </div>
            )}
          </div>

          {/* Summary Quote */}
          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 text-sm text-slate-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{element.summary}</p>
          </div>

          {/* Section: Real-world Uses (ประโยชน์และการใช้งาน) */}
          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>ประโยชน์และการใช้งานจริงในชีวิตประจำวันและอุตสาหกรรม</span>
            </div>
            <p className="text-slate-100 text-sm leading-relaxed">
              {element.uses}
            </p>
          </div>

          {/* Key Chemical Properties Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Atomic Number */}
            <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/40">
              <div className="text-xs text-slate-400">เลขอะตอม (Z)</div>
              <div className="mt-1 font-mono text-lg font-bold text-white tabular-nums">
                {element.atomicNumber}
              </div>
              <div className="text-[11px] text-slate-400">โปรตอน = อิเล็กตรอน</div>
            </div>

            {/* Atomic Mass */}
            <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/40">
              <div className="text-xs text-slate-400">มวลอะตอมเฉลี่ย</div>
              <div className="mt-1 font-mono text-lg font-bold text-white tabular-nums">
                {element.atomicMass}
              </div>
              <div className="text-[11px] text-slate-400">u (หรือ g/mol)</div>
            </div>

            {/* Group & Period */}
            <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/40">
              <div className="text-xs text-slate-400">หมู่ และ คาบ</div>
              <div className="mt-1 font-mono text-lg font-bold text-white">
                {element.group ? `หมู่ ${element.group}` : 'f-block'} / คาบ {element.period}
              </div>
              <div className="text-[11px] text-slate-400">บล็อก {element.block}-block</div>
            </div>

            {/* Electron Configuration */}
            <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/40 sm:col-span-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">การจัดเรียงอิเล็กตรอน (Electron Configuration)</span>
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="mt-1.5 font-mono text-base font-semibold text-cyan-300">
                {element.electronConfig}
              </div>
            </div>

            {/* Melting Point */}
            <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/40">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Thermometer className="w-3 h-3 text-red-400" />
                <span>จุดหลอมเหลว</span>
              </div>
              <div className="mt-1 font-mono text-base font-semibold text-slate-200 tabular-nums">
                {element.meltingPoint !== null && element.meltingPoint !== undefined
                  ? `${element.meltingPoint} °C`
                  : 'ไม่ระบุ / สังเคราะห์'}
              </div>
            </div>

            {/* Boiling Point */}
            <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/40">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Thermometer className="w-3 h-3 text-amber-400" />
                <span>จุดเดือด</span>
              </div>
              <div className="mt-1 font-mono text-base font-semibold text-slate-200 tabular-nums">
                {element.boilingPoint !== null && element.boilingPoint !== undefined
                  ? `${element.boilingPoint} °C`
                  : 'ไม่ระบุ / สังเคราะห์'}
              </div>
            </div>

            {/* Density */}
            <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/40">
              <div className="text-xs text-slate-400">ความหนาแน่น</div>
              <div className="mt-1 font-mono text-base font-semibold text-slate-200 tabular-nums">
                {element.density !== null && element.density !== undefined
                  ? `${element.density} ${element.state === 'gas' ? 'g/L' : 'g/cm³'}`
                  : 'ไม่ระบุ'}
              </div>
            </div>

            {/* Electronegativity */}
            <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/40">
              <div className="text-xs text-slate-400">อิเล็กโตรเนกาติวิตี (Pauling)</div>
              <div className="mt-1 font-mono text-base font-semibold text-slate-200 tabular-nums">
                {element.electronegativity !== null && element.electronegativity !== undefined
                  ? element.electronegativity
                  : '-'}
              </div>
            </div>

            {/* Discovery Information */}
            <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/40 col-span-2 sm:col-span-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Clock className="w-3 h-3 text-blue-400" />
                <span>ประวัติการค้นพบ</span>
              </div>
              <div className="mt-1 text-xs text-slate-200">
                <strong className="text-white">ค้นพบโดย:</strong> {element.discoveredBy || 'ไม่ระบุ'}
              </div>
              <div className="text-xs text-slate-400">
                ปีที่ค้นพบ: {element.yearDiscovered || '-'}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer with Previous / Next navigation */}
        <div className="flex items-center justify-between border-t border-slate-800 px-6 py-4 bg-slate-950/60">
          <button
            type="button"
            onClick={onSelectPrevious}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-xs font-medium text-slate-300 hover:border-slate-700 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>ธาตุก่อนหน้า</span>
          </button>

          <span className="text-xs font-mono text-slate-400">
            {element.atomicNumber} / 118
          </span>

          <button
            type="button"
            onClick={onSelectNext}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-xs font-medium text-slate-300 hover:border-slate-700 hover:text-white transition-colors"
          >
            <span>ธาตุถัดไป</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
