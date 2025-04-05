
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import TeamMemberCard from "./TeamMemberCard";
import RoleCard from "./RoleCard";
import AddMemberDialog from "./AddMemberDialog";
import AddRoleDialog from "./AddRoleDialog";
import ManageSkillsDialog from "./ManageSkillsDialog";
import Header from "./Header";

import { AllocationMethod, Role, Skill, TeamAllocation, TeamMember } from "@/lib/types";
import { allocateRoles, generateId } from "@/lib/utils";
import { defaultRoles, defaultSkills, sampleTeamMembers } from "@/lib/seed-data";

const TeamRoleAllocator = () => {
  const [teamAllocation, setTeamAllocation] = useState<TeamAllocation>({
    id: generateId(),
    name: "My Team",
    timestamp: Date.now(),
    members: [...sampleTeamMembers],
    roles: [...defaultRoles]
  });
  
  const [skills, setSkills] = useState<Skill[]>([...defaultSkills]);
  
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<TeamMember | undefined>(undefined);
  
  const [addRoleOpen, setAddRoleOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState<Role | undefined>(undefined);
  
  const [manageSkillsOpen, setManageSkillsOpen] = useState(false);
  
  const [allocationMethod, setAllocationMethod] = useState<AllocationMethod>("skills");
  
  // Initialize drag state
  useEffect(() => {
    const handleDragStart = (e: DragEvent) => {
      const element = e.target as HTMLElement;
      const memberId = element.dataset.memberId;
      if (memberId && e.dataTransfer) {
        e.dataTransfer.setData("member_id", memberId);
        e.dataTransfer.effectAllowed = "move";
      }
    };
    
    document.addEventListener("dragstart", handleDragStart);
    
    return () => {
      document.removeEventListener("dragstart", handleDragStart);
    };
  }, []);
  
  const handleEditMember = (member: TeamMember) => {
    setMemberToEdit(member);
    setAddMemberOpen(true);
  };
  
  const handleDeleteMember = (memberId: string) => {
    setTeamAllocation(prev => ({
      ...prev,
      members: prev.members.filter(m => m.id !== memberId),
      roles: prev.roles.map(r => 
        r.assignedMemberId === memberId ? { ...r, assignedMemberId: undefined } : r
      )
    }));
  };
  
  const handleSaveMember = (member: TeamMember) => {
    if (memberToEdit) {
      // Update existing member
      setTeamAllocation(prev => ({
        ...prev,
        members: prev.members.map(m => m.id === member.id ? member : m)
      }));
    } else {
      // Add new member
      setTeamAllocation(prev => ({
        ...prev,
        members: [...prev.members, member]
      }));
    }
  };
  
  const handleEditRole = (role: Role) => {
    setRoleToEdit(role);
    setAddRoleOpen(true);
  };
  
  const handleDeleteRole = (roleId: string) => {
    setTeamAllocation(prev => ({
      ...prev,
      roles: prev.roles.filter(r => r.id !== roleId),
      members: prev.members.map(m => 
        m.assignedRole === roleId ? { ...m, assignedRole: undefined } : m
      )
    }));
  };
  
  const handleSaveRole = (role: Role) => {
    if (roleToEdit) {
      // Update existing role
      setTeamAllocation(prev => ({
        ...prev,
        roles: prev.roles.map(r => r.id === role.id ? role : r)
      }));
    } else {
      // Add new role
      setTeamAllocation(prev => ({
        ...prev,
        roles: [...prev.roles, role]
      }));
    }
  };
  
  const handleSaveSkills = (updatedSkills: Skill[]) => {
    setSkills(updatedSkills);
  };
  
  const handleAllocateRoles = () => {
    const { members, roles } = allocateRoles(
      teamAllocation.members,
      teamAllocation.roles,
      allocationMethod
    );
    
    setTeamAllocation(prev => ({
      ...prev,
      members,
      roles
    }));
  };
  
  const handleManualAssignment = (roleId: string, memberId: string | undefined) => {
    // First, unassign the role from any member that had it
    const updatedMembers = teamAllocation.members.map(member => {
      if (member.assignedRole === roleId) {
        return { ...member, assignedRole: undefined };
      }
      // If this is the member we're assigning to, assign the new role and remove any previous role
      if (memberId && member.id === memberId) {
        return { ...member, assignedRole: roleId };
      }
      return member;
    });
    
    // Update the role's assigned member
    const updatedRoles = teamAllocation.roles.map(role => {
      if (role.id === roleId) {
        return { ...role, assignedMemberId: memberId };
      }
      // If this member was previously assigned to another role, unassign them
      if (memberId && role.assignedMemberId === memberId && role.id !== roleId) {
        return { ...role, assignedMemberId: undefined };
      }
      return role;
    });
    
    setTeamAllocation(prev => ({
      ...prev,
      members: updatedMembers,
      roles: updatedRoles
    }));
  };
  
  const handleImport = (data: TeamAllocation) => {
    setTeamAllocation({
      ...data,
      timestamp: Date.now()  // Update timestamp to current
    });
  };
  
  const handleAddMember = () => {
    setMemberToEdit(undefined);
    setAddMemberOpen(true);
  };
  
  const handleAddRole = () => {
    setRoleToEdit(undefined);
    setAddRoleOpen(true);
  };
  
  const handleManageSkills = () => {
    setManageSkillsOpen(true);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        teamAllocation={teamAllocation} 
        onImport={handleImport} 
        onManageSkills={handleManageSkills}
      />
      
      <main className="flex-1">
        <div className="container py-8 space-y-8">
          <Tabs defaultValue="members">
            <TabsList className="mb-6">
              <TabsTrigger value="members">Team Members</TabsTrigger>
              <TabsTrigger value="roles">Roles</TabsTrigger>
              <TabsTrigger value="allocation">Role Allocation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="members" className="animate-fade-in">
              <div className="grid gap-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Team Members</h2>
                  <Button onClick={handleAddMember}>Add Team Member</Button>
                </div>
                
                {teamAllocation.members.length === 0 ? (
                  <Card className="text-center p-8">
                    <p className="text-muted-foreground">
                      No team members added yet. Click "Add Team Member" to get started.
                    </p>
                  </Card>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teamAllocation.members.map((member) => (
                      <TeamMemberCard
                        key={member.id}
                        member={member}
                        skills={skills}
                        roles={teamAllocation.roles}
                        onEdit={handleEditMember}
                        onDelete={handleDeleteMember}
                      />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="roles" className="animate-fade-in">
              <div className="grid gap-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Project Roles</h2>
                  <Button onClick={handleAddRole}>Add Role</Button>
                </div>
                
                {teamAllocation.roles.length === 0 ? (
                  <Card className="text-center p-8">
                    <p className="text-muted-foreground">
                      No roles added yet. Click "Add Role" to get started.
                    </p>
                  </Card>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teamAllocation.roles.map((role) => (
                      <RoleCard
                        key={role.id}
                        role={role}
                        skills={skills}
                        members={teamAllocation.members}
                        onEdit={handleEditRole}
                        onDelete={handleDeleteRole}
                        onMemberAssigned={handleManualAssignment}
                      />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="allocation" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Role Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Allocation Method</h3>
                      <RadioGroup 
                        value={allocationMethod}
                        onValueChange={(value) => setAllocationMethod(value as AllocationMethod)}
                        className="space-y-4"
                      >
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="skills" id="skills" />
                          <div className="grid gap-1">
                            <Label htmlFor="skills" className="font-medium">Skills-based</Label>
                            <p className="text-sm text-muted-foreground">
                              Allocate roles based on team members' skills and role requirements.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="preferences" id="preferences" />
                          <div className="grid gap-1">
                            <Label htmlFor="preferences" className="font-medium">Preference-based</Label>
                            <p className="text-sm text-muted-foreground">
                              Allocate roles based on team members' role preferences.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="random" id="random" />
                          <div className="grid gap-1">
                            <Label htmlFor="random" className="font-medium">Random</Label>
                            <p className="text-sm text-muted-foreground">
                              Randomly allocate roles to team members.
                            </p>
                          </div>
                        </div>
                      </RadioGroup>
                      
                      <div className="mt-6">
                        <Button 
                          size="lg" 
                          onClick={handleAllocateRoles}
                          disabled={teamAllocation.members.length === 0 || teamAllocation.roles.length === 0}
                        >
                          Allocate Roles
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Current Allocations</h3>
                      <ScrollArea className="h-[300px] pr-4">
                        {teamAllocation.roles.filter(r => r.assignedMemberId).length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            No roles have been assigned yet. Use the allocator on the left to assign roles.
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {teamAllocation.roles.filter(r => r.assignedMemberId).map(role => {
                              const assignedMember = teamAllocation.members.find(m => m.id === role.assignedMemberId);
                              if (!assignedMember) return null;
                              
                              return (
                                <div key={role.id} className="flex items-center p-3 bg-muted/50 rounded-md">
                                  <div className="flex-1">
                                    <div className="font-medium">{role.name}</div>
                                    <div className="text-sm text-muted-foreground">{assignedMember.name}</div>
                                  </div>
                                  <div 
                                    className="w-3 h-3 rounded-full" 
                                    style={{ backgroundColor: role.color }}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </ScrollArea>
                      
                      <div className="pt-4 mt-4 border-t">
                        <h4 className="text-sm font-medium mb-2">Manual Assignment</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          You can also drag and drop team members onto roles in the Roles tab.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t p-4">
                  <div className="text-sm text-muted-foreground">
                    {teamAllocation.members.filter(m => m.assignedRole).length} of {teamAllocation.members.length} members assigned
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {teamAllocation.roles.filter(r => r.assignedMemberId).length} of {teamAllocation.roles.length} roles filled
                  </div>
                </CardFooter>
              </Card>
              
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Final Team Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {teamAllocation.roles.map(role => {
                      const assignedMember = teamAllocation.members.find(m => m.id === role.assignedMemberId);
                      
                      return (
                        <div key={role.id} className="p-4 border rounded-md">
                          <div className="flex items-center gap-2 mb-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: role.color }}
                            />
                            <h3 className="font-medium">{role.name}</h3>
                          </div>
                          
                          <Separator className="my-2" />
                          
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Role Description:</p>
                              <p className="text-sm">{role.description || "No description provided"}</p>
                              
                              {role.requiredSkills.length > 0 && (
                                <div className="mt-3">
                                  <p className="text-sm text-muted-foreground mb-1">Required Skills:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {role.requiredSkills.map(({ skillId, minLevel }) => {
                                      const skillInfo = skills.find((s) => s.id === skillId);
                                      return (
                                        <Badge variant="outline" key={skillId} className="text-xs">
                                          {skillInfo?.name}
                                          {minLevel ? ` (Min: ${minLevel})` : ""}
                                        </Badge>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            <div className="bg-muted/30 p-3 rounded-md">
                              <p className="text-sm text-muted-foreground mb-2">Assigned To:</p>
                              
                              {assignedMember ? (
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center text-sm font-medium">
                                    {assignedMember.name.substring(0, 2).toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="font-medium text-sm">{assignedMember.name}</div>
                                    {assignedMember.skills
                                      .filter(s => role.requiredSkills.some(rs => rs.skillId === s.skillId))
                                      .map(s => {
                                        const skillInfo = skills.find((sk) => sk.id === s.skillId);
                                        return (
                                          <Badge key={s.skillId} variant="secondary" className="mt-1 mr-1 text-xs">
                                            {skillInfo?.name}: {s.level}/5
                                          </Badge>
                                        );
                                      })}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-sm text-muted-foreground italic">
                                  No one assigned to this role
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {teamAllocation.roles.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No roles have been defined yet. Go to the Roles tab to add some.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <AddMemberDialog
        open={addMemberOpen}
        onOpenChange={setAddMemberOpen}
        skills={skills}
        roles={teamAllocation.roles}
        onSave={handleSaveMember}
        initialMember={memberToEdit}
      />
      
      <AddRoleDialog
        open={addRoleOpen}
        onOpenChange={setAddRoleOpen}
        skills={skills}
        onSave={handleSaveRole}
        initialRole={roleToEdit}
      />
      
      <ManageSkillsDialog
        open={manageSkillsOpen}
        onOpenChange={setManageSkillsOpen}
        skills={skills}
        onSave={handleSaveSkills}
      />
    </div>
  );
};

export default TeamRoleAllocator;
