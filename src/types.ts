export type AssessmentTab = 
  | 'briefing'
  | 'hotspot'
  | 'matching'
  | 'topology'
  | 'procedure'
  | 'results';

export interface CadetInfo {
  name: string;
  cadetId: string;
  vessel: string;
  rank: string;
}

export interface HotspotQuestion {
  id: string;
  title: string;
  description: string;
  correctChoice: string;
  choices: string[];
  feedbackCorrect: string;
  feedbackIncorrect: string;
  componentKey: 'motherboard' | 'ram' | 'nic' | 'monitor' | 'ssd' | 'cpu';
  hotspotCoords: { x: number; y: number; width: number; height: number; label: string };
}

export interface ShipboardApplicationQuestion {
  id: string;
  question: string;
  choices: { key: string; text: string }[];
  correctAnswer: string;
  feedbackCorrect: string;
  feedbackIncorrect: string;
}

export interface MatchItem {
  id: string;
  component: string;
  functionText: string;
  description: string;
  iconName: string;
}

export interface TopologyDevice {
  id: string;
  type: 'workstation-bridge' | 'workstation-engine' | 'workstation-admin' | 'switch' | 'router' | 'server' | 'satellite';
  label: string;
  category: 'workstation' | 'infrastructure' | 'external';
  x: number;
  y: number;
  iconName: string;
  description: string;
  requiredConnections?: string[];
}

export interface TopologyConnection {
  id: string;
  fromId: string;
  toId: string;
}

export interface TopologyValidationResult {
  isValid: boolean;
  score: number;
  maxScore: number;
  errors: string[];
  successes: string[];
  feedback: string;
}

export interface SituationCheck {
  id: string;
  situation: string;
  correctAction: string;
  choices: string[];
  explanation: string;
}

export interface HandlingStep {
  id: number;
  text: string;
  correctOrder: number;
  detail: string;
  icon: string;
}

export interface AssessmentScores {
  hardwareIdentification: number;      // max 20
  componentFunctionMatching: number;   // max 15
  shipboardApplication: number;        // max 10
  networkLayoutConstruction: number;   // max 30
  networkCheckingProcedure: number;    // max 15
  correctHandlingSequence: number;     // max 10
}
