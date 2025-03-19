
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, X, FileText, File, Loader2 } from "lucide-react";

// Document category options
const categoryOptions = [
  { value: "gender_equality", label: "Jämställdhet" },
  { value: "environment", label: "Miljö & Klimat" },
  { value: "social_responsibility", label: "Socialt ansvar" },
  { value: "governance", label: "Bolagsstyrning" },
  { value: "supply_chain", label: "Leverantörskedja" },
  { value: "human_rights", label: "Mänskliga rättigheter" },
  { value: "diversity", label: "Mångfald & Inkludering" },
  { value: "other", label: "Övrigt" }
];

interface DocumentUploadProps {
  onUploadComplete?: (document: any) => void;
  onCancel?: () => void;
  accountingPeriod?: string;
}

interface DocumentData {
  id: string;
  category: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadDate: string;
  accountingPeriod: string;
  file?: File;
}

const DocumentUpload = ({ onUploadComplete, onCancel, accountingPeriod }: DocumentUploadProps) => {
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getPeriodInfo = () => {
    if (!accountingPeriod) return null;
    
    const savedPeriods = localStorage.getItem("accounting-periods");
    if (savedPeriods) {
      const periods = JSON.parse(savedPeriods);
      return periods.find((p: any) => p.id === accountingPeriod);
    }
    return null;
  };

  const periodInfo = getPeriodInfo();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Check file size (limit to 10MB for example)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Filen är för stor. Max filstorlek är 10MB.");
      return;
    }
    
    // Check file type
    const acceptedTypes = [
      "application/pdf", 
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain"
    ];
    
    if (!acceptedTypes.includes(file.type)) {
      toast.error("Filtypen stöds inte. Vänligen ladda upp en PDF, Word, Excel eller textfil.");
      return;
    }
    
    setFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !file || !accountingPeriod) {
      toast.error("Vänligen välj en kategori och ladda upp en fil.");
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create document object with minimal data
      const newDocument: DocumentData = {
        id: `doc-${Date.now()}`,
        category,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadDate: new Date().toISOString(),
        accountingPeriod: accountingPeriod,
        file
      };
      
      // Get existing documents or initialize empty array
      const existingDocs = JSON.parse(localStorage.getItem("documents") || "[]");
      
      // Add new document
      localStorage.setItem("documents", JSON.stringify([...existingDocs, newDocument]));
      
      toast.success("Dokumentet har laddats upp");
      
      // Call onUploadComplete if provided
      if (onUploadComplete) {
        onUploadComplete(newDocument);
      }
      
      // Reset form
      setCategory("");
      setFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Ett fel uppstod vid uppladdning av dokumentet");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full space-y-6 animate-fade-in">
      {periodInfo && (
        <div className="bg-muted p-3 rounded-md">
          <p className="text-sm font-medium">Dokument laddas upp till räkenskapsperiod:</p>
          <p className="text-sm">{periodInfo.name}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(periodInfo.startDate).toLocaleDateString()} - {new Date(periodInfo.endDate).toLocaleDateString()}
          </p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6 w-full">
        <div className="space-y-4">          
          <div className="space-y-2">
            <Label htmlFor="category" className="font-medium">
              Kategori <span className="text-destructive">*</span>
            </Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Välj en kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Välj huvudkategori för dokumentet - innehållet kommer analyseras automatiskt
            </p>
          </div>
          
          <div className="space-y-2">
            <Label className="font-medium">
              Fil <span className="text-destructive">*</span>
            </Label>
            
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`
                border-2 border-dashed rounded-lg p-6 transition-all duration-200 w-full
                ${dragActive ? "border-primary bg-primary/5" : "border-border"}
                ${file ? "bg-secondary/50" : ""}
              `}
            >
              {!file ? (
                <div className="flex flex-col items-center justify-center space-y-4 text-center w-full">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Dra och släpp din fil här</h3>
                    <p className="text-sm text-muted-foreground">
                      Eller klicka för att välja en fil från din dator
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, Word, Excel eller textfil (max 10MB)
                    </p>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    className="relative"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Välj fil
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-4 w-full">
                  <div className="rounded-md bg-primary/10 p-2 flex-shrink-0">
                    <File className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB • {
                        file.type.split("/")[1].toUpperCase()
                      }
                    </p>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setFile(null)}
                    className="rounded-full hover:bg-destructive/10 hover:text-destructive flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Ta bort fil</span>
                  </Button>
                </div>
              )}
              
              <Input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                onChange={handleChange}
                className="hidden"
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-end space-x-4">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isUploading}
            >
              Avbryt
            </Button>
          )}
          
          <Button type="submit" disabled={isUploading || !file || !accountingPeriod}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Laddar upp...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Ladda upp dokument
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DocumentUpload;
