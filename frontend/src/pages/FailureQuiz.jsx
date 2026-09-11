import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { getQuizQuestions } from '../lib/api';
import { LoadingState } from '../components/common/InsightCard';
import { 
  HelpCircle, CheckCircle, XCircle, ArrowRight, RotateCcw, 
  Sparkles, Award, BookOpen, AlertOctagon 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function FailureQuiz() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQuiz() {
      setLoading(true);
      try {
        const res = await getQuizQuestions();
        setQuestions(res.data || []);
      } catch (err) {
        console.error('Quiz load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadQuiz();
  }, []);

  if (loading || questions.length === 0) {
    return (
      <div className="vault-container py-20">
        <LoadingState message="Loading failure forensic quiz scenarios..." />
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  const handleSelectOption = (option) => {
    if (selectedOption !== null) return; // Prevent changing after answer
    setSelectedOption(option);
    setAnsweredCount((prev) => prev + 1);
    if (option.isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setIsQuizComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setAnsweredCount(0);
    setIsQuizComplete(false);
  };

  return (
    <div className="pb-20">
      <PageHeader
        title="Interactive Startup Survival Quiz"
        subtitle="Test your venture diagnostic instincts across real-world startup collapse scenarios."
        badge="Founder IQ Test"
        tagline="FORENSIC SIMULATION"
        breadcrumbs={[{ label: 'Learn' }, { label: 'Failure Quiz' }]}
      />

      <div className="vault-container max-w-3xl mx-auto">
        {!isQuizComplete ? (
          <div className="vault-card p-6 sm:p-8 space-y-6">
            {/* Header: Progress & Score */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800 text-xs font-mono">
              <span className="text-neutral-500">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-neutral-400">Survival Score:</span>
                <span className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">
                  {score} / {answeredCount}
                </span>
              </div>
            </div>

            {/* Scenario Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="vault-badge vault-badge-red text-xs">
                  Case: {currentQ.startup}
                </span>
                <span className="text-xs font-mono text-neutral-400">
                  Raised {currentQ.raised} • {currentQ.industry}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold font-sans text-neutral-950 dark:text-neutral-50 leading-snug">
                {currentQ.scenario}
              </h3>
            </div>

            {/* Multiple Choice Options */}
            <div className="space-y-3">
              {currentQ.options.map((opt) => {
                const isSelected = selectedOption?.id === opt.id;
                const hasAnswered = selectedOption !== null;

                let borderClass = 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400';
                let bgClass = 'bg-neutral-50 dark:bg-neutral-900/60';

                if (hasAnswered) {
                  if (opt.isCorrect) {
                    borderClass = 'border-emerald-500 dark:border-emerald-600 ring-1 ring-emerald-500';
                    bgClass = 'bg-emerald-50/50 dark:bg-emerald-950/30';
                  } else if (isSelected && !opt.isCorrect) {
                    borderClass = 'border-rose-500 dark:border-rose-600 ring-1 ring-rose-500';
                    bgClass = 'bg-rose-50/50 dark:bg-rose-950/30';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt)}
                    disabled={hasAnswered}
                    className={`w-full text-left p-4 rounded-lg border transition-all text-xs sm:text-sm font-sans flex items-start gap-3 ${borderClass} ${bgClass} ${hasAnswered ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <span className="w-6 h-6 rounded font-mono font-bold text-xs flex items-center justify-center shrink-0 bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                      {opt.id}
                    </span>
                    <div className="flex-1">
                      <p className="text-neutral-900 dark:text-neutral-100 leading-relaxed">
                        {opt.text}
                      </p>
                      {hasAnswered && opt.isCorrect && (
                        <p className="mt-2 text-xs text-emerald-700 dark:text-emerald-400 font-sans">
                          ✓ {opt.critique}
                        </p>
                      )}
                      {hasAnswered && isSelected && !opt.isCorrect && (
                        <p className="mt-2 text-xs text-rose-700 dark:text-rose-400 font-sans">
                          ✕ {opt.critique}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Post-Answer Diagnostic Explanation Box */}
            {selectedOption !== null && (
              <div className="p-4 rounded-lg bg-neutral-900 text-white dark:bg-neutral-950 border border-neutral-800 space-y-2 animate-fade-in text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-rose-400 text-[10px] uppercase">
                    HISTORICAL POST-MORTEM LESSON
                  </span>
                  <Link 
                    to={`/startup/${currentQ.relatedStartupId}`} 
                    className="text-[11px] font-mono text-neutral-400 hover:text-white underline"
                  >
                    Read {currentQ.startup} Autopsy →
                  </Link>
                </div>
                <p className="text-neutral-200 leading-relaxed">
                  {currentQ.historicalLesson}
                </p>
                <div className="text-[10px] font-mono text-neutral-400 pt-1">
                  Source: {currentQ.evidenceSource}
                </div>
              </div>
            )}

            {/* Next Question Button */}
            {selectedOption !== null && (
              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
                <button
                  onClick={handleNext}
                  className="vault-btn-primary text-xs font-mono flex items-center gap-1.5"
                >
                  <span>{currentIndex < questions.length - 1 ? 'Next Autopsy Scenario' : 'View Final Score'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Quiz Results Completion Card */
          <div className="vault-card p-8 sm:p-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-2xl font-bold font-sans text-neutral-950 dark:text-neutral-50">
                Diagnostic Assessment Complete
              </h2>
              <p className="mt-1 text-xs text-neutral-500 font-mono">
                Survival Instinct Rating
              </p>
            </div>

            <div className="text-4xl font-extrabold font-mono text-neutral-900 dark:text-neutral-50">
              {score} / {questions.length} Correct
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
              {score === questions.length
                ? 'Flawless forensic instincts. You recognized every fatal trap across unit economics, governance, and distribution.'
                : score >= 3
                ? 'Strong venture awareness. You understand the primary failure vectors, but continue reviewing edge cases in hardware and platform monopolies.'
                : 'High risk tolerance detected. Review our Founder Defensive Playbooks to sharpen your unit economics radar.'}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                onClick={handleRestart}
                className="vault-btn-secondary text-xs flex items-center gap-1.5 font-mono"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Quiz</span>
              </button>
              <Link to="/founder-playbook" className="vault-btn-primary text-xs font-mono">
                <span>Open Founder Playbook</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FailureQuiz;
