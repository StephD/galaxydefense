import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useBoosters, addBooster, editBooster, bulkUpdateBoosters, downloadActiveBoostersList, Booster } from "@/hooks/useBoosters";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Plus, Search, Pencil, CheckCircle2, XCircle, Download } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import BoosterForm from "@/components/BoosterForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Boosters: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: boosters = [], isLoading, error, refetch } = useBoosters();
  const { mutateAsync: createBooster } = addBooster();
  const { mutateAsync: updateBooster } = editBooster();
  const { mutateAsync: bulkUpdate, isPending: isBulkUpdating } = bulkUpdateBoosters();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [boosterToEdit, setBoosterToEdit] = useState<Booster | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkBoosterList, setBulkBoosterList] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // Redirect to home if not authenticated
  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Access Denied",
        description: "You must be logged in to view this page.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Handle bulk update of boosters
  const handleBulkUpdate = async () => {
    try {
      const results = await bulkUpdate({ boosterList: bulkBoosterList });
      
      toast({
        title: "Bulk Update Complete",
        description: `Added ${results.added} new boosters and updated ${results.updated} existing boosters.${results.errors.length > 0 ? ' Some errors occurred.' : ''}`
      });
      
      if (results.errors.length > 0) {
        console.error("Bulk update errors:", results.errors);
      }
      
      setIsBulkModalOpen(false);
      setBulkBoosterList("");
    } catch (error) {
      console.error("Error during bulk update:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update boosters",
        variant: "destructive",
      });
    }
  };

  // Handle creation of a new booster
  const handleCreateBooster = async (formData: any) => {
    try {
      // Sanitize input data
      const sanitizedData = {
        discord_name: formData.discord_name.trim(),
        game_id: formData.game_id.trim(),
        active: formData.active,
        premium_since: formData.premium_since || null
      };

      await createBooster(sanitizedData);

      toast({
        title: "Success",
        description: "Booster added successfully",
      });

      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating booster:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add booster",
        variant: "destructive",
      });
    }
  };

  // Handle updating a booster's status
  const handleToggleStatus = async (booster: Booster) => {
    try {
      await updateBooster({
        discord_name: booster.discord_name,
        updates: {
          active: !booster.active
        }
      });

      toast({
        title: "Status Updated",
        description: `Booster is now ${!booster.active ? "active" : "inactive"}`
      });
    } catch (error) {
      console.error("Error updating booster status:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update booster status",
        variant: "destructive",
      });
    }
  };

  // Handle editing a booster
  const handleEditBooster = async (formData: any) => {
    if (!boosterToEdit) return;

    try {
      // Sanitize input data
      const sanitizedData = {
        discord_name: formData.discord_name.trim(),
        discord_nickname: formData.discord_nickname.trim(),
        game_id: formData.game_id.trim(),
        active: formData.active,
        premium_since: formData.premium_since || null
      };

      await updateBooster({
        discord_name: boosterToEdit.discord_name,
        updates: sanitizedData
      });

      toast({
        title: "Success",
        description: "Booster updated successfully",
      });

      setIsEditModalOpen(false);
      setBoosterToEdit(null);
    } catch (error) {
      console.error("Error updating booster:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update booster",
        variant: "destructive",
      });
    }
  };

  // Filter boosters based on search term
  const filteredBoosters = boosters.filter(booster => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (
      booster.discord_name.toLowerCase().includes(searchLower) ||
      (booster.discord_nickname && booster.discord_nickname.toLowerCase().includes(searchLower)) ||
      booster.game_id.toLowerCase().includes(searchLower)
    );
    
    // If showInactive is false, only show active boosters
    return matchesSearch && (showInactive || booster.active);
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredBoosters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBoosters = filteredBoosters.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, showInactive]);

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Verifying access...</span>
      </div>
    );
  }

  // If not authenticated, don't render the content (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Boosters
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Manage all game boosters. View active and inactive boosters.
          </p>
          {!isLoading && !error && (
            <div className="mt-4">
              <p className="text-lg font-semibold text-primary">
                Total Boosters: {boosters.length}
              </p>
            </div>
          )}
        </div>
        <hr className="my-2" />

        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading boosters data...</span>
              </div>
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-10 text-destructive">
                <p>Error loading boosters data</p>
                <p className="text-sm opacity-70">{String(error)}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Filter and Add Button UI */}
            <div className="flex items-center gap-4 justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setIsCreateModalOpen(true)} 
                    size="sm" 
                    className="h-8 text-xs px-2 py-1 flex items-center gap-1"
                  >
                    <Plus size={12} />
                    Add Booster
                  </Button>

                  <Button 
                    onClick={() => downloadActiveBoostersList(boosters)}
                    size="sm" 
                    variant="outline"
                    className="h-8 text-xs px-2 py-1 flex items-center gap-1"
                    title="Download active boosters' game IDs"
                  >
                    <Download size={12} />
                    Download IDs
                  </Button>
                </div>
               
                <div className="flex items-center ml-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="show-inactive" 
                      checked={showInactive}
                      onCheckedChange={(checked) => setShowInactive(checked as boolean)}
                    />
                    <label 
                      htmlFor="show-inactive" 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Inactive
                    </label>
                  </div>
                </div>
                <div className="relative w-[260px]">
                  <Input
                    type="text"
                    placeholder="Search by name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-8 text-sm pl-2 pr-8"
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-8 w-8 p-0"
                      onClick={() => setSearchTerm("")}
                      title="Clear search"
                    >
                      ×
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Filtered count display */}
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-muted-foreground">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredBoosters.length)} of {filteredBoosters.length} boosters
                {filteredBoosters.length !== boosters.length && ` (filtered from ${boosters.length} total)`}
              </p>
              {totalPages > 1 && (
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </p>
              )}
            </div>
            
            {/* Table */}
            <div className="border rounded-md overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="h-10">
                      <TableHead className="py-1 px-2">Discord</TableHead>
                      <TableHead className="py-1 px-2">Nickname</TableHead>
                      <TableHead className="py-1 px-2">Game ID</TableHead>
                      <TableHead className="py-1 px-2">Status</TableHead>
                      <TableHead className="py-1 px-2">Since</TableHead>
                      <TableHead className="py-1 px-2">Last Edit</TableHead>
                      <TableHead className="text-right py-1 px-2">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedBoosters.length > 0 ? (
                      paginatedBoosters.map((booster) => (
                        <TableRow 
                          key={booster.discord_name} 
                          className={`h-10 cursor-pointer ${!booster.game_id || booster.game_id.trim() === '' ? 'bg-red-100 hover:bg-red-200' : 'hover:bg-muted/50'}`}
                          onClick={() => {
                            setBoosterToEdit(booster);
                            setIsEditModalOpen(true);
                          }}
                        >
                          <TableCell className="font-medium py-1 px-2">{booster.discord_name}</TableCell>
                          <TableCell className="py-1 px-2">{booster.discord_nickname || '-'}</TableCell>
                          <TableCell className="py-1 px-2">{booster.game_id ? (booster.game_id.length > 28 ? `${booster.game_id.slice(0, 28)}...` : booster.game_id) : '-'}</TableCell>
                          <TableCell className="py-1 px-2">
                            <Badge 
                              variant={booster.active ? "default" : "secondary"} 
                              className={booster.active ? "bg-green-200 text-green-800 hover:bg-green-300" : ""}
                            >
                              {booster.active ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-1 px-2">{booster.premium_since ? new Date(booster.premium_since).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'long',
                              year: '2-digit'
                            }) : '-'}</TableCell>
                          <TableCell className="py-1 px-2">{booster.updated_at ? new Date(booster.updated_at).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'long',
                              year: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : '-'}</TableCell>
                          <TableCell className="text-right py-1 px-2">
                            <div className="flex justify-end gap-0">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleStatus(booster);
                                }}
                                title={booster.active ? "Mark as inactive" : "Mark as active"}
                              >
                                {booster.active ? 
                                  <XCircle className="h-4 w-4" /> : 
                                  <CheckCircle2 className="h-4 w-4" />}
                              </Button>
                              
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          {filteredBoosters.length === 0 ? (searchTerm ? "No boosters match your search" : "No boosters found") : "No boosters on this page"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="h-8 px-3"
                >
                  Previous
                </Button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNumber}
                        variant={currentPage === pageNumber ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNumber)}
                        className="h-8 w-8 p-0"
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="h-8 px-3"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
        
        {/* Create Booster Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Add New Booster</DialogTitle>
              <DialogDescription>
                Enter the booster's details below.
              </DialogDescription>
            </DialogHeader>
            <BoosterForm 
              onSubmit={handleCreateBooster} 
              onCancel={() => setIsCreateModalOpen(false)} 
            />
          </DialogContent>
        </Dialog>
        
        {/* Edit Booster Modal */}
        {boosterToEdit && (
          <Dialog 
            open={isEditModalOpen} 
            onOpenChange={(open) => {
              setIsEditModalOpen(open);
              if (!open) setBoosterToEdit(null);
            }}
          >
            <DialogContent className="sm:max-w-[450px]">
              <DialogHeader>
                <DialogTitle>Edit Booster</DialogTitle>
                <DialogDescription>
                  Update the booster's information below.
                </DialogDescription>
              </DialogHeader>
              <BoosterForm 
                onSubmit={handleEditBooster} 
                onCancel={() => setIsEditModalOpen(false)}
                defaultValues={{
                  discord_name: boosterToEdit.discord_name,
                  discord_nickname: boosterToEdit.discord_nickname || "",
                  game_id: boosterToEdit.game_id || "",
                  active: boosterToEdit.active
                }}
                isEditing={true}
              />
            </DialogContent>
          </Dialog>
        )}
        
        {/* Bulk Update Modal */}
        <Dialog open={isBulkModalOpen} onOpenChange={setIsBulkModalOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Bulk Update Boosters</DialogTitle>
              <DialogDescription>
                Enter a list of Discord names separated by colons (format: "name1:name2:name3").
                All boosters in this list will be set as active, and any active boosters not in this list will be set as inactive.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid w-full gap-1.5">
                <label htmlFor="bulk-boosters" className="text-sm font-medium">
                  Booster List
                </label>
                <Textarea
                  id="bulk-boosters"
                  placeholder="first_user:second_user:third_user"
                  className="min-h-[200px] font-mono text-sm"
                  value={bulkBoosterList}
                  onChange={(e) => setBulkBoosterList(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Format: discord_name1:discord_name2:discord_name3 (separated by colons)
                </p>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsBulkModalOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleBulkUpdate} 
                  disabled={isBulkUpdating || !bulkBoosterList.trim()}
                >
                  {isBulkUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Boosters
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Boosters;
