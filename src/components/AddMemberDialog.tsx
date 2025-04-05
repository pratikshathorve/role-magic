
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Role, Skill, SkillLevel, TeamMember } from "@/lib/types";
import { generateId } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skills: Skill[];
  roles: Role[];
  onSave: (member: TeamMember) => void;
  initialMember?: TeamMember;
}

const AddMemberDialog = ({
  open,
  onOpenChange,
  skills,
  roles,
  onSave,
  initialMember,
}: AddMemberDialogProps) => {
  const [name, setName] = useState("");
  const [memberSkills, setMemberSkills] = useState<Array<{ skillId: string; level: SkillLevel }>>([]);
  const [preferredRoles, setPreferredRoles] = useState<string[]>([]);
  const [currentSkillId, setCurrentSkillId] = useState<string>("");
  const [currentSkillLevel, setCurrentSkillLevel] = useState<SkillLevel>(3);
  const [currentRoleId, setCurrentRoleId] = useState<string>("");
  
  // Reset form when dialog opens/closes or initialMember changes
  useEffect(() => {
    if (initialMember) {
      setName(initialMember.name);
      setMemberSkills([...initialMember.skills]);
      setPreferredRoles([...initialMember.preferredRoles]);
    } else {
      setName("");
      setMemberSkills([]);
      setPreferredRoles([]);
    }
    setCurrentSkillId("");
    setCurrentSkillLevel(3);
    setCurrentRoleId("");
  }, [open, initialMember]);
  
  const handleAddSkill = () => {
    if (!currentSkillId) return;
    
    // Check if skill already exists
    if (memberSkills.some((s) => s.skillId === currentSkillId)) {
      // Update existing skill
      setMemberSkills(
        memberSkills.map((s) =>
          s.skillId === currentSkillId ? { ...s, level: currentSkillLevel } : s
        )
      );
    } else {
      // Add new skill
      setMemberSkills([
        ...memberSkills,
        { skillId: currentSkillId, level: currentSkillLevel },
      ]);
    }
    
    setCurrentSkillId("");
    setCurrentSkillLevel(3);
  };
  
  const handleRemoveSkill = (skillId: string) => {
    setMemberSkills(memberSkills.filter((s) => s.skillId !== skillId));
  };
  
  const handleAddPreferredRole = () => {
    if (!currentRoleId || preferredRoles.includes(currentRoleId)) return;
    setPreferredRoles([...preferredRoles, currentRoleId]);
    setCurrentRoleId("");
  };
  
  const handleRemovePreferredRole = (roleId: string) => {
    setPreferredRoles(preferredRoles.filter((id) => id !== roleId));
  };
  
  const handleSave = () => {
    if (!name.trim()) return;
    
    const member: TeamMember = {
      id: initialMember?.id || generateId(),
      name: name.trim(),
      skills: memberSkills,
      preferredRoles,
      assignedRole: initialMember?.assignedRole,
    };
    
    onSave(member);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialMember ? "Edit" : "Add"} Team Member</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter member name"
            />
          </div>
          
          <div className="grid gap-4">
            <Label>Skills</Label>
            <div className="flex gap-2">
              <Select
                value={currentSkillId}
                onValueChange={setCurrentSkillId}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select skill" />
                </SelectTrigger>
                <SelectContent>
                  {skills.map((skill) => (
                    <SelectItem key={skill.id} value={skill.id}>
                      {skill.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleAddSkill}
                disabled={!currentSkillId}
                type="button"
              >
                Add
              </Button>
            </div>
            
            {currentSkillId && (
              <div className="grid gap-2">
                <div className="flex justify-between">
                  <Label>Skill Level</Label>
                  <span className="text-sm">
                    {currentSkillLevel}/5
                  </span>
                </div>
                <Slider
                  value={[currentSkillLevel]}
                  min={1}
                  max={5}
                  step={1}
                  onValueChange={(value) => setCurrentSkillLevel(value[0] as SkillLevel)}
                />
              </div>
            )}
            
            {memberSkills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {memberSkills.map(({ skillId, level }) => {
                  const skill = skills.find((s) => s.id === skillId);
                  return (
                    <div
                      key={skillId}
                      className="bg-muted px-2 py-1 rounded-md flex items-center gap-1 text-sm"
                    >
                      <span>
                        {skill?.name} ({level}/5)
                      </span>
                      <button
                        onClick={() => handleRemoveSkill(skillId)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          <div className="grid gap-4">
            <Label>Preferred Roles</Label>
            <div className="flex gap-2">
              <Select
                value={currentRoleId}
                onValueChange={setCurrentRoleId}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleAddPreferredRole}
                disabled={!currentRoleId}
                type="button"
              >
                Add
              </Button>
            </div>
            
            {preferredRoles.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {preferredRoles.map((roleId) => {
                  const role = roles.find((r) => r.id === roleId);
                  return (
                    <div
                      key={roleId}
                      className="bg-muted px-2 py-1 rounded-md flex items-center gap-1 text-sm"
                    >
                      <span>{role?.name}</span>
                      <button
                        onClick={() => handleRemovePreferredRole(roleId)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
