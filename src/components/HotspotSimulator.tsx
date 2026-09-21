import React, { useState, useMemo } from 'react';
import { HOTSPOT_QUESTIONS, SHIPBOARD_APP_QUESTION } from '../data/assessmentData';
import { HotspotQuestion } from '../types';
import { CheckCircle2, XCircle, HelpCircle, ArrowRight, RotateCcw, Info, Monitor, Cpu, HardDrive, Network, Zap, Lock } from 'lucide-react';
import { shuffleArray } from '../utils/shuffle';

interface HotspotSimulatorProps {
  onScoreUpdate: (hardwareScore: number, shipboardAppScore: number) => void;
  onNext: () => void;
  savedAnswers?: Record<string, string>;
  savedAppAnswer?: string;
  onSaveAnswers?: (answers: Record<string, string>, appAnswer: string) => void;
  isLocked?: boolean;
}

export const HotspotSimulator: React.FC<HotspotSimulatorProps> = ({
  onScoreUpdate,
  onNext,
  savedAnswers = {},
  savedAppAnswer = '',
  onSaveAnswers,
  isLocked = false,
}) => {
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>(savedAnswers);
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const [shipboardAnswer, setShipboardAnswer] = useState<string>(savedAppAnswer);

  // Shuffle multiple-choice options for each question so the answer position is unpredictable
  const questionChoicesMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    HOTSPOT_QUESTIONS.forEach((q) => {
      map[q.id] = shuffleArray(q.choices);
    });
    return map;
  }, []);

  // Shuffle shipboard application choices
  const shuffledShipboardChoices = useMemo(() => {
    return shuffleArray(SHIPBOARD_APP_QUESTION.choices);
  }, []);

  const currentQ = HOTSPOT_QUESTIONS[activeQuestionIdx];

  // Calculate score
  const calculateScores = (answers: Record<string, string>, appAns: string) => {
    let hwPoints = 0;
    HOTSPOT_QUESTIONS.forEach((q) => {
      if (answers[q.id] === q.correctChoice) {
        hwPoints += 4; // 5 questions * 4 pts = 20 pts
      }
    });

    let appPoints = 0;
    if (appAns === SHIPBOARD_APP_QUESTION.correctAnswer) {
      appPoints = 10; // 10 pts
    }

    onScoreUpdate(hwPoints, appPoints);
  };

  const handleSelectChoice = (choice: string) => {
    if (isLocked) return;
    const nextAnswers = { ...userAnswers, [currentQ.id]: choice };
    setUserAnswers(nextAnswers);
    calculateScores(nextAnswers, shipboardAnswer);
    onSaveAnswers?.(nextAnswers, shipboardAnswer);
  };

  const handleHotspotClick = (componentKey: string) => {
    setSelectedHotspot(componentKey);
    // Find question matching this component
    const foundIdx = HOTSPOT_QUESTIONS.findIndex((q) => q.componentKey === componentKey);
    if (foundIdx !== -1) {
      setActiveQuestionIdx(foundIdx);
    }
  };

  const handleShipboardSelect = (key: string) => {
    if (isLocked) return;
    setShipboardAnswer(key);
    calculateScores(userAnswers, key);
    onSaveAnswers?.(userAnswers, key);
  };

  const currentAnswer = userAnswers[currentQ.id];
  const isAnswered = Boolean(currentAnswer);
  const isCorrect = currentAnswer === currentQ.correctChoice;

  const totalAnsweredCount = Object.keys(userAnswers).length;
  const isAllAnswered = totalAnsweredCount === HOTSPOT_QUESTIONS.length && shipboardAnswer !== '';

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-8">
      {/* Assessment Locked Notice Banner */}
      {isLocked && (
        <div className="bg-amber-50 border border-amber-300 text-amber-900 p-4 rounded-xl text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Assessment Finalized & Locked (Read-Only Mode):</strong> Your submitted answers are displayed below for review. Modifications are disabled.
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
              Activity 1 & 3: Hotspot Labelling & Identification
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Click on the highlighted component in the shipboard workstation schematic or choose the correct hardware name below.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
              Total: 30 Points (20 pts Activity 1 + 10 pts Activity 3)
            </span>
          </div>
        </div>

        {/* Progress Pills for Activity 1 */}
        <div className="mt-5 flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100">
          <span className="text-xs font-medium text-slate-500 mr-2">Components:</span>
          {HOTSPOT_QUESTIONS.map((q, idx) => {
            const ans = userAnswers[q.id];
            const isQAnswered = Boolean(ans);
            const isCurrent = idx === activeQuestionIdx;

            return (
              <button
                key={q.id}
                onClick={() => {
                  setActiveQuestionIdx(idx);
                  setSelectedHotspot(q.componentKey);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isCurrent
                    ? 'ring-2 ring-sky-500 bg-sky-50 text-sky-800 font-semibold'
                    : isQAnswered
                    ? 'bg-sky-50/80 text-sky-900 border border-sky-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{q.title}</span>
                {isQAnswered && (
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-600 inline-block" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Workstation Diagram + Selection Controls */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Schematic SVG */}
        <div className="lg:col-span-7 bg-slate-900 rounded-xl border border-slate-800 p-4 shadow-lg text-white">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-mono text-slate-300">TRADITIONAL DESKTOP COMPUTER SYSTEM & HARDWARE</span>
            </div>
            <span className="text-slate-400 text-[11px]">Click numbered hotspots to identify</span>
          </div>

          {/* SVG Canvas */}
          <div className="relative w-full aspect-[16/10] bg-slate-950 rounded-lg overflow-hidden mt-3 border border-slate-800 select-none">
            <svg
              viewBox="0 0 700 440"
              className="w-full h-full"
              style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))' }}
            >
              <defs>
                <linearGradient id="desk-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
                <linearGradient id="wall-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0a0f1d" />
                  <stop offset="100%" stopColor="#050811" />
                </linearGradient>
                <linearGradient id="screen-os-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="40%" stopColor="#0369a1" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
                <linearGradient id="case-body-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#182030" />
                  <stop offset="60%" stopColor="#0f172a" />
                  <stop offset="100%" stopColor="#090d16" />
                </linearGradient>
                <linearGradient id="mb-black-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#131d2a" />
                  <stop offset="100%" stopColor="#090e17" />
                </linearGradient>
                <linearGradient id="rgb-ram" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="50%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
                <linearGradient id="fan-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
              </defs>

              {/* Room Wall Background */}
              <rect width="700" height="350" fill="url(#wall-grad)" />

              {/* Desktop Table Surface */}
              <polygon points="0,350 700,350 700,440 0,440" fill="url(#desk-grad)" />
              <line x1="0" y1="350" x2="700" y2="350" stroke="#334155" strokeWidth="2" />
              <line x1="0" y1="352" x2="700" y2="352" stroke="#475569" strokeWidth="0.5" />

              {/* ======================================================== */}
              {/* 1. TRADITIONAL WIDESCREEN DESKTOP MONITOR (HOTSPOT 4)     */}
              {/* ======================================================== */}
              <g
                id="hotspot-monitor"
                onClick={() => handleHotspotClick('monitor')}
                className="cursor-pointer group"
              >
                {/* Monitor Desk Stand & Neck */}
                <ellipse cx="145" cy="348" rx="60" ry="12" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                <rect x="137" y="240" width="16" height="108" rx="3" fill="#1e293b" stroke="#334155" />

                {/* Monitor Outer Chassis & Slim Bezel */}
                <rect
                  x="20"
                  y="50"
                  width="250"
                  height="190"
                  rx="6"
                  fill="#090d16"
                  stroke={currentQ.componentKey === 'monitor' ? '#38bdf8' : '#334155'}
                  strokeWidth={currentQ.componentKey === 'monitor' ? '3' : '1.5'}
                />

                {/* Monitor Screen Surface */}
                <rect x="25" y="55" width="240" height="175" rx="3" fill="url(#screen-os-grad)" />

                {/* OS Desktop Wallpaper & Icons */}
                {/* Desktop Icons on left */}
                <rect x="32" y="65" width="10" height="10" rx="1.5" fill="#38bdf8" />
                <text x="46" y="73" fill="#e2e8f0" fontSize="6.5">This PC</text>

                <rect x="32" y="82" width="10" height="10" rx="1.5" fill="#f59e0b" />
                <text x="46" y="90" fill="#e2e8f0" fontSize="6.5">Documents</text>

                <rect x="32" y="99" width="10" height="10" rx="1.5" fill="#10b981" />
                <text x="46" y="107" fill="#e2e8f0" fontSize="6.5">Network</text>

                <rect x="32" y="116" width="10" height="10" rx="1.5" fill="#94a3b8" />
                <text x="46" y="124" fill="#e2e8f0" fontSize="6.5">Recycle Bin</text>

                {/* Open Application Window on Desktop */}
                <rect x="75" y="70" width="175" height="135" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="1" />
                {/* Window Title Bar */}
                <rect x="75" y="70" width="175" height="16" rx="4" fill="#1e293b" />
                <text x="82" y="81" fill="#f1f5f9" fontSize="7" fontWeight="bold">Device Manager - Traditional PC</text>
                <circle cx="232" cy="78" r="3" fill="#64748b" />
                <circle cx="240" cy="78" r="3" fill="#38bdf8" />
                <circle cx="247" cy="78" r="3" fill="#f43f5e" />

                {/* Window Inner Content */}
                <rect x="80" y="90" width="165" height="110" rx="2" fill="#090d16" />
                <text x="88" y="104" fill="#38bdf8" fontSize="7.5" fontWeight="bold">Operating System: Diagnostic Terminal</text>
                <text x="88" y="117" fill="#94a3b8" fontSize="7">&gt; System bus controller: Online</text>
                <text x="88" y="129" fill="#94a3b8" fontSize="7">&gt; Kernel interface link: Nominal</text>
                <text x="88" y="141" fill="#94a3b8" fontSize="7">&gt; Port arbitration: Synchronized</text>
                <text x="88" y="153" fill="#94a3b8" fontSize="7">&gt; Active task scheduler: Running</text>
                <text x="88" y="165" fill="#94a3b8" fontSize="7">&gt; Hardware scan status: Ready</text>

                {/* Desktop Taskbar at Screen Bottom */}
                <rect x="25" y="215" width="240" height="15" fill="#0a0f1d" />
                {/* Start Menu button */}
                <rect x="29" y="218" width="9" height="9" rx="1" fill="#0284c7" />
                {/* App pin icons */}
                <rect x="42" y="219" width="7" height="7" rx="1" fill="#38bdf8" />
                <rect x="52" y="219" width="7" height="7" rx="1" fill="#f59e0b" />
                <rect x="62" y="219" width="7" height="7" rx="1" fill="#10b981" />
                {/* System Tray Clock */}
                <text x="235" y="226" fill="#94a3b8" fontSize="6" fontFamily="monospace">12:00 PM</text>

                {/* Hotspot Indicator #4: DISPLAY / MONITOR */}
                <circle
                  cx="145"
                  cy="145"
                  r="16"
                  fill="#0284c7"
                  stroke="#38bdf8"
                  strokeWidth={currentQ.componentKey === 'monitor' ? '3' : '1.5'}
                />
                <text x="145" y="149" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
                  4
                </text>
              </g>

              {/* ======================================================== */}
              {/* 2. TRADITIONAL DESKTOP PC TOWER (MID-TOWER ATX CHASSIS)  */}
              {/* ======================================================== */}
              {/* Tower Outer Chassis */}
              <rect x="305" y="30" width="370" height="350" rx="8" fill="url(#case-body-grad)" stroke="#334155" strokeWidth="2.5" />

              {/* Case Front Panel (Right Side of Tower) */}
              <rect x="645" y="30" width="30" height="350" rx="4" fill="#0f172a" stroke="#1e293b" />
              {/* Power Button & I/O on Case Front */}
              <circle cx="660" cy="55" r="5" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
              <rect x="656" y="70" width="8" height="3" fill="#38bdf8" />
              <rect x="656" y="77" width="8" height="3" fill="#38bdf8" />
              <circle cx="660" cy="88" r="1.5" fill="#64748b" />
              {/* Front Mesh Air Intake */}
              <line x1="652" y1="110" x2="668" y2="110" stroke="#1e293b" strokeWidth="1.5" />
              <line x1="652" y1="120" x2="668" y2="120" stroke="#1e293b" strokeWidth="1.5" />
              <line x1="652" y1="130" x2="668" y2="130" stroke="#1e293b" strokeWidth="1.5" />
              <line x1="652" y1="140" x2="668" y2="140" stroke="#1e293b" strokeWidth="1.5" />
              <line x1="652" y1="150" x2="668" y2="150" stroke="#1e293b" strokeWidth="1.5" />

              {/* Tempered Glass Side Window View */}
              <rect x="312" y="38" width="330" height="334" rx="4" fill="#060911" stroke="#1e293b" />

              {/* Lower PSU Shroud Chamber */}
              <rect x="315" y="310" width="324" height="58" rx="3" fill="#0f172a" stroke="#1e293b" />
              <text x="325" y="338" fill="#64748b" fontSize="10" fontWeight="bold">ATX POWER SUPPLY (PSU 650W)</text>
              <text x="325" y="352" fill="#475569" fontSize="8">Power Cable Harness & Modular Bays</text>

              {/* Rear Case Exhaust Fan */}
              <circle cx="335" cy="115" r="20" fill="#090d16" stroke="#334155" />
              <circle cx="335" cy="115" r="6" fill="#1e293b" />

              {/* ======================================================== */}
              {/* 3. MOTHERBOARD (MAIN CIRCUIT BOARD) (HOTSPOT 1)          */}
              {/* ======================================================== */}
              <g
                id="hotspot-motherboard"
                onClick={() => handleHotspotClick('motherboard')}
                className="cursor-pointer group"
              >
                {/* ATX Motherboard PCB */}
                <rect
                  x="365"
                  y="55"
                  width="265"
                  height="250"
                  rx="5"
                  fill="url(#mb-black-grad)"
                  stroke={currentQ.componentKey === 'motherboard' ? '#38bdf8' : '#334155'}
                  strokeWidth={currentQ.componentKey === 'motherboard' ? '3' : '1.5'}
                />

                {/* Copper traces and motherboard aesthetics */}
                <path
                  d="M 380 75 L 420 75 L 435 95 M 480 70 L 520 70 L 540 85 M 380 230 L 410 230 L 430 260 M 520 280 L 580 280"
                  fill="none"
                  stroke="#1e3a5f"
                  strokeWidth="1.2"
                  opacity="0.8"
                />

                {/* VRM Aluminum Heatsinks on Motherboard */}
                <rect x="375" y="65" width="45" height="20" rx="2" fill="#334155" stroke="#475569" />
                <rect x="375" y="90" width="18" height="50" rx="2" fill="#334155" stroke="#475569" />

                {/* Chipset Heatsink (Bottom Right of Motherboard) */}
                <rect x="565" y="235" width="55" height="45" rx="3" fill="#1e293b" stroke="#334155" />
                <text x="592" y="260" textAnchor="middle" fill="#64748b" fontSize="8" fontWeight="bold">CHIPSET</text>

                {/* CPU Cooler / Fan inside Motherboard */}
                <g>
                  <circle cx="415" cy="120" r="32" fill="#090d16" stroke="#475569" strokeWidth="2" />
                  <circle cx="415" cy="120" r="28" fill="none" stroke="url(#fan-glow)" strokeWidth="2.5" opacity="0.8" />
                  <circle cx="415" cy="120" r="10" fill="#1e293b" stroke="#38bdf8" />
                  <text x="415" y="123" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">CPU</text>
                </g>

                {/* Hotspot Indicator #1 */}
                <circle
                  cx="540"
                  cy="95"
                  r="16"
                  fill="#059669"
                  stroke="#34d399"
                  strokeWidth={currentQ.componentKey === 'motherboard' ? '3' : '1.5'}
                />
                <text x="540" y="99" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
                  1
                </text>
              </g>

              {/* ======================================================== */}
              {/* 4. RAM (MEMORY MODULES / DIMM SLOTS) (HOTSPOT 2)         */}
              {/* ======================================================== */}
              <g
                id="hotspot-ram"
                onClick={() => handleHotspotClick('ram')}
                className="cursor-pointer group"
              >
                {/* 4 DIMM Slots, 2 populated with RGB/Metal RAM Sticks */}
                <rect x="460" y="80" width="10" height="80" rx="1.5" fill="#1e293b" stroke="#334155" />
                <rect
                  x="475"
                  y="75"
                  width="10"
                  height="90"
                  rx="2"
                  fill="#0f172a"
                  stroke={currentQ.componentKey === 'ram' ? '#38bdf8' : '#64748b'}
                  strokeWidth={currentQ.componentKey === 'ram' ? '2.5' : '1'}
                />
                <rect x="477" y="77" width="6" height="86" rx="1" fill="url(#rgb-ram)" />

                <rect x="490" y="80" width="10" height="80" rx="1.5" fill="#1e293b" stroke="#334155" />
                <rect
                  x="505"
                  y="75"
                  width="10"
                  height="90"
                  rx="2"
                  fill="#0f172a"
                  stroke={currentQ.componentKey === 'ram' ? '#38bdf8' : '#64748b'}
                  strokeWidth={currentQ.componentKey === 'ram' ? '2.5' : '1'}
                />
                <rect x="507" y="77" width="6" height="86" rx="1" fill="url(#rgb-ram)" />

                {/* Hotspot Indicator #2 */}
                <circle
                  cx="490"
                  cy="120"
                  r="16"
                  fill="#0d9488"
                  stroke="#2dd4bf"
                  strokeWidth={currentQ.componentKey === 'ram' ? '3' : '1.5'}
                />
                <text x="490" y="124" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
                  2
                </text>
              </g>

              {/* ======================================================== */}
              {/* 5. SSD (M.2 NVMe SOLID STATE DRIVE) (HOTSPOT 5)          */}
              {/* ======================================================== */}
              <g
                id="hotspot-ssd"
                onClick={() => handleHotspotClick('ssd')}
                className="cursor-pointer group"
              >
                {/* M.2 Socket and NVMe SSD Stick */}
                <rect
                  x="430"
                  y="180"
                  width="70"
                  height="22"
                  rx="2.5"
                  fill="#1e293b"
                  stroke={currentQ.componentKey === 'ssd' ? '#38bdf8' : '#64748b'}
                  strokeWidth={currentQ.componentKey === 'ssd' ? '2.5' : '1.5'}
                />
                {/* Aluminum Heatsink on SSD with ridges */}
                <rect x="435" y="183" width="58" height="16" rx="1.5" fill="#334155" />
                <line x1="445" y1="184" x2="445" y2="198" stroke="#475569" strokeWidth="1" />
                <line x1="455" y1="184" x2="455" y2="198" stroke="#475569" strokeWidth="1" />
                <line x1="465" y1="184" x2="465" y2="198" stroke="#475569" strokeWidth="1" />
                <line x1="475" y1="184" x2="475" y2="198" stroke="#475569" strokeWidth="1" />
                {/* Gold Pins & Mounting Screw */}
                <circle cx="496" cy="191" r="2.5" fill="#f59e0b" />

                {/* Hotspot Indicator #5 */}
                <circle
                  cx="465"
                  cy="191"
                  r="16"
                  fill="#6366f1"
                  stroke="#a5b4fc"
                  strokeWidth={currentQ.componentKey === 'ssd' ? '3' : '1.5'}
                />
                <text x="465" y="195" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
                  5
                </text>
              </g>

              {/* ======================================================== */}
              {/* 6. NIC (NETWORK INTERFACE CARD / ETHERNET) (HOTSPOT 3)   */}
              {/* ======================================================== */}
              <g
                id="hotspot-nic"
                onClick={() => handleHotspotClick('nic')}
                className="cursor-pointer group"
              >
                {/* PCIe Slot on Motherboard */}
                <rect x="380" y="225" width="130" height="8" rx="1" fill="#1e293b" stroke="#334155" />

                {/* Network Interface Card installed in PCIe slot */}
                <rect
                  x="375"
                  y="240"
                  width="120"
                  height="45"
                  rx="3"
                  fill="#064e3b"
                  stroke={currentQ.componentKey === 'nic' ? '#38bdf8' : '#059669'}
                  strokeWidth={currentQ.componentKey === 'nic' ? '2.5' : '1.5'}
                />

                {/* Controller Chip & RJ45 Ethernet port bracket on rear */}
                <rect x="375" y="240" width="8" height="45" fill="#64748b" />
                <rect x="368" y="248" width="10" height="15" fill="#334155" stroke="#94a3b8" />
                {/* Link & Activity LEDs on Ethernet port */}
                <circle cx="365" cy="252" r="2" fill="#22c55e" />
                <circle cx="365" cy="259" r="2" fill="#eab308" />

                {/* Network Cable leading out */}
                <path d="M 368 255 C 330 255, 320 300, 310 350" fill="none" stroke="#0284c7" strokeWidth="2.5" />

                <rect x="410" y="250" width="22" height="22" rx="2" fill="#0f172a" stroke="#047857" />
                <text x="421" y="264" textAnchor="middle" fill="#a7f3d0" fontSize="6.5">LAN</text>

                {/* Hotspot Indicator #3 */}
                <circle
                  cx="445"
                  cy="262"
                  r="16"
                  fill="#0284c7"
                  stroke="#38bdf8"
                  strokeWidth={currentQ.componentKey === 'nic' ? '3' : '1.5'}
                />
                <text x="445" y="266" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
                  3
                </text>
              </g>

              {/* ======================================================== */}
              {/* 7. DESKTOP PERIPHERALS: KEYBOARD & MOUSE ON DESK         */}
              {/* ======================================================== */}
              {/* Desktop Keyboard */}
              <rect x="40" y="375" width="220" height="42" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
              {/* Keycaps */}
              <line x1="45" y1="384" x2="255" y2="384" stroke="#1e293b" strokeWidth="4" strokeDasharray="5 3" />
              <line x1="45" y1="392" x2="255" y2="392" stroke="#1e293b" strokeWidth="4" strokeDasharray="5 3" />
              <line x1="45" y1="400" x2="255" y2="400" stroke="#1e293b" strokeWidth="4" strokeDasharray="5 3" />
              {/* Spacebar */}
              <rect x="100" y="406" width="90" height="6" rx="1.5" fill="#1e293b" stroke="#334155" />
              <text x="145" y="411" textAnchor="middle" fill="#64748b" fontSize="5.5">SPACEBAR</text>
              <text x="50" y="411" fill="#94a3b8" fontSize="6">USB KEYBOARD</text>

              {/* Mousepad & Optical Mouse */}
              <rect x="275" y="370" width="55" height="52" rx="4" fill="#1e293b" stroke="#334155" />
              <rect x="290" y="380" width="24" height="34" rx="12" fill="#0f172a" stroke="#475569" />
              <line x1="302" y1="380" x2="302" y2="392" stroke="#64748b" strokeWidth="1" />
              <rect x="300" y="384" width="4" height="6" rx="1" fill="#38bdf8" />
            </svg>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>Hover / Click on numbered hotspots 1-5 to examine component</span>
            <span className="font-mono text-sky-400">Active hotspot marker: #{activeQuestionIdx + 1}</span>
          </div>
        </div>

        {/* Right Column: Question & Multiple Choice Selection */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Question Box */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-sky-100 text-sky-800">
                Activity 1: Identify Component ({activeQuestionIdx + 1} of 5)
              </span>
              <span className="text-xs font-mono text-slate-500">4 Points</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 mb-5">
              <span className="text-xs text-slate-500 font-medium">Component description:</span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                &ldquo;{currentQ.description}&rdquo;
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Target hotspot: <strong className="text-slate-700">Hotspot #{activeQuestionIdx + 1}</strong>
              </p>
            </div>

            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Select the correct name:
              </p>
              {(questionChoicesMap[currentQ.id] || currentQ.choices).map((choice) => {
                const isSelected = currentAnswer === choice;

                let btnStyle = 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800';
                if (isSelected) {
                  btnStyle = 'border-sky-500 bg-sky-50 text-sky-900 font-medium ring-1 ring-sky-400';
                }

                return (
                  <button
                    key={choice}
                    disabled={isLocked}
                    onClick={() => handleSelectChoice(choice)}
                    className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all flex items-center justify-between ${
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

            {/* Assessment Confirmation Panel */}
            {isAnswered && (
              <div className="mt-5 p-3.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-sky-600" />
                  <span className="font-medium">Answer recorded for Part {activeQuestionIdx + 1}</span>
                </div>
                <span className="text-[11px] text-slate-500">Graded at final submission</span>
              </div>
            )}

            {/* Pagination between hotspot questions */}
            <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                disabled={activeQuestionIdx === 0}
                onClick={() => {
                  const prev = activeQuestionIdx - 1;
                  setActiveQuestionIdx(prev);
                  setSelectedHotspot(HOTSPOT_QUESTIONS[prev].componentKey);
                }}
                className="text-xs text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed font-medium px-3 py-1.5 rounded border border-slate-200 cursor-pointer"
              >
                Previous Part
              </button>
              <button
                disabled={activeQuestionIdx === HOTSPOT_QUESTIONS.length - 1}
                onClick={() => {
                  const next = activeQuestionIdx + 1;
                  setActiveQuestionIdx(next);
                  setSelectedHotspot(HOTSPOT_QUESTIONS[next].componentKey);
                }}
                className="text-xs text-white bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed font-medium px-3 py-1.5 rounded cursor-pointer"
              >
                Next Part
              </button>
            </div>
          </div>

          {/* Activity 3: Shipboard Application Question */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-indigo-100 text-indigo-800">
                Activity 3: Shipboard Application
              </span>
              <span className="text-xs font-mono text-slate-500">10 Points</span>
            </div>

            <h4 className="text-sm font-bold text-slate-900 mb-3">
              {SHIPBOARD_APP_QUESTION.question}
            </h4>

            <div className="space-y-2">
              {shuffledShipboardChoices.map((c) => {
                const isSelected = shipboardAnswer === c.key;

                let btnStyle = 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800';
                if (isSelected) {
                  btnStyle = 'border-sky-500 bg-sky-50 text-sky-900 font-medium ring-1 ring-sky-400';
                }

                return (
                  <button
                    key={c.key}
                    disabled={isLocked}
                    onClick={() => handleShipboardSelect(c.key)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg border text-xs transition-all flex items-center justify-between ${
                      isLocked ? 'cursor-default opacity-85' : 'cursor-pointer'
                    } ${btnStyle}`}
                  >
                    <span><strong>{c.key}.</strong> {c.text}</span>
                    {isSelected && (
                      <span className="text-[11px] font-semibold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                        Selected
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {shipboardAnswer && (
              <div className="mt-4 p-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-600" />
                  <span className="font-medium">Application response recorded</span>
                </div>
                <span className="text-[11px] text-slate-500">Graded at final submission</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="text-xs text-slate-500">
          Answered {totalAnsweredCount} of 5 components {shipboardAnswer ? '+ Activity 3 done' : ''}
        </div>
        <button
          id="btn-next-to-matching"
          onClick={onNext}
          className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold px-5 py-2.5 rounded-lg shadow transition cursor-pointer"
        >
          <span>Proceed to Simulator 2: Component Matching</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
