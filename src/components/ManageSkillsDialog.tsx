
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skill } from "@/lib/types";
import AddSkillDialog from "./AddSkillDialog";
import { useState } from "react";

interface ManageSkillsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skills: Skill[];
  onSave: (skills: Skill[]) => void;
}

const ManageSkillsDialog = ({
  open,
  onOpenChange,
  skills,
  onSave,
}: ManageSkillsDialogProps) => {
  const [editedSkills, setEditedSkills] = useState<Skill[]>([]);
  const [addSkillOpen, setAddSkillOpen] = useState(false);
  const [skillToEdit, setSkillToEdit] = useState<Skill | undefined>(undefined);
  
  // Initialize edited skills when dialog opens
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setEditedSkills([...skills]);
    }
    onOpenChange(isOpen);
  };
  
  const handleEditSkill = (skill: Skill) => {
    setSkillToEdit(skill);
    setAddSkillOpen(true);
  };
  
  const handleAddSkill = () => {
    setSkillToEdit(undefined);
    setAddSkillOpen(true);
  };
  
  const handleSaveSkill = (skill: Skill) => {
    if (skillToEdit) {
      // Edit existing skill
      setEditedSkills(editedSkills.map(s => s.id === skill.id ? skill : s));
    } else {
      // Add new skill
      setEditedSkills([...editedSkills, skill]);
    }
  };
  
  const handleDeleteSkill = (skillId: string) => {
    setEditedSkills(editedSkills.filter(s => s.id !== skillId));
  };
  
  const handleSaveChanges = () => {
    onSave(editedSkills);
    onOpenChange(false);
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Manage Skills</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex justify-end mb-4">
              <Button onClick={handleAddSkill}>Add Skill</Button>
            </div>
            
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2">
                {editedSkills.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    No skills added yet. Click "Add Skill" to create one.
                  </div>
                ) : (
                  editedSkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
                    >
                      <span>{skill.name}</span>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditSkill(skill)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteSkill(skill.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AddSkillDialog
        open={addSkillOpen}
        onOpenChange={setAddSkillOpen}
        onSave={handleSaveSkill}
        initialSkill={skillToEdit}
      />
    </>
  );
};

export default ManageSkillsDialog;
