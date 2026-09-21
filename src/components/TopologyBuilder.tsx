import React, { useState, useRef } from 'react';
import { TopologyDevice, TopologyConnection, TopologyValidationResult } from '../types';
import {
  Network,
  Radio,
  Server as ServerIcon,
  Monitor,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Cable,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Info,
  Maximize2,
  Lock,
} from 'lucide-react';

interface TopologyBuilderProps {
  onScoreUpdate: (score: number) => void;
  onNext: () => void;
  savedConnections?: TopologyConnection[];
  onSaveConnections?: (conns: TopologyConnection[]) => void;
  isLocked?: boolean;
}

const INITIAL_DEVICES: TopologyDevice[] = [
  {
    id: 'ws-bridge',
    type: 'workstation-bridge',
    label: 'Bridge Workstation',
    category: 'workstation',
    x: 60,
    y: 50,
    iconName: 'Monitor',
    description: 'Bridge navigation and operations terminal',
  },
  {
    id: 'router',
    type: 'router',
    label: 'Router',
    category: 'infrastructure',
    x: 520,
    y: 70,
    iconName: 'Zap',
    description: 'Shipboard gateway router between external link and LAN',
  },
  {
    id: 'ws-engine',
    type: 'workstation-engine',
    label: 'Engine-Room Workstation',
    category: 'workstation',
    x: 60,
    y: 200,
    iconName: 'Monitor',
    description: 'Machinery automation & alarm monitoring terminal',
  },
  {
    id: 'server',
    type: 'server',
    label: 'Server',
    category: 'infrastructure',
    x: 520,
    y: 210,
    iconName: 'ServerIcon',
    description: 'Central shipboard database & log management server',
  },
  {
    id: 'switch',
    type: 'switch',
    label: 'Network Switch',
    category: 'infrastructure',
    x: 290,
    y: 330,
    iconName: 'Network',
    description: 'Central maritime managed switch distributing local traffic',
  },
  {
    id: 'ws-admin',
    type: 'workstation-admin',
    label: 'Administrative Workstation',
    category: 'workstation',
    x: 60,
    y: 340,
    iconName: 'Monitor',
    description: 'Shipboard administration computer',
  },
  {
    id: 'satellite',
    type: 'satellite',
    label: 'Satellite / Internet',
    category: 'external',
    x: 520,
    y: 340,
    iconName: 'Radio',
    description: 'Shipboard VSAT / Inmarsat external broadband connection',
  },
];

