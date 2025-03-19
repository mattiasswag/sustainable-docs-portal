
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DocumentUpload from "@/components/documents/DocumentUpload";
import DocumentList from "@/components/documents/DocumentList";
import AccountingPeriodSelector from "@/components/accounting/AccountingPeriodSelector";
import { toast } from "sonner";

interface Document {
  id: string;
  category: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadDate: string;
  accountingPeriod?: string;
}

const Documents = () => {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [currentPeriod, setCurrentPeriod] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  // Load documents and accounting periods
  useEffect(() => {
    const loadDocuments = () => {
      const savedDocs = localStorage.getItem("documents");
      if (savedDocs) {
        setDocuments(JSON.parse(savedDocs));
      }
    };

    loadDocuments();

    if (!currentPeriod) {
      const savedPeriods = localStorage.getItem("accounting-periods");
      if (savedPeriods) {
        const periods = JSON.parse(savedPeriods);
        if (periods.length > 0) {
          setCurrentPeriod(periods[0].id);
        }
      }
    }
  }, [currentPeriod]);

  // Handle adding new document
  const handleAddNew = () => {
    setIsUploadDialogOpen(true);
  };

  // Handle upload completion
  const handleUploadComplete = () => {
    // Refresh documents list after upload
    const savedDocs = localStorage.getItem("documents");
    if (savedDocs) {
      setDocuments(JSON.parse(savedDocs));
    }
    setIsUploadDialogOpen(false);
    toast.success("Dokumentet har laddats upp");
  };

  // Handle viewing document details
  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
    setIsViewDialogOpen(true);
  };

  // Handle document deletion
  const handleDeleteDocument = async (id: string) => {
    try {
      // Filter out the deleted document
      const updatedDocs = documents.filter(doc => doc.id !== id);
      
      // Update state and localStorage
      setDocuments(updatedDocs);
      localStorage.setItem("documents", JSON.stringify(updatedDocs));
      
      // Close view dialog if the deleted document was selected
      if (selectedDocument && selectedDocument.id === id) {
        setIsViewDialogOpen(false);
      }
      
      toast.success("Dokumentet har tagits bort");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Ett fel uppstod vid borttagning av dokumentet");
    }
  };

  // Get current period name for display
  const getCurrentPeriodName = () => {
    if (!currentPeriod) return "";
    
    const savedPeriods = localStorage.getItem("accounting-periods");
    if (savedPeriods) {
      const periods = JSON.parse(savedPeriods);
      const period = periods.find((p: any) => p.id === currentPeriod);
      return period ? period.name : "";
    }
    return "";
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col space-y-4 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dokument</h1>
            <p className="text-muted-foreground">
              Hantera hållbarhetsrelaterade dokument
            </p>
          </div>
        </div>
        
        <div className="w-full md:max-w-md">
          <div className="space-y-1">
            <label className="text-sm font-medium">Räkenskapsperiod</label>
            <AccountingPeriodSelector
              value={currentPeriod}
              onChange={setCurrentPeriod}
            />
          </div>
        </div>
      </div>
      
      <DocumentList 
        onAddNew={handleAddNew}
        onViewDocument={handleViewDocument}
        onDeleteDocument={handleDeleteDocument}
        documents={documents}
        accountingPeriod={currentPeriod}
      />
      
      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ladda upp dokument</DialogTitle>
            <DialogDescription>
              Ladda upp ett hållbarhetsrelaterat dokument för räkenskapsperiod:{" "}
              <span className="font-medium">{getCurrentPeriodName()}</span>
            </DialogDescription>
          </DialogHeader>
          
          <DocumentUpload 
            onUploadComplete={handleUploadComplete}
            onCancel={() => setIsUploadDialogOpen(false)}
            accountingPeriod={currentPeriod}
          />
        </DialogContent>
      </Dialog>
      
      {/* View Document Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Dokumentdetaljer</DialogTitle>
            <DialogDescription>
              Information om dokumentet
            </DialogDescription>
          </DialogHeader>
          
          {selectedDocument && (
            <div className="space-y-4 py-2">
              <div className="space-y-1">
                <h3 className="font-medium text-sm">Filnamn</h3>
                <p>{selectedDocument.fileName}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h3 className="font-medium text-sm">Kategori</h3>
                  <p className="text-muted-foreground">
                    {selectedDocument.category.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <h3 className="font-medium text-sm">Uppladdad</h3>
                  <p className="text-muted-foreground">
                    {new Date(selectedDocument.uploadDate).toLocaleDateString("sv-SE", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h3 className="font-medium text-sm">Filstorlek</h3>
                  <p className="text-muted-foreground">
                    {selectedDocument.fileSize < 1024
                      ? `${selectedDocument.fileSize} B`
                      : selectedDocument.fileSize < 1048576
                      ? `${(selectedDocument.fileSize / 1024).toFixed(1)} KB`
                      : `${(selectedDocument.fileSize / 1048576).toFixed(1)} MB`}
                  </p>
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium text-sm">Räkenskapsperiod</h3>
                  <p className="text-muted-foreground">
                    {(() => {
                      if (!selectedDocument.accountingPeriod) return "Inte specificerad";
                      
                      const savedPeriods = localStorage.getItem("accounting-periods");
                      if (savedPeriods) {
                        const periods = JSON.parse(savedPeriods);
                        const period = periods.find((p: any) => p.id === selectedDocument.accountingPeriod);
                        return period ? period.name : "Okänd period";
                      }
                      return "Okänd period";
                    })()}
                  </p>
                </div>
              </div>
              
              <div className="pt-2 flex space-x-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsViewDialogOpen(false)}
                >
                  Stäng
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => {
                    handleDeleteDocument(selectedDocument.id);
                  }}
                >
                  Ta bort
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Documents;
