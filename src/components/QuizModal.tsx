import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ChemicalElement } from '../types/element';
import { ELEMENTS } from '../data/elements';
import { CheckCircle2, XCircle, RotateCcw, Award, Sparkles, X, ChevronRight } from 'lucide-react';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectElement: (el: ChemicalElement) => void;
}

interface Question {
  questionText: string;
  categoryTag: string;
  correctElement: ChemicalElement;
  options: ChemicalElement[];
  explanation: string;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onClose,
  onSelectElement,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<ChemicalElement | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);

  // Generator for 10 dynamic balanced chemistry questions
  const generateQuestions = useCallback((): Question[] => {
    const list: Question[] = [];
    const usedIndices = new Set<number>();

    // Types of questions:
    // 0: Symbol to Name
    // 1: Name to Symbol
    // 2: Atomic Number to Element
    // 3: Uses / Application
    // 4: Category / Family
    const questionTypes = [0, 1, 2, 3, 4, 0, 1, 2, 3, 4];

    for (let i = 0; i < 10; i++) {
      let targetIdx = Math.floor(Math.random() * ELEMENTS.length);
      while (usedIndices.has(targetIdx)) {
        targetIdx = Math.floor(Math.random() * ELEMENTS.length);
      }
      usedIndices.add(targetIdx);
      const target = ELEMENTS[targetIdx];

      // Pick 3 distractors
      const distractors: ChemicalElement[] = [];
      const distractorIndices = new Set<number>([targetIdx]);
      while (distractors.length < 3) {
        const randIdx = Math.floor(Math.random() * ELEMENTS.length);
        if (!distractorIndices.has(randIdx)) {
          distractorIndices.add(randIdx);
          distractors.push(ELEMENTS[randIdx]);
        }
      }

      // Shuffle options
      const options = [target, ...distractors].sort(() => Math.random() - 0.5);

      const qType = questionTypes[i % questionTypes.length];
      let questionText = '';
      let categoryTag = '';
      let explanation = '';

      if (qType === 0) {
        questionText = `สัญลักษณ์ทางเคมี "${target.symbol}" คือธาตุใด?`;
        categoryTag = 'ทายสัญลักษณ์ธาตุ';
        explanation = `${target.symbol} คือสัญลักษณ์ของ "${target.nameTh} (${target.nameEn})" เลขอะตอม ${target.atomicNumber}`;
      } else if (qType === 1) {
        questionText = `ธาตุ "${target.nameTh} (${target.nameEn})" มีสัญลักษณ์เคมีว่าอย่างไร?`;
        categoryTag = 'ทายชื่อเป็นสัญลักษณ์';
        explanation = `ธาตุ ${target.nameTh} มีสัญลักษณ์คือ "${target.symbol}" มีมวลอะตอม ${target.atomicMass}`;
      } else if (qType === 2) {
        questionText = `ธาตุที่มีเลขอะตอม (Atomic Number) เท่ากับ ${target.atomicNumber} คือธาตุใด?`;
        categoryTag = 'ทายเลขอะตอม';
        explanation = `เลขอะตอม ${target.atomicNumber} คือ ${target.nameTh} (${target.symbol}) อยู่ในคาบที่ ${target.period}`;
      } else if (qType === 3) {
        questionText = `ธาตุใดมีประโยชน์หลักคือ: "${target.uses.split(' ')[0]} ${target.uses.split(' ')[1] || ''}..."?`;
        categoryTag = 'ประโยชน์และการใช้งาน';
        explanation = `${target.nameTh} (${target.symbol}): ${target.uses}`;
      } else {
        questionText = `ธาตุใดต่อไปนี้จัดอยู่ในกลุ่ม "${target.categoryTh}"?`;
        categoryTag = 'กลุ่มและตระกูลของธาตุ';
        explanation = `${target.nameTh} (${target.symbol}) จัดเป็น "${target.categoryTh}"`;
      }

      list.push({
        questionText,
        categoryTag,
        correctElement: target,
        options,
        explanation,
      });
    }

    return list;
  }, []);

  const startNewQuiz = useCallback(() => {
    const q = generateQuestions();
    setQuizQuestions(q);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
  }, [generateQuestions]);

  useEffect(() => {
    if (isOpen) {
      startNewQuiz();
    }
  }, [isOpen, startNewQuiz]);

  if (!isOpen) return null;

  const currentQ = quizQuestions[currentQuestionIndex];
  const isFinished = currentQuestionIndex >= quizQuestions.length && quizQuestions.length > 0;

  const handleSelectOption = (option: ChemicalElement) => {
    if (isAnswered || !currentQ) return;
    setSelectedOption(option);
    setIsAnswered(true);

    if (option.atomicNumber === currentQ.correctElement.atomicNumber) {
      const newScore = score + 10 + streak * 2;
      setScore(newScore);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
    } else {
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-900 text-slate-100 shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">แบบทดสอบเคมีและตารางธาตุ</h2>
              <p className="text-xs text-slate-400">ทบทวนความจำสัญลักษณ์ เลขอะตอม และประโยชน์</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quiz Body */}
        {!isFinished && currentQ ? (
          <div className="py-6 space-y-6">
            {/* Score & Progress */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-200">
                  ข้อที่ {currentQuestionIndex + 1} / {quizQuestions.length}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-medium">
                  {currentQ.categoryTag}
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono">
                <span>คะแนน: <strong className="text-amber-400">{score}</strong></span>
                <span>คอมโบ: <strong className="text-emerald-400">{streak} 🔥</strong></span>
              </div>
            </div>

            {/* Question Card */}
            <div className="rounded-xl border border-slate-700/80 bg-slate-950/60 p-5 text-center shadow-inner">
              <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                {currentQ.questionText}
              </h3>
            </div>

            {/* Multiple Choice Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options.map((opt) => {
                const isSelected = selectedOption?.atomicNumber === opt.atomicNumber;
                const isCorrect = opt.atomicNumber === currentQ.correctElement.atomicNumber;

                let btnStyle = 'border-slate-700 bg-slate-800/60 hover:bg-slate-800 hover:border-slate-600 text-slate-200';
                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = 'border-emerald-500 bg-emerald-500/20 text-emerald-200 ring-2 ring-emerald-500/50';
                  } else if (isSelected) {
                    btnStyle = 'border-red-500 bg-red-500/20 text-red-200 ring-2 ring-red-500/50';
                  } else {
                    btnStyle = 'border-slate-800 bg-slate-950/40 text-slate-500';
                  }
                }

                return (
                  <button
                    key={opt.atomicNumber}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(opt)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${btnStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-base font-bold w-10 text-center py-1 rounded bg-slate-900/80 text-cyan-300">
                        {opt.symbol}
                      </span>
                      <div>
                        <div className="font-semibold text-sm">{opt.nameTh}</div>
                        <div className="text-xs opacity-75">{opt.nameEn} (Z={opt.atomicNumber})</div>
                      </div>
                    </div>

                    {isAnswered && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answer Feedback & Explanation */}
            {isAnswered && (
              <div className="p-4 rounded-xl border border-slate-700 bg-slate-950/70 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {selectedOption?.atomicNumber === currentQ.correctElement.atomicNumber ? (
                      <span className="text-emerald-400 font-bold text-sm flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> ถูกต้อง! เยี่ยมมาก
                      </span>
                    ) : (
                      <span className="text-red-400 font-bold text-sm flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> ยังไม่ถูกต้อง
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onSelectElement(currentQ.correctElement);
                    }}
                    className="text-xs text-cyan-400 hover:underline"
                  >
                    เปิดดูธาตุนี้ในตาราง ↗
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  💡 {currentQ.explanation}
                </p>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition-colors shadow-md"
                  >
                    <span>ข้อถัดไป</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Finished Screen */
          <div className="py-8 text-center space-y-5">
            <div className="inline-flex p-4 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Award className="w-12 h-12" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">ยอดเยี่ยม! ทำแบบทดสอบเสร็จสิ้น</h3>
              <p className="text-sm text-slate-400 mt-1">
                คุณทำได้ <strong className="text-amber-400 text-lg">{score}</strong> คะแนน (คอมโบสูงสุด {bestStreak} ข้อ)
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={startNewQuiz}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold transition-colors shadow-lg"
              >
                <RotateCcw className="w-4 h-4" />
                <span>เล่นใหม่อีกรอบ</span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors"
              >
                กลับไปดูตารางธาตุ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
