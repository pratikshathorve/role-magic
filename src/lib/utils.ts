
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AllocationMethod, Role, TeamMember } from "./types";
import { toast } from "@/hooks/use-toast";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

export const getSkillLevelText = (level: number): string => {
  switch (level) {
    case 1:
      return "Beginner";
    case 2:
      return "Basic";
    case 3:
      return "Intermediate";
    case 4:
      return "Advanced";
    case 5:
      return "Expert";
    default:
      return "Unknown";
  }
};

export const calculateSkillMatch = (
  member: TeamMember,
  role: Role
): number => {
  if (!role.requiredSkills.length) return 100;
  
  let totalScore = 0;
  const maxPossibleScore = role.requiredSkills.length * 5;
  
  for (const requiredSkill of role.requiredSkills) {
    const memberSkill = member.skills.find(
      (s) => s.skillId === requiredSkill.skillId
    );
    
    if (memberSkill) {
      totalScore += memberSkill.level;
    }
  }
  
  return Math.round((totalScore / maxPossibleScore) * 100);
};

export const allocateRoles = (
  members: TeamMember[],
  roles: Role[],
  method: AllocationMethod
): { members: TeamMember[]; roles: Role[] } => {
  const updatedMembers = [...members];
  const updatedRoles = [...roles];
  
  // Reset current allocations
  updatedMembers.forEach(member => {
    member.assignedRole = undefined;
  });
  
  updatedRoles.forEach(role => {
    role.assignedMemberId = undefined;
  });
  
  if (method === "random") {
    // Shuffle members
    const shuffledMembers = [...updatedMembers].sort(() => Math.random() - 0.5);
    
    // Assign roles in order
    for (let i = 0; i < Math.min(shuffledMembers.length, updatedRoles.length); i++) {
      shuffledMembers[i].assignedRole = updatedRoles[i].id;
      updatedRoles[i].assignedMemberId = shuffledMembers[i].id;
    }
  } 
  else if (method === "preferences") {
    // Try to match based on preferences
    const unassignedRoles = [...updatedRoles];
    
    // First pass: Assign members to their preferred roles if possible
    for (const member of updatedMembers) {
      if (member.preferredRoles.length > 0) {
        for (const preferredRoleId of member.preferredRoles) {
          const roleIndex = unassignedRoles.findIndex(r => r.id === preferredRoleId);
          if (roleIndex !== -1) {
            const role = unassignedRoles[roleIndex];
            member.assignedRole = role.id;
            role.assignedMemberId = member.id;
            unassignedRoles.splice(roleIndex, 1);
            break;
          }
        }
      }
    }
    
    // Second pass: Assign remaining members randomly to remaining roles
    const unassignedMembers = updatedMembers.filter(m => !m.assignedRole);
    for (let i = 0; i < Math.min(unassignedMembers.length, unassignedRoles.length); i++) {
      unassignedMembers[i].assignedRole = unassignedRoles[i].id;
      unassignedRoles[i].assignedMemberId = unassignedMembers[i].id;
    }
  } 
  else if (method === "skills") {
    // Score each member against each role based on skill match
    const scores: { memberId: string; roleId: string; score: number }[] = [];
    
    for (const member of updatedMembers) {
      for (const role of updatedRoles) {
        const score = calculateSkillMatch(member, role);
        scores.push({
          memberId: member.id,
          roleId: role.id,
          score
        });
      }
    }
    
    // Sort scores descending
    scores.sort((a, b) => b.score - a.score);
    
    // Assign roles based on highest scores
    const assignedMembers = new Set<string>();
    const assignedRoles = new Set<string>();
    
    for (const { memberId, roleId, score } of scores) {
      if (
        !assignedMembers.has(memberId) && 
        !assignedRoles.has(roleId) && 
        assignedRoles.size < updatedRoles.length && 
        assignedMembers.size < updatedMembers.length
      ) {
        const member = updatedMembers.find(m => m.id === memberId);
        const role = updatedRoles.find(r => r.id === roleId);
        
        if (member && role) {
          member.assignedRole = roleId;
          role.assignedMemberId = memberId;
          assignedMembers.add(memberId);
          assignedRoles.add(roleId);
        }
      }
    }
  }
  
  toast({
    title: "Roles allocated",
    description: `Team roles have been assigned using ${method}-based allocation`,
  });
  
  return { members: updatedMembers, roles: updatedRoles };
};

export function downloadObjectAsJson(exportObj: any, exportName: string): void {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", exportName + ".json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
  
  toast({
    title: "Export successful",
    description: `Team allocation exported as ${exportName}.json`,
  });
}
