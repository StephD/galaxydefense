import { useState, useMemo, useEffect } from "react";
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
import { Eye, Pencil, ThumbsUp, Filter, Plus, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
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
  const [searchTitle, setSearchTitle] = useState<string>("");
  const [debouncedSearchTitle, setDebouncedSearchTitle] = useState<string>("");
  
  // Debounce search input to avoid excessive filtering
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTitle(searchTitle);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTitle]);
  
  // Function to truncate text if it's too long
  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

  // Function to get badge color based on report type
  const getReportTypeBadge = (type: string) => {
    // Truncate type names to 4 characters
    const getTruncatedName = (fullName: string): string => {
      return fullName.substring(0, 4);
    };
    
    switch (type) {
      case "suggestions":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">{getTruncatedName("Suggestions")}</Badge>;
      case "translation":
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">{getTruncatedName("Translation")}</Badge>;
      case "optimisation":
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">{getTruncatedName("Optimisation")}</Badge>;
      case "other":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">{getTruncatedName("Other")}</Badge>;
      default:
        return <Badge variant="outline">{getTruncatedName(type)}</Badge>;
    }
  };
  
  // Filter and sort reports
  const filteredAndSortedReports = useMemo(() => {
    // First filter by type and title
    const filtered = reports.filter(report => {
      // Filter by type if not 'all'
      const typeMatch = selectedType === "all" || report.type === selectedType;
      
      // Filter by title if search text exists
      const titleMatch = !debouncedSearchTitle || 
        report.title.toLowerCase().includes(debouncedSearchTitle.toLowerCase());
      
      return typeMatch && titleMatch;
    });
      
    // Then sort by votes (descending)
    return [...filtered].sort((a, b) => {
      // Default to 0 if votes is undefined
      const votesA = a.votes || 0;
      const votesB = b.votes || 0;
      return votesB - votesA;
    });
  }, [reports, selectedType, debouncedSearchTitle]);

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
        <div className="flex items-center gap-2 flex-wrap">
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
            <span className="text-sm font-medium">Type:</span>
          </div>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[160px] h-8 text-sm">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Report Types</SelectLabel>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="suggestions">Suggestions</SelectItem>
                <SelectItem value="translation">Translation</SelectItem>
                <SelectItem value="optimisation">Optimisation</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <div className="flex items-center gap-2 ml-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Search:</span>
          </div>
          <div className="relative w-[260px]">
            <Input
              type="text"
              placeholder="Search report titles..."
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              className="h-8 text-sm pl-2 pr-8"
            />
            {searchTitle && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-8 w-8 p-0"
                onClick={() => setSearchTitle("")}
                title="Clear search"
              >
                ×
              </Button>
            )}
          </div>
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
                <TableHead className="py-1 hidden md:table-cell">Description</TableHead>
                <TableHead className="py-1 hidden sm:table-cell">Mod</TableHead>
                <TableHead className="py-1">Votes</TableHead>
                <TableHead className="text-right py-1">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedReports.map((report) => (
                <TableRow 
                  key={report.id} 
                  className="h-10 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => onViewReport(report)}
                >
                  <TableCell className="py-1 px-2">{getReportTypeBadge(report.type)}</TableCell>
                  <TableCell className="font-medium py-1 px-2">{report.title}</TableCell>
                  <TableCell className="py-1 hidden md:table-cell px-2">{truncateText(report.description, 40)}</TableCell>
                  <TableCell className="py-1 hidden sm:table-cell px-2">
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
                    <div className="flex justify-end gap-0" onClick={(e) => e.stopPropagation()}>
                      {onVoteUp && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            onVoteUp(report.id);
                          }}
                          title="Vote up"
                        >
                          <ThumbsUp className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      {onEditReport && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditReport(report);
                          }}
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
