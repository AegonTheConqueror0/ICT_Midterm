import React, { useRef, useState } from 'react';
import { CadetInfo, AssessmentScores, AssessmentTab } from '../types';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Printer,
  RotateCcw,
  Shield,
  FileCheck,
  ChevronRight,
  Lock,
  Calendar,
  UserCheck,
  Building2,
  FileText,
  Clock,
  ExternalLink,
  Download,
  Loader2,
  FileDown,
} from 'lucide-react';
import { HcdcSchoolLogo, ComeProgramLogo } from './Logos';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

const signatureAssets = import.meta.glob<{ default: string }>(
  '../assets/images/*',
  { eager: true }
);

function resolveSignatureAsset(candidates: string[], fallbackPublicUrl: string): string {
  for (const name of candidates) {
    const key = `../assets/images/${name}`;
    if (signatureAssets[key]?.default) {
      return signatureAssets[key].default;
    }
  }
  return fallbackPublicUrl;
}

const assessorSignatureUrl = resolveSignatureAsset(
  ['edgardo_rojas_signature.svg', 'edgardo_rojas_signature.png', 'edgardo_signature.svg'],
  '/assets/images/edgardo_rojas_signature.svg'
);

const AssessorSignature: React.FC<{ className?: string }> = ({ className = 'w-32 h-20' }) => {
  const [imgError, setImgError] = useState<boolean>(false);
  const [currentSrc, setCurrentSrc] = useState<string>(assessorSignatureUrl);

  const handleError = () => {
    if (currentSrc !== '/assets/images/edgardo_rojas_signature.svg') {
      setCurrentSrc('/assets/images/edgardo_rojas_signature.svg');
    } else {
      setImgError(true);
    }
  };

  if (imgError) {
    return (
      <svg
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
        aria-label="Edgardo Rojas Signature"
      >
        <g
          stroke="#3730a3"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <path
            d="M 120,195
               C 100,190 90,180 110,175
               C 135,170 160,180 190,170
               C 210,163 225,140 240,115
               C 258,82 285,55 320,60
               C 350,65 362,95 340,120
               C 320,142 295,152 268,160
               C 240,168 210,172 182,180"
          />
          <path
            d="M 200,75
               L 200,330
               C 200,345 188,358 172,352
               C 158,347 152,328 160,310
               C 170,288 190,278 200,260"
          />
          <path
            d="M 118,192
               C 145,185 170,180 200,175
               L 370,80"
          />
        </g>
      </svg>
    );
  }

  return (
    <img
      src={currentSrc}
      alt="Edgardo Rojas - Authorized Signature"
      crossOrigin="anonymous"
      className={`object-contain shrink-0 ${className}`}
      onError={handleError}
      referrerPolicy="no-referrer"
      loading="eager"
    />
  );
};

interface ResultScreenProps {
  cadet: CadetInfo;
  scores: AssessmentScores;
  onNavigateTab: (tab: AssessmentTab) => void;
  onRestart: () => void;
  submissionTimestamp?: string;
  receiptNumber?: string;
  isLocked?: boolean;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  cadet,
  scores,
  onNavigateTab,
  onRestart,
  submissionTimestamp,
  receiptNumber = 'HCDC-REC-2024-ICTLab-84920',
  isLocked = true,
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  const totalScore =
    scores.hardwareIdentification +
    scores.componentFunctionMatching +
    scores.shipboardApplication +
    scores.networkLayoutConstruction +
    scores.networkCheckingProcedure +
    scores.correctHandlingSequence;

  // Rating and Status computation based on 70% passing threshold
  let rating = 'Unsatisfactory';
  let status = 'Needs Remediation';
  let statusBadgeStyle = 'text-rose-800 bg-rose-50 border-rose-300';
  let statusIcon = <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />;

  if (totalScore >= 85) {
    rating = 'Satisfactory';
    status = 'Passed (High Distinction)';
    statusBadgeStyle = 'text-emerald-800 bg-emerald-50 border-emerald-300';
    statusIcon = <Award className="w-5 h-5 text-emerald-600 shrink-0" />;
  } else if (totalScore >= 70) {
    rating = 'Satisfactory';
    status = 'Passed (Competent)';
    statusBadgeStyle = 'text-sky-800 bg-sky-50 border-sky-300';
    statusIcon = <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0" />;
  }

