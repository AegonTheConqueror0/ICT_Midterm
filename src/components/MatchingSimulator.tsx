import React, { useState, useMemo } from 'react';
import { MATCH_ITEMS } from '../data/assessmentData';
import { MatchItem } from '../types';
import { CheckCircle2, XCircle, RotateCcw, ArrowRight, HelpCircle, Cpu, Zap, HardDrive, Network, Monitor, Keyboard, GripVertical, Lock } from 'lucide-react';
import { shuffleArray } from '../utils/shuffle';

interface MatchingSimulatorProps {
  onScoreUpdate: (score: number) => void;
  onNext: () => void;
  savedMatches?: Record<string, string>; // functionText -> componentId
  onSaveMatches?: (matches: Record<string, string>) => void;
  isLocked?: boolean;
}

export const MatchingSimulator: React.FC<MatchingSimulatorProps> = ({
  onScoreUpdate,
  onNext,
  savedMatches = {},
  onSaveMatches,
  isLocked = false,
}) => {
  // matches: map of functionText -> componentId
  const [matches, setMatches] = useState<Record<string, string>>(savedMatches);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [draggedComponentId, setDraggedComponentId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(Object.keys(savedMatches).length === MATCH_ITEMS.length);

  // Shuffle components on the left and functions on the right independently so they aren't side-by-side matches
  const shuffledComponents = useMemo(() => shuffleArray(MATCH_ITEMS), []);
  const shuffledFunctions = useMemo(() => shuffleArray(MATCH_ITEMS), []);

  // Icon mapping
  const renderIcon = (name: string) => {
    switch (name) {
      case 'Cpu': return <Cpu className="w-4 h-4 text-amber-600" />;
      case 'Zap': return <Zap className="w-4 h-4 text-sky-600" />;
      case 'HardDrive': return <HardDrive className="w-4 h-4 text-emerald-600" />;
      case 'Network': return <Network className="w-4 h-4 text-indigo-600" />;
      case 'Monitor': return <Monitor className="w-4 h-4 text-blue-600" />;
      case 'Keyboard': return <Keyboard className="w-4 h-4 text-purple-600" />;
      default: return <Cpu className="w-4 h-4 text-slate-600" />;
    }
  };

  // Find if a component is already paired
  const getPairedFunctionForComponent = (componentId: string) => {
    for (const [func, cId] of Object.entries(matches)) {
      if (cId === componentId) return func;
    }
    return null;
  };

  // Handle assigning a component to a function
  const assignMatch = (functionText: string, componentId: string) => {
    if (isLocked) return;
    const nextMatches = { ...matches };
    // Remove if component was placed elsewhere
    for (const [key, val] of Object.entries(nextMatches)) {
      if (val === componentId) {
        delete nextMatches[key];
      }
    }
    nextMatches[functionText] = componentId;
    setMatches(nextMatches);
    setSelectedComponentId(null);
    setDraggedComponentId(null);

    // Auto-calculate score if submitted or update
    calculateScore(nextMatches);
    onSaveMatches?.(nextMatches);
  };

  const removeMatch = (functionText: string) => {
    if (isLocked) return;
    const nextMatches = { ...matches };
    delete nextMatches[functionText];
    setMatches(nextMatches);
    calculateScore(nextMatches);
    onSaveMatches?.(nextMatches);
  };

  const calculateScore = (currentMatches: Record<string, string>) => {
    let correctCount = 0;
    MATCH_ITEMS.forEach((item) => {
      if (currentMatches[item.functionText] === item.id) {
        correctCount += 1;
      }
    });
    // 6 items, 15 points total = 2.5 pts each (15 total)
    const points = Math.round((correctCount / MATCH_ITEMS.length) * 15);
    onScoreUpdate(points);
  };

  const handleDragStart = (componentId: string) => {
    if (isLocked) return;
    setDraggedComponentId(componentId);
  };

  const handleDrop = (functionText: string) => {
    if (isLocked) return;
    if (draggedComponentId) {
      assignMatch(functionText, draggedComponentId);
    }
  };

  const handleReset = () => {
    if (isLocked) return;
    setMatches({});
    setSelectedComponentId(null);
    setIsSubmitted(false);
    onScoreUpdate(0);
    onSaveMatches?.({});
  };

  const handleSubmit = () => {
    if (isLocked) return;
    setIsSubmitted(true);
    calculateScore(matches);
    onSaveMatches?.(matches);
  };

  const totalMatched = Object.keys(matches).length;

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-8">
      {/* Assessment Locked Notice Banner */}
      {isLocked && (
        <div className="bg-amber-50 border border-amber-300 text-amber-900 p-4 rounded-xl text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Assessment Finalized & Locked (Read-Only Mode):</strong> Component matches are recorded and displayed below. Drag-and-drop actions are disabled.
            </span>
          </div>
          <span className="bg-amber-200/80 text-amber-950 font-bold px-2.5 py-0.5 rounded text-[11px]">
            Locked
          </span>
        </div>
      )}

      {/* Activity Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
              Part 1: Hardware Identification (Topic 1)
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              Activity 2: Drag-and-Drop Matching Simulator
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Drag each computer component card or click to match it with its correct operational function.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
              Score: 15 Points (2.5 pts / component)
            </span>
          </div>
        </div>

        {/* Tip / instructions bar */}
        <div className="mt-4 flex items-center justify-between bg-sky-50 border border-sky-200 rounded-lg p-3 text-xs text-sky-900">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-sky-600 shrink-0" />
            <span>
              <strong>Cadet Instruction:</strong> Drag cards from the left to drop targets on the right, or click a component then click a function target.
            </span>
          </div>
          {!isLocked && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-slate-600 hover:text-slate-900 text-xs px-2.5 py-1 rounded bg-white border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Matches</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Matching Work Area */}
      <div className="grid md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Components Shelf */}
        <div className="md:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Hardware Components
            </h3>
            <span className="text-xs text-slate-400">6 Items Available</span>
          </div>

          <div className="space-y-2.5">
            {shuffledComponents.map((item) => {
              const isPaired = Boolean(getPairedFunctionForComponent(item.id));
              const isSelected = selectedComponentId === item.id;
              const isDragging = draggedComponentId === item.id;

              return (
                <div
                  key={item.id}
                  id={`match-comp-${item.id}`}
                  draggable={!isLocked}
                  onDragStart={() => !isLocked && handleDragStart(item.id)}
                  onClick={() => {
                    if (isLocked) return;
                    if (selectedComponentId === item.id) {
                      setSelectedComponentId(null);
                    } else {
                      setSelectedComponentId(item.id);
                    }
                  }}
                  className={`p-3.5 rounded-lg border text-sm transition-all select-none flex items-center justify-between ${
                    isLocked ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
                  } ${
                    isSelected
                      ? 'border-sky-500 bg-sky-50 text-sky-900 shadow-sm ring-2 ring-sky-400'
                      : isPaired
                      ? 'border-slate-200 bg-slate-50/80 text-slate-500 opacity-75'
                      : 'border-slate-200 bg-white text-slate-900 hover:border-sky-300 hover:shadow-sm'
                  } ${isDragging ? 'opacity-40 border-dashed border-sky-400' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-slate-400 shrink-0" />
                    <div className="p-1.5 rounded-md bg-slate-100">
                      {renderIcon(item.iconName)}
                    </div>
                    <div>
                      <span className="font-bold text-sm text-slate-900">{item.component}</span>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{item.description}</p>
                    </div>
                  </div>

                  {isPaired && (
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                      Paired
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-400 italic pt-2">
            Selected: <strong className="text-slate-700">{selectedComponentId ? MATCH_ITEMS.find(m => m.id === selectedComponentId)?.component : 'None (Click or drag any component)'}</strong>
          </p>
        </div>

        {/* Right Column: Function Slots */}
        <div className="md:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Target Operational Functions
            </h3>
            <span className="text-xs font-mono text-slate-500">
              Matched: {totalMatched} / 6
            </span>
          </div>

          <div className="space-y-3">
            {shuffledFunctions.map((item) => {
              const matchedCompId = matches[item.functionText];
              const matchedComponent = MATCH_ITEMS.find((m) => m.id === matchedCompId);

              return (
                <div
                  key={item.functionText}
                  id={`slot-${item.id}`}
                  onDragOver={(e) => !isLocked && e.preventDefault()}
                  onDrop={() => !isLocked && handleDrop(item.functionText)}
                  onClick={() => {
                    if (isLocked) return;
                    if (selectedComponentId) {
                      assignMatch(item.functionText, selectedComponentId);
                    }
                  }}
                  className={`p-3.5 rounded-xl border transition-all ${
                    !isLocked && selectedComponentId && !matchedComponent
                      ? 'border-sky-400 bg-sky-50/40 hover:bg-sky-50 cursor-pointer border-dashed'
                      : 'border-slate-200 bg-slate-50/50'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex-1">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-0.5">
                        Function
                      </span>
                      <p className="text-sm font-semibold text-slate-800">
                        &bull; {item.functionText}
                      </p>
                    </div>

                    {/* Assigned Component Badge or Empty Drop Target */}
                    <div className="sm:w-56 shrink-0">
                      {matchedComponent ? (
                        <div className="flex items-center justify-between p-2 rounded-lg border border-slate-300 bg-white text-slate-900 shadow-xs text-xs font-medium">
                          <div className="flex items-center gap-2">
                            {renderIcon(matchedComponent.iconName)}
                            <strong className="text-xs">{matchedComponent.component}</strong>
                          </div>
                          {!isLocked && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeMatch(item.functionText);
                              }}
                              className="text-slate-400 hover:text-rose-600 px-1.5 py-0.5 text-[11px] rounded hover:bg-slate-100 cursor-pointer"
                            >
                              &times;
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="text-center p-2 rounded-lg border border-dashed border-slate-300 bg-white/70 text-slate-400 text-xs hover:border-sky-400 transition-colors">
                          {isLocked ? 'No component assigned' : selectedComponentId ? 'Click to place here' : 'Drop component here'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 flex items-center justify-between">
            <button
              onClick={handleSubmit}
              disabled={isLocked || totalMatched === 0}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold cursor-pointer shadow transition"
            >
              Record & Save Matches
            </button>
            <span className="text-xs text-slate-500">
              {isSubmitted ? `Recorded (${totalMatched} of 6 matched) • Evaluated at final submission` : 'Assign all 6 components to proceed'}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="text-xs text-slate-500">
          Matched {totalMatched} of 6 components.
        </div>
        <button
          id="btn-next-to-topology"
          onClick={onNext}
          className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold px-5 py-2.5 rounded-lg shadow transition cursor-pointer"
        >
          <span>Proceed to Simulator 3: Network Topology Builder</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
