export type RelevantExperienceNodeType = 'parent' | 'child';
export type RelevantExperienceIcon = 'briefcase-business' | 'folder-kanban';

export type RelevantExperienceNodeLayout = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type RelevantExperienceConnectionAnchor = 'top' | 'right' | 'bottom' | 'left';

export type RelevantExperienceNode = {
  id: string;
  type: RelevantExperienceNodeType;
  parentId?: string;
  title: string;
  subtitle?: string;
  details: string;
  previewTags?: string[];
  modalTags?: string[];
  image?: string;
  icon?: RelevantExperienceIcon;
  layout: RelevantExperienceNodeLayout;
  logoAnimation?: 'bounce' | 'static';
  companyDescription?: string;
  
  // Custom structured content fields for new modal blueprint:
  overviewText?: string;       // 1-2 sentence overview/intro
  whatILearned?: string[];     // NCII
  keyTakeaways?: string[];     // NCII
  whatIDid?: string[];         // Internship
  whatIGained?: string[];      // Internship
  problemText?: string;        // Projects ("The Problem")
  solutionBullets?: string[];  // Projects ("The Solution")
  myRoleBullets?: string[];    // Projects ("My Role" - bullets)
  myRoleText?: string;         // Projects ("My Role" - simple text)
};

export type RelevantExperienceConnectionPoint = {
  x: number;
  y: number;
};

export type RelevantExperienceConnection = {
  id: string;
  from: string;
  to: string;
  fromAnchor: RelevantExperienceConnectionAnchor;
  toAnchor: RelevantExperienceConnectionAnchor;
  viaPoints: RelevantExperienceConnectionPoint[];
  variant: 'group' | 'detail';
};

export type RelevantExperiencesLayoutNode = {
  id: string;
  layout: RelevantExperienceNodeLayout;
};

export type RelevantExperiencesLayoutState = {
  nodes: RelevantExperiencesLayoutNode[];
  connections: RelevantExperienceConnection[];
};

export type RelevantExperiencesContentState = {
  nodes: RelevantExperienceNode[];
  connections: RelevantExperienceConnection[];
  mdLayout?: RelevantExperiencesLayoutState;
};