  // Dynamic strengths generation based on scores
  const strengths: string[] = [];
  if (scores.hardwareIdentification >= 16) {
    strengths.push('Demonstrated strong mastery in identifying core workstation components (Motherboard, CPU, RAM, PSU, NIC).');
  }
  if (scores.componentFunctionMatching >= 12) {
    strengths.push('Accurately articulated functional operational roles across storage, volatile memory, and network interfaces.');
  }
  if (scores.shipboardApplication === 10) {
    strengths.push('Understands critical maritime application requirements and isolation of bridge navigation systems.');
  }
  if (scores.networkLayoutConstruction >= 25) {
    strengths.push('Successfully constructed shipboard star topology with proper router gateway and switch cabling.');
  }
  if (scores.networkCheckingProcedure >= 12) {
    strengths.push('Accurately diagnosed fault symptoms and determined correct maritime corrective maintenance actions.');
  }
  if (scores.correctHandlingSequence >= 8) {
    strengths.push('Correctly sequenced the 6-step standard equipment handling and safety verification procedure.');
  }
  if (strengths.length === 0) {
    strengths.push('Successfully attempted all four practical laboratory simulators under timed exam conditions.');
  }

  // Dynamic improvement points
  const improvements: string[] = [];
  if (scores.hardwareIdentification < 16) {
    improvements.push('Review physical form factors and internal bus connections of Motherboard, RAM slots, and NIC adapters.');
  }
  if (scores.componentFunctionMatching < 12) {
    improvements.push('Reinforce theoretical distinction between volatile high-speed cache/RAM and persistent SSD storage.');
  }
  if (scores.networkLayoutConstruction < 25) {
    improvements.push('Review shipboard network gateway design: all client stations must route via the central network switch.');
    improvements.push('Verify isolation between shipboard administrative terminals and raw satellite broadband links.');
  }
  if (scores.networkCheckingProcedure < 12) {
    improvements.push('Review troubleshooting methods for physical link layer disconnects and power supply verification.');
  }
  if (scores.correctHandlingSequence < 8) {
    improvements.push('Memorize the 6-stage maritime equipment handling procedure: Inspection → Disconnection → Cleaning → Grounding → Testing → Reporting.');
  }
  if (improvements.length === 0) {
    improvements.push('Maintain high standards of maritime cyber-hygiene and adherence to IMO MSC cyber risk guidelines.');
  }

