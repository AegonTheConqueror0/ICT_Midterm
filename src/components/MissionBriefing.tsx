import React, { useState } from 'react';
import { CadetInfo } from '../types';
import { Compass, CheckCircle2, ArrowRight, Shield, Cpu, Network, Wrench, Layers, AlertCircle, Lock, Play, UserCheck } from 'lucide-react';
import { HcdcSchoolLogo, ComeProgramLogo, DualInstitutionalHeader } from './Logos';

interface MissionBriefingProps {
  cadet: CadetInfo;
  onUpdateCadet: (info: CadetInfo) => void;
  onStart: () => void;
  isAssessmentStarted?: boolean;
}

export const MissionBriefing: React.FC<MissionBriefingProps> = ({
  cadet,
  onUpdateCadet,
  onStart,
  isAssessmentStarted = false,
}) => {
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState<boolean>(false);

  const nameError = !cadet.name || !cadet.name.trim();
  const cadetIdError = !cadet.cadetId || !cadet.cadetId.trim();
  const vesselError = !cadet.vessel || !cadet.vessel.trim();
  const rankError = !cadet.rank || !cadet.rank.trim();

  const isFormValid = !nameError && !cadetIdError && !vesselError && !rankError;

  const handleStartClick = () => {
    if (!isFormValid) {
      setHasAttemptedSubmit(true);
      const firstInvalid = document.querySelector<HTMLInputElement>('.cadet-field-invalid');
      if (firstInvalid) {
        firstInvalid.focus();
      }
      return;
    }
    onStart();
  };

  const handleQuickFillSample = () => {
    onUpdateCadet({
      name: 'Cadet Edgardo Rojas',
      cadetId: '2024-COME-0192',
      vessel: 'T/S Kapitan Felix Oca',
      rank: 'BSMT Navigation Cadet',
    });
    setHasAttemptedSubmit(false);
  };
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Official Institutional Banner with School & Program Logos */}
      <div className="mb-8">
        <DualInstitutionalHeader variant="full" />
      </div>

      {/* Title & Badge */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-100 text-sky-900 text-xs font-bold tracking-wide uppercase mb-3 border border-sky-200 shadow-xs">
          <span>HCDC ICT • BSMT Midterm Examination</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-serif">
          Shipboard Computer Hardware and Network Design
        </h1>
        <p className="mt-2 text-base text-slate-600 max-w-2xl mx-auto font-medium">
          Bachelor of Science in Marine Transportation (BSMT) Interactive Laboratory Assessment covering Topic 1 and Topic 2.
        </p>
      </div>

      {/* Mission Briefing Callout */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-sky-950 text-white rounded-xl p-6 sm:p-8 shadow-xl border border-sky-800/50 mb-8 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-8 translate-y-8 pointer-events-none">
          <Compass className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Shield className="w-4 h-4" />
            Official BSMT Mission Briefing
          </div>
          <p className="text-lg sm:text-xl font-medium leading-relaxed text-slate-100">
            &ldquo;You are assigned as a BSMT ICT support cadet aboard a maritime training vessel. Your task is to identify computer hardware, connect the correct network devices, create a shipboard network layout, and verify that the system is properly connected.&rdquo;
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <div className="bg-white/10 px-3 py-1.5 rounded backdrop-blur border border-white/10">
              <strong className="text-sky-300">College:</strong> College of Maritime Education 
            </div>
            <div className="bg-white/10 px-3 py-1.5 rounded backdrop-blur border border-white/10">
              <strong className="text-emerald-300">Degree Program:</strong> BSMT
            </div>
            <div className="bg-white/10 px-3 py-1.5 rounded backdrop-blur border border-white/10">
              <strong className="text-white">Coverage:</strong> Topic 1 & Topic 2
            </div>
            <div className="bg-white/10 px-3 py-1.5 rounded backdrop-blur border border-white/10">
              <strong className="text-white">Estimated Time:</strong> 30 Minutes
            </div>
            <div className="bg-white/10 px-3 py-1.5 rounded backdrop-blur border border-white/10">
              <strong className="text-white">Total Points:</strong> 100 Points
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Structure Overview */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-sky-300 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-sky-50 text-sky-600">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Part 1: Hotspot Labelling (30 pts)</h3>
              <p className="text-xs text-slate-500">Activity 1 (20 pts) & Activity 3 (10 pts)</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Clickable diagram of computer hardware (Motherboard, RAM, NIC, Monitor, SSD) plus shipboard bridge application validation.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-sky-300 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Part 1: Component Matching (15 pts)</h3>
              <p className="text-xs text-slate-500">Activity 2 (15 pts)</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Interactive drag-and-drop / connector matching linking hardware components (CPU, RAM, SSD, NIC, etc.) to operational functions.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-sky-300 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Part 2: Network Topology Builder (30 pts)</h3>
              <p className="text-xs text-slate-500">Activity 4 (30 pts)</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Drag devices (Bridge, Engine, Admin, Server, Switch, Router, Satellite) and wire network cables with automated rule validation.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-sky-300 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Part 3: Checking & Handling (25 pts)</h3>
              <p className="text-xs text-slate-500">Activity 5 (15 pts) & Activity 6 (10 pts)</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Troubleshoot 5 shipboard fault scenarios and sequence the 6-step maritime equipment handling protocol.
          </p>
        </div>
      </div>

      {/* Candidate Registration Details */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-sky-100 text-sky-700">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Cadet Assessment Credentials
              </h3>
              <p className="text-xs text-slate-500">
                Official Midterm Examination for College of Maritime Education (COME) ICT: Laboratory Exercise
              </p>
            </div>
          </div>

          {!isAssessmentStarted && (
            <button
              type="button"
              onClick={handleQuickFillSample}
              className="inline-flex items-center gap-1.5 text-xs text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-2.5 py-1.5 rounded-lg transition font-medium cursor-pointer"
              title="Quick-fill sample candidate details for examination testing"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Fill Sample BSMT Cadet</span>
            </button>
          )}
        </div>

        {/* Informational Banner */}
        {!isAssessmentStarted ? (
          <div className="mb-5 bg-amber-50 border border-amber-200 rounded-lg p-3.5 flex items-start gap-3 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="font-semibold block text-amber-950 mb-0.5">
                Mandatory Candidate Verification (Assessment Locked)
              </strong>
              You are strictly required to fill out your complete cadet credentials below before proceeding to any assessment sections. 
              The <strong>30-minute exam timer will begin immediately</strong> when you click &ldquo;Start Laboratory Assessment&rdquo;.
            </div>
          </div>
        ) : (
          <div className="mb-5 bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center gap-2.5 text-xs text-emerald-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">
              Cadet credentials registered. Your 30-minute laboratory examination is currently active.
            </span>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name (Cadet) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="cadet-name-input"
              value={cadet.name}
              disabled={isAssessmentStarted}
              onChange={(e) => {
                onUpdateCadet({ ...cadet, name: e.target.value });
              }}
              className={`w-full text-sm border rounded-lg px-3 py-2 text-slate-900 focus:outline-none transition ${
                hasAttemptedSubmit && nameError
                  ? 'border-rose-500 bg-rose-50/20 ring-2 ring-rose-200 cadet-field-invalid'
                  : 'border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500'
              } ${isAssessmentStarted ? 'bg-slate-50 text-slate-600 cursor-not-allowed' : 'bg-white'}`}
              placeholder="e.g. Juan Dela Cruz"
            />
            {hasAttemptedSubmit && nameError && (
              <p className="mt-1 text-[11px] text-rose-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3 h-3 inline" />
                Cadet Full Name is required before starting.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Student / Cadet ID <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="cadet-id-input"
              value={cadet.cadetId}
              disabled={isAssessmentStarted}
              onChange={(e) => {
                onUpdateCadet({ ...cadet, cadetId: e.target.value });
              }}
              className={`w-full text-sm border rounded-lg px-3 py-2 text-slate-900 focus:outline-none font-mono transition ${
                hasAttemptedSubmit && cadetIdError
                  ? 'border-rose-500 bg-rose-50/20 ring-2 ring-rose-200 cadet-field-invalid'
                  : 'border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500'
              } ${isAssessmentStarted ? 'bg-slate-50 text-slate-600 cursor-not-allowed' : 'bg-white'}`}
              placeholder="e.g. 2024-COME-0192"
            />
            {hasAttemptedSubmit && cadetIdError && (
              <p className="mt-1 text-[11px] text-rose-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3 h-3 inline" />
                Student / Cadet ID is required before starting.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Training Vessel / Simulator Station <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="cadet-vessel-input"
              value={cadet.vessel}
              disabled={isAssessmentStarted}
              onChange={(e) => {
                onUpdateCadet({ ...cadet, vessel: e.target.value });
              }}
              className={`w-full text-sm border rounded-lg px-3 py-2 text-slate-900 focus:outline-none transition ${
                hasAttemptedSubmit && vesselError
                  ? 'border-rose-500 bg-rose-50/20 ring-2 ring-rose-200 cadet-field-invalid'
                  : 'border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500'
              } ${isAssessmentStarted ? 'bg-slate-50 text-slate-600 cursor-not-allowed' : 'bg-white'}`}
              placeholder="e.g. T/S Kapitan Felix Oca or Simulator Station Alpha"
            />
            {hasAttemptedSubmit && vesselError && (
              <p className="mt-1 text-[11px] text-rose-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3 h-3 inline" />
                Training Vessel / Station is required before starting.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Rank / Designation <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="cadet-rank-input"
              value={cadet.rank}
              disabled={isAssessmentStarted}
              onChange={(e) => {
                onUpdateCadet({ ...cadet, rank: e.target.value });
              }}
              className={`w-full text-sm border rounded-lg px-3 py-2 text-slate-900 focus:outline-none transition ${
                hasAttemptedSubmit && rankError
                  ? 'border-rose-500 bg-rose-50/20 ring-2 ring-rose-200 cadet-field-invalid'
                  : 'border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500'
              } ${isAssessmentStarted ? 'bg-slate-50 text-slate-600 cursor-not-allowed' : 'bg-white'}`}
              placeholder="e.g. BSMT Navigation Cadet / Deck Cadet"
            />
            {hasAttemptedSubmit && rankError && (
              <p className="mt-1 text-[11px] text-rose-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3 h-3 inline" />
                Rank / Designation is required before starting.
              </p>
            )}
          </div>

          <div className="col-span-1 sm:col-span-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 bg-sky-50/60 p-2.5 rounded-lg border border-sky-100">
            <span className="font-semibold text-slate-800">
              Academic Program:
            </span>
            <span className="font-bold text-sky-900 bg-sky-200/80 px-2.5 py-0.5 rounded border border-sky-300">
              Bachelor of Science in Marine Transportation
            </span>
          </div>
        </div>
      </div>

      {/* Start Button & Validation Gate */}
      <div className="text-center">
        {hasAttemptedSubmit && !isFormValid && (
          <div className="max-w-lg mx-auto mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs font-semibold flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Please complete all required cadet information above to start the assessment.</span>
          </div>
        )}

        <button
          id="btn-start-laboratory"
          onClick={handleStartClick}
          className={`inline-flex items-center justify-center gap-3 font-semibold px-8 py-3.5 rounded-xl shadow-lg transition-all text-base hover:scale-[1.01] active:scale-[0.99] cursor-pointer ${
            isAssessmentStarted
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25'
              : !isFormValid && hasAttemptedSubmit
              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/25'
              : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/25'
          }`}
        >
          {isAssessmentStarted ? (
            <>
              <span>Resume Laboratory Assessment</span>
              <ArrowRight className="w-5 h-5" />
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span>Start Laboratory Assessment (Begin 30:00 Timer)</span>
            </>
          )}
        </button>

        <p className="mt-2.5 text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          {!isAssessmentStarted
            ? 'Candidate details will be validated before launch. The 30-minute exam timer will start immediately, and all assessment tabs will unlock.'
            : 'Your answers and progress are tracked in real-time. You may navigate freely between the unlocked assessment tabs.'}
        </p>
      </div>
    </div>
  );
};
