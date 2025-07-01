import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ReportForm from "@/components/ReportForm";
import ReportTable from "@/components/ReportTable";
import ReportViewModal from "@/components/ReportViewModal";
import { Report } from "@/hooks/useReports";
import { useAllReports, useCreateReport } from "@/hooks/useReports";
import { toast } from "@/components/ui/use-toast";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Navigation from "@/components/Navigation";

const Reports = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  // Use React Query hook for fetching reports
  const { 
    data: reports = [], 
    isLoading, 
    error, 
    refetch: fetchReports 
  } = useAllReports();
  
  // Create report mutation
  const { mutateAsync: createReportMutation } = useCreateReport();
  
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
        user_id: formData.user_id.trim()
      };

      // Use the mutation function instead of direct service call
      await createReportMutation({
        title: sanitizedData.title,
        description: sanitizedData.description,
        type: sanitizedData.type,
        user_id: sanitizedData.user_id
      });

      toast({
        title: "Success",
        description: "Report created successfully",
      });
      
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

  // If not authenticated, show login required message
  if (!isAuthenticated) {
    return (
      <>
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6 pb-6">
              <div className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                <p className="text-muted-foreground">Please log in to access this page.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

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
      <div className="container mx-auto px-4 py-8">
        <Navigation />
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Reports</h1>
        </div>
      </div>
    );
  }

  // Main admin view with simple error handling
  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Reports</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Report</h2>
          <ReportForm onSubmit={handleCreateReport} />
        </div>
        
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
          ) : (
            <ReportTable 
              reports={reports} 
              isLoading={isLoading} 
              onViewReport={handleViewReport} 
            />
          )}
        </div>
      </div>

      {selectedReport && (
        <ReportViewModal
          report={selectedReport}
          isOpen={isViewModalOpen}
          onOpenChange={setIsViewModalOpen}
        />
      )}
    </>
  );
};

export default Reports;
