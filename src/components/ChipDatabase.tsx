import { useState, useMemo, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useChipsData, useGearTypes, ChipBase, GearType, ChipRarity, addChip, updateChip } from "@/hooks/useChipsData";
import { type TowerType, type TowerName, useTowerNames, useTowerTypes, TowerTypeNames } from "@/hooks/useCardsData";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon, PlusCircle, X, Check, ChevronDown, ChevronUp, Edit, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

const ChipDatabase = () => {
  const { data: chips = [], isLoading: chipsLoading, error: chipsError } = useChipsData();
  const { data: gearTypes = [] } = useGearTypes();
  const { data: towerNames = [] } = useTowerNames();
  const { data: towerTypes = [] } = useTowerTypes();
  const { user } = useAuth();
  const [selectedGearType, setSelectedGearType] = useState<string>("all");
  const [selectedTowerName, setSelectedTowerName] = useState<string>("all");
  const [selectedTowerType, setSelectedTowerType] = useState<string>("all");
  const [selectedBoostType, setSelectedBoostType] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [chipSearchQuery, setChipSearchQuery] = useState("");
  const [selectedChipToUpdate, setSelectedChipToUpdate] = useState<ChipBase | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const isAuthenticated = !!user;
  
  // Column visibility state - only for rarity columns
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    Common: false,  // Hidden by default
    Fine: false,    // Hidden by default
    Rare: true,
    Epic: true,
    Legendary: true,
    Supreme: true,
    Ultimate: true
  });
  
  // Form state for adding a new chip
  const [newChip, setNewChip] = useState<{
    name: string;
    description: string;
    compatibleGears: GearType[];
    affectedTowers: TowerName[];
    boostType: string;
    values: Record<ChipRarity, string>
  }>({
    name: "",
    description: "",
    compatibleGears: [] as GearType[],
    affectedTowers: [] as TowerName[],
    boostType: "",
    values: {
      Common: "",
      Fine: "",
      Rare: "",
      Epic: "",
      Legendary: "",
      Supreme: "",
      Ultimate: ""
    } as Record<ChipRarity, string>
  });
  
  // Helper function to get tower type from tower name
  const getTowerTypeFromName = (towerName: TowerName): TowerType | undefined => {
    for (const [towerType, towerNames] of Object.entries(TowerTypeNames)) {
      if (towerNames.includes(towerName)) {
        return towerType as TowerType;
      }
    }
    return undefined;
  };

  // Filter chips based on selected filters
  const filteredChips = useMemo(() => {
    return chips.filter(chip => {
      // Filter by gear type
      if (selectedGearType !== "all" && !chip.compatibleGears.includes(selectedGearType as GearType)) {
        return false;
      }
      
      // Filter by tower name
      if (selectedTowerName !== "all" && !chip.affectedTowers.includes(selectedTowerName as TowerName)) {
        return false;
      }

      // Filter by tower type
      if (selectedTowerType !== "all") {
        const hasTowersOfType = chip.affectedTowers.some(tower => {
          const towerType = getTowerTypeFromName(tower as TowerName);
          return towerType === selectedTowerType;
        });
        if (!hasTowersOfType) {
          return false;
        }
      }
      
      // Filter by boost type
      if (selectedBoostType !== "all" && chip.boostType !== selectedBoostType) {
        return false;
      }
      
      return true;
    });
  }, [chips, selectedGearType, selectedTowerName, selectedTowerType, selectedBoostType]);
  
  const getRarityColor = (rarity: ChipRarity) => {
    switch (rarity) {
      case "Common": return "bg-gray-300 text-gray-800";
      case "Fine": return "bg-green-400 text-green-900";
      case "Rare": return "bg-blue-400 text-blue-900";
      case "Epic": return "bg-purple-400 text-purple-900";
      case "Legendary": return "bg-orange-400 text-orange-900";
      case "Supreme": return "bg-red-400 text-red-900";
      case "Ultimate": return "bg-gradient-to-r from-red-400 via-green-400 to-blue-400 text-white";
      default: return "bg-gray-200 text-gray-800";
    }
  };
  
  const getGearTypeColor = (gearType: GearType) => {
    switch (gearType) {
      case "Armor": return "bg-slate-200 text-slate-800";
      case "Helmet": return "bg-amber-200 text-amber-800";
      case "Energy Core": return "bg-cyan-200 text-cyan-800";
      case "Boots": return "bg-lime-200 text-lime-800";
      case "Shield": return "bg-indigo-200 text-indigo-800";
      case "Weapon": return "bg-rose-200 text-rose-800";
      default: return "bg-gray-200 text-gray-800";
    }
  };
  
  const getTowerTypeColor = (towerType: TowerType | TowerName) => {
    // Check if it's a tower name first
    if (typeof towerType === 'string') {
    // Physical towers (sky-blue)
      if (TowerTypeNames.Physical.includes(towerType as TowerName)) {
      return "bg-sky-200 text-sky-800";
    }
    // Energy towers (green)
      else if (TowerTypeNames.Energy.includes(towerType as TowerName)) {
      return "bg-green-300 text-green-800";
    }
    // Electric towers (purple)
      else if (TowerTypeNames.Electric.includes(towerType as TowerName)) {
      return "bg-purple-300 text-purple-800";
    }
      // Fire towers (blue)
      else if (TowerTypeNames.Fire.includes(towerType as TowerName)) {
        return "bg-blue-300 text-blue-800";
    }
      // Force-field towers (Grey-white)
      else if (TowerTypeNames["Force-field"].includes(towerType as TowerName)) {
        return "bg-slate-300 text-slate-800";
      }
      // All towers
      else if (towerType === "All") {
        return "bg-gray-200 text-gray-800";
      }
    }
    // If it's a tower type category
    else {
      switch(towerType) {
        case "Physical": return "bg-sky-200 text-sky-800";
        case "Energy": return "bg-green-300 text-green-800";
        case "Electric": return "bg-purple-300 text-purple-800";
        case "Fire": return "bg-blue-300 text-blue-800";
        case "Force-field": return "bg-slate-300 text-slate-800";
        default: return "bg-gray-200 text-gray-800";
    }
    }
    // Default
    return "bg-gray-200 text-gray-800";
  };
  
  // Get all possible rarities from the data
  const rarities: ChipRarity[] = ["Common", "Fine", "Rare", "Epic", "Legendary", "Supreme", "Ultimate"];
  
  // Available boost types
  const boostTypes = [
    "Crit",
    "Crit DMG",
    "Tower Boost",
    "Tower Ability",
    "Tower DMG",
    "Fortress",
    "Conditional DMG",
    "Game Mechanic",
    "DMG Type"
  ];
  
  // Handle form submission
  const handleAddChip = async () => {
    // Validate form
    if (!newChip.name) {
      alert("Please enter a chip name");
      return;
    }
    if (!newChip.boostType) {
      alert("Please select a boost type");
      return;
    }
    if (newChip.compatibleGears.length === 0) {
      alert("Please select at least one compatible gear");
      return;
    }
    if (newChip.affectedTowers.length === 0) {
      alert("Please select at least one affected tower");
      return;
    }
    if (Object.values(newChip.values).every(v => v === undefined)) {
      alert("Please enter at least one rarity value");
      return;
    }
    
    try {
      // Prepare chip data for submission
      const chipData = {
        name: newChip.name,
        description: newChip.description,
        compatibleGears: newChip.compatibleGears,
        affectedTowers: newChip.affectedTowers,
        boostType: newChip.boostType,
        values: Object.fromEntries(
          Object.entries(newChip.values).filter(([_, value]) => value !== undefined)
        ) as ChipBase['values']
      };
      
      // Add chip to database via Supabase
      const addedChip = await addChip(chipData as ChipBase);
      
      // Update local cache with the new chip
      queryClient.setQueryData(["chips"], (oldData: ChipBase[] | undefined) => {
        return [...(oldData || []), addedChip];
      });
      
      // Reset form
      resetForm();
      
      // Hide form
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding chip:", error);
      alert("Failed to add chip. Please try again.");
    }
  };
  
  // Reset form function
  const resetForm = () => {
    setNewChip({
      name: "",
      description: "",
      compatibleGears: [] as GearType[],
      affectedTowers: [] as TowerName[],
      boostType: "",
      values: {
        Common: "",
        Fine: "",
        Rare: "",
        Epic: "",
        Legendary: "",
        Supreme: "",
        Ultimate: ""
      } as Record<ChipRarity, string>
    });
  };
  
  // Handle searching for chips to update
  const handleChipSearch = (query: string) => {
    setChipSearchQuery(query);
  };
  
  // Handle click outside search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node) && chipSearchQuery) {
        // Only clear if we have a selected chip, otherwise keep the search open
        if (selectedChipToUpdate) {
          setChipSearchQuery("");
        }
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [chipSearchQuery, selectedChipToUpdate]);
  
  // Filter chips based on search query
  const searchResults = useMemo(() => {
    if (!chipSearchQuery.trim()) return [];
    
    const lowerQuery = chipSearchQuery.toLowerCase();
    return chips.filter(chip => 
      chip.name.toLowerCase().includes(lowerQuery) ||
      chip.description.toLowerCase().includes(lowerQuery)
    ).slice(0, 5); // Limit to 5 results
  }, [chips, chipSearchQuery]);
  
  // Select a chip to update
  const handleSelectChipToUpdate = (chip: ChipBase) => {
    setSelectedChipToUpdate(chip);
    setNewChip({
      name: chip.name,
      description: chip.description,
      compatibleGears: [...chip.compatibleGears] as GearType[],
      affectedTowers: [...chip.affectedTowers] as TowerName[],
      boostType: chip.boostType,
      values: { ...chip.values } as Record<ChipRarity, string>
    });
  };
  
  // Handle updating a chip
  const handleUpdateChip = async () => {
    if (!selectedChipToUpdate) {
      alert("No chip selected for update");
      return;
    }
    
    if (!newChip.name) {
      alert("Please enter a chip name");
      return;
    }
    
    try {
      // Update chip in database
      const updatedChip = await updateChip(selectedChipToUpdate.id, newChip);
      
      // Update local cache
      queryClient.setQueryData(["chips"], (oldData: ChipBase[] | undefined) => {
        if (!oldData) return [updatedChip];
        return oldData.map(chip => chip.id === updatedChip.id ? updatedChip : chip);
      });
      
      // Reset form
      resetForm();
      setSelectedChipToUpdate(null);
      setChipSearchQuery("");
      
      // Hide form
      setShowUpdateForm(false);
    } catch (error) {
      console.error("Error updating chip:", error);
      alert("Failed to update chip. Please try again.");
    }
  };
  
  // Toggle gear selection
  const toggleGear = (gear: GearType) => {
    if (newChip.compatibleGears.includes(gear)) {
      setNewChip({
        ...newChip,
        compatibleGears: newChip.compatibleGears.filter(g => g !== gear)
      });
    } else {
      setNewChip({
        ...newChip,
        compatibleGears: [...newChip.compatibleGears, gear]
      });
    }
  };
  
  // Toggle tower selection
  const toggleTower = (tower: TowerName) => {
    if (tower === "All") {
      if (newChip.affectedTowers.includes("All" as TowerName)) {
        // If "All" is being unchecked, just remove it
        setNewChip({
          ...newChip,
          affectedTowers: newChip.affectedTowers.filter(t => t !== "All")
        });
      } else {
        // If "All" is being checked, make it the only selection
        setNewChip({
          ...newChip,
          affectedTowers: ["All" as TowerName]
        });
      }
    } else {
      // If "All" is already selected, don't allow other selections
      if (newChip.affectedTowers.includes("All" as TowerName)) {
        return;
      }
      
      // Normal toggle behavior for other towers
      if (newChip.affectedTowers.includes(tower)) {
        setNewChip({
          ...newChip,
          affectedTowers: newChip.affectedTowers.filter(t => t !== tower)
        });
      } else {
        setNewChip({
          ...newChip,
          affectedTowers: [...newChip.affectedTowers, tower]
        });
      }
    }
  };
  
  // Update rarity value
  const updateRarityValue = (rarity: ChipRarity, value: string) => {
    // Format the value appropriately, respecting negative values
    const formattedValue = value === "" ? undefined : 
      value.startsWith('+') || value.startsWith('-') ? value : // Keep as is if already has sign
      value.includes('%') ? value : // Keep as is if already has %
      `+${value}`; // Add + prefix only for positive values without sign
    
    setNewChip({
      ...newChip,
      values: {
        ...newChip.values,
        [rarity]: formattedValue
      }
    });
  };
  
  if (chipsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-secondary/20 rounded-lg">
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-6 w-40" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (chipsError) {
    return (
      <div className="text-center py-8 text-destructive">
        Error loading chips data. Please try again later.
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          {isAuthenticated && (
            <>
              <Button 
                onClick={() => {
                  setShowAddForm(!showAddForm);
                  if (showUpdateForm) setShowUpdateForm(false);
                  if (!showAddForm) resetForm();
                }} 
                variant={showAddForm ? "destructive" : "default"}
                className="flex items-center gap-2"
              >
                {showAddForm ? <X className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
                {showAddForm ? "Cancel" : "Add New Chip"}
              </Button>
              
              <Button 
                onClick={() => {
                  setShowUpdateForm(!showUpdateForm);
                  if (showAddForm) setShowAddForm(false);
                  if (!showUpdateForm) {
                    resetForm();
                    setSelectedChipToUpdate(null);
                    setChipSearchQuery("");
                  }
                }} 
                variant={showUpdateForm ? "destructive" : "default"}
                className="flex items-center gap-2"
              >
                {showUpdateForm ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                {showUpdateForm ? "Cancel" : "Update Chip"}
              </Button>
            </>  
          )}
          
          {/* Search input for chips */}
          {isAuthenticated && showUpdateForm && (
            <div className="relative ml-2 w-64" ref={searchRef}>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                placeholder="Search chips..."
                value={chipSearchQuery}
                onChange={(e) => handleChipSearch(e.target.value)}
                className="pl-10 w-full"
              />
              
              {/* Search results dropdown */}
              {chipSearchQuery && searchResults.length > 0 && (
                <div className="absolute z-10 mt-1 w-full border rounded-md overflow-hidden bg-background shadow-md">
                  {searchResults.map(chip => (
                    <div 
                      key={chip.id}
                      className={cn(
                        "p-2 cursor-pointer hover:bg-secondary/50",
                        selectedChipToUpdate?.id === chip.id && "bg-secondary"
                      )}
                      onClick={() => handleSelectChipToUpdate(chip)}
                    >
                      <div className="font-medium">{chip.name}</div>
                      <div className="text-sm text-muted-foreground truncate">{chip.description}</div>
                    </div>
                  ))}
                </div>
              )}
              
              {chipSearchQuery && searchResults.length === 0 && (
                <div className="absolute z-10 mt-1 w-full border rounded-md p-2 bg-background shadow-md text-sm text-muted-foreground">
                  No chips found
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Add Chip Form */}
      {showAddForm && (
        <Card className="border-dashed border-primary/50">
          <CardHeader>
            <CardTitle>Add New Chip</CardTitle>
            <CardDescription>Fill in the details to add a new chip to the database</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="chip-name">Chip Name *</Label>
                  <Input 
                    id="chip-name" 
                    placeholder="Enter chip name" 
                    value={newChip.name}
                    onChange={(e) => setNewChip({...newChip, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="chip-description">Description *</Label>
                  <Textarea 
                    id="chip-description" 
                    placeholder="Enter chip description" 
                    value={newChip.description}
                    onChange={(e) => setNewChip({...newChip, description: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="boost-type">Boost Type *</Label>
                  <Select 
                    value={newChip.boostType} 
                    onValueChange={(value) => setNewChip({...newChip, boostType: value})}
                  >
                    <SelectTrigger id="boost-type">
                      <SelectValue placeholder="Select boost type" />
                    </SelectTrigger>
                    <SelectContent>
                      {boostTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Compatible Gear and Affected Towers */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="block mb-2">Compatible Gear Types *</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {gearTypes.map(gear => (
                      <div key={gear} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`gear-${gear}`} 
                          checked={newChip.compatibleGears.includes(gear)}
                          onCheckedChange={() => toggleGear(gear)}
                        />
                        <Label 
                          htmlFor={`gear-${gear}`}
                          className="cursor-pointer flex items-center gap-2"
                        >
                          <Badge variant="outline">{gear}</Badge>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="block mb-2">Affected Towers *</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {/* Special "All" option at the top */}
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="tower-All" 
                        checked={newChip.affectedTowers.includes("All" as TowerName)}
                        onCheckedChange={() => toggleTower("All" as TowerName)}
                      />
                      <Label 
                        htmlFor="tower-All"
                        className="cursor-pointer flex items-center gap-2"
                      >
                        <Badge className="bg-purple-300 text-purple-800 font-bold">All</Badge>
                      </Label>
                    </div>
                    
                    {/* Other tower options */}
                    {towerNames.filter(tower => tower !== "All").map(tower => (
                      <div key={tower} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`tower-${tower}`} 
                          checked={newChip.affectedTowers.includes(tower)}
                          onCheckedChange={() => toggleTower(tower)}
                          disabled={newChip.affectedTowers.includes("All" as TowerName)}
                        />
                        <Label 
                          htmlFor={`tower-${tower}`}
                          className={`cursor-pointer flex items-center gap-2 ${newChip.affectedTowers.includes("All" as TowerName) ? "opacity-50" : ""}`}
                        >
                          <Badge className={getTowerTypeColor(tower as TowerName)}>{tower}</Badge>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Rarity Values */}
            <div className="mt-6">
              <Label className="block mb-3">Boost Values by Rarity</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {rarities.map(rarity => (
                  <div key={rarity} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getRarityColor(rarity)}>{rarity}</Badge>
                    </div>
                    <Input 
                      type="text" 
                      placeholder="e.g. +5% or +10" 
                      value={newChip.values[rarity] === undefined ? "" : newChip.values[rarity]}
                      onChange={(e) => updateRarityValue(rarity, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
            <Button onClick={handleAddChip} className="flex items-center gap-2">
              <Check className="h-4 w-4" /> Add Chip
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Update Chip Form */}
      {showUpdateForm && selectedChipToUpdate && (
        <Card className="border-dashed border-amber-500/50">
          <CardHeader>
            <CardTitle>Update Chip: {selectedChipToUpdate.name}</CardTitle>
            <CardDescription>Modify the chip details and save your changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="update-chip-name">Chip Name *</Label>
                  <Input 
                    id="update-chip-name" 
                    placeholder="Enter chip name" 
                    value={newChip.name}
                    onChange={(e) => setNewChip({...newChip, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="update-chip-description">Description *</Label>
                  <Textarea 
                    id="update-chip-description" 
                    placeholder="Enter chip description" 
                    value={newChip.description}
                    onChange={(e) => setNewChip({...newChip, description: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="update-boost-type">Boost Type *</Label>
                  <Select 
                    value={newChip.boostType} 
                    onValueChange={(value) => setNewChip({...newChip, boostType: value})}
                  >
                    <SelectTrigger id="update-boost-type">
                      <SelectValue placeholder="Select boost type" />
                    </SelectTrigger>
                    <SelectContent>
                      {boostTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Compatible Gear and Affected Towers */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="block mb-2">Compatible Gear Types *</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {gearTypes.map(gear => (
                      <div key={gear} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`update-gear-${gear}`} 
                          checked={newChip.compatibleGears.includes(gear)}
                          onCheckedChange={() => toggleGear(gear)}
                        />
                        <Label 
                          htmlFor={`update-gear-${gear}`}
                          className="cursor-pointer flex items-center gap-2"
                        >
                          <Badge variant="outline">{gear}</Badge>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="block mb-2">Affected Towers *</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {/* Special "All" option at the top */}
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="update-tower-All" 
                        checked={newChip.affectedTowers.includes("All" as TowerName)}
                        onCheckedChange={() => toggleTower("All" as TowerName)}
                      />
                      <Label 
                        htmlFor="update-tower-All"
                        className="cursor-pointer flex items-center gap-2"
                      >
                        <Badge className="bg-purple-300 text-purple-800 font-bold">All</Badge>
                      </Label>
                    </div>
                    
                    {/* Other tower options */}
                    {towerNames.filter(tower => tower !== "All").map(tower => (
                      <div key={tower} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`update-tower-${tower}`} 
                          checked={newChip.affectedTowers.includes(tower)}
                          onCheckedChange={() => toggleTower(tower)}
                          disabled={newChip.affectedTowers.includes("All" as TowerName)}
                        />
                        <Label 
                          htmlFor={`update-tower-${tower}`}
                          className={`cursor-pointer flex items-center gap-2 ${newChip.affectedTowers.includes("All" as TowerName) ? "opacity-50" : ""}`}
                        >
                          <Badge className={getTowerTypeColor(tower as TowerName)}>{tower}</Badge>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Rarity Values */}
            <div className="mt-6">
              <Label className="block mb-3">Boost Values by Rarity</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {rarities.map(rarity => (
                  <div key={rarity} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getRarityColor(rarity)}>{rarity}</Badge>
                    </div>
                    <Input 
                      type="text" 
                      placeholder="e.g. +5% or +10" 
                      value={newChip.values[rarity] === undefined ? "" : newChip.values[rarity]}
                      onChange={(e) => updateRarityValue(rarity, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {
              setShowUpdateForm(false);
              setSelectedChipToUpdate(null);
              setChipSearchQuery("");
            }}>Cancel</Button>
            <Button onClick={handleUpdateChip} className="flex items-center gap-2">
              <Check className="h-4 w-4" /> Save Changes
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Filters and Column Visibility */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          {/* Gear Type Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Gear Type:</label>
            <Select value={selectedGearType} onValueChange={setSelectedGearType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select gear type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Gear Types</SelectItem>
                {gearTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Tower Name Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Tower:</label>
            <Select value={selectedTowerName} onValueChange={setSelectedTowerName}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select tower" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Towers</SelectItem>
                {towerNames.map(tower => (
                  <SelectItem key={tower} value={tower}>{tower}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Tower Type Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Tower Type:</label>
            <Select value={selectedTowerType} onValueChange={setSelectedTowerType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select tower type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tower Types</SelectItem>
                {towerTypes.map(type => (
                  <SelectItem 
                    key={type} 
                    value={type}
                  >
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Boost Type Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Boost Type:</label>
            <Select value={selectedBoostType} onValueChange={setSelectedBoostType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select boost type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Boost Types</SelectItem>
                {boostTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Rarity Column Visibility */}
        <div className="flex flex-col gap-1 w-full md:w-auto">
          <label className="text-sm font-medium">Show Rarity Columns:</label>
          <div className="flex flex-wrap gap-2">
            {rarities.map(rarity => (
              <Badge 
                key={rarity} 
                variant={visibleColumns[rarity] ? "default" : "outline"}
                className={cn(
                  "cursor-pointer",
                  visibleColumns[rarity] ? getRarityColor(rarity) : ""
                )}
                onClick={() => setVisibleColumns(prev => ({ ...prev, [rarity]: !prev[rarity] }))}
              >
                {rarity}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      
      {/* Results Count */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Showing {filteredChips.length} of {chips.length} chips
        </div>
      </div>

      {/* Chips Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Chip Database</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Name</TableHead>
                  <TableHead className="whitespace-nowrap">Gears</TableHead>
                  <TableHead className="whitespace-nowrap">Towers</TableHead>
                  <TableHead className="whitespace-nowrap">Boost Type</TableHead>
                  {rarities.map(rarity => (
                    visibleColumns[rarity] && (
                      <TableHead key={rarity} className="whitespace-nowrap">
                        <Badge className={getRarityColor(rarity)}>
                          {rarity}
                        </Badge>
                      </TableHead>
                    )
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredChips.map(chip => (
                  <TableRow key={chip.id}>
                    <TableCell className="font-medium whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="flex items-center gap-1">
                              {chip.name}
                              <InfoIcon className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">{chip.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 w-7 p-0" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowUpdateForm(true);
                            if (showAddForm) setShowAddForm(false);
                            handleSelectChipToUpdate(chip);
                          }}
                        >
                          <Edit className="h-3.5 w-3.5" />
                          <span className="sr-only">Edit {chip.name}</span>
                        </Button>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {chip.compatibleGears.map(gear => (
                          <Badge key={gear} className="bg-gray-100 text-gray-800">
                            {gear.charAt(0).toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {chip.affectedTowers.map(tower => (
                          <Badge key={tower} className={getTowerTypeColor(tower)}>
                            {tower}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    
                    <TableCell className="whitespace-nowrap">{chip.boostType}</TableCell>
                    
                    {rarities.map(rarity => (
                      visibleColumns[rarity] && (
                        <TableCell key={rarity} className="text-center">
                          <div className="flex justify-center items-center">
                            {chip.values[rarity] !== undefined ? (
                              <span className={cn(
                                "font-medium align-middle",
                                rarity === "Ultimate" && "text-primary"
                              )}>
                                {chip.values[rarity]}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </div>
                        </TableCell>
                      )
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {filteredChips.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No chips match your current filters.
        </div>
      )}
    </div>
  );
};

export default ChipDatabase;
