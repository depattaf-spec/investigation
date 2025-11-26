import { Evidence, Suspect, LabTest, DialogueOption } from './types';

export const INITIAL_SUSPECTS: Suspect[] = [
  {
    id: 'victoria',
    name: 'Victoria Ashford',
    role: 'The Daughter',
    age: 42,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
    description: 'Nervous, well-dressed. Stands to inherit the estate.',
    motive: 'Inheritance and debts',
    alibi: 'In drawing room with Margaret',
    isGuilty: false
  },
  {
    id: 'james',
    name: 'Dr. James Whitmore',
    role: 'The Colleague',
    age: 55,
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&q=80',
    description: 'Defensive intellectual. Sweats when nervous.',
    motive: 'Professional rivalry and forgery exposure',
    alibi: 'Smoking in garden',
    isGuilty: false
  },
  {
    id: 'margaret',
    name: 'Margaret Chen',
    role: 'The Broker',
    age: 38,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    description: 'Smooth, charming art dealer.',
    motive: 'Illegal manuscript sale commission',
    alibi: 'In drawing room with Victoria',
    isGuilty: false
  },
  {
    id: 'thomas',
    name: 'Thomas Garrett',
    role: 'The Butler',
    age: 51,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    description: 'Formal, proper, increasingly agitated.',
    motive: 'Revenge for affair and firing of wife',
    alibi: 'Preparing tea in kitchen',
    isGuilty: true
  },
  {
    id: 'olivia',
    name: 'Olivia Hart',
    role: 'The Assistant',
    age: 29,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    description: 'Bitter, intelligent graduate student.',
    motive: 'Research theft',
    alibi: 'Left manor at 11:00 PM',
    isGuilty: false
  }
];

export const INITIAL_EVIDENCE: Evidence[] = [
  // Crime Scene Items - Coordinates mapped to new SVG layout (0-100%)
  { id: 'body', name: 'Victim Body', description: 'Prof. Ashford found slumped in chair. No external wounds.', category: 'physical', location: 'Library - Center Rug', isCollected: false, x: 55, y: 55 },
  { id: 'decanter', name: 'Port Decanter', description: 'Crystal decanter, half empty. Smells slightly metallic.', category: 'physical', location: 'Side Table', isCollected: false, x: 72, y: 45 },
  { id: 'teacup', name: 'Unused Teacup', description: 'Fine china, completely dry and clean.', category: 'physical', location: 'Main Desk', isCollected: false, x: 62, y: 35 },
  { id: 'desk_compartment', name: 'Hidden Letters', description: 'Love letters between Richard and the Cook (Thomas\'s wife).', category: 'document', location: 'Desk Drawer (Hidden)', isCollected: false, x: 65, y: 38 },
  { id: 'calendar', name: 'Desk Calendar', description: 'Entry at 4:00 PM: "Fire Mrs. Garrett".', category: 'document', location: 'Main Desk', isCollected: false, x: 58, y: 32 },
  { id: 'window', name: 'Open Window', description: 'Window latch is broken. Muddy footprint outside.', category: 'physical', location: 'North Window', isCollected: false, x: 50, y: 5 },
  { id: 'poison_book', name: 'Poison History Book', description: 'Borrowed by Dr. Whitmore earlier.', category: 'physical', location: 'West Bookshelf', isCollected: false, x: 8, y: 40 },
  
  // Testimony / Lab Results / Background Checks (Unlockable)
  { id: 'fingerprint_report', name: 'Fingerprint Analysis', description: 'Thomas\'s prints found on the decanter.', category: 'forensic', isCollected: false },
  { id: 'tox_report', name: 'Toxicology Report', description: 'Cause of death: Liquid Nicotine poisoning.', category: 'forensic', isCollected: false },
  { id: 'luminol_gloves', name: 'Butler\'s Gloves Test', description: 'Traces of nicotine found on Thomas\'s white gloves.', category: 'forensic', isCollected: false },
  
  { id: 'kitchen_log', name: 'Kitchen Log & Staff', description: 'Staff confirm Thomas was NOT in the kitchen at 11:35 PM.', category: 'testimony', isCollected: false },
  { id: 'garden_inventory', name: 'Shed Inventory', description: 'Bottle of liquid nicotine pesticide is missing.', category: 'document', isCollected: false },
  
  { id: 'financial_report', name: 'Bank Records', description: 'Victoria Ashford has $300k in gambling debts.', category: 'document', isCollected: false },
  { id: 'theft_record', name: 'Criminal Record', description: 'Thomas Garrett has prior convictions for theft.', category: 'document', isCollected: false },
  { id: 'forgery_scandal', name: 'Academic Forum', description: 'Rumors that Dr. Whitmore\'s work relies on forgeries.', category: 'document', isCollected: false },
];

