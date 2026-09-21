import React, { useState } from 'react';
import { CadetInfo } from '../types';
import {
  AlertTriangle,
  Lock,
  CheckCircle2,
  FileCheck,
  ShieldAlert,
  ArrowRight,
  X,
  Layers,
  Cpu,
  Network,
  Wrench,
} from 'lucide-react';
import { HcdcSchoolLogo, ComeProgramLogo } from './Logos';

interface SubmissionConfirmationModalProps {
  isOpen: boolean;
  cadet: CadetInfo;
  onClose: () => void;
  onConfirm: () => void;
  answeredCounts: {
    hotspotCount: number;
    matchingCount: number;
    topologyConfigured: boolean;
    procedureCount: number;
  };
}

export const SubmissionConfirmationModal: React.FC<SubmissionConfirmationModalProps> = ({
  isOpen,
  cadet,
  onClose,
  onConfirm,
  answeredCounts,
}) => {
  const [hasAgreed, setHasAgreed] = useState<boolean>(false);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Modal Top Color Bar */}
        <div className="h-2 bg-gradient-to-r from-amber-500 via-sky-600 to-emerald-500" />

        {/* Modal Header with Official Logos */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex items-center -space-x-2 shrink-0 p-1 bg-slate-100 rounded-xl border border-slate-200">
              <HcdcSchoolLogo className="w-9 h-9" />
              <ComeProgramLogo className="w-10 h-10 drop-shadow-xs" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  COME • BSMT Program
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Submission Gate
                </span>
              </div>
              <h3 id="confirm-modal-title" className="text-lg font-bold text-slate-900 mt-1">
                Confirm Assessment Final Submission
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Holy Cross of Davao College • College of Maritime Education (COME)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs text-slate-700">
          {/* Prominent Warning Callout */}
          <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
              <Lock className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Assessment Will Be Permanently Locked</span>
            </div>
            <p className="leading-relaxed">
              Once you confirm your submission, <strong>your answers cannot be edited, modified, or re-wired</strong>. The assessment will transition into read-only mode and your official examination results & receipt will be generated.
            </p>
          </div>

          {/* Module Readiness Summary */}
          <div className="space-y-2">
            <span className="font-semibold text-slate-900 uppercase tracking-wide text-[11px]">
              Module Completion Summary:
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2.5">
                <Cpu className="w-4 h-4 text-sky-600 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900 text-[11px]">Part 1: Hotspots</div>
                  <div className="text-[10px] text-slate-500">
                    {answeredCounts.hotspotCount} / 5 Questions Logged
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-indigo-600 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900 text-[11px]">Part 2: Matching</div>
                  <div className="text-[10px] text-slate-500">
                    {answeredCounts.matchingCount} / 6 Functions Paired
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2.5">
                <Network className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900 text-[11px]">Part 3: Topology</div>
                  <div className="text-[10px] text-slate-500">
                    {answeredCounts.topologyConfigured ? 'Cables Wired & Configured' : 'Topology Ready'}
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2.5">
                <Wrench className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900 text-[11px]">Part 4: Procedures</div>
                  <div className="text-[10px] text-slate-500">
                    {answeredCounts.procedureCount} / 5 Scenarios Checked
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cadet Verification Agreement Checkbox */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 cursor-pointer transition select-none">
              <input
                type="checkbox"
                id="checkbox-confirm-lock"
                checked={hasAgreed}
                onChange={(e) => setHasAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
              />
              <span className="text-xs text-slate-800 leading-relaxed">
                I, <strong>{cadet.name || 'Candidate Cadet'}</strong> (BSMT Cadet ID:{' '}
                <span className="font-mono">{cadet.cadetId || '2024-COME-0192'}</span>), confirm that I have reviewed my answers across all assessment sections and formally agree to finalize my submission. I understand that my answers will be locked immediately and cannot be modified.
              </span>
            </label>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-6 pt-3 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer transition"
          >
            Return to Review Answers
          </button>

          <button
            id="btn-confirm-final-submission"
            disabled={!hasAgreed}
            onClick={onConfirm}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold shadow transition ${
              hasAgreed
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer ring-1 ring-emerald-400'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Finalize & Generate Receipt</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
