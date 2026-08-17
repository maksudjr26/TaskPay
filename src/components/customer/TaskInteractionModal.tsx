import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Task } from '../../types';
import {
  X,
  Sparkles,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Play,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  task: Task;
  onClose: () => void;
}

export const TaskInteractionModal: React.FC<Props> = ({ task, onClose }) => {
  const { t, lang, completeTask, settings } = useApp();
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [mathProblem, setMathProblem] = useState({ q: '', ans: 0 });
  const [mathInput, setMathInput] = useState('');
  const [selectedSurveyOption, setSelectedSurveyOption] = useState<string | null>(null);
  
  // Timers
  const [timerSeconds, setTimerSeconds] = useState(task.estimatedSeconds || 15);
  const [timerFinished, setTimerFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSuccess, setCompletedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate random CAPTCHA code
  const generateCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput('');
    setErrorMessage('');
  };

  // Generate random Math Quiz
  const generateMathQuiz = () => {
    const ops = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * (task.config?.mathDifficulty === 'hard' ? 3 : 2))];
    let n1 = Math.floor(Math.random() * 50) + 10;
    let n2 = Math.floor(Math.random() * 30) + 5;
    let ans = 0;

    if (op === '+') {
      ans = n1 + n2;
    } else if (op === '-') {
      if (n1 < n2) [n1, n2] = [n2, n1];
      ans = n1 - n2;
    } else {
      n1 = Math.floor(Math.random() * 12) + 2;
      n2 = Math.floor(Math.random() * 9) + 2;
      ans = n1 * n2;
    }

    setMathProblem({
      q: `${n1} ${op === '*' ? '×' : op} ${n2} = ?`,
      ans
    });
    setMathInput('');
    setErrorMessage('');
  };

  // Draw distorted CAPTCHA to canvas
  useEffect(() => {
    if (task.type === 'captcha') {
      generateCaptcha();
    } else if (task.type === 'math_quiz') {
      generateMathQuiz();
    }
  }, [task.id]);

  useEffect(() => {
    if (task.type === 'captcha' && canvasRef.current && captchaCode) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Background with gradient
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, '#f8fafc');
      grad.addColorStop(1, '#e2e8f0');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Random noise lines
      for (let i = 0; i < 5; i++) {
        ctx.strokeStyle = `rgba(${Math.floor(Math.random()*150)}, ${Math.floor(Math.random()*150)}, ${Math.floor(Math.random()*150)}, 0.4)`;
        ctx.lineWidth = Math.random() * 2 + 1;
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.stroke();
      }

      // Random noise dots
      for (let i = 0; i < 30; i++) {
        ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.25})`;
        ctx.beginPath();
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render each character with slight angle and jitter
      const charArray = captchaCode.split('');
      const charWidth = canvas.width / (charArray.length + 1);

      ctx.textBaseline = 'middle';
      charArray.forEach((char, index) => {
        ctx.save();
        const x = (index + 0.8) * charWidth;
        const y = canvas.height / 2 + (Math.random() * 6 - 3);
        const angle = (Math.random() * 30 - 15) * (Math.PI / 180);

        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.font = `bold ${Math.floor(Math.random() * 6 + 26)}px 'Plus Jakarta Sans', sans-serif`;
        
        // Random distinct deep colors
        const colors = ['#0f172a', '#1e3a8a', '#047857', '#991b1b', '#6b21a8'];
        ctx.fillStyle = colors[index % colors.length];
        ctx.shadowColor = 'rgba(0,0,0,0.15)';
        ctx.shadowBlur = 3;
        ctx.fillText(char, -10, 0);
        ctx.restore();
      });
    }
  }, [captchaCode, task.type]);

  // Countdown timer for reading and video ad tasks
  useEffect(() => {
    if (task.type === 'read_article' || task.type === 'video_ad') {
      const interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setTimerFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [task.type]);

  const handleSubmit = () => {
    setErrorMessage('');
    setIsSubmitting(true);

    if (task.type === 'captcha') {
      if (captchaInput.trim().toUpperCase() !== captchaCode) {
        setErrorMessage(lang === 'bn' ? 'ক্যাপচা কোড সঠিক হয়নি! আবার চেষ্টা করুন।' : 'Incorrect CAPTCHA code. Please try again.');
        generateCaptcha();
        setIsSubmitting(false);
        return;
      }
    } else if (task.type === 'math_quiz') {
      if (parseInt(mathInput.trim(), 10) !== mathProblem.ans) {
        setErrorMessage(lang === 'bn' ? 'উত্তর সঠিক হয়নি! আবার চেষ্টা করুন।' : 'Incorrect math answer. Please try again.');
        generateMathQuiz();
        setIsSubmitting(false);
        return;
      }
    } else if (task.type === 'survey') {
      if (!selectedSurveyOption) {
        setErrorMessage(lang === 'bn' ? 'দয়া করে একটি উত্তর নির্বাচন করুন।' : 'Please select an option.');
        setIsSubmitting(false);
        return;
      }
    }

    const proof =
      task.type === 'captcha'
        ? `Verified Captcha: ${captchaCode}`
        : task.type === 'math_quiz'
        ? `Quiz Answered: ${mathProblem.q} => ${mathInput}`
        : task.type === 'survey'
        ? `Survey Answer: ${selectedSurveyOption}`
        : `Completed Timer: ${task.title}`;

    const res = completeTask(task.id, proof);
    setIsSubmitting(false);

    if (res.success) {
      setCompletedSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-snug">
                {lang === 'bn' ? task.titleBn : task.title}
              </h3>
              <p className="text-xs text-slate-400">
                {t.taskReward}: <span className="text-emerald-400 font-bold">৳{task.reward}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {completedSuccess ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-8 text-center space-y-3"
            >
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>
              <h4 className="text-xl font-bold text-slate-800">{t.congratulations}</h4>
              <p className="text-sm text-slate-600">
                <span className="font-bold text-emerald-600 text-base">৳{task.reward}</span> {t.rewardAddedToBalance}
              </p>
            </motion.div>
          ) : (
            <>
              {/* Task Description */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
                {lang === 'bn' ? task.descriptionBn : task.description}
              </div>

              {/* 1. CAPTCHA TASK TYPE */}
              {task.type === 'captcha' && (
                <div className="space-y-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative group">
                      <canvas
                        ref={canvasRef}
                        width={280}
                        height={85}
                        className="rounded-xl border-2 border-slate-300 shadow-inner bg-slate-100"
                      />
                      <button
                        onClick={generateCaptcha}
                        className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white text-slate-700 rounded-lg shadow-sm border border-slate-200 transition-all hover:scale-105"
                        title={t.refreshCaptcha}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5" />
                      {t.captchaPlaceholder}
                    </span>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                      placeholder="Enter CAPTCHA code"
                      maxLength={6}
                      className="w-full text-center text-xl font-mono tracking-widest uppercase font-bold py-3 px-4 rounded-xl border-2 border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                      autoFocus
                    />
                  </div>
                </div>
              )}

              {/* 2. MATH QUIZ TASK TYPE */}
              {task.type === 'math_quiz' && (
                <div className="space-y-4">
                  <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center">
                    <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block mb-1">
                      {t.mathQuizTitle}
                    </span>
                    <div className="text-3xl font-extrabold text-slate-800 font-mono tracking-wider">
                      {mathProblem.q}
                    </div>
                  </div>

                  <div>
                    <input
                      type="number"
                      value={mathInput}
                      onChange={(e) => setMathInput(e.target.value)}
                      placeholder={t.yourAnswer}
                      className="w-full text-center text-2xl font-bold py-3 px-4 rounded-xl border-2 border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                      autoFocus
                    />
                  </div>
                </div>
              )}

              {/* 3. READ ARTICLE TASK TYPE */}
              {task.type === 'read_article' && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 max-h-48 overflow-y-auto text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {lang === 'bn'
                      ? task.config?.articleContentBn || task.descriptionBn
                      : task.config?.articleContent || task.description}
                  </div>

                  {/* Reading Timer Bar */}
                  <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <span>{timerFinished ? (lang === 'bn' ? 'পড়া সম্পন্ন হয়েছে!' : 'Reading Completed!') : `${timerSeconds} ${t.readingCountdown}`}</span>
                    </div>
                    <div className="w-28 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full transition-all duration-1000"
                        style={{
                          width: `${((task.estimatedSeconds - timerSeconds) / task.estimatedSeconds) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 4. SURVEY / OPINION POLL TASK TYPE */}
              {task.type === 'survey' && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-slate-800">
                    {lang === 'bn' ? task.config?.surveyQuestionBn : task.config?.surveyQuestion}
                  </h4>
                  <div className="space-y-2">
                    {(task.config?.surveyOptions || ['bKash', 'Nagad', 'Rocket', 'Bank']).map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedSurveyOption(opt)}
                        className={`w-full text-left p-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-between ${
                          selectedSurveyOption === opt
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold ring-2 ring-emerald-200'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span>{opt}</span>
                        {selectedSurveyOption === opt && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. VIDEO / AD VIEW TASK TYPE */}
              {task.type === 'video_ad' && (
                <div className="space-y-4">
                  <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden relative flex items-center justify-center text-white">
                    <div className="text-center p-4 space-y-2">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                        <Play className="w-6 h-6 ml-0.5" />
                      </div>
                      <p className="text-xs text-slate-300 font-medium">
                        {lang === 'bn' ? 'স্পন্সর প্রিভিউ লোড হচ্ছে...' : 'Sponsored Partner Preview Active'}
                      </p>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between text-xs">
                      <span>{timerFinished ? '0s' : `${timerSeconds}s`}</span>
                      <div className="w-48 bg-white/20 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-400 h-full transition-all duration-1000"
                          style={{
                            width: `${((task.estimatedSeconds - timerSeconds) / task.estimatedSeconds) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2">
                <button
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting ||
                    ((task.type === 'read_article' || task.type === 'video_ad') && !timerFinished) ||
                    (task.type === 'captcha' && !captchaInput) ||
                    (task.type === 'math_quiz' && !mathInput) ||
                    (task.type === 'survey' && !selectedSurveyOption)
                  }
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>{isSubmitting ? t.loading : t.verifyAndEarn} (+৳{task.reward})</span>
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
