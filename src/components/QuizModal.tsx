import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChemicalElement } from '../types/element';
import { ELEMENTS } from '../data/elements';
import { CATEGORIES } from '../data/categories';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  Sparkles,
  X,
  ChevronRight,
  HelpCircle,
  Flame,
  Zap,
  Gauge,
  ArrowRight,
} from 'lucide-react';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectElement: (el: ChemicalElement) => void;
}

export type QuizDifficulty = 'easy' | 'medium' | 'hard';

type QuestionType =
  | 'symbol_to_name' // Given symbol, guess name
  | 'name_to_symbol' // Given name, guess symbol
  | 'atomic_number'  // Given Z, guess element
  | 'uses'           // Given application, guess element
  | 'category'       // Given category, guess element in category
  | 'group_period';  // Given Group & Period, guess element (Medium/Hard)

interface QuizQuestion {
  type: QuestionType;
  promptLabel: string;
  questionText: string;
  badgeHighlight?: string;
  correctElement: ChemicalElement;
  options: ChemicalElement[];
  explanation: string;
}

// 30 Most well-known elements for 'Easy' mode
const EASY_ATOMIC_NUMBERS = [
  1, 2, 3, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 26, 28, 29, 30, 35, 47, 50, 53, 79, 80, 82, 92,
];

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onClose,
  onSelectElement,
}) => {
  const [difficulty, setDifficulty] = useState<QuizDifficulty>('medium');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<ChemicalElement | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);

  // Ref for auto-scrolling to next button smoothly
  const nextButtonRef = useRef<HTMLButtonElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Generator for 10 questions customized by difficulty level
  const generateQuestions = useCallback((level: QuizDifficulty): QuizQuestion[] => {
    const list: QuizQuestion[] = [];
    const usedIndices = new Set<number>();

    // Determine element candidate pool by difficulty
    let pool: ChemicalElement[] = [];
    if (level === 'easy') {
      pool = ELEMENTS.filter((e) => EASY_ATOMIC_NUMBERS.includes(e.atomicNumber));
    } else if (level === 'medium') {
      // Elements 1 - 54 (Periods 1 - 5)
      pool = ELEMENTS.filter((e) => e.atomicNumber <= 54);
    } else {
      // All 118 elements (including rare earth & superheavy)
      pool = [...ELEMENTS];
    }

    // Configure question types based on difficulty
    let questionTypes: QuestionType[] = [];
    if (level === 'easy') {
      questionTypes = [
        'symbol_to_name',
        'name_to_symbol',
        'uses',
        'symbol_to_name',
        'name_to_symbol',
        'uses',
        'category',
        'symbol_to_name',
        'name_to_symbol',
        'category',
      ];
    } else if (level === 'medium') {
      questionTypes = [
        'symbol_to_name',
        'name_to_symbol',
        'atomic_number',
        'uses',
        'category',
        'group_period',
        'symbol_to_name',
        'name_to_symbol',
        'atomic_number',
        'uses',
      ];
    } else {
      // Hard mode: Includes complex matching, group & period, atomic numbers, superheavies
      questionTypes = [
        'name_to_symbol',
        'symbol_to_name',
        'atomic_number',
        'group_period',
        'category',
        'name_to_symbol',
        'symbol_to_name',
        'atomic_number',
        'group_period',
        'uses',
      ];
    }

    for (let i = 0; i < 10; i++) {
      const qType = questionTypes[i % questionTypes.length];

      // Pick target element from the pool
      let target: ChemicalElement;
      let attempts = 0;
      do {
        const randIdx = Math.floor(Math.random() * pool.length);
        target = pool[randIdx];
        attempts++;
      } while (usedIndices.has(target.atomicNumber) && attempts < 100);

      usedIndices.add(target.atomicNumber);

      // Pick 3 sensible distractors
      const distractors: ChemicalElement[] = [];
      const distractorNumbers = new Set<number>([target.atomicNumber]);

      if (qType === 'category') {
        // Distractors must be from OTHER categories so only 1 correct answer
        while (distractors.length < 3) {
          const randEl = pool[Math.floor(Math.random() * pool.length)];
          if (!distractorNumbers.has(randEl.atomicNumber) && randEl.category !== target.category) {
            distractorNumbers.add(randEl.atomicNumber);
            distractors.push(randEl);
          }
        }
      } else if (qType === 'name_to_symbol') {
        // In medium/hard, pick tricky distractors with same first letter
        const sameLetter = pool.filter(
          (e) =>
            e.atomicNumber !== target.atomicNumber &&
            e.symbol[0] === target.symbol[0]
        );
        for (const el of sameLetter) {
          if (distractors.length < (level === 'hard' ? 3 : 2) && !distractorNumbers.has(el.atomicNumber)) {
            distractorNumbers.add(el.atomicNumber);
            distractors.push(el);
          }
        }
        // Fill remaining
        while (distractors.length < 3) {
          const randEl = pool[Math.floor(Math.random() * pool.length)];
          if (!distractorNumbers.has(randEl.atomicNumber)) {
            distractorNumbers.add(randEl.atomicNumber);
            distractors.push(randEl);
          }
        }
      } else {
        while (distractors.length < 3) {
          const randEl = pool[Math.floor(Math.random() * pool.length)];
          if (!distractorNumbers.has(randEl.atomicNumber)) {
            distractorNumbers.add(randEl.atomicNumber);
            distractors.push(randEl);
          }
        }
      }

      // Shuffle options randomly
      const options = [target, ...distractors].sort(() => Math.random() - 0.5);

      let questionText = '';
      let promptLabel = '';
      let badgeHighlight: string | undefined = undefined;
      let explanation = '';

      if (qType === 'symbol_to_name') {
        promptLabel = 'สัญลักษณ์ ➔ ชื่อธาตุ';
        questionText = `สัญลักษณ์ทางเคมีนี้คือธาตุใด?`;
        badgeHighlight = target.symbol;
        explanation = `สัญลักษณ์ "${target.symbol}" คือธาตุ "${target.nameTh} (${target.nameEn})" เลขอะตอม ${target.atomicNumber}`;
      } else if (qType === 'name_to_symbol') {
        promptLabel = 'ชื่อ ➔ สัญลักษณ์เคมี';
        questionText = `ธาตุ "${target.nameTh} (${target.nameEn})" มีสัญลักษณ์เคมีคือตัวใด?`;
        badgeHighlight = `${target.nameTh}`;
        explanation = `ธาตุ "${target.nameTh} (${target.nameEn})" มีสัญลักษณ์เคมีคือ "${target.symbol}" (เลขอะตอม ${target.atomicNumber})`;
      } else if (qType === 'atomic_number') {
        promptLabel = 'เลขอะตอม (Atomic Number)';
        questionText = `ธาตุใดมีเลขอะตอม (จำนวนโปรตอน) เท่ากับ ${target.atomicNumber}?`;
        badgeHighlight = `Z = ${target.atomicNumber}`;
        explanation = `เลขอะตอม ${target.atomicNumber} คือธาตุ "${target.nameTh} (${target.symbol})" อยู่ในคาบ ${target.period}${target.group ? ` หมู่ ${target.group}` : ''}`;
      } else if (qType === 'group_period') {
        promptLabel = 'หมู่ และ คาบในตารางธาตุ';
        const groupDesc = target.group ? `หมู่ ${target.group}` : `อนุกรม ${target.categoryTh}`;
        questionText = `ธาตุใดในตารางธาตุจัดอยู่ใน "${groupDesc}" และ "คาบ ${target.period}"?`;
        badgeHighlight = `${groupDesc} · คาบ ${target.period}`;
        explanation = `ธาตุ "${target.nameTh} (${target.symbol})" เลขอะตอม ${target.atomicNumber} อยู่ใน${groupDesc} คาบ ${target.period}`;
      } else if (qType === 'uses') {
        promptLabel = 'ประโยชน์และการใช้งานจริง';
        questionText = `ธาตุใดมีบทบาทและการใช้งานสำคัญดังต่อไปนี้?\n"${target.uses}"`;
        explanation = `ธาตุ "${target.nameTh} (${target.symbol})": ${target.uses}`;
      } else {
        const catInfo = CATEGORIES[target.category] || CATEGORIES.unknown;
        promptLabel = 'กลุ่มและตระกูลของธาตุ';
        questionText = `ธาตุใดต่อไปนี้จัดอยู่ในกลุ่ม "${catInfo.nameTh} (${catInfo.nameEn})"?`;
        badgeHighlight = `${catInfo.icon} ${catInfo.nameTh}`;
        explanation = `"${target.nameTh} (${target.symbol})" จัดอยู่ในกลุ่ม ${catInfo.nameTh}`;
      }

      list.push({
        type: qType,
        promptLabel,
        questionText,
        badgeHighlight,
        correctElement: target,
        options,
        explanation,
      });
    }

    return list;
  }, []);

  const startNewQuiz = useCallback((lvl: QuizDifficulty = difficulty) => {
    const q = generateQuestions(lvl);
    setQuizQuestions(q);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
  }, [difficulty, generateQuestions]);

  // Handle switching difficulty level
  const handleChangeDifficulty = (newLevel: QuizDifficulty) => {
    setDifficulty(newLevel);
    startNewQuiz(newLevel);
  };

  useEffect(() => {
    if (isOpen) {
      startNewQuiz(difficulty);
    }
  }, [isOpen, startNewQuiz, difficulty]);

  // Auto-scroll down smoothly when answered so the user sees the next button easily
  useEffect(() => {
    if (isAnswered) {
      const timer = setTimeout(() => {
        nextButtonRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isAnswered]);

  const currentQ = quizQuestions[currentQuestionIndex];
  const isFinished = currentQuestionIndex >= quizQuestions.length && quizQuestions.length > 0;

  const handleSelectOption = (option: ChemicalElement) => {
    if (isAnswered || !currentQ) return;
    setSelectedOption(option);
    setIsAnswered(true);

    if (option.atomicNumber === currentQ.correctElement.atomicNumber) {
      // Score multiplier based on difficulty
      const multiplier = difficulty === 'hard' ? 20 : difficulty === 'medium' ? 15 : 10;
      const comboBonus = streak * 4;
      const newScore = score + multiplier + comboBonus;
      setScore(newScore);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
    } else {
      setStreak(0);
    }
  };

  const handleNextQuestion = useCallback(() => {
    setSelectedOption(null);
    setIsAnswered(false);
    setCurrentQuestionIndex((prev) => prev + 1);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Keyboard shortcut: Press Space or Enter to proceed to next question
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (isAnswered && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        handleNextQuestion();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isAnswered, handleNextQuestion]);

  if (!isOpen) return null;

  const optionLabels = ['ก.', 'ข.', 'ค.', 'ง.'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        ref={scrollContainerRef}
        className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 text-slate-100 shadow-2xl p-4 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 sm:pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                แบบทดสอบเคมีและตารางธาตุ
              </h2>
              <p className="text-xs text-slate-400 hidden sm:block">
                วัดความรู้เคมี ทบทวนสัญลักษณ์ เลขอะตอม และประโยชน์
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="ปิดแบบทดสอบ (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Difficulty Level Selector Tabs */}
        <div className="mt-3 pt-1">
          <div className="flex items-center justify-between gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => handleChangeDifficulty('easy')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                difficulty === 'easy'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40 border border-emerald-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <span>🟢</span>
              <span>ง่าย (30 ธาตุคุ้นเคย)</span>
            </button>

            <button
              type="button"
              onClick={() => handleChangeDifficulty('medium')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                difficulty === 'medium'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-900/40 border border-amber-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <span>🟡</span>
              <span>ปานกลาง (ธาตุ 1-54)</span>
            </button>

            <button
              type="button"
              onClick={() => handleChangeDifficulty('hard')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                difficulty === 'hard'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-900/40 border border-rose-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <span>🔴</span>
              <span>ยาก (ครบ 118 ธาตุ)</span>
            </button>
          </div>
        </div>

        {/* Quiz Body */}
        {!isFinished && currentQ ? (
          <div className="py-4 space-y-4">
            {/* Score, Progress, and Streak */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                  ข้อ {currentQuestionIndex + 1} / {quizQuestions.length}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-cyan-950/80 text-cyan-300 font-semibold border border-cyan-800/60 hidden sm:inline-block">
                  {currentQ.promptLabel}
                </span>
              </div>

              <div className="flex items-center gap-3 font-mono">
                <span className="text-slate-300">
                  คะแนน: <strong className="text-amber-300 font-bold text-sm">{score}</strong>
                </span>
                {streak > 1 && (
                  <span className="flex items-center gap-1 text-orange-400 font-bold bg-orange-950/50 px-2 py-0.5 rounded border border-orange-800/60 animate-pulse">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    <span>{streak}x Combo</span>
                  </span>
                )}
              </div>
            </div>

            {/* Question Card */}
            <div className="rounded-2xl border-2 border-slate-700/80 bg-slate-950/90 p-4 sm:p-5 text-center shadow-lg space-y-3">
              {/* Badge Highlight (e.g. big symbol or keyword) */}
              {currentQ.badgeHighlight && (
                <div className="inline-flex items-center justify-center">
                  {currentQ.type === 'symbol_to_name' ? (
                    <div className="px-7 py-2.5 rounded-2xl border-2 border-cyan-400 bg-cyan-950/70 shadow-lg shadow-cyan-500/20">
                      <span className="font-mono text-4xl sm:text-5xl font-black text-white tracking-wider">
                        {currentQ.badgeHighlight}
                      </span>
                    </div>
                  ) : (
                    <span className="px-3.5 py-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/60 text-cyan-300 font-bold text-sm sm:text-base">
                      {currentQ.badgeHighlight}
                    </span>
                  )}
                </div>
              )}

              <h3 className="text-base sm:text-lg font-bold text-slate-100 leading-relaxed whitespace-pre-line">
                {currentQ.questionText}
              </h3>
            </div>

            {/* Multiple Choice Options Grid (Spoiler-Free) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption?.atomicNumber === opt.atomicNumber;
                const isCorrect = opt.atomicNumber === currentQ.correctElement.atomicNumber;

                let btnStyle =
                  'border-slate-700 bg-slate-800/80 hover:bg-slate-750 hover:border-slate-500 text-slate-200 shadow-sm';

                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle =
                      'border-emerald-400 bg-emerald-950/70 text-emerald-200 ring-2 ring-emerald-500 font-bold shadow-lg shadow-emerald-900/30';
                  } else if (isSelected && !isCorrect) {
                    btnStyle =
                      'border-rose-500 bg-rose-950/70 text-rose-200 ring-2 ring-rose-500 shadow-lg shadow-rose-900/30';
                  } else {
                    btnStyle = 'border-slate-800/80 bg-slate-950/40 text-slate-500 opacity-40';
                  }
                }

                return (
                  <button
                    key={opt.atomicNumber}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(opt)}
                    className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl border-2 text-left transition-all duration-150 cursor-pointer disabled:cursor-default ${btnStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Option letter (ก, ข, ค, ง) */}
                      <span className="flex items-center justify-center w-6 h-6 rounded-md bg-slate-900 border border-slate-700 text-xs font-bold text-slate-300 shrink-0">
                        {optionLabels[idx]}
                      </span>

                      {/* Content based on type */}
                      <div>
                        {currentQ.type === 'symbol_to_name' && (
                          <div className="space-y-0.5">
                            <span className="font-bold text-sm sm:text-base text-white">
                              {opt.nameTh}
                            </span>
                            <div className="text-xs text-slate-400 font-medium">
                              ({opt.nameEn})
                            </div>
                          </div>
                        )}

                        {currentQ.type === 'name_to_symbol' && (
                          <div className="font-mono text-2xl font-black text-cyan-300">
                            {opt.symbol}
                          </div>
                        )}

                        {currentQ.type === 'atomic_number' && (
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-cyan-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                              {opt.symbol}
                            </span>
                            <span className="font-bold text-sm text-white">
                              {opt.nameTh}
                            </span>
                          </div>
                        )}

                        {(currentQ.type === 'uses' || currentQ.type === 'category' || currentQ.type === 'group_period') && (
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-cyan-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                              {opt.symbol}
                            </span>
                            <div>
                              <span className="font-bold text-sm text-white block">
                                {opt.nameTh}
                              </span>
                              <span className="text-xs text-slate-400">
                                {opt.nameEn}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Result Icon */}
                    {isAnswered && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answer Feedback & LARGE, EASY-TO-CLICK NEXT QUESTION BUTTON */}
            {isAnswered && (
              <div className="p-4 sm:p-5 rounded-2xl border-2 border-slate-700 bg-slate-950 space-y-4 animate-in fade-in duration-200">
                {/* Status Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {selectedOption?.atomicNumber === currentQ.correctElement.atomicNumber ? (
                      <span className="text-emerald-400 font-black text-sm sm:text-base flex items-center gap-1.5">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>ถูกต้อง! (+{difficulty === 'hard' ? 20 : difficulty === 'medium' ? 15 : 10} คะแนน)</span>
                      </span>
                    ) : (
                      <span className="text-rose-400 font-black text-sm sm:text-base flex items-center gap-1.5">
                        <XCircle className="w-5 h-5" />
                        <span>ยังไม่ถูกต้อง! (คำตอบคือ {currentQ.correctElement.nameTh})</span>
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onSelectElement(currentQ.correctElement);
                    }}
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <span>ดูข้อมูลธาตุนี้ ↗</span>
                  </button>
                </div>

                {/* Explanation text */}
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-start gap-2.5">
                  <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">เฉลยและคำอธิบาย: </span>
                    <span>{currentQ.explanation}</span>
                  </div>
                </div>

                {/* BIG PROMINENT NEXT BUTTON (Super easy to click & keyboard friendly) */}
                <div className="pt-2">
                  <button
                    ref={nextButtonRef}
                    type="button"
                    onClick={handleNextQuestion}
                    className="w-full flex items-center justify-center gap-3 py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-base sm:text-lg transition-all duration-150 shadow-xl shadow-cyan-600/30 hover:shadow-cyan-500/50 hover:scale-[1.01] active:scale-[0.99] cursor-pointer ring-2 ring-cyan-400/50"
                  >
                    <span>
                      {currentQuestionIndex + 1 < quizQuestions.length
                        ? `ข้อถัดไป (${currentQuestionIndex + 2}/${quizQuestions.length})`
                        : 'ดูสรุปผลคะแนนทั้งหมด 🎉'}
                    </span>
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                  <p className="text-[11px] text-center text-slate-400 mt-2 font-mono">
                    💡 ทิป: สามารถกดแป้น <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">Enter</kbd> หรือ <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">Spacebar</kbd> เพื่อไปข้อถัดไปได้ทันที
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Finished Screen */
          <div className="py-6 sm:py-8 text-center space-y-5">
            <div className="inline-flex p-4 rounded-2xl bg-amber-500/10 text-amber-400 border-2 border-amber-500/30 shadow-xl shadow-amber-500/10">
              <Award className="w-14 h-14" />
            </div>

            <div>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 bg-slate-800 border border-slate-700 text-slate-300">
                โหมด: {difficulty === 'easy' ? '🟢 ง่าย' : difficulty === 'medium' ? '🟡 ปานกลาง' : '🔴 ยาก'}
              </div>
              <h3 className="text-2xl font-black text-white">
                ยอดเยี่ยม! ทำแบบทดสอบเสร็จสิ้น
              </h3>
              <p className="text-sm text-slate-300 mt-1.5">
                คุณทำได้{' '}
                <strong className="text-amber-300 text-xl font-mono font-bold">
                  {score}
                </strong>{' '}
                คะแนน (คอมโบตอบถูกต่อเนื่องสูงสุด{' '}
                <strong className="text-emerald-400 font-mono">{bestStreak}</strong> ข้อ)
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 max-w-sm mx-auto text-xs text-slate-300">
              {score >= 100 ? (
                <span className="text-emerald-300 font-bold">
                  🏆 ยอดเยี่ยมระดับเซียนเคมี! จดจำสัญลักษณ์และสมบัติธาตุได้แม่นยำมาก
                </span>
              ) : score >= 60 ? (
                <span className="text-cyan-300 font-bold">
                  👏 ทำได้ดีมาก! ลองท้าทายระดับที่ยากขึ้นเพื่อทดสอบความแม่นยำ
                </span>
              ) : (
                <span className="text-amber-300 font-bold">
                  💪 เริ่มต้นได้ดี! สามารถใช้โหมดท่องจำหรือตารางธาตุเพื่อทบทวนเพิ่มเติมได้นะ
                </span>
              )}
            </div>

            {/* Quick replay in same or different difficulty */}
            <div className="space-y-3 pt-2 max-w-md mx-auto">
              <button
                onClick={() => startNewQuiz(difficulty)}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-base font-bold transition-all shadow-lg hover:shadow-cyan-500/25 cursor-pointer"
              >
                <RotateCcw className="w-5 h-5" />
                <span>เล่นใหม่อีกรอบ ({difficulty === 'easy' ? 'ระดับง่าย' : difficulty === 'medium' ? 'ระดับปานกลาง' : 'ระดับยาก'})</span>
              </button>

              <div className="flex gap-2">
                {difficulty !== 'easy' && (
                  <button
                    onClick={() => handleChangeDifficulty('easy')}
                    className="flex-1 py-2 px-3 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
                  >
                    ลองระดับง่าย 🟢
                  </button>
                )}
                {difficulty !== 'hard' && (
                  <button
                    onClick={() => handleChangeDifficulty('hard')}
                    className="flex-1 py-2 px-3 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
                  >
                    ลองระดับยาก 🔴
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="flex-1 py-2 px-3 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  กลับไปดูตาราง
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
