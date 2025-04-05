
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skill, TeamMember } from "@/lib/types";
import { getInitials, getSkillLevelText } from "@/lib/utils";
import { Role } from "@/lib/types";

interface TeamMemberCardProps {
  member: TeamMember;
  skills: Skill[];
  roles: Role[];
  onEdit: (member: TeamMember) => void;
  onDelete: (memberId: string) => void;
  isDraggable?: boolean;
}

const TeamMemberCard = ({
  member,
  skills,
  roles,
  onEdit,
  onDelete,
  isDraggable = false,
}: TeamMemberCardProps) => {
  const assignedRole = roles.find((role) => role.id === member.assignedRole);
  
  return (
    <Card className={`overflow-hidden ${isDraggable ? 'drag-item cursor-move' : ''}`}>
      <div
        className={`h-2 ${
          assignedRole
            ? `bg-[${assignedRole.color}]`
            : "bg-gray-200"
        }`}
      />
      <CardContent className="pt-6">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-12 w-12 border">
            <AvatarFallback className="bg-purple-100 text-purple-800">
              {getInitials(member.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{member.name}</h3>
            {assignedRole && (
              <Badge 
                className="mt-1" 
                style={{ backgroundColor: assignedRole.color }}
              >
                {assignedRole.name}
              </Badge>
            )}
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-xs uppercase font-semibold text-muted-foreground mb-2">
            Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {member.skills.map((skill) => {
              const skillInfo = skills.find((s) => s.id === skill.skillId);
              return (
                <Badge variant="outline" key={skill.skillId} className="text-xs">
                  {skillInfo?.name}: {getSkillLevelText(skill.level)}
                </Badge>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase font-semibold text-muted-foreground mb-2">
            Preferred Roles
          </h4>
          <div className="flex flex-wrap gap-2">
            {member.preferredRoles.map((roleId) => {
              const role = roles.find((r) => r.id === roleId);
              return role ? (
                <Badge 
                  variant="secondary" 
                  key={roleId} 
                  className="text-xs"
                  style={{ backgroundColor: role.color + '20', color: role.color }}
                >
                  {role.name}
                </Badge>
              ) : null;
            })}
            {member.preferredRoles.length === 0 && (
              <span className="text-xs text-muted-foreground">No preferences</span>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t bg-muted/30 p-2">
        <Button variant="ghost" size="sm" onClick={() => onEdit(member)}>
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(member.id)}
          className="text-destructive hover:text-destructive"
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TeamMemberCard;
