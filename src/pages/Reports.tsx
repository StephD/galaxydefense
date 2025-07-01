import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ReportForm from "@/components/ReportForm";
import ReportTable from "@/components/ReportTable";
import ReportViewModal from "@/components/ReportViewModal";
import { Report, ModName } from "@/hooks/useReports";
import { useAllReports, useCreateReport, useVoteUpReport, useUpdateReport } from "@/hooks/useReports";
import { toast } from "@/components/ui/use-toast";
import { AlertCircle, Plus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Reports = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [reportToEdit, setReportToEdit] = useState<Report | null>(null);
  
  // Use React Query hook for fetching reports
  const { 
    data: reports = [], 
    isLoading, 
    error, 
    refetch: fetchReports 
  } = useAllReports();
  
  // Report mutations
  const { mutateAsync: createReportMutation } = useCreateReport();
  const { mutateAsync: voteUpReportMutation } = useVoteUpReport();
  const { mutateAsync: updateReportMutation } = useUpdateReport();
  
  // Call fetchReports when admin status changes
  useEffect(() => {
    if (isAdmin) {
      fetchReports();
    }
  }, [isAdmin, fetchReports]);

  const handleViewReport = (report: Report) => {
    // Sanitize the report data before displaying it
    const sanitizedReport = {
      ...report,
      title: report.title.trim(),
      description: report.description.trim(),
      user_id: report.user_id.trim()
    };
    
    setSelectedReport(sanitizedReport);
    setIsViewModalOpen(true);
  };

  const handleCreateReport = async (formData: any) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a report.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Validate and sanitize input
      const sanitizedData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        type: formData.type,
        user_id: formData.user_id.trim(),
        mod_id: formData.mod_id
      };

      // Use the mutation function instead of direct service call
      await createReportMutation({
        title: sanitizedData.title,
        description: sanitizedData.description,
        type: sanitizedData.type,
        user_id: sanitizedData.user_id,
        mod_id: sanitizedData.mod_id
      });

      toast({
        title: "Success",
        description: "Report created successfully",
      });
      
      // Close the create modal after successful submission
      setIsCreateModalOpen(false);
      
      // Reports list will be automatically refreshed by React Query
    } catch (error) {
      console.error('Error creating report:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create report. Please try again later.",
        variant: "destructive",
      });
    }
  };

  // Error handling for report creation
  const handleCreateError = (error: Error) => {
    console.error("Error creating report:", error);
    toast({
      variant: "destructive",
      title: "Error creating report",
      description: error.message || "An unexpected error occurred",
    });
  };
  
  // Handle vote up for a report
  const handleVoteUp = async (reportId: string) => {
    try {
      await voteUpReportMutation(reportId);
      toast({
        title: "Vote Recorded",
        description: "Your vote has been counted.",
      });
    } catch (error) {
      console.error("Error voting up report:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to record your vote. Please try again.",
      });
    }
  };

  // Handle report update
  const handleUpdateReport = async (formData: any) => {
    if (!reportToEdit) return;
    
    try {
      // Sanitize and validate data
      const sanitizedData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        type: formData.type,
        user_id: formData.user_id.trim(),
        mod_id: formData.mod_id
      };

      // Use the mutation function
      await updateReportMutation({
        reportId: reportToEdit.id,
        updates: {
          title: sanitizedData.title,
          description: sanitizedData.description,
          type: sanitizedData.type,
          user_id: sanitizedData.user_id,
          mod_id: sanitizedData.mod_id
        }
      });

      toast({
        title: "Report Updated",
        description: "The report has been successfully updated.",
      });

      // Close the modal after successful update
      setIsEditModalOpen(false);
      setReportToEdit(null);
    } catch (error) {
      console.error("Error updating report:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update report. Please try again.",
      });
    }
  };

  // Error reset handler
  const handleErrorReset = () => {
    fetchReports();
  };

  // Set page title based on access state
  useEffect(() => {
    if (!isAuthenticated) {
      document.title = "Access Denied | Galaxy Defense";
    } else if (!isAdmin) {
      document.title = "Admin Access Required | Galaxy Defense";
    } else {
      document.title = "Reports | Galaxy Defense";
    }
    
    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = "Galaxy Defense";
    };
  }, [isAuthenticated, isAdmin]);

  // // If authenticated but not admin, show permission denied message
  // if (isAuthenticated && !isAdmin) {
  //   return (
  //     <>
  //       <Navigation />
  //       <div className="container mx-auto px-4 py-8">
  //         <Card>
  //           <CardContent className="pt-6 pb-6">
  //             <div className="flex flex-col items-center justify-center py-12">
  //               <AlertCircle className="h-12 w-12 text-destructive mb-4" />
  //               <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
  //               <p className="text-muted-foreground">You don't have permission to view this page.</p>
  //             </div>
  //           </CardContent>
  //         </Card>
  //       </div>
  //     </>
  //   );
  // }

  // Display error state if there's an error
  if (error) {
    return (
      <main className="container mx-auto px-4 py-6">
        <Navigation />
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Reports</h1>
        </div>
      </main>
    );
  }

  // Main admin view with simple error handling
  return (
    <>
      <Navigation />
      <main className="container mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Reports
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Community reports, suggestions and optimisations.
          </p>
        </div>
        <hr />
          
        <div>
          <h2 className="text-xl font-semibold mb-4">Reports List</h2>
          {isLoading ? (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[100px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                      <Skeleton className="h-8 w-[80px]" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : reports.length > 0 ? (
            <ReportTable 
              reports={reports} 
              isLoading={isLoading}
              onViewReport={(report) => {
                setSelectedReport(report);
                setIsViewModalOpen(true);
              }}
              onCreateReport={() => setIsCreateModalOpen(true)}
              onVoteUp={handleVoteUp}
              onEditReport={(report) => {
                setReportToEdit(report);
                setIsEditModalOpen(true);
              }}
            />
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No reports found.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* View Report Modal */}
      {selectedReport && (
        <ReportViewModal
          report={selectedReport}
          isOpen={isViewModalOpen}
          onOpenChange={setIsViewModalOpen}
        />
      )}
      
      {/* Create Report Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Create New Report</DialogTitle>
            <DialogDescription>
              Fill out the form below to submit a new report.
            </DialogDescription>
          </DialogHeader>
          <ReportForm onSubmit={handleCreateReport} />
        </DialogContent>
      </Dialog>

      {/* Edit Report Modal */}
      {reportToEdit && (
        <Dialog open={isEditModalOpen} onOpenChange={(open) => {
          setIsEditModalOpen(open);
          if (!open) setReportToEdit(null);
        }}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Edit Report</DialogTitle>
              <DialogDescription>
                Update the report details below.
              </DialogDescription>
            </DialogHeader>
            <ReportForm 
              onSubmit={handleUpdateReport} 
              defaultValues={{
                title: reportToEdit.title,
                description: reportToEdit.description,
                type: reportToEdit.type,
                user_id: reportToEdit.user_id,
                mod_id: (reportToEdit.mod_id as ModName) || "Other" as ModName
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default Reports;