export const TopologyBuilder: React.FC<TopologyBuilderProps> = ({
  onScoreUpdate,
  onNext,
  savedConnections = [],
  onSaveConnections,
  isLocked = false,
}) => {
  const [devices, setDevices] = useState<TopologyDevice[]>(INITIAL_DEVICES);
  const [connections, setConnections] = useState<TopologyConnection[]>(savedConnections);
  const [connectingSourceId, setConnectingSourceId] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<TopologyValidationResult | null>(null);
  const [draggedDeviceId, setDraggedDeviceId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLDivElement>(null);

  // Validate the current topology against the exact rules
  const validateTopology = (conns: TopologyConnection[]): TopologyValidationResult => {
    const isConnected = (idA: string, idB: string) => {
      return conns.some(
        (c) =>
          (c.fromId === idA && c.toId === idB) ||
          (c.fromId === idB && c.toId === idA)
      );
    };

    const errors: string[] = [];
    const successes: string[] = [];
    let score = 0;

    // Rule 1: Connect all workstations to the network switch (15 pts: 5 pts each)
    const bridgeToSwitch = isConnected('ws-bridge', 'switch');
    const engineToSwitch = isConnected('ws-engine', 'switch');
    const adminToSwitch = isConnected('ws-admin', 'switch');

    if (bridgeToSwitch) {
      successes.push('Bridge workstation local area network link verified.');
      score += 5;
    } else {
      errors.push('Bridge workstation is missing required local network connectivity.');
    }

    if (engineToSwitch) {
      successes.push('Engine-room workstation local area network link verified.');
      score += 5;
    } else {
      errors.push('Engine-room workstation is missing required local network connectivity.');
    }

    if (adminToSwitch) {
      successes.push('Administrative workstation local area network link verified.');
      score += 5;
    } else {
      errors.push('Administrative workstation is missing required local network connectivity.');
    }

    // Rule 2: Connect the server to the network switch (5 pts)
    const serverToSwitch = isConnected('server', 'switch');
    if (serverToSwitch) {
      successes.push('Central server network connectivity verified.');
      score += 5;
    } else {
      errors.push('Central database server is missing required local network connectivity.');
    }

    // Rule 3: Connect the router to the network switch (5 pts)
    const routerToSwitch = isConnected('router', 'switch');
    if (routerToSwitch) {
      successes.push('Router internal gateway link verified.');
      score += 5;
    } else {
      errors.push('Gateway router is missing local network distribution connection.');
    }

    // Rule 4: Connect the router to the external communication link (5 pts)
    const routerToSat = isConnected('router', 'satellite');
    if (routerToSat) {
      successes.push('External satellite broadband uplink verified.');
      score += 5;
    } else {
      errors.push('External broadband satellite communication circuit is not connected to gateway router.');
    }

    // Rule 5: Avoid connecting workstations directly to satellite or internet link
    const illegalSatLinks = conns.filter(
      (c) =>
        (c.fromId === 'satellite' && c.toId !== 'router') ||
        (c.toId === 'satellite' && c.fromId !== 'router')
    );
    if (illegalSatLinks.length > 0) {
      errors.push('Cybersecurity violation: Direct link detected between internal host and external satellite circuit.');
      score = Math.max(0, score - 10);
    }

    const isValid = errors.length === 0;

    let feedback = '';
    if (isValid) {
      feedback =
        'Network layout validated. All shipboard workstations, the server, and the gateway router are properly integrated into the local area network with secure external satellite routing.';
    } else {
      feedback = 'Network topology criteria incomplete or invalid. Review requirements and correct cable routing.';
    }

    return {
      isValid,
      score: Math.min(30, Math.max(0, score)),
      maxScore: 30,
      errors,
      successes,
      feedback,
    };
  };

  const handleDeviceClick = (deviceId: string) => {
    if (isLocked) return;
    if (!connectingSourceId) {
      // Set as source
      setConnectingSourceId(deviceId);
    } else if (connectingSourceId === deviceId) {
      // Deselect
      setConnectingSourceId(null);
    } else {
      // Create connection between connectingSourceId and deviceId
      const exists = connections.some(
        (c) =>
          (c.fromId === connectingSourceId && c.toId === deviceId) ||
          (c.fromId === deviceId && c.toId === connectingSourceId)
      );

      let nextConns: TopologyConnection[] = [];
      if (exists) {
        // Remove connection if already exists
        nextConns = connections.filter(
          (c) =>
            !(
              (c.fromId === connectingSourceId && c.toId === deviceId) ||
              (c.fromId === deviceId && c.toId === connectingSourceId)
            )
        );
      } else {
        const newConn: TopologyConnection = {
          id: `c-${Date.now()}-${Math.random()}`,
          fromId: connectingSourceId,
          toId: deviceId,
        };
        nextConns = [...connections, newConn];
      }
      setConnections(nextConns);
      onSaveConnections?.(nextConns);
      const res = validateTopology(nextConns);
      onScoreUpdate(res.score);
      setConnectingSourceId(null);
    }
  };

  const handleRemoveConnection = (connId: string) => {
    if (isLocked) return;
    const next = connections.filter((c) => c.id !== connId);
    setConnections(next);
    onSaveConnections?.(next);
    const res = validateTopology(next);
    onScoreUpdate(res.score);
  };

  const handleClearAll = () => {
    if (isLocked) return;
    setConnections([]);
    setConnectingSourceId(null);
    setValidationResult(null);
    onScoreUpdate(0);
    onSaveConnections?.([]);
  };

  const handleSubmitTopology = () => {
    if (isLocked) return;
    const res = validateTopology(connections);
    setValidationResult(res);
    onScoreUpdate(res.score);
    onSaveConnections?.(connections);
  };

  // Dragging device nodes on canvas
  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    if (isLocked) return;
    e.stopPropagation();
    const dev = devices.find((d) => d.id === id);
    if (!dev || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setDraggedDeviceId(id);
    setDragOffset({
      x: (e.clientX - rect.left) - dev.x,
      y: (e.clientY - rect.top) - dev.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isLocked || !draggedDeviceId || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const newX = Math.max(20, Math.min(rect.width - 120, e.clientX - rect.left - dragOffset.x));
    const newY = Math.max(20, Math.min(rect.height - 80, e.clientY - rect.top - dragOffset.y));
    setDevices((prev) =>
      prev.map((d) => (d.id === draggedDeviceId ? { ...d, x: newX, y: newY } : d))
    );
  };

  const handleMouseUp = () => {
    setDraggedDeviceId(null);
  };

  // Helper to render device icons
  const renderDeviceIcon = (type: string) => {
    switch (type) {
      case 'satellite':
        return <Radio className="w-5 h-5 text-amber-500" />;
      case 'router':
        return <Zap className="w-5 h-5 text-sky-400" />;
      case 'switch':
        return <Network className="w-5 h-5 text-emerald-400" />;
      case 'server':
        return <ServerIcon className="w-5 h-5 text-indigo-400" />;
      default:
        return <Monitor className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-8">
      {/* Assessment Locked Notice Banner */}
      {isLocked && (
        <div className="bg-amber-50 border border-amber-300 text-amber-900 p-4 rounded-xl text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Assessment Finalized & Locked (Read-Only Mode):</strong> Your topology cabling layout has been recorded. Cabling tools and edits are disabled.
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
              Part 2: Computer Network Design (Topic 2)
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              Activity 4: Virtual Network Topology Builder
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Drag devices onto the workspace canvas and connect them with network cables according to shipboard network rules.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
              Score: 30 Points Total
            </span>
          </div>
        </div>

        {/* Toolbar & Rules quick bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <Cable className="w-4 h-4 text-sky-600 shrink-0" />
            <span>
              <strong>Cabler Tool:</strong> Click any device to select it as the cable origin, then click another device to link or disconnect.
            </span>
            {connectingSourceId && (
              <span className="ml-2 font-semibold text-sky-700 bg-sky-100 px-2 py-0.5 rounded animate-pulse">
                Wiring from: {devices.find((d) => d.id === connectingSourceId)?.label}
              </span>
            )}
          </div>

          {!isLocked && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleClearAll}
                className="flex items-center gap-1 text-slate-600 hover:text-rose-600 px-2.5 py-1 rounded bg-white border border-slate-200 hover:bg-rose-50 transition cursor-pointer"
                title="Clear all connections"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Cables</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Interactive Canvas & Validation Inspector */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left: Canvas Area */}
        <div className="lg:col-span-8 bg-slate-950 rounded-xl border border-slate-800 p-3 shadow-xl select-none">
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="font-mono text-slate-200 font-semibold">SHIPBOARD NETWORK TOPOLOGY WORKSPACE</span>
            </div>
            <span>Cables: <strong className="text-sky-400">{connections.length}</strong> active</span>
          </div>

          {/* Interactive Topology Board */}
          <div
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="relative w-full h-[450px] bg-slate-900 rounded-lg overflow-hidden mt-2 border border-slate-800"
            style={{
              backgroundImage: `radial-gradient(#1e293b 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}
          >
            {/* SVG Layer for Cables & Flow Pulses */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <defs>
                <linearGradient id="cable-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
                <linearGradient id="sat-cable-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>

              {connections.map((conn) => {
                const devA = devices.find((d) => d.id === conn.fromId);
                const devB = devices.find((d) => d.id === conn.toId);
                if (!devA || !devB) return null;

                // Center of device boxes (boxes are approx 90px wide, 55px high)
                const x1 = devA.x + 45;
                const y1 = devA.y + 28;
                const x2 = devB.x + 45;
                const y2 = devB.y + 28;

                const isSatLink = devA.id === 'satellite' || devB.id === 'satellite';
                const isRouterLink = devA.id === 'router' || devB.id === 'router';

                return (
                  <g key={conn.id}>
                    {/* Cable Shadow / Halo */}
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={isSatLink ? '#78350f' : '#0c4a6e'}
                      strokeWidth="6"
                      strokeLinecap="round"
                      opacity="0.4"
                    />
                    {/* Main Cable Line */}
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={isSatLink ? 'url(#sat-cable-grad)' : 'url(#cable-grad)'}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Data flow animated dot if valid */}
                    {validationResult?.isValid && (
                      <circle r="3.5" fill="#ffffff" filter="drop-shadow(0 0 4px #38bdf8)">
                        <animateMotion
                          path={`M ${x1} ${y1} L ${x2} ${y2}`}
                          dur="1.8s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                  </g>
                );
              })}

              {/* Temporary line while connecting */}
              {connectingSourceId && (
                <text x="15" y="25" fill="#38bdf8" fontSize="11" fontFamily="monospace">
                  CABLE ACTIVE: Select destination node to attach
                </text>
              )}
            </svg>

            {/* Draggable Device Nodes */}
            {devices.map((device) => {
              const isSource = connectingSourceId === device.id;
              const hasConnections = connections.some(
                (c) => c.fromId === device.id || c.toId === device.id
              );

              return (
                <div
                  key={device.id}
                  id={`dev-${device.id}`}
                  onMouseDown={(e) => handleMouseDown(e, device.id)}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeviceClick(device.id);
                  }}
                  style={{
                    left: `${device.x}px`,
                    top: `${device.y}px`,
                  }}
                  className={`absolute z-10 w-[90px] rounded-lg p-2 flex flex-col items-center justify-center transition-shadow cursor-pointer select-none text-center ${
                    isSource
                      ? 'bg-sky-900 border-2 border-sky-400 shadow-lg shadow-sky-500/50 ring-2 ring-sky-300'
                      : device.type === 'satellite'
                      ? 'bg-amber-950/80 border border-amber-600/70 hover:border-amber-400'
                      : device.type === 'switch'
                      ? 'bg-emerald-950/80 border border-emerald-600/70 hover:border-emerald-400'
                      : device.type === 'router'
                      ? 'bg-sky-950/80 border border-sky-600/70 hover:border-sky-400'
                      : device.type === 'server'
                      ? 'bg-indigo-950/80 border border-indigo-600/70 hover:border-indigo-400'
                      : 'bg-slate-800/90 border border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className="relative mb-1">
                    {renderDeviceIcon(device.type)}
                    {/* Link LED */}
                    <span
                      className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
                        hasConnections ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-slate-600'
                      }`}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-200 leading-tight">
                    {device.label}
                  </span>
                  <span className="text-[8px] text-slate-400 font-mono mt-0.5">
                    {device.category}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 px-2">
            <span>Click any node to attach cable • Drag nodes to reposition</span>
            <span className="font-mono text-slate-300">Ethernet Cat6 / VSAT Uplink</span>
          </div>
        </div>

        {/* Right: Validation Inspector & Rule Checker */}
        <div className="lg:col-span-4 space-y-5">
          {/* Rules Checklist */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              Assessment Topology Criteria
            </h3>

            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <span className="font-bold text-slate-400">•</span>
                <span>All local shipboard workstations must have functional local area network connectivity.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-slate-400">•</span>
                <span>The central database server must be accessible to shipboard network clients.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-slate-400">•</span>
                <span>External broadband satellite communications must be properly integrated through maritime network gateway infrastructure.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-slate-400">•</span>
                <span>Ensure maritime cybersecurity isolation—no unrouted direct links from workstations to external satellite circuits.</span>
              </li>
            </ul>

            {/* Submit Button */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <button
                id="btn-submit-topology"
                disabled={isLocked}
                onClick={handleSubmitTopology}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg text-xs shadow cursor-pointer transition flex items-center justify-center gap-2"
              >
                <Network className="w-4 h-4 text-sky-400" />
                <span>{isLocked ? 'Layout Locked (Submitted)' : 'Submit & Save Layout'}</span>
              </button>
            </div>
          </div>

          {/* Diagnostic Result Card */}
          {validationResult && (
            <div className="rounded-xl border border-sky-200 bg-sky-50/80 p-5 shadow-sm text-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm text-sky-950">
                  <div className="w-2.5 h-2.5 rounded-full bg-sky-600" />
                  <span>Network Topology Configuration Recorded</span>
                </div>
                <span className="text-[11px] font-semibold text-sky-800 bg-sky-100 px-2 py-0.5 rounded">
                  Recorded
                </span>
              </div>

              <p className="text-slate-700 leading-relaxed">
                Your shipboard cabling layout with <strong>{connections.length} active connection{connections.length !== 1 ? 's' : ''}</strong> has been logged for evaluation.
              </p>

              <div className="pt-2 border-t border-sky-200/80 flex items-center justify-between text-[11px] text-slate-500">
                <span>Active endpoints: {devices.filter(d => connections.some(c => c.fromId === d.id || c.toId === d.id)).length} of {devices.length}</span>
                <span>Evaluated on final results screen</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="text-xs text-slate-500">
          {validationResult
            ? 'Topology submitted and recorded. Proceed to Simulator 4.'
            : 'Establish connections according to network requirements, then submit.'}
        </div>
        <button
          id="btn-next-to-procedure"
          onClick={onNext}
          className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold px-5 py-2.5 rounded-lg shadow transition cursor-pointer"
        >
          <span>Proceed to Simulator 4: Checking & Handling</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
