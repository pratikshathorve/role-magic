
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
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { Role, Skill, SkillLevel } from "@/lib/types";
import { generateId } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

interface AddRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skills: Skill[];
  onSave: (role: Role) => void;
  initialRole?: Role;
}

const AddRoleDialog = ({
  open,
  onOpenChange,
  skills,
  onSave,
  initialRole,
}: AddRoleDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [requiredSkills, setRequiredSkills] = useState<Array<{ skillId: string; minLevel?: SkillLevel }>>([]);
  const [currentSkillId, setCurrentSkillId] = useState<string>("");
  const [currentMinLevel, setCurrentMinLevel] = useState<SkillLevel | undefined>(undefined);
  const [color, setColor] = useState("#8B5CF6"); // Default purple
  
  // Reset form when dialog opens/closes or initialRole changes
  useEffect(() => {
    if (initialRole) {
      setName(initialRole.name);
      setDescription(initialRole.description);
      setRequiredSkills([...initialRole.requiredSkills]);
      setColor(initialRole.color || "#8B5CF6");
    } else {
      setName("");
      setDescription("");
      setRequiredSkills([]);
      setColor("#8B5CF6");
    }
    setCurrentSkillId("");
    setCurrentMinLevel(undefined);
  }, [open, initialRole]);
  
  const handleAddSkill = () => {
    if (!currentSkillId) return;
    
    // Check if skill already exists
    if (requiredSkills.some((s) => s.skillId === currentSkillId)) {
      // Update existing skill
      setRequiredSkills(
        requiredSkills.map((s) =>
          s.skillId === currentSkillId ? { ...s, minLevel: currentMinLevel } : s
        )
      );
    } else {
      // Add new skill
      setRequiredSkills([
        ...requiredSkills,
        { skillId: currentSkillId, minLevel: currentMinLevel },
      ]);
    }
    
    setCurrentSkillId("");
    setCurrentMinLevel(undefined);
  };
  
  const handleRemoveSkill = (skillId: string) => {
    setRequiredSkills(requiredSkills.filter((s) => s.skillId !== skillId));
  };
  
  const handleSave = () => {
    if (!name.trim()) return;
    
    const role: Role = {
      id: initialRole?.id || generateId(),
      name: name.trim(),
      description: description.trim(),
      requiredSkills,
      color,
      assignedMemberId: initialRole?.assignedMemberId,
    };
    
    onSave(role);
    onOpenChange(false);
  };
  
  const predefinedColors = [
    "#8B5CF6", // Purple
    "#0EA5E9", // Blue
    "#10B981", // Green
    "#F59E0B", // Amber
    "#EF4444", // Red
    "#EC4899", // Pink
    "#6366F1", // Indigo
    "#14B8A6", // Teal
  ];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialRole ? "Edit" : "Add"} Role</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Role Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter role name"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this role's responsibilities"
              rows={3}
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Role Color</Label>
            <div className="flex flex-wrap gap-2">
              {predefinedColors.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`w-8 h-8 rounded-full transition-all ${
                    color === c
                      ? "ring-2 ring-offset-2 ring-primary"
                      : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-8 h-8 cursor-pointer bg-transparent"
              />
            </div>
          </div>
          
          <div className="grid gap-4">
            <Label>Required Skills</Label>
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
                  <Label>Minimum Skill Level</Label>
                  <span className="text-sm">
                    {currentMinLevel ? `${currentMinLevel}/5` : "Not specified"}
                  </span>
                </div>
                <Slider
                  value={currentMinLevel ? [currentMinLevel] : [0]}
                  min={0}
                  max={5}
                  step={1}
                  onValueChange={(value) => {
                    const level = value[0];
                    setCurrentMinLevel(level === 0 ? undefined : (level as SkillLevel));
                  }}
                />
                <div className="text-xs text-muted-foreground">
                  Set to 0 for no minimum requirement
                </div>
              </div>
            )}
            
            {requiredSkills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {requiredSkills.map(({ skillId, minLevel }) => {
                  const skill = skills.find((s) => s.id === skillId);
                  return (
                    <div
                      key={skillId}
                      className="bg-muted px-2 py-1 rounded-md flex items-center gap-1 text-sm"
                    >
                      <span>
                        {skill?.name}
                        {minLevel ? ` (Min: ${minLevel}/5)` : ""}
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

export default AddRoleDialog;
