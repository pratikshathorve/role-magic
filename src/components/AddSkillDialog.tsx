
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
import { useState, useEffect } from "react";
import { Skill } from "@/lib/types";
import { generateId } from "@/lib/utils";

interface AddSkillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (skill: Skill) => void;
  initialSkill?: Skill;
}

const AddSkillDialog = ({
  open,
  onOpenChange,
  onSave,
  initialSkill,
}: AddSkillDialogProps) => {
  const [name, setName] = useState("");
  
  // Reset form when dialog opens/closes or initialSkill changes
  useEffect(() => {
    if (initialSkill) {
      setName(initialSkill.name);
    } else {
      setName("");
    }
  }, [open, initialSkill]);
  
  const handleSave = () => {
    if (!name.trim()) return;
    
    const skill: Skill = {
      id: initialSkill?.id || generateId(),
      name: name.trim(),
    };
    
    onSave(skill);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialSkill ? "Edit" : "Add"} Skill</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Skill Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter skill name"
            />
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

export default AddSkillDialog;
