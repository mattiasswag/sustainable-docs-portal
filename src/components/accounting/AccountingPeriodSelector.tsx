
import { useState, useEffect } from "react";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Plus } from "lucide-react";
import { toast } from "sonner";

interface AccountingPeriodSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

interface AccountingPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

const AccountingPeriodSelector = ({ value, onChange }: AccountingPeriodSelectorProps) => {
  const [periods, setPeriods] = useState<AccountingPeriod[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newPeriodName, setNewPeriodName] = useState("");
  const [newStartDate, setNewStartDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");

  // Load saved accounting periods
  useEffect(() => {
    const savedPeriods = localStorage.getItem("accounting-periods");
    if (savedPeriods) {
      setPeriods(JSON.parse(savedPeriods));
    } else {
      // Create default period if none exists
      const defaultPeriod = {
        id: "default",
        name: "Standard räkenskapsperiod",
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
      };
      setPeriods([defaultPeriod]);
      localStorage.setItem("accounting-periods", JSON.stringify([defaultPeriod]));
    }
  }, []);

  // Set default value if none selected
  useEffect(() => {
    if (periods.length > 0 && !value) {
      onChange(periods[0].id);
    }
  }, [periods, value, onChange]);

  const handleAddPeriod = () => {
    if (!newPeriodName || !newStartDate || !newEndDate) {
      toast.error("Vänligen fyll i alla fält");
      return;
    }

    const newPeriod: AccountingPeriod = {
      id: `period-${Date.now()}`,
      name: newPeriodName,
      startDate: newStartDate,
      endDate: newEndDate
    };

    const updatedPeriods = [...periods, newPeriod];
    setPeriods(updatedPeriods);
    localStorage.setItem("accounting-periods", JSON.stringify(updatedPeriods));
    
    // Select the new period
    onChange(newPeriod.id);
    
    // Reset form and close dialog
    setNewPeriodName("");
    setNewStartDate("");
    setNewEndDate("");
    setIsAddDialogOpen(false);
    
    toast.success("Ny räkenskapsperiod har skapats");
  };

  // Find current period name
  const getCurrentPeriodName = () => {
    const period = periods.find(p => p.id === value);
    return period ? period.name : "Välj period";
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="flex-1">
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder="Välj räkenskapsperiod">
              {getCurrentPeriodName()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {periods.map((period) => (
                <SelectItem key={period.id} value={period.id}>
                  {period.name} ({new Date(period.startDate).toLocaleDateString()} - {new Date(period.endDate).toLocaleDateString()})
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={() => setIsAddDialogOpen(true)}
        title="Lägg till räkenskapsperiod"
      >
        <Plus className="h-4 w-4" />
      </Button>
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Lägg till räkenskapsperiod</DialogTitle>
            <DialogDescription>
              Skapa en ny räkenskapsperiod för att gruppera dina dokument
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="periodName">Namn</Label>
              <Input
                id="periodName"
                value={newPeriodName}
                onChange={(e) => setNewPeriodName(e.target.value)}
                placeholder="t.ex. Räkenskapsår 2023"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Startdatum</Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="startDate"
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate">Slutdatum</Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="endDate"
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleAddPeriod}>
              Lägg till period
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountingPeriodSelector;
