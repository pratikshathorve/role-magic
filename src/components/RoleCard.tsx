
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Role, Skill, TeamMember } from "@/lib/types";
import { getSkillLevelText } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

interface RoleCardProps {
  role: Role;
  skills: Skill[];
  members: TeamMember[];
  onEdit: (role: Role) => void;
  onDelete: (roleId: string) => void;
  onMemberAssigned?: (roleId: string, memberId: string | undefined) => void;
}

const RoleCard = ({
  role,
  skills,
  members,
  onEdit,
  onDelete,
  onMemberAssigned,
}: RoleCardProps) => {
  const assignedMember = members.find((m) => m.id === role.assignedMemberId);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add("active");
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("active");
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove("active");
    const memberId = e.dataTransfer.getData("member_id");
    onMemberAssigned?.(role.id, memberId || undefined);
  };
  
  return (
    <Card className="overflow-hidden role-card" style={{ borderTopColor: role.color }}>
      <div
        className="h-2"
        style={{ backgroundColor: role.color }}
      />
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold">{role.name}</h3>
            <p className="text-sm text-muted-foreground">{role.description}</p>
          </div>
          {role.color && (
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: role.color }}
            />
          )}
        </div>
        
        <div className="mb-4">
          <h4 className="text-xs uppercase font-semibold text-muted-foreground mb-2">
            Required Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {role.requiredSkills.map((skill) => {
              const skillInfo = skills.find((s) => s.id === skill.skillId);
              return (
                <Badge variant="outline" key={skill.skillId} className="text-xs">
                  {skillInfo?.name}
                  {skill.minLevel && ` (${getSkillLevelText(skill.minLevel)}+)`}
                </Badge>
              );
            })}
            {role.requiredSkills.length === 0 && (
              <span className="text-xs text-muted-foreground">No specific skills required</span>
            )}
          </div>
        </div>
        
        <div 
          className={`p-4 mt-4 rounded-md drop-area ${assignedMember ? 'bg-muted/50' : 'bg-transparent'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <h4 className="text-xs uppercase font-semibold text-muted-foreground mb-2 text-center">
            {assignedMember ? 'Assigned To' : 'Drag Team Member Here'}
          </h4>
          
          {assignedMember ? (
            <div className="flex items-center gap-3 justify-center">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-purple-100 text-purple-800 text-xs">
                  {getInitials(assignedMember.name)}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">{assignedMember.name}</div>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-6 w-6" 
                onClick={() => onMemberAssigned?.(role.id, undefined)}
              >
                ✕
              </Button>
            </div>
          ) : (
            <div className="text-center text-muted-foreground text-sm">
              No one assigned
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t bg-muted/30 p-2">
        <Button variant="ghost" size="sm" onClick={() => onEdit(role)}>
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(role.id)}
          className="text-destructive hover:text-destructive"
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RoleCard;
