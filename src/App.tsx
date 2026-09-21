import React, { useState, useEffect } from 'react';
import { AssessmentTab, CadetInfo, AssessmentScores, TopologyConnection } from './types';
import { Header } from './components/Header';
import { MissionBriefing } from './components/MissionBriefing';
import { HotspotSimulator } from './components/HotspotSimulator';
import { MatchingSimulator } from './components/MatchingSimulator';
import { TopologyBuilder } from './components/TopologyBuilder';
import { ProcedureSimulator } from './components/ProcedureSimulator';
import { ResultScreen } from './components/ResultScreen';
import { SubmissionConfirmationModal } from './components/SubmissionConfirmationModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<AssessmentTab>('briefing');
  const [isAssessmentStarted, setIsAssessmentStarted] = useState<boolean>(false);
  const [cadet, setCadet] = useState<CadetInfo>({
    name: '',
    cadetId: '',
    vessel: '',
    rank: 'BSMT Navigation Cadet',
  });

  const [scores, setScores] = useState<AssessmentScores>({
    hardwareIdentification: 0,
    componentFunctionMatching: 0,
    shipboardApplication: 0,
    networkLayoutConstruction: 0,
    networkCheckingProcedure: 0,
    correctHandlingSequence: 0,
  });

  // Assessment locking and receipt states
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [receiptNumber, setReceiptNumber] = useState<string>('HCDC-REC-2024-COME-84920');
  const [submissionTimestamp, setSubmissionTimestamp] = useState<string>('');

  // Persisted state for each simulator module
  const [savedHotspotAnswers, setSavedHotspotAnswers] = useState<Record<string, string>>({});
  const [savedHotspotAppAnswer, setSavedHotspotAppAnswer] = useState<string>('');
  const [savedMatches, setSavedMatches] = useState<Record<string, string>>({});
  const [savedConnections, setSavedConnections] = useState<TopologyConnection[]>([]);
  const [savedSituationAnswers, setSavedSituationAnswers] = useState<Record<string, string>>({});
  const [savedSequenceOrder, setSavedSequenceOrder] = useState<number[] | undefined>(undefined);

  const [timeRemaining, setTimeRemaining] = useState<number>(30 * 60); // 30 minutes
  const [timerActive, setTimerActive] = useState<boolean>(false); // Timer is paused until cadet starts assessment

  // Countdown timer effect (stops when exam is locked or pending start)
  useEffect(() => {
    if (!timerActive || isLocked || timeRemaining <= 0) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, isLocked, timeRemaining]);

  // Tab change handler with gating interceptors
  const handleTabChange = (targetTab: AssessmentTab) => {
    // Gate: Cadets cannot proceed to other pages until registration is complete and assessment started
    if (!isAssessmentStarted && targetTab !== 'briefing') {
      return;
    }

    if (targetTab === 'results') {
      if (!isLocked) {
        setShowConfirmModal(true);
        return;
      }
    }
    setCurrentTab(targetTab);
  };

  // Start Assessment action (triggered after validating cadet info)
  const handleStartAssessment = () => {
    if (!cadet.name.trim() || !cadet.cadetId.trim() || !cadet.vessel.trim() || !cadet.rank.trim()) {
      return;
    }
    setIsAssessmentStarted(true);
    setTimerActive(true);
    setCurrentTab('hotspot');
  };

  // Final confirmation action
  const handleConfirmSubmission = () => {
    const timestamp = new Date().toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'medium',
    });
    const generatedReceipt = `HCDC-REC-${new Date().getFullYear()}-COME-${Math.floor(10000 + Math.random() * 90000)}`;

    setIsLocked(true);
    setTimerActive(false);
    setSubmissionTimestamp(timestamp);
    setReceiptNumber(generatedReceipt);
    setShowConfirmModal(false);
    setCurrentTab('results');
  };

  const handleRestart = () => {
    if (window.confirm('Are you sure you want to restart the assessment from Mission Briefing? This will unlock the exam, reset the 30-minute timer, and clear scores.')) {
      setCurrentTab('briefing');
      setIsAssessmentStarted(false);
      setTimerActive(false);
      setTimeRemaining(30 * 60);
      setIsLocked(false);
      setShowConfirmModal(false);
      setScores({
        hardwareIdentification: 0,
        componentFunctionMatching: 0,
        shipboardApplication: 0,
        networkLayoutConstruction: 0,
        networkCheckingProcedure: 0,
        correctHandlingSequence: 0,
      });
      setSavedHotspotAnswers({});
      setSavedHotspotAppAnswer('');
      setSavedMatches({});
      setSavedConnections([]);
      setSavedSituationAnswers({});
      setSavedSequenceOrder(undefined);
    }
  };

  // Counts for readiness summary
  const answeredCounts = {
    hotspotCount: Object.keys(savedHotspotAnswers).length + (savedHotspotAppAnswer ? 1 : 0),
    matchingCount: Object.keys(savedMatches).length,
    topologyConfigured: savedConnections.length > 0,
    procedureCount: Object.keys(savedSituationAnswers).length,
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans antialiased selection:bg-sky-500 selection:text-white">
      {/* Persistent Navigation Header */}
      <Header
        currentTab={currentTab}
        onTabChange={handleTabChange}
        cadet={cadet}
        scores={scores}
        timeRemaining={timeRemaining}
        isLocked={isLocked}
        isAssessmentStarted={isAssessmentStarted}
      />

      {/* Main Assessment Body Viewport */}
      <main className="flex-1 w-full pb-12">
        {currentTab === 'briefing' && (
          <MissionBriefing
            cadet={cadet}
            onUpdateCadet={setCadet}
            onStart={handleStartAssessment}
            isAssessmentStarted={isAssessmentStarted}
          />
        )}

        {currentTab === 'hotspot' && (
          <HotspotSimulator
            onScoreUpdate={(hwScore, shipScore) => {
              setScores((prev) => ({
                ...prev,
                hardwareIdentification: hwScore,
                shipboardApplication: shipScore,
              }));
            }}
            onNext={() => setCurrentTab('matching')}
            savedAnswers={savedHotspotAnswers}
            savedAppAnswer={savedHotspotAppAnswer}
            onSaveAnswers={(answers, appAns) => {
              setSavedHotspotAnswers(answers);
              setSavedHotspotAppAnswer(appAns);
            }}
            isLocked={isLocked}
          />
        )}

        {currentTab === 'matching' && (
          <MatchingSimulator
            onScoreUpdate={(matchScore) => {
              setScores((prev) => ({
                ...prev,
                componentFunctionMatching: matchScore,
              }));
            }}
            onNext={() => setCurrentTab('topology')}
            savedMatches={savedMatches}
            onSaveMatches={(matches) => setSavedMatches(matches)}
            isLocked={isLocked}
          />
        )}

        {currentTab === 'topology' && (
          <TopologyBuilder
            onScoreUpdate={(topologyScore) => {
              setScores((prev) => ({
                ...prev,
                networkLayoutConstruction: topologyScore,
              }));
            }}
            onNext={() => setCurrentTab('procedure')}
            savedConnections={savedConnections}
            onSaveConnections={(conns) => setSavedConnections(conns)}
            isLocked={isLocked}
          />
        )}

        {currentTab === 'procedure' && (
          <ProcedureSimulator
            onScoreUpdate={(checkingScore, seqScore) => {
              setScores((prev) => ({
                ...prev,
                networkCheckingProcedure: checkingScore,
                correctHandlingSequence: seqScore,
              }));
            }}
            onFinish={() => handleTabChange('results')}
            savedSituationAnswers={savedSituationAnswers}
            savedSequenceOrder={savedSequenceOrder}
            onSaveState={(sitAnswers, seqOrder) => {
              setSavedSituationAnswers(sitAnswers);
              setSavedSequenceOrder(seqOrder);
            }}
            isLocked={isLocked}
          />
        )}

        {currentTab === 'results' && (
          <ResultScreen
            cadet={cadet}
            scores={scores}
            onNavigateTab={(tab) => setCurrentTab(tab)}
            onRestart={handleRestart}
            submissionTimestamp={submissionTimestamp}
            receiptNumber={receiptNumber}
            isLocked={isLocked}
          />
        )}
      </main>

      {/* Submission Confirmation Modal Gate */}
      <SubmissionConfirmationModal
        isOpen={showConfirmModal}
        cadet={cadet}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSubmission}
        answeredCounts={answeredCounts}
      />

      {/* Footer info banner */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-4 px-4 text-center print:hidden">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span>Holy Cross of Davao College • College of Maritime Education (COME) • BSMT Program</span>
          <span>Coverage: Topic 1 (Hardware & Functions) & Topic 2 (Shipboard Network Topology & Handling)</span>
        </div>
      </footer>
    </div>
  );
}
