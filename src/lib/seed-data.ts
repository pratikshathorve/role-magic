
import { Role, Skill, TeamMember } from "./types";

export const defaultSkills: Skill[] = [
  { id: "s1", name: "Frontend Development" },
  { id: "s2", name: "Backend Development" },
  { id: "s3", name: "UI/UX Design" },
  { id: "s4", name: "Project Management" },
  { id: "s5", name: "Data Analysis" },
  { id: "s6", name: "Content Writing" },
  { id: "s7", name: "QA Testing" },
  { id: "s8", name: "DevOps" },
];

export const defaultRoles: Role[] = [
  {
    id: "r1",
    name: "Project Lead",
    description: "Oversees the entire project and coordinates team efforts",
    requiredSkills: [
      { skillId: "s4", minLevel: 4 },
    ],
    color: "#8B5CF6", // Purple
  },
  {
    id: "r2",
    name: "Frontend Developer",
    description: "Creates and maintains the user interface of the application",
    requiredSkills: [
      { skillId: "s1", minLevel: 3 },
    ],
    color: "#0EA5E9", // Blue
  },
  {
    id: "r3",
    name: "Backend Developer",
    description: "Develops and maintains server-side logic",
    requiredSkills: [
      { skillId: "s2", minLevel: 3 },
    ],
    color: "#10B981", // Green
  },
  {
    id: "r4",
    name: "UI/UX Designer",
    description: "Designs user interfaces and experiences",
    requiredSkills: [
      { skillId: "s3", minLevel: 3 },
    ],
    color: "#F59E0B", // Amber
  },
  {
    id: "r5",
    name: "QA Engineer",
    description: "Tests and ensures quality of the application",
    requiredSkills: [
      { skillId: "s7", minLevel: 3 },
    ],
    color: "#EF4444", // Red
  },
];

export const sampleTeamMembers: TeamMember[] = [
  {
    id: "m1",
    name: "Alex Johnson",
    skills: [
      { skillId: "s1", level: 4 },
      { skillId: "s3", level: 3 },
      { skillId: "s7", level: 2 },
    ],
    preferredRoles: ["r2", "r4"],
  },
  {
    id: "m2",
    name: "Sam Martinez",
    skills: [
      { skillId: "s2", level: 5 },
      { skillId: "s8", level: 4 },
      { skillId: "s7", level: 3 },
    ],
    preferredRoles: ["r3", "r5"],
  },
  {
    id: "m3",
    name: "Jamie Rivera",
    skills: [
      { skillId: "s4", level: 5 },
      { skillId: "s6", level: 4 },
      { skillId: "s5", level: 3 },
    ],
    preferredRoles: ["r1"],
  },
  {
    id: "m4",
    name: "Taylor Kim",
    skills: [
      { skillId: "s3", level: 5 },
      { skillId: "s1", level: 3 },
      { skillId: "s6", level: 4 },
    ],
    preferredRoles: ["r4", "r2"],
  },
  {
    id: "m5",
    name: "Jordan Patel",
    skills: [
      { skillId: "s2", level: 4 },
      { skillId: "s8", level: 5 },
      { skillId: "s5", level: 3 },
    ],
    preferredRoles: ["r3"],
  },
];
