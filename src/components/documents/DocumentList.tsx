
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  File,
  FileText,
  FilePdf,
  FileSpreadsheet,
  Calendar,
  Tag,
  Search,
  Trash2,
  Download,
  Eye,
  Loader2,
  Plus
} from "lucide-react";

// Document category options and their labels
const categoryOptions = [
  { value: "all", label: "Alla kategorier" },
  { value: "gender_equality", label: "Jämställdhet" },
  { value: "environment", label: "Miljö & Klimat" },
  { value: "social_responsibility", label: "Socialt ansvar" },
  { value: "governance", label: "Bolagsstyrning" },
  { value: "supply_chain", label: "Leverantörskedja" },
  { value: "human_rights", label: "Mänskliga rättigheter" },
  { value: "diversity", label: "Mångfald & Inkludering" },
  { value: "other", label: "Övrigt" }
];

// Find category label by value
const getCategoryLabel = (value: string) => {
  const category = categoryOptions.find(cat => cat.value === value);
  return category ? category.label : value;
};

interface Document {
  id: string;
  name: string;
  description: string;
  category: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadDate: string;
}

interface DocumentListProps {
  onAddNew?: () => void;
  onViewDocument?: (document: Document) => void;
}

const DocumentList = ({ onAddNew, onViewDocument }: DocumentListProps) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    const loadDocuments = async () => {
      setIsLoading(true);
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Load from localStorage
        const savedDocs = localStorage.getItem("documents");
        if (savedDocs) {
          setDocuments(JSON.parse(savedDocs));
        }
      } catch (error) {
        console.error("Error loading documents:", error);
        toast.error("Ett fel uppstod vid laddning av dokument");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDocuments();
  }, []);

  // Filter documents based on search and category
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || doc.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Format file size to KB, MB, etc.
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  // Format date to locale format
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  // Get appropriate icon for file type
  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) {
      return <FilePdf className="h-10 w-10 text-red-500" />;
    } else if (fileType.includes("spreadsheet") || fileType.includes("excel")) {
      return <FileSpreadsheet className="h-10 w-10 text-green-600" />;
    } else if (fileType.includes("word") || fileType.includes("document")) {
      return <FileText className="h-10 w-10 text-blue-600" />;
    } else {
      return <File className="h-10 w-10 text-gray-600" />;
    }
  };

  const handleDeleteDocument = async (id: string) => {
    setIsDeleting(id);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Filter out the deleted document
      const updatedDocs = documents.filter(doc => doc.id !== id);
      
      // Update state and localStorage
      setDocuments(updatedDocs);
      localStorage.setItem("documents", JSON.stringify(updatedDocs));
      
      toast.success("Dokumentet har tagits bort");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Ett fel uppstod vid borttagning av dokumentet");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Search and filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Sök dokument..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="w-full sm:w-48">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Alla kategorier" />
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
          </div>
          
          {onAddNew && (
            <Button onClick={onAddNew} className="shrink-0">
              <Plus className="h-4 w-4 mr-2" />
              Ladda upp
            </Button>
          )}
        </div>
      </div>
      
      {/* Document list */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Inga dokument hittades</h3>
            <p className="text-muted-foreground mb-6">
              {documents.length === 0
                ? "Du har inte laddat upp några dokument än."
                : "Inga dokument matchar din sökning eller filtrering."}
            </p>
            {onAddNew && (
              <Button onClick={onAddNew}>
                <Plus className="h-4 w-4 mr-2" />
                Ladda upp ditt första dokument
              </Button>
            )}
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-4">
            {filteredDocuments.map((doc) => (
              <li 
                key={doc.id} 
                className="document-card bg-card border rounded-xl p-4 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start">
                  <div className="mr-4 mt-1">
                    {getFileIcon(doc.fileType)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-lg truncate">{doc.name}</h3>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1 mb-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        <span>{formatDate(doc.uploadDate)}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Tag className="h-3.5 w-3.5 mr-1" />
                        <span>{getCategoryLabel(doc.category)}</span>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        {formatFileSize(doc.fileSize)}
                      </div>
                    </div>
                    
                    {doc.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {doc.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {onViewDocument && (
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => onViewDocument(doc)}
                        className="rounded-full hover:bg-primary/10 hover:text-primary"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Visa detaljer</span>
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => toast.info("Nedladdningsfunktionen är inte implementerad i denna demo.")}
                      className="rounded-full hover:bg-primary/10 hover:text-primary"
                    >
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Ladda ner</span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleDeleteDocument(doc.id)}
                      disabled={isDeleting === doc.id}
                      className="rounded-full hover:bg-destructive/10 hover:text-destructive"
                    >
                      {isDeleting === doc.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      <span className="sr-only">Ta bort</span>
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DocumentList;
