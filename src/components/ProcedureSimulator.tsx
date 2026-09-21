import React, { useState, useMemo } from 'react';
import { SITUATIONS_DATA, HANDLING_STEPS_DATA } from '../data/assessmentData';
import { SituationCheck, HandlingStep } from '../types';
import { shuffleArray } from '../utils/shuffle';
import {
  CheckCircle2,
  XCircle,
  Wrench,
  ArrowRight,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Play,
  Eye,
  Plug,
  GitBranch,
  Power,
  Activity,
  FileText,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Lock,
} from 'lucide-react';

interface ProcedureSimulatorProps {
  onScoreUpdate: (checkingScore: number, sequenceScore: number) => void;
  onFinish: () => void;
  savedSituationAnswers?: Record<string, string>;
  savedSequenceOrder?: number[];
  onSaveState?: (sitAnswers: Record<string, string>, seqOrder: number[]) => void;
  isLocked?: boolean;
}

export const ProcedureSimulator: React.FC<ProcedureSimulatorProps> = ({
  onScoreUpdate,
  onFinish,
  savedSituationAnswers = {},
  savedSequenceOrder,
  onSaveState,
  isLocked = false,
}) => {
  // Activity 5 state
  const [situationAnswers, setSituationAnswers] = useState<Record<string, string>>(savedSituationAnswers);
  const [activeSituationIdx, setActiveSituationIdx] = useState<number>(0);

  // Shuffle multiple choices for each situation scenario so answer locations vary
  const situationChoicesMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    SITUATIONS_DATA.forEach((s) => {
      map[s.id] = shuffleArray(s.choices);
    });
    return map;
  }, []);

  // Activity 6 state: array of step IDs in current user order
  // Initial shuffle if not saved
  const [stepOrder, setStepOrder] = useState<number[]>(() => {
    if (savedSequenceOrder && savedSequenceOrder.length === 6) {
      return savedSequenceOrder;
    }
    let shuffled = shuffleArray([1, 2, 3, 4, 5, 6]);
    // Ensure it's not accidentally in exact 1..6 order initially
    if (shuffled.every((v, i) => v === i + 1)) {
      shuffled = [3, 1, 5, 2, 6, 4];
    }
    return shuffled;
  });

  const [isSequenceSubmitted, setIsSequenceSubmitted] = useState<boolean>(false);
  const [simulatedStepActive, setSimulatedStepActive] = useState<number | null>(null);
  const [simulationRunning, setSimulationRunning] = useState<boolean>(false);

  // Render step icon
  const renderStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'Eye': return <Eye className="w-4 h-4 text-sky-600" />;
      case 'Plug': return <Plug className="w-4 h-4 text-amber-600" />;
      case 'GitBranch': return <GitBranch className="w-4 h-4 text-indigo-600" />;
      case 'Power': return <Power className="w-4 h-4 text-emerald-600" />;
      case 'Activity': return <Activity className="w-4 h-4 text-blue-600" />;
      case 'FileText': return <FileText className="w-4 h-4 text-purple-600" />;
      default: return <Wrench className="w-4 h-4 text-slate-600" />;
    }
  };

  // Activity 5 scoring: 5 items * 3 pts = 15 pts
  const calculateCheckingScore = (answers: Record<string, string>) => {
    let score = 0;
    SITUATIONS_DATA.forEach((s) => {
      if (answers[s.id] === s.correctAction) {
        score += 3;
      }
    });
    return score;
  };

  // Activity 6 scoring: 10 pts max
  const calculateSequenceScore = (order: number[]) => {
    let correctPositions = 0;
    order.forEach((stepId, idx) => {
      const step = HANDLING_STEPS_DATA.find((s) => s.id === stepId);
      if (step && step.correctOrder === idx + 1) {
        correctPositions += 1;
      }
    });
    // Scale 6 steps to 10 points
    return Math.round((correctPositions / 6) * 10);
  };

  const handleSelectSituationAction = (sitId: string, action: string) => {
    if (isLocked) return;
    const nextAnswers = { ...situationAnswers, [sitId]: action };
    setSituationAnswers(nextAnswers);
    const checkScore = calculateCheckingScore(nextAnswers);
    const seqScore = calculateSequenceScore(stepOrder);
    onScoreUpdate(checkScore, seqScore);
    onSaveState?.(nextAnswers, stepOrder);
  };

  // Step movement handlers
  const moveStep = (index: number, direction: 'up' | 'down') => {
    if (isLocked) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === stepOrder.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const nextOrder = [...stepOrder];
    const temp = nextOrder[index];
    nextOrder[index] = nextOrder[targetIndex];
    nextOrder[targetIndex] = temp;

    setStepOrder(nextOrder);
    setIsSequenceSubmitted(false);

    const checkScore = calculateCheckingScore(situationAnswers);
    const seqScore = calculateSequenceScore(nextOrder);
    onScoreUpdate(checkScore, seqScore);
    onSaveState?.(situationAnswers, nextOrder);
  };

  const handleResetSequence = () => {
    if (isLocked) return;
    let reset = shuffleArray([1, 2, 3, 4, 5, 6]);
    if (reset.every((v, i) => v === i + 1)) {
      reset = [3, 1, 5, 2, 6, 4];
    }
    setStepOrder(reset);
    setIsSequenceSubmitted(false);
    setSimulationRunning(false);
    setSimulatedStepActive(null);
    const checkScore = calculateCheckingScore(situationAnswers);
    const seqScore = calculateSequenceScore(reset);
    onScoreUpdate(checkScore, seqScore);
    onSaveState?.(situationAnswers, reset);
  };

  const handleVerifySequence = () => {
    if (isLocked) return;
    setIsSequenceSubmitted(true);
    const checkScore = calculateCheckingScore(situationAnswers);
    const seqScore = calculateSequenceScore(stepOrder);
    onScoreUpdate(checkScore, seqScore);
    onSaveState?.(situationAnswers, stepOrder);

    // Run interactive virtual lab sequence animation
    setSimulationRunning(true);
    setSimulatedStepActive(1);

    let current = 1;
    const interval = setInterval(() => {
      current += 1;
      if (current > 6) {
        clearInterval(interval);
        setSimulationRunning(false);
        setSimulatedStepActive(null);
      } else {
        setSimulatedStepActive(current);
      }
    }, 700);
  };

  const currentSituation = SITUATIONS_DATA[activeSituationIdx];
  const currentSitAnswer = situationAnswers[currentSituation.id];
  const isSitAnswered = Boolean(currentSitAnswer);
  const isSitCorrect = currentSitAnswer === currentSituation.correctAction;

  const totalSitAnswered = Object.keys(situationAnswers).length;
  const isSequenceCorrect = stepOrder.every((id, idx) => {
    const s = HANDLING_STEPS_DATA.find((item) => item.id === id);
    return s?.correctOrder === idx + 1;
  });

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-8">
      {/* Assessment Locked Notice Banner */}
      {isLocked && (
        <div className="bg-amber-50 border border-amber-300 text-amber-900 p-4 rounded-xl text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Assessment Finalized & Locked (Read-Only Mode):</strong> Fault checking answers and sequence order are recorded. Adjustments are disabled.
            </span>
          </div>
          <span className="bg-amber-200/80 text-amber-950 font-bold px-2.5 py-0.5 rounded text-[11px]">
            Locked
          </span>
        </div>
      )}

      {/* Module Title */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
              Part 3: Check and Handle the System (Topic 3)
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              Activity 5 & 6: Network Checking & Procedure Sequencing
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Diagnose shipboard faults and arrange the 6-step maritime equipment handling procedure into the correct sequence.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
              Total: 25 Points (15 pts Activity 5 + 10 pts Activity 6)
            </span>
          </div>
        </div>
      </div>

      {/* Activity 5: Perform a Basic Network Check (15 pts) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-amber-100 text-amber-800">
              Activity 5: Perform a basic network check
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              Select the correct action for each situation
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500">15 Points Total (3 pts each)</span>
        </div>

        {/* Situation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {SITUATIONS_DATA.map((s, idx) => {
            const ans = situationAnswers[s.id];
            const isAnswered = Boolean(ans);
            const isCurrent = idx === activeSituationIdx;

            return (
              <button
                key={s.id}
                onClick={() => setActiveSituationIdx(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  isCurrent
                    ? 'bg-sky-600 text-white shadow-sm'
                    : isAnswered
                    ? 'bg-sky-50 text-sky-900 border border-sky-200'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>Situation {idx + 1}</span>
                {isAnswered && (
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-600 inline-block" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Scenario Card */}
        <div className="grid md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-5 bg-slate-900 text-white rounded-xl p-5 border border-slate-800 space-y-3">
            <span className="text-xs font-mono text-sky-400 font-bold uppercase tracking-wider">
              Shipboard Incident Report #{activeSituationIdx + 1}
            </span>
            <div className="p-3.5 rounded-lg bg-slate-800/80 border border-slate-700">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Observed Situation:</span>
              <p className="text-base font-bold text-white mt-1">
                &ldquo;{currentSituation.situation}&rdquo;
              </p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              As the duty ICT support cadet, analyze the symptom and identify the standard maritime maintenance action.
            </p>
          </div>

          <div className="md:col-span-7 space-y-3">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
              Select the Correct Action:
            </span>

            <div className="space-y-2">
              {(situationChoicesMap[currentSituation.id] || currentSituation.choices).map((choice) => {
                const isSelected = currentSitAnswer === choice;

                let btnStyle = 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800';
                if (isSelected) {
                  btnStyle = 'border-sky-500 bg-sky-50 text-sky-900 font-medium ring-1 ring-sky-400';
                }

                return (
                  <button
                    key={choice}
                    disabled={isLocked}
                    onClick={() => handleSelectSituationAction(currentSituation.id, choice)}
                    className={`w-full text-left px-4 py-3 rounded-lg border text-xs sm:text-sm transition-all flex items-center justify-between ${
                      isLocked ? 'cursor-default opacity-85' : 'cursor-pointer'
                    } ${btnStyle}`}
                  >
                    <span>{choice}</span>
                    {isSelected && (
                      <span className="text-[11px] font-semibold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                        Selected
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {isSitAnswered && (
              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-sky-600" />
                  <span className="font-medium">Diagnostic action recorded for Situation {activeSituationIdx + 1}</span>
                </div>
                <span className="text-[11px] text-slate-500">Graded at final submission</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Activity 6: Correct Handling Procedure Sequencing (10 pts) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-indigo-100 text-indigo-800">
              Activity 6: Correct handling procedure
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              Arrange the steps in the correct order (1 to 6)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500">10 Points Total</span>
            {!isLocked && (
              <button
                onClick={handleResetSequence}
                className="flex items-center gap-1 text-slate-600 hover:text-slate-900 text-xs px-2.5 py-1 rounded bg-white border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Shuffle</span>
              </button>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-600">
          Use the <strong>Up / Down</strong> buttons to arrange the checking steps in their exact procedural sequence from step 1 to step 6.
        </p>

        {/* Step List */}
        <div className="space-y-2.5">
          {stepOrder.map((stepId, index) => {
            const step = HANDLING_STEPS_DATA.find((s) => s.id === stepId)!;
            const isCorrectPosition = step.correctOrder === index + 1;
            const isSimulating = simulatedStepActive === index + 1;

            return (
              <div
                key={step.id}
                className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  isSimulating
                    ? 'border-sky-500 bg-sky-50 shadow-md ring-2 ring-sky-400'
                    : 'border-slate-200 bg-slate-50/60 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Step Rank Number Badge */}
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 bg-slate-800 text-white">
                    {index + 1}
                  </div>

                  <div className="p-1.5 rounded-md bg-white border border-slate-200 shrink-0">
                    {renderStepIcon(step.icon)}
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      {step.text}
                    </h4>
                    <p className="text-[11px] text-slate-500 hidden sm:block mt-0.5">
                      {step.detail}
                    </p>
                  </div>
                </div>

                {/* Control Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    disabled={isLocked || index === 0}
                    onClick={() => moveStep(index, 'up')}
                    className="p-1.5 rounded bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="Move Step Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5 text-slate-700" />
                  </button>
                  <button
                    disabled={isLocked || index === stepOrder.length - 1}
                    onClick={() => moveStep(index, 'down')}
                    className="p-1.5 rounded bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="Move Step Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5 text-slate-700" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Verification / Walkthrough Action */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleVerifySequence}
            disabled={isLocked || simulationRunning}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg text-xs font-semibold cursor-pointer shadow transition"
          >
            <Play className="w-3.5 h-3.5 text-sky-400" />
            <span>{isLocked ? 'Sequence Locked' : 'Submit Sequence & Run Procedure Check'}</span>
          </button>

          {isSequenceSubmitted && (
            <span className="text-xs font-medium text-slate-500">
              Sequence logged • Evaluated at final submission
            </span>
          )}
        </div>

        {/* Result Confirmation Banner */}
        {isSequenceSubmitted && (
          <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/70 text-sky-950 text-xs leading-relaxed space-y-1.5">
            <div className="font-bold flex items-center gap-2 text-sm text-sky-900">
              <div className="w-2.5 h-2.5 rounded-full bg-sky-600" />
              <span>Handling Procedure Sequence Logged</span>
            </div>
            <p className="text-slate-700">
              Your 6-step procedural sequence has been recorded into the maritime laboratory logbook.
            </p>
            <p className="text-[11px] text-slate-500">
              Procedural sequence accuracy and point distribution will be presented on the final assessment screen.
            </p>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="text-xs text-slate-500">
          Situations answered: {totalSitAnswered} / 5 • Sequence {isSequenceSubmitted ? 'submitted' : 'in progress'}
        </div>
        <button
          id="btn-view-final-sheet"
          onClick={onFinish}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-6 py-2.5 rounded-lg shadow transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isLocked ? 'View Assessment Report & Receipt' : 'Review & Finalize Assessment'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
