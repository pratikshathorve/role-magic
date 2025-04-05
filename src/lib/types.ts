
export type SkillLevel = 1 | 2 | 3 | 4 | 5;

export interface Skill {
  id: string;
  name: string;
}

export interface TeamMember {
  id: string;
  name: string;
  skills: {
    skillId: string;
    level: SkillLevel;
  }[];
  preferredRoles: string[];
  assignedRole?: string;
  avatar?: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  requiredSkills: {
    skillId: string;
    minLevel?: SkillLevel;
  }[];
  assignedMemberId?: string;
  color?: string;
}

export interface TeamAllocation {
  id: string;
  name: string;
  timestamp: number;
  members: TeamMember[];
  roles: Role[];
}

export type AllocationMethod = "skills" | "preferences" | "random";
