
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { TeamAllocation } from "@/lib/types";
import { downloadObjectAsJson } from "@/lib/utils";

interface HeaderProps {
  teamAllocation: TeamAllocation;
  onImport: (data: TeamAllocation) => void;
  onManageSkills: () => void;
}

const Header = ({ teamAllocation, onImport, onManageSkills }: HeaderProps) => {
  const { toast } = useToast();

  const handleExport = () => {
    const exportName = `team-allocation-${new Date().toISOString().split('T')[0]}`;
    downloadObjectAsJson(teamAllocation, exportName);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          
          // Basic validation
          if (!data.members || !data.roles || !data.name) {
            throw new Error("Invalid team allocation data");
          }
          
          onImport(data);
          toast({
            title: "Import successful",
            description: `Imported team: ${data.name}`,
          });
        } catch (error) {
          toast({
            title: "Import failed",
            description: "The selected file contains invalid data",
            variant: "destructive",
          });
        }
      };
      
      reader.readAsText(file);
    };
    
    input.click();
  };
  
  return (
    <header className="border-b bg-card">
      <div className="container flex justify-between items-center py-4">
        <div>
          <h1 className="text-2xl font-bold text-purple-600">Team Role Allocator</h1>
          <p className="text-muted-foreground">Assign roles to your team members efficiently</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={onManageSkills}>
            Manage Skills
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExport}>Export Data</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleImport}>Import Data</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
