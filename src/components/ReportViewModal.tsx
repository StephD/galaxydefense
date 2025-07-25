import { Report } from "@/hooks/useReports";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface ReportViewModalProps {
  report: Report;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ReportViewModal = ({ report, isOpen, onOpenChange }: ReportViewModalProps) => {
  // Function to format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP 'at' p");
    } catch (error) {
      return dateString;
    }
  };

  // Function to get badge color based on report type
  const getReportTypeBadge = (type: string) => {
    switch (type) {
      case "suggestions":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Suggestions</Badge>;
      case "translation":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Translation</Badge>;
      case "optimisation":
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">Optimisation</Badge>;
      case "other":
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">Other</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange} >
      <DialogContent className="sm:max-w-lg pb-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {report.title}
            <span className="ml-2">{getReportTypeBadge(report.type)}</span>
          </DialogTitle>
          <DialogDescription className="text-left">
            <div className="flex flex-col gap-1">
              <div>Reported by User ID: {report.user_id}</div>
              {report.mod_id && (
                <div className="text-xs">Moderator: <span className="font-medium">{report.mod_id}</span></div>
              )}
              {report.created_at && (
                <span className="text-xs">
                  Created on {formatDate(report.created_at)}
                </span>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-0">
          <h3 className="text-sm font-medium mb-2">Description</h3>
          <div className="bg-secondary/50 p-4 rounded-md whitespace-pre-wrap">
            {report.description}
          </div>
        </div>
        
        <div className="mt-0 flex justify-end">
          <Button 
            variant="outline" 
            size="sm"
            className="px-3 py-3 text-xs"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportViewModal;
