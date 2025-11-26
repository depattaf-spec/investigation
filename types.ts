export type Tab = 'home' | 'crime_scene' | 'interviews' | 'evidence_board' | 'lab' | 'background' | 'timeline' | 'theory' | 'notes';

export type EvidenceCategory = 'physical' | 'testimony' | 'document' | 'forensic';

export interface Evidence {
  id: string;
  name: string;
  description: string;
  category: EvidenceCategory;
  location?: string;
  image?: string;
  isCollected: boolean;
  notes?: string;
  x?: number; // For board positioning (simplified)
  y?: number;
}

export interface Suspect {
  id: string;
  name: string;
  role: string;
  age: number;
  avatar: string;
  description: string;
  motive: string; // Hidden initially
  alibi: string;
  isGuilty: boolean;
}

export interface DialogueOption {
  id: string;
  text: string;
  response: string;
  requiresEvidenceId?: string; // Unlocks if player has this evidence
  unlocksEvidenceId?: string; // Unlocks a new piece of evidence/clue
  isAsked: boolean;
}

export interface LabTest {
  id: string;
  name: string;
  description: string;
  duration: number; // in seconds
  requiredEvidenceId: string;
  resultDescription: string;
  status: 'available' | 'running' | 'completed';
  progress: number;
}

export interface GameState {
  currentTab: Tab;
  evidence: Evidence[];
  suspects: Suspect[];
  labTests: LabTest[];
  dialogueHistory: Record<string, string[]>; // suspectId -> array of asked question IDs
  connections: Array<{ from: string; to: string }>; // Evidence ID pairs
  notes: string;
  solved: boolean;
  gameTime: number; // Abstract time counter
  lastSave: string;
}

export interface AccusationData {
  suspectId: string;
  methodId: string;
  motiveId: string;
  timeId: string;
  evidenceIds: string[];
}