  // PDF Direct Download Handler
  const handleDownloadPdf = async () => {
    if (!printRef.current || isGeneratingPdf) return;
    setIsGeneratingPdf(true);

    try {
      const element = printRef.current;

      // Render high-DPI canvas capture of the receipt element
      const canvas = await html2canvas(element, {
        scale: 2, // Crisp 2x retina clarity
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth || 900,
      });

      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 8; // 8mm margin
      const contentWidth = pdfWidth - margin * 2;
      const contentHeight = (canvas.height * contentWidth) / canvas.width;

      // If content fits comfortably on 1 page (up to available height), render single page
      if (contentHeight <= pdfHeight - margin * 2) {
        pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, contentHeight);
      } else {
        // Multi-page segmented slicing
        let heightLeft = contentHeight;
        let position = margin;

        pdf.addImage(imgData, 'PNG', margin, position, contentWidth, contentHeight);
        heightLeft -= (pdfHeight - margin * 2);

        while (heightLeft > 0) {
          position = position - (pdfHeight - margin * 2);
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', margin, position, contentWidth, contentHeight);
          heightLeft -= (pdfHeight - margin * 2);
        }
      }

      const safeName = (cadet.name || 'Cadet').replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `HCDC_ICTLab_BSMT_Receipt_${safeName}_${receiptNumber}.pdf`;
      pdf.save(filename);
    } catch (err) {
      console.error('Direct PDF export encountered an issue, triggering system print fallback:', err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Browser Print handler
  const handlePrint = () => {
    window.print();
  };

  const formattedDate = submissionTimestamp || new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  });

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6 print:py-0 print:px-0 print:m-0 print:max-w-none">
      {/* Top Action Bar (Hidden in Print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs print:hidden">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <span>Assessment Completed & Locked</span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Verified Receipt
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Receipt No: <span className="font-mono font-semibold text-slate-700">{receiptNumber}</span> • Submitted: {formattedDate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Direct Download as PDF Button */}
          <button
            onClick={handleDownloadPdf}
            id="btn-download-pdf-top"
            disabled={isGeneratingPdf}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800/60 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow cursor-pointer transition"
            title="Download assessment receipt directly as PDF document"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download PDF Receipt</span>
              </>
            )}
          </button>

          {/* Browser Print Button */}
          <button
            onClick={handlePrint}
            id="btn-print-report"
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-2.5 rounded-lg shadow cursor-pointer transition"
            title="Print or open system print dialog"
          >
            <Printer className="w-4 h-4 text-sky-400" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Official Assessment Receipt Document Container */}
      <div
        ref={printRef}
        id="assessment-receipt-document"
        className="bg-white rounded-2xl border-2 border-slate-300 shadow-xl p-6 sm:p-10 space-y-6 print:border-none print:shadow-none print:p-2 print:rounded-none"
      >
        {/* Institutional Letterhead Header with Authentic School and Program Logos */}
        <div className="border-b-2 border-slate-900 pb-5 relative">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Official HCDC School Seal */}
            <div className="shrink-0">
              <HcdcSchoolLogo className="w-20 h-20 sm:w-24 sm:h-24" />
            </div>

            {/* Center: Institutional Letterhead Typography */}
            <div className="text-center flex-1">
              <div className="text-sm sm:text-lg font-black tracking-wider text-slate-900 uppercase font-serif">
                HOLY CROSS OF DAVAO COLLEGE, INC.
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-sky-900 tracking-wide uppercase">
                COLLEGE OF MARITIME EDUCATION
              </div>
              <div className="text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wide mt-0.5">
                Department of Marine Transportation • BSMT Program
              </div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-0.5">
                Sta. Ana Avenue, Davao City, Philippines 8000
              </p>
            </div>

            {/* Right: Official COME Maritime Program Logo */}
            <div className="shrink-0">
              <ComeProgramLogo className="w-20 h-20 sm:w-24 sm:h-24" />
            </div>
          </div>

          <div className="mt-4 text-center">
            <div className="inline-block bg-slate-900 text-white px-4 py-1 rounded text-xs font-bold tracking-wider uppercase">
               Official ICT:Laboratory Examination Record & Laboratory Assessment Receipt
            </div>
            <div className="mt-1.5 text-xs text-slate-600 font-medium">
              Course: <strong>ICT 101: Software Applications and Network Systems used in Seagoing Ships</strong>
            </div>
          </div>
        </div>

        {/* Receipt Key Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Receipt No.</span>
            <span className="font-mono font-bold text-sky-900 text-xs sm:text-sm">{receiptNumber}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Date & Time Logged</span>
            <span className="font-medium text-slate-800">{formattedDate}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Assessor / Instructor</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">Edgardo Rojas</span>
              <AssessorSignature className="w-14 h-7 opacity-90" />
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Assessor Email</span>
            <span className="font-mono text-slate-600 text-[11px]">edgardo.rojas@hcdc.edu.ph</span>
          </div>
        </div>

        {/* Cadet Profile & Overall Evaluation Card */}
        <div className="grid sm:grid-cols-12 gap-4 items-center bg-sky-50/50 p-5 rounded-xl border border-sky-200">
          <div className="sm:col-span-7 space-y-1.5 border-b sm:border-b-0 sm:border-r border-sky-200 pb-3 sm:pb-0 sm:pr-4">
            <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider block">
              Candidate Examination Information (BSMT Program)
            </span>
            <div className="text-lg font-extrabold text-slate-900">
              {cadet.name || 'Juan Dela Cruz'}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
              <div>
                Cadet ID: <strong className="font-mono text-slate-900">{cadet.cadetId || '2024-COME-0192'}</strong>
              </div>
              <div>
                Rank: <strong className="text-slate-900">{cadet.rank || 'BSMT Navigation Cadet'}</strong>
              </div>
              <div>
                Training Vessel: <strong className="text-slate-900">{cadet.vessel || 'T/S Kapitan Felix Oca'}</strong>
              </div>
              <div>
                Degree Program: <strong className="text-emerald-800 font-bold">BSMT</strong>
              </div>
            </div>
            <div className="pt-1 text-[11px] text-slate-500 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Assessment Submission State: <strong>LOCKED & CERTIFIED (ICT)</strong></span>
            </div>
          </div>

          <div className="sm:col-span-5 text-center sm:text-right flex flex-col justify-center sm:items-end space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Total Examination Standing
            </span>
            <div className="text-3xl sm:text-4xl font-black text-slate-900">
              <span className="font-mono text-sky-700">{totalScore}</span>
              <span className="text-slate-400 text-xl font-normal"> / 100</span>
            </div>
            <div className="text-xs font-semibold text-slate-600">
              Passing Standard: 70 / 100 (70%)
            </div>
            <div className={`mt-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${statusBadgeStyle}`}>
              {statusIcon}
              <span>{rating.toUpperCase()} — {status}</span>
            </div>
          </div>
        </div>

        {/* Itemized Competency Score Breakdown Table (Receipt Table) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-sky-700" />
              Itemized Competency Score Breakdown
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">
              6 Practical Assessment Sections
            </span>
          </div>

          <div className="overflow-hidden border border-slate-300 rounded-xl">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <tr>
                  <th className="px-4 py-2.5">Examination Section & Competency Area</th>
                  <th className="px-3 py-2.5 text-center">Topic</th>
                  <th className="px-3 py-2.5 text-center">Max Pts</th>
                  <th className="px-4 py-2.5 text-right font-mono">Cadet Score</th>
                  <th className="px-3 py-2.5 text-center">Status</th>
                  <th className="px-3 py-2.5 text-right print:hidden">Module Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr className="hover:bg-slate-50/70">
                  <td className="px-4 py-2.5 font-medium">
                    <div className="font-bold text-slate-900">1. Hardware Identification (Hotspots)</div>
                    <div className="text-[11px] text-slate-500">Visual identification of Motherboard, CPU, RAM, PSU, NIC</div>
                  </td>
                  <td className="px-3 py-2.5 text-center font-mono text-xs">Topic 1</td>
                  <td className="px-3 py-2.5 text-center font-mono">20</td>
                  <td className="px-4 py-2.5 text-right font-mono font-bold text-slate-900">
                    {scores.hardwareIdentification}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      scores.hardwareIdentification >= 14 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {scores.hardwareIdentification >= 14 ? 'COMPETENT' : 'REVIEW'}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-right print:hidden">
                    <button
                      onClick={() => onNavigateTab('hotspot')}
                      className="text-xs text-sky-700 hover:text-sky-900 font-semibold cursor-pointer underline"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/70">
                  <td className="px-4 py-2.5 font-medium">
                    <div className="font-bold text-slate-900">2. Component-Function Matching</div>
                    <div className="text-[11px] text-slate-500">Pairing operational roles with physical shipboard components</div>
                  </td>
                  <td className="px-3 py-2.5 text-center font-mono text-xs">Topic 1</td>
                  <td className="px-3 py-2.5 text-center font-mono">15</td>
                  <td className="px-4 py-2.5 text-right font-mono font-bold text-slate-900">
                    {scores.componentFunctionMatching}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      scores.componentFunctionMatching >= 10 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {scores.componentFunctionMatching >= 10 ? 'COMPETENT' : 'REVIEW'}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-right print:hidden">
                    <button
                      onClick={() => onNavigateTab('matching')}
                      className="text-xs text-sky-700 hover:text-sky-900 font-semibold cursor-pointer underline"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/70">
                  <td className="px-4 py-2.5 font-medium">
                    <div className="font-bold text-slate-900">3. Shipboard Computer Application</div>
                    <div className="text-[11px] text-slate-500">ECDIS, Engine Monitoring, Administrative Workstation roles</div>
                  </td>
                  <td className="px-3 py-2.5 text-center font-mono text-xs">Topic 1</td>
                  <td className="px-3 py-2.5 text-center font-mono">10</td>
                  <td className="px-4 py-2.5 text-right font-mono font-bold text-slate-900">
                    {scores.shipboardApplication}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      scores.shipboardApplication >= 7 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {scores.shipboardApplication >= 7 ? 'COMPETENT' : 'REVIEW'}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-right print:hidden">
                    <button
                      onClick={() => onNavigateTab('hotspot')}
                      className="text-xs text-sky-700 hover:text-sky-900 font-semibold cursor-pointer underline"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/70">
                  <td className="px-4 py-2.5 font-medium">
                    <div className="font-bold text-slate-900">4. Network Layout Construction (Topology)</div>
                    <div className="text-[11px] text-slate-500">Cabling star topology: Switch, Router, Workstations & Satellite</div>
                  </td>
                  <td className="px-3 py-2.5 text-center font-mono text-xs">Topic 2</td>
                  <td className="px-3 py-2.5 text-center font-mono">30</td>
                  <td className="px-4 py-2.5 text-right font-mono font-bold text-slate-900">
                    {scores.networkLayoutConstruction}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      scores.networkLayoutConstruction >= 21 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {scores.networkLayoutConstruction >= 21 ? 'COMPETENT' : 'REVIEW'}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-right print:hidden">
                    <button
                      onClick={() => onNavigateTab('topology')}
                      className="text-xs text-sky-700 hover:text-sky-900 font-semibold cursor-pointer underline"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/70">
                  <td className="px-4 py-2.5 font-medium">
                    <div className="font-bold text-slate-900">5. Network Checking & Fault Diagnosis</div>
                    <div className="text-[11px] text-slate-500">Incident troubleshooting: physical links, switch power, NIC</div>
                  </td>
                  <td className="px-3 py-2.5 text-center font-mono text-xs">Topic 2</td>
                  <td className="px-3 py-2.5 text-center font-mono">15</td>
                  <td className="px-4 py-2.5 text-right font-mono font-bold text-slate-900">
                    {scores.networkCheckingProcedure}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      scores.networkCheckingProcedure >= 10 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {scores.networkCheckingProcedure >= 10 ? 'COMPETENT' : 'REVIEW'}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-right print:hidden">
                    <button
                      onClick={() => onNavigateTab('procedure')}
                      className="text-xs text-sky-700 hover:text-sky-900 font-semibold cursor-pointer underline"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/70">
                  <td className="px-4 py-2.5 font-medium">
                    <div className="font-bold text-slate-900">6. Standard Equipment Handling Sequence</div>
                    <div className="text-[11px] text-slate-500">Correct 6-stage maritime safety inspection and handling order</div>
                  </td>
                  <td className="px-3 py-2.5 text-center font-mono text-xs">Topic 2</td>
                  <td className="px-3 py-2.5 text-center font-mono">10</td>
                  <td className="px-4 py-2.5 text-right font-mono font-bold text-slate-900">
                    {scores.correctHandlingSequence}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      scores.correctHandlingSequence >= 7 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {scores.correctHandlingSequence >= 7 ? 'COMPETENT' : 'REVIEW'}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-right print:hidden">
                    <button
                      onClick={() => onNavigateTab('procedure')}
                      className="text-xs text-sky-700 hover:text-sky-900 font-semibold cursor-pointer underline"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-900 text-white font-extrabold text-xs sm:text-sm">
                <tr>
                  <td colSpan={2} className="px-4 py-3 uppercase tracking-wider">
                    Total Assessment Grade
                  </td>
                  <td className="px-3 py-3 text-center font-mono">100</td>
                  <td className="px-4 py-3 text-right font-mono text-base text-sky-300">
                    {totalScore}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className="text-[11px] font-bold text-emerald-300 uppercase">
                      {totalScore >= 70 ? 'PASSED' : 'REMEDIAL'}
                    </span>
                  </td>
                  <td className="px-3 py-3 print:hidden"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Competency Observations & Actionable Remarks */}
        <div className="grid sm:grid-cols-2 gap-4 text-xs">
          {/* Strengths */}
          <div className="bg-emerald-50/80 rounded-xl p-4 border border-emerald-200 space-y-2">
            <h4 className="font-extrabold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              Observed Competencies & Strengths:
            </h4>
            <ul className="space-y-1.5 text-emerald-950">
              {strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-1.5 leading-snug">
                  <span className="text-emerald-700 font-bold">•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Items */}
          <div className="bg-amber-50/80 rounded-xl p-4 border border-amber-200 space-y-2">
            <h4 className="font-extrabold text-amber-950 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              Areas Recommended for Further Study:
            </h4>
            <ul className="space-y-1.5 text-amber-950">
              {improvements.map((imp, idx) => (
                <li key={idx} className="flex items-start gap-1.5 leading-snug">
                  <span className="text-amber-700 font-bold">•</span>
                  <span>{imp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Official COME Laboratory Completion Notice */}
        <div className="bg-slate-900 text-white rounded-xl p-4 text-xs space-y-1 border border-slate-800">
          <div className="text-[10px] font-mono text-sky-400 font-bold uppercase tracking-wider">
            Maritime Regulatory Framework & Certification Statement (BSMT)
          </div>
          <p className="text-slate-200 leading-relaxed text-[11px]">
            This assessment certifies practical competency in shipboard computer hardware topology, component diagnostics, and preventive maintenance handling aligned with the College of Maritime Education (COME), Bachelor of Science in Marine Transportation (BSMT) curriculum, and STCW familiarization standards.
          </p>
        </div>

        {/* Dual Signatures & Endorsement Block */}
        <div className="pt-4 border-t-2 border-slate-300 grid grid-cols-2 gap-8 text-center text-xs">
          <div className="space-y-2">
            <div className="relative h-24 sm:h-28 flex items-end justify-center">
              <div className="font-bold text-slate-900 text-sm w-full pb-3 border-b border-slate-400">
                {cadet.name || 'Juan Dela Cruz'}
              </div>
            </div>
            <div className="font-bold text-slate-800 uppercase text-[10px] leading-tight">Cadet / Examinee Signature (BSMT)</div>
            <div className="text-[10px] text-slate-500 leading-tight">Cadet ID: {cadet.cadetId || '2024-COME-0192'} • Date: {formattedDate.split(',')[0]}</div>
          </div>

          <div className="space-y-2">
            <div className="relative h-24 sm:h-28 flex items-end justify-center">
              <AssessorSignature className="absolute inset-x-0 top-0 mx-auto w-48 h-28 sm:w-100 sm:h-45 z-20" />
              <div className="font-bold text-slate-900 text-sm w-full pb-3 border-b border-slate-400 relative z-10 pt-14 sm:pt-16">
                Edgardo Rojas
              </div>
            </div>
            <div className="font-bold text-slate-800 uppercase text-[10px] leading-tight">COME Laboratory Assessor / Instructor</div>
            <div className="text-[10px] text-slate-500 leading-tight">Holy Cross of Davao College • ICT • edgardo.rojas@hcdc.edu.ph</div>
          </div>
        </div>

        {/* Official Electronic Verification Barcode / Security Strip */}
        <div className="border-t border-slate-200 pt-3 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-mono tracking-widest text-slate-600 font-bold">|||| | | ||||| ||| |||| | ||| ||||| ||||</span>
            <span className="font-mono text-[9px] text-slate-500">HASH: 7F9A-ICT-HCDC-84920-VERIFIED</span>
          </div>
          <div className="text-right">
            Official Computer-Generated Receipt • Holy Cross of Davao College
          </div>
        </div>
      </div>

      {/* Bottom Action Footer (Print, Review) (Hidden in Print) */}
      <div className="flex flex-wrap items-center justify-end gap-4 pt-2 print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('hotspot')}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-4 py-2.5 rounded-lg transition cursor-pointer"
          >
            <span>Review Simulators (Read-Only)</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Main Button: Downloads the official receipt as PDF */}
          <button
            onClick={handleDownloadPdf}
            id="btn-print-download-official-receipt"
            disabled={isGeneratingPdf}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800/60 text-white text-xs font-semibold px-5 py-2.5 rounded-lg shadow transition cursor-pointer"
            title="Download this official assessment receipt as a PDF document"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating PDF Receipt...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Print Official Receipt (Download PDF)</span>
              </>
            )}
          </button>

          {/* Browser System Print Option */}
          <button
            onClick={handlePrint}
            id="btn-system-print-bottom"
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-2.5 rounded-lg shadow transition cursor-pointer"
            title="Open system print dialog"
          >
            <Printer className="w-4 h-4 text-sky-400" />
            <span>Print</span>
          </button>
        </div>
      </div>
    </div>
  );
};
