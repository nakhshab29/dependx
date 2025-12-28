// Mock data for the dependency visualization

export interface Person {
  id: string;
  name: string;
  role: string;
  avatar: string;
  riskScore: number; // 1-5, how much depends on them
  knowledgeAreas: KnowledgeArea[];
  lastActive: string;
}

export interface KnowledgeArea {
  module: string;
  level: 'primary' | 'secondary' | 'reviewer';
  isOnlyOwner: boolean;
}

export interface Module {
  id: string;
  name: string;
  busFactor: number; // 1-5
  riskLevel: 'critical' | 'warning' | 'healthy';
  owners: string[]; // person ids
  lastActivity: string;
  concentration: number; // percentage
  description: string;
}

export interface DependencyLink {
  source: string;
  target: string;
  strength: number; // 1-100
  type: 'owns' | 'reviews' | 'contributes';
}

export const mockPeople: Person[] = [
  {
    id: 'p1',
    name: 'Sarah Chen',
    role: 'Senior Backend Engineer',
    avatar: 'SC',
    riskScore: 5,
    knowledgeAreas: [
      { module: 'Payment Service', level: 'primary', isOnlyOwner: true },
      { module: 'Auth System', level: 'primary', isOnlyOwner: false },
      { module: 'User Management', level: 'secondary', isOnlyOwner: false },
    ],
    lastActive: '2 hours ago',
  },
  {
    id: 'p2',
    name: 'Marcus Johnson',
    role: 'DevOps Lead',
    avatar: 'MJ',
    riskScore: 4,
    knowledgeAreas: [
      { module: 'Deployment Pipeline', level: 'primary', isOnlyOwner: true },
      { module: 'Infrastructure', level: 'primary', isOnlyOwner: false },
      { module: 'Monitoring', level: 'secondary', isOnlyOwner: false },
    ],
    lastActive: '1 day ago',
  },
  {
    id: 'p3',
    name: 'Emily Rodriguez',
    role: 'Frontend Lead',
    avatar: 'ER',
    riskScore: 3,
    knowledgeAreas: [
      { module: 'Dashboard UI', level: 'primary', isOnlyOwner: false },
      { module: 'Design System', level: 'primary', isOnlyOwner: false },
      { module: 'Analytics', level: 'reviewer', isOnlyOwner: false },
    ],
    lastActive: '5 hours ago',
  },
  {
    id: 'p4',
    name: 'David Kim',
    role: 'Full Stack Developer',
    avatar: 'DK',
    riskScore: 2,
    knowledgeAreas: [
      { module: 'User Management', level: 'secondary', isOnlyOwner: false },
      { module: 'Notifications', level: 'primary', isOnlyOwner: false },
      { module: 'API Gateway', level: 'reviewer', isOnlyOwner: false },
    ],
    lastActive: '3 hours ago',
  },
  {
    id: 'p5',
    name: 'Anna Weber',
    role: 'Backend Engineer',
    avatar: 'AW',
    riskScore: 2,
    knowledgeAreas: [
      { module: 'Auth System', level: 'secondary', isOnlyOwner: false },
      { module: 'API Gateway', level: 'primary', isOnlyOwner: false },
      { module: 'Infrastructure', level: 'reviewer', isOnlyOwner: false },
    ],
    lastActive: '6 hours ago',
  },
];

export const mockModules: Module[] = [
  {
    id: 'm1',
    name: 'Payment Service',
    busFactor: 1,
    riskLevel: 'critical',
    owners: ['p1'],
    lastActivity: '2 hours ago',
    concentration: 94,
    description: 'Handles all payment processing, subscription management, and billing logic.',
  },
  {
    id: 'm2',
    name: 'Deployment Pipeline',
    busFactor: 1,
    riskLevel: 'critical',
    owners: ['p2'],
    lastActivity: '1 day ago',
    concentration: 88,
    description: 'CI/CD infrastructure, deployment automation, and release management.',
  },
  {
    id: 'm3',
    name: 'Auth System',
    busFactor: 2,
    riskLevel: 'warning',
    owners: ['p1', 'p5'],
    lastActivity: '5 hours ago',
    concentration: 72,
    description: 'User authentication, session management, and security protocols.',
  },
  {
    id: 'm4',
    name: 'Dashboard UI',
    busFactor: 3,
    riskLevel: 'healthy',
    owners: ['p3', 'p4', 'p5'],
    lastActivity: '3 hours ago',
    concentration: 45,
    description: 'Main user interface, component library, and user experience.',
  },
  {
    id: 'm5',
    name: 'Infrastructure',
    busFactor: 2,
    riskLevel: 'warning',
    owners: ['p2', 'p5'],
    lastActivity: '1 day ago',
    concentration: 68,
    description: 'Cloud resources, networking, and infrastructure as code.',
  },
  {
    id: 'm6',
    name: 'API Gateway',
    busFactor: 3,
    riskLevel: 'healthy',
    owners: ['p4', 'p5'],
    lastActivity: '4 hours ago',
    concentration: 52,
    description: 'Request routing, rate limiting, and API management.',
  },
];

export const mockLinks: DependencyLink[] = [
  { source: 'p1', target: 'm1', strength: 95, type: 'owns' },
  { source: 'p1', target: 'm3', strength: 70, type: 'owns' },
  { source: 'p1', target: 'm4', strength: 25, type: 'contributes' },
  { source: 'p2', target: 'm2', strength: 90, type: 'owns' },
  { source: 'p2', target: 'm5', strength: 75, type: 'owns' },
  { source: 'p3', target: 'm4', strength: 80, type: 'owns' },
  { source: 'p3', target: 'm6', strength: 30, type: 'reviews' },
  { source: 'p4', target: 'm4', strength: 55, type: 'contributes' },
  { source: 'p4', target: 'm6', strength: 60, type: 'owns' },
  { source: 'p5', target: 'm3', strength: 50, type: 'contributes' },
  { source: 'p5', target: 'm5', strength: 40, type: 'contributes' },
  { source: 'p5', target: 'm6', strength: 55, type: 'owns' },
];

export const mockStats = {
  overallBusFactor: 2.1,
  trend: 'declining' as const,
  criticalAreas: 2,
  warningAreas: 2,
  healthyAreas: 2,
  totalPeople: 5,
  totalModules: 6,
};
