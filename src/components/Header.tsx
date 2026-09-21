import React from 'react';
import { AssessmentTab, CadetInfo, AssessmentScores } from '../types';
import { Shield, Clock, Award, CheckCircle2, ChevronRight, FileText, Lock } from 'lucide-react';
import { HcdcSchoolLogo, ComeProgramLogo } from './Logos';

interface HeaderProps {
  currentTab: AssessmentTab;
  onTabChange: (tab: AssessmentTab) => void;
  cadet: CadetInfo;
  scores: AssessmentScores;
  timeRemaining: number;
  isLocked?: boolean;
  isAssessmentStarted?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  cadet,
  scores,
  timeRemaining,
  isLocked = false,
  isAssessmentStarted = false,
}) => {
  const totalScore =
    scores.hardwareIdentification +
    scores.componentFunctionMatching +
    scores.shipboardApplication +
    scores.networkLayoutConstruction +
    scores.networkCheckingProcedure +
    scores.correctHandlingSequence;

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isResultsTab = currentTab === 'results';

  const navItems: { id: AssessmentTab; label: string; short: string; badge?: string }[] = [
    { id: 'briefing', label: 'Mission Briefing', short: 'Briefing' },
    { id: 'hotspot', label: '1. Hotspot Labelling', short: '1. Hotspots', badge: '30 pts' },
    { id: 'matching', label: '2. Component Matching', short: '2. Matching', badge: '15 pts' },
    { id: 'topology', label: '3. Topology Builder', short: '3. Topology', badge: '30 pts' },
    { id: 'procedure', label: '4. Checking & Handling', short: '4. Procedure', badge: '25 pts' },
    { id: 'results', label: isLocked ? 'Assessment Report & Receipt' : 'Final Assessment Screen', short: isLocked ? 'Report & Receipt' : 'Results', badge: isLocked ? `${totalScore}/100` : 'Final' },
  ];

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          {/* Official HCDC School Seal and COME Program Logo */}
          <div className="flex items-center -space-x-1.5 shrink-0 bg-slate-950/60 p-1 rounded-lg border border-slate-800">
            <HcdcSchoolLogo className="w-7 h-7 sm:w-8 sm:h-8" />
            <ComeProgramLogo className="w-8 h-8 sm:w-9 sm:h-9 drop-shadow-md" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wide text-sky-400 font-serif text-[11px] sm:text-xs">
                HOLY CROSS OF DAVAO COLLEGE
              </span>
              <span className="px-1.5 py-0.2 rounded bg-sky-950 text-sky-300 font-mono font-bold text-[10px] border border-sky-800">
                COME
              </span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 font-bold text-[10px] border border-emerald-800">
                BSMT
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium">
              College of Maritime Education • Shipboard ICT Laboratory Assessment
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 text-slate-300">
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-800/70 px-2.5 py-1 rounded border border-slate-700/60">
            <Shield className="w-3.5 h-3.5 text-sky-400" />
            <span>Cadet: <strong className="text-white">{cadet.name.trim() ? cadet.name : 'Unregistered'}</strong></span>
            {cadet.vessel.trim() && <span className="text-slate-400">({cadet.vessel})</span>}
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800/70 px-2.5 py-1 rounded border border-slate-700/60">
            <Clock className={`w-3.5 h-3.5 ${isAssessmentStarted ? 'text-amber-400' : 'text-slate-400'}`} />
            <span>
              Time:{' '}
              <span className={`font-mono font-semibold ${isAssessmentStarted ? 'text-white' : 'text-amber-300'}`}>
                {isLocked
                  ? 'Completed'
                  : isAssessmentStarted
                  ? formattedTime
                  : '30:00 (Pending Start)'}
              </span>
            </span>
          </div>

          <div className={`flex items-center gap-1.5 px-3 py-1 rounded border ${
            isLocked
              ? 'bg-emerald-950/80 border-emerald-700/60 text-emerald-300'
              : !isAssessmentStarted
              ? 'bg-amber-950/80 border-amber-700/60 text-amber-300'
              : 'bg-sky-950/80 border-sky-700/60 text-sky-300'
          }`}>
            {!isAssessmentStarted ? (
              <>
                <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-medium text-amber-200">Registration Required</span>
              </>
            ) : isLocked ? (
              <>
                <Award className="w-3.5 h-3.5" />
                <span>Final Grade: <strong className="text-white font-mono text-sm">{totalScore}</strong> / 100</span>
              </>
            ) : isResultsTab ? (
              <>
                <Award className="w-3.5 h-3.5" />
                <span>Final Score: <strong className="text-white font-mono text-sm">{totalScore}</strong> / 100</span>
              </>
            ) : (
              <>
                <Award className="w-3.5 h-3.5" />
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
                  <span className="text-white font-medium">Exam in Progress</span>
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Bar with Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-2 overflow-x-auto scrollbar-none gap-2">
          <div className="flex items-center space-x-1 min-w-max">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              const isLockedTab = !isAssessmentStarted && item.id !== 'briefing';

              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  disabled={isLockedTab}
                  onClick={() => {
                    if (isLockedTab) return;
                    onTabChange(item.id);
                  }}
                  title={
                    isLockedTab
                      ? 'Locked: Please complete cadet information on Briefing to start assessment'
                      : item.label
                  }
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isLockedTab
                      ? 'text-slate-500 bg-slate-900/40 border border-slate-800/60 cursor-not-allowed opacity-60 select-none'
                      : isActive
                      ? 'bg-sky-600 text-white shadow-sm ring-1 ring-sky-400 cursor-pointer'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer'
                  }`}
                >
                  {isLockedTab && <Lock className="w-3 h-3 text-amber-500/80 shrink-0" />}
                  <span>{item.short}</span>
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                        isLockedTab
                          ? 'bg-slate-800 text-slate-500'
                          : isActive
                          ? 'bg-sky-700/80 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            disabled={!isAssessmentStarted}
            onClick={() => {
              if (!isAssessmentStarted) return;
              onTabChange('results');
            }}
            title={
              !isAssessmentStarted
                ? 'Locked: Complete registration on Mission Briefing first'
                : 'Go to Assessment Report & Receipt'
            }
            className={`hidden md:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded border transition-colors ${
              !isAssessmentStarted
                ? 'text-slate-500 bg-slate-900/40 border-slate-800 cursor-not-allowed opacity-50 select-none'
                : 'text-sky-300 hover:text-white bg-slate-800 hover:bg-slate-700 border-slate-700 cursor-pointer'
            }`}
          >
            {!isAssessmentStarted ? (
              <Lock className="w-3.5 h-3.5 text-amber-500/70" />
            ) : (
              <FileText className="w-3.5 h-3.5" />
            )}
            <span>{isLocked ? 'Assessment Receipt' : 'Final Assessment Screen'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
