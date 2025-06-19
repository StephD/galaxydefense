import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useChipsData, useGearTypes, addChip, type ChipRarity, type GearType, type ChipBase } from "@/hooks/useChipsData";
import { type TowerType, type TowerName, useTowerNames, useTowerTypes, TowerTypeNames } from "@/hooks/useCardsData";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon, PlusCircle, X, Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";

const ChipDatabase = () => {
  const { data: chips = [], isLoading: chipsLoading, error: chipsError } = useChipsData();
  const { data: gearTypes = [] } = useGearTypes();
  const { data: towerNames = [] } = useTowerNames();
  const { data: towerTypes = [] } = useTowerTypes();
  const [selectedGearType, setSelectedGearType] = useState<string>("all");
  const [selectedTowerName, setSelectedTowerName] = useState<string>("all");
  const [selectedTowerType, setSelectedTowerType] = useState<string>("all");
  const [selectedBoostType, setSelectedBoostType] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const queryClient = useQueryClient();
  
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
    values: Record<ChipRarity, string | undefined>;
  }>({
    name: "",
    description: "",
    compatibleGears: [],
    affectedTowers: [],
    boostType: "",
    values: {
      Common: undefined,
      Fine: undefined,
      Rare: undefined,
      Epic: undefined,
      Legendary: undefined,
      Supreme: undefined,
      Ultimate: undefined
    }
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
      setNewChip({
        name: "",
        description: "",
        compatibleGears: [],
        affectedTowers: [],
        boostType: "",
        values: {
          Common: undefined,
          Fine: undefined,
          Rare: undefined,
          Epic: undefined,
          Legendary: undefined,
          Supreme: undefined,
          Ultimate: undefined
        }
      });
      
      // Hide form
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding chip:", error);
      alert("Failed to add chip. Please try again.");
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
      {/* Add Chip Button */}
      <div className="flex justify-between items-center">
        <Button 
          onClick={() => setShowAddForm(!showAddForm)} 
          variant={showAddForm ? "destructive" : "default"}
          className="flex items-center gap-2"
        >
          {showAddForm ? <X className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
          {showAddForm ? "Cancel" : "Add New Chip"}
        </Button>
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
                    {towerNames.map(tower => (
                      <div key={tower} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`tower-${tower}`} 
                          checked={newChip.affectedTowers.includes(tower)}
                          onCheckedChange={() => toggleTower(tower)}
                        />
                        <Label 
                          htmlFor={`tower-${tower}`}
                          className="cursor-pointer flex items-center gap-2"
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
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {chip.compatibleGears.map(gear => (
                          <Badge key={gear} className="bg-gray-100 text-gray-800">
                            {gear}
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
                                "font-medium",
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
