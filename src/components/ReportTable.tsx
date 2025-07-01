import { useState, useMemo } from "react";
import { Report, ReportType } from "@/hooks/useReports";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Pencil, ThumbsUp, Filter, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface ReportTableProps {
  reports: Report[];
  isLoading: boolean;
  onViewReport: (report: Report) => void;
  onEditReport?: (report: Report) => void;
  onCreateReport?: () => void;
  onVoteUp?: (reportId: string) => void;
}

const ReportTable = ({
  reports,
  isLoading,
  onViewReport,
  onEditReport,
  onCreateReport,
  onVoteUp,
}: ReportTableProps) => {
  const [selectedType, setSelectedType] = useState<string>("all");
  
  // Function to truncate text if it's too long
  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

  // Function to get badge color based on report type
  const getReportTypeBadge = (type: string) => {
    switch (type) {
      case "suggestions":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Suggestions</Badge>;
      case "translation":
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Translation</Badge>;
      case "optimisation":
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">Optimisation</Badge>;
      case "other":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">Other</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };
  
  // Filter and sort reports
  const filteredAndSortedReports = useMemo(() => {
    // First filter by type if needed
    const filtered = selectedType === "all" 
      ? reports 
      : reports.filter(report => report.type === selectedType);
      
    // Then sort by votes (descending)
    return [...filtered].sort((a, b) => {
      // Default to 0 if votes is undefined
      const votesA = a.votes || 0;
      const votesB = b.votes || 0;
      return votesB - votesA;
    });
  }, [reports, selectedType]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-8 w-[100px]" />
        </div>
        <div className="border rounded-md">
          <div className="p-4 space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[300px]" />
                </div>
                <Skeleton className="h-8 w-[100px]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md">
        <p className="text-muted-foreground">No reports found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter UI */}
      <div className="flex items-center gap-4 justify-between">
        <div className="flex items-center gap-2">
          {onCreateReport && (
            <Button 
              onClick={onCreateReport} 
              size="sm" 
              className="h-8 text-xs px-2 py-1 flex items-center gap-1"
            >
              <Plus size={12} />
              New Report
            </Button>
          )}
          
          <div className="flex items-center gap-2 ml-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filter by type:</span>
          </div>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[180px] h-8 text-sm">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="suggestions">Suggestions</SelectItem>
                <SelectItem value="translation">Translation</SelectItem>
                <SelectItem value="optimisation">Optimisation</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Table */}
      <div className="border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="h-10">
                <TableHead className="py-1">Type</TableHead>
                <TableHead className="py-1">Title</TableHead>
                <TableHead className="py-1">Description</TableHead>
                <TableHead className="py-1">Mod</TableHead>
                <TableHead className="py-1">Votes</TableHead>
                <TableHead className="text-right py-1">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedReports.map((report) => (
                <TableRow key={report.id} className="h-10">
                  <TableCell className="py-1">{getReportTypeBadge(report.type)}</TableCell>
                  <TableCell className="font-medium py-1">{report.title}</TableCell>
                  <TableCell className="py-1">{truncateText(report.description, 40)}</TableCell>
                  <TableCell className="py-1">
                    {report.mod_id ? (
                      <span className="text-sm">{report.mod_id}</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Unknown</span>
                    )}
                  </TableCell>
                  <TableCell className="py-1">
                    <div className="flex items-center gap-1">
                      <span className="text-sm">{report.votes || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-1">
                    <div className="flex justify-end gap-1">
                      {onVoteUp && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => onVoteUp(report.id)}
                          title="Vote up"
                        >
                          <ThumbsUp className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => onViewReport(report)}
                        title="View report details"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      {onEditReport && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => onEditReport(report)}
                          title="Edit report"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ReportTable;