export const INITIAL_LAB_TESTS: LabTest[] = [
  { id: 'test_tox', name: 'Toxicology Screening', description: 'Analyze victim blood sample for toxins.', duration: 5, requiredEvidenceId: 'body', resultDescription: 'Lethal dose of liquid nicotine detected.', status: 'available', progress: 0 },
  { id: 'test_prints', name: 'Fingerprint Analysis', description: 'Dust the port decanter for prints.', duration: 5, requiredEvidenceId: 'decanter', resultDescription: 'Prints match Thomas Garrett (The Butler).', status: 'available', progress: 0 },
  { id: 'test_luminol', name: 'Luminol Test', description: 'Test Thomas\'s gloves for chemical residue.', duration: 5, requiredEvidenceId: 'thomas_gloves', resultDescription: 'Positive for high concentration of nicotine.', status: 'available', progress: 0 },
  { id: 'test_doc', name: 'Handwriting Analysis', description: 'Verify authorship of love letters.', duration: 5, requiredEvidenceId: 'desk_compartment', resultDescription: 'Confirmed handwriting of Richard Ashford and Mrs. Garrett.', status: 'available', progress: 0 },
];

export const SUSPECT_DIALOGUES: Record<string, DialogueOption[]> = {
  victoria: [
    { id: 'vic_1', text: 'Where were you between 11:15 and 11:45 PM?', response: 'I was in the drawing room with Margaret. We were discussing art.', isAsked: false },
    { id: 'vic_2', text: 'Did you know about the manuscript?', response: 'Father never shut up about it. Supposed to be worth a fortune.', isAsked: false },
    { id: 'vic_3', text: 'I know about your gambling debts.', response: 'That... that is personal! But yes, I needed money. I didn\'t kill him though!', requiresEvidenceId: 'financial_report', isAsked: false },
  ],
  james: [
    { id: 'jam_1', text: 'What were you doing in the garden?', response: 'Smoking. A bad habit, I know. I needed fresh air.', isAsked: false },
    { id: 'jam_2', text: 'Tell me about this book on poisons.', response: 'Purely academic interest! I returned it... or meant to.', isAsked: false },
    { id: 'jam_3', text: 'Rumor is your work is based on forgeries.', response: 'Slander! ...Though Richard did threaten to ruin me with those lies.', requiresEvidenceId: 'forgery_scandal', isAsked: false },
  ],
  margaret: [
    { id: 'mar_1', text: 'Can you verify Victoria\'s alibi?', response: 'Yes, poor dear. She was with me the whole time.', isAsked: false },
    { id: 'mar_2', text: 'Why was the manuscript so important?', response: 'I had a buyer lined up. A private collector.', isAsked: false },
  ],
  thomas: [
    { id: 'tho_1', text: 'Where were you at the time of death?', response: 'I was in the kitchen, preparing the Professor\'s late-night tea.', isAsked: false },
    { id: 'tho_2', text: 'The kitchen staff says you weren\'t there.', response: 'They... must be mistaken. Or perhaps I stepped into the pantry.', requiresEvidenceId: 'kitchen_log', isAsked: false },
    { id: 'tho_3', text: 'We found these letters in the desk.', response: 'I... I have nothing to say. I loved her! He ruined everything!', requiresEvidenceId: 'desk_compartment', isAsked: false },
  ],
  olivia: [
    { id: 'oli_1', text: 'When did you leave?', response: '11:00 sharp. I was home by 11:30. You can check the gate logs.', isAsked: false },
    { id: 'oli_2', text: 'You argued with the Professor.', response: 'He stole my work! He was a fraud. But I didn\'t kill him.', isAsked: false },
  ]
};

// Map suspect ID to evidence that is unlocked when researching them
export const BACKGROUND_RESULTS: Record<string, string[]> = {
  victoria: ['financial_report'],
  thomas: ['kitchen_log', 'theft_record', 'garden_inventory'],
  james: ['forgery_scandal'],
  margaret: [], // Clean record
  olivia: [] // Clean record
};

export const ACCUSATION_OPTIONS = {
  methods: [
    { id: 'poison_port', label: 'Poisoned Port Wine' },
    { id: 'blunt_force', label: 'Blunt Force Trauma' },
    { id: 'strangulation', label: 'Strangulation' },
    { id: 'poison_tea', label: 'Poisoned Tea' },
  ],
  motives: [
    { id: 'inheritance', label: 'Inheritance Money' },
    { id: 'revenge_affair', label: 'Revenge for Affair/Firing' },
    { id: 'academic_theft', label: 'Academic Theft' },
    { id: 'silence_fraud', label: 'To Silence Fraud Exposure' },
  ],
  times: [
    { id: '1100', label: '11:00 PM' },
    { id: '1115', label: '11:15 PM' },
    { id: '1135', label: '11:35 PM' },
    { id: '1150', label: '11:50 PM' },
  ]
};

// Solution Key
export const SOLUTION = {
  suspectId: 'thomas',
  methodId: 'poison_port',
  motiveId: 'revenge_affair',
  timeId: '1135',
  requiredEvidence: ['decanter', 'fingerprint_report', 'desk_compartment', 'calendar', 'kitchen_log', 'luminol_gloves', 'tox_report'] // Any 3 of these
};