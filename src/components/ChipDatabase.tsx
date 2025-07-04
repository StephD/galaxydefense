import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useChipsData, useGearTypes, ChipBase, GearType, ChipRarity, addChip, updateChip } from "@/hooks/useChipsData";
import { type TurretType, type TurretName, type TurretNickname, useTurretNames, useTurretTypes, TurretTypeNames } from "@/hooks/useCardsData";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { InfoIcon, PlusCircle, X, Check, ChevronDown, ChevronUp, Edit, Search, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

// Turret name to nickname mapping
const turretNicknameMap: Record<TurretName, TurretNickname> = {
  "Railgun": "Railgun",
  "Guardian": "Guardian",
  "Aeroblast": "AeroB",
  "Laser": "Laser",
  "Beam": "Beam",
  "Thunderbolt": "Thunder",
  "Teslacoil": "Tesla",
  "Sky Guard": "SkyG",
  "Firewheel Drone": "FireW",
  "Gravity Vortex Gun": "Gravity",
  "Disruption Drone": "DisruptD",
  "Hive": "Hive",
  "All": "All"
};

// Function to get turret nickname from turret name
const getTurretNickname = (turretName: TurretName): TurretNickname => {
  return turretNicknameMap[turretName] || turretName as unknown as TurretNickname;
};

const ChipDatabase = () => {
  const { data: chips = [], isLoading: chipsLoading, error: chipsError } = useChipsData();
  const { data: gearTypes = [] } = useGearTypes();
  const { data: turretNames = [] } = useTurretNames();
  const { data: turretTypes = [] } = useTurretTypes();
  const { user } = useAuth();
  const [selectedGearType, setSelectedGearType] = useState<string>("all");
  const [selectedTurretName, setSelectedTurretName] = useState<string>("all");
  const [selectedTurretType, setSelectedTurretType] = useState<string>("all");
  const [selectedBoostType, setSelectedBoostType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
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
    affectedTurrets: TurretName[];
    boostType: string;
    values: Record<ChipRarity, string>
  }>({
    name: "",
    description: "",
    compatibleGears: [] as GearType[],
    affectedTurrets: [] as TurretName[],
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
  
  // Helper function to get turret type from turret name
  const getTurretTypeFromName = (turretName: TurretName): TurretType | undefined => {
    for (const [turretType, turretNames] of Object.entries(TurretTypeNames)) {
      if (turretNames.includes(turretName)) {
        return turretType as TurretType;
      }
    }
    return undefined;
  };

  // Filter chips based on selected filters
  const filteredChips = useMemo(() => {
    // First filter the chips
    const filtered = chips.filter(chip => {
      // Filter by gear type
      if (selectedGearType !== "all" && !chip.compatibleGears.includes(selectedGearType as GearType)) {
        return false;
      }
      
      // Filter by turret name
      if (selectedTurretName !== "all" && !chip.affectedTurrets.includes(selectedTurretName as TurretName)) {
        return false;
      }

      // Filter by turret type
      if (selectedTurretType !== "all") {
        const hasTurretsOfType = chip.affectedTurrets.some(turret => {
          const turretType = getTurretTypeFromName(turret as TurretName);
          return turretType === selectedTurretType;
        });
        if (!hasTurretsOfType) {
          return false;
        }
      }
      
      // Filter by boost type
      if (selectedBoostType !== "all" && chip.boostType !== selectedBoostType) {
        return false;
      }
      
      // Filter by search query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase().trim();
        const nameMatch = chip.name.toLowerCase().includes(query);
        const descriptionMatch = chip.description.toLowerCase().includes(query);
        if (!nameMatch && !descriptionMatch) {
          return false;
        }
      }
      
      return true;
    });
    
    // Then sort by boost type first, then by name
    return filtered.sort((a, b) => {
      // First sort by boost type
      if (a.boostType < b.boostType) return -1;
      if (a.boostType > b.boostType) return 1;
      
      // If boost types are the same, sort by name
      return a.name.localeCompare(b.name);
    });
  }, [chips, selectedGearType, selectedTurretName, selectedTurretType, selectedBoostType, searchQuery]);
  
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
  
  const getTurretTypeColor = (turretType: TurretType | TurretName) => {
    // Check if it's a turret name first
    if (typeof turretType === 'string') {
    // Physical turrets (sky-blue)
      if (TurretTypeNames.Physical.includes(turretType as TurretName)) {
      return "bg-sky-200 text-sky-800";
    }
    // Energy turrets (green)
      else if (TurretTypeNames.Energy.includes(turretType as TurretName)) {
      return "bg-green-300 text-green-800";
    }
    // Electric turrets (purple)
      else if (TurretTypeNames.Electric.includes(turretType as TurretName)) {
      return "bg-purple-300 text-purple-800";
    }
      // Fire turrets (blue)
      else if (TurretTypeNames.Fire.includes(turretType as TurretName)) {
        return "bg-blue-300 text-blue-800";
    }
      // Force-field turrets (Grey-white)
      else if (TurretTypeNames["Force-field"].includes(turretType as TurretName)) {
        return "bg-slate-300 text-slate-800";
      }
      // All turrets
      else if (turretType === "All") {
        return "bg-gray-200 text-gray-800";
      }
    }
    // If it's a turret type category
    else {
      switch(turretType) {
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
    "Turret Boost",
    "Turret Ability",
    "Turret DMG",
    "Type DMG",
    "Fortress",
    "Game Mechanic",
    "Other"
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
    if (newChip.affectedTurrets.length === 0) {
      alert("Please select at least one affected turret");
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
        affectedTurrets: newChip.affectedTurrets,
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
      affectedTurrets: [] as TurretName[],
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
      affectedTurrets: [...chip.affectedTurrets] as TurretName[],
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
  
  // Toggle turret selection
  const toggleTurret = (turret: TurretName) => {
    if (turret === "All") {
      if (newChip.affectedTurrets.includes("All" as TurretName)) {
        // If "All" is being unchecked, just remove it
        setNewChip({
          ...newChip,
          affectedTurrets: newChip.affectedTurrets.filter(t => t !== "All")
        });
      } else {
        // If "All" is being checked, make it the only selection
        setNewChip({
          ...newChip,
          affectedTurrets: ["All" as TurretName]
        });
      }
    } else {
      // If "All" is already selected, don't allow other selections
      if (newChip.affectedTurrets.includes("All" as TurretName)) {
        return;
      }
      
      // Normal toggle behavior for other turrets
      if (newChip.affectedTurrets.includes(turret)) {
        setNewChip({
          ...newChip,
          affectedTurrets: newChip.affectedTurrets.filter(t => t !== turret)
        });
      } else {
        setNewChip({
          ...newChip,
          affectedTurrets: [...newChip.affectedTurrets, turret]
        });
      }
    }
  };
  
  // Update rarity value
  const updateRarityValue = (rarity: ChipRarity, value: string) => {
    // Format the value appropriately, respecting negative values but allowing plain numbers
    const formattedValue = value === "" ? undefined : value; // Keep the value as entered without forcing a + sign
    
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
              
              {/* Compatible Gear and Affected Turrets */}
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
                  <Label className="block mb-2">Affected Turrets *</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {/* Special "All" option at the top */}
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="turret-All" 
                        checked={newChip.affectedTurrets.includes("All" as TurretName)}
                        onCheckedChange={() => toggleTurret("All" as TurretName)}
                      />
                      <Label 
                        htmlFor="turret-All"
                        className="cursor-pointer flex items-center gap-2"
                      >
                        <Badge className="bg-purple-300 text-purple-800 font-bold">All</Badge>
                      </Label>
                    </div>
                    
                    {/* Other turret options */}
                    {turretNames.filter(turret => turret !== "All").map(turret => (
                      <div key={turret} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`turret-${turret}`} 
                          checked={newChip.affectedTurrets.includes(turret)}
                          onCheckedChange={() => toggleTurret(turret)}
                          disabled={newChip.affectedTurrets.includes("All" as TurretName)}
                        />
                        <Label 
                          htmlFor={`turret-${turret}`}
                          className={`cursor-pointer flex items-center gap-2 ${newChip.affectedTurrets.includes("All" as TurretName) ? "opacity-50" : ""}`}
                        >
                          <Badge className={getTurretTypeColor(turret as TurretName)}>{turret}</Badge>
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
              
              {/* Compatible Gear and Affected Turrets */}
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
                  <Label className="block mb-2">Affected Turrets *</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {/* Special "All" option at the top */}
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="update-turret-All" 
                        checked={newChip.affectedTurrets.includes("All" as TurretName)}
                        onCheckedChange={() => toggleTurret("All" as TurretName)}
                      />
                      <Label 
                        htmlFor="update-turret-All"
                        className="cursor-pointer flex items-center gap-2"
                      >
                        <Badge className="bg-purple-300 text-purple-800 font-bold">All</Badge>
                      </Label>
                    </div>
                    
                    {/* Other turret options */}
                    {turretNames.filter(turret => turret !== "All").map(turret => (
                      <div key={turret} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`update-turret-${turret}`} 
                          checked={newChip.affectedTurrets.includes(turret)}
                          onCheckedChange={() => toggleTurret(turret)}
                          disabled={newChip.affectedTurrets.includes("All" as TurretName)}
                        />
                        <Label 
                          htmlFor={`update-turret-${turret}`}
                          className={`cursor-pointer flex items-center gap-2 ${newChip.affectedTurrets.includes("All" as TurretName) ? "opacity-50" : ""}`}
                        >
                          <Badge className={getTurretTypeColor(turret as TurretName)}>{turret}</Badge>
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
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {/* Search Filter */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm font-medium">Search Chips</label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:flex md:flex-row gap-3 w-full md:w-auto">
          {/* Gear Type Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Gear Type:</label>
            <Select value={selectedGearType} onValueChange={setSelectedGearType}>
              <SelectTrigger className="w-full lg:w-[140px]">
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
          
          {/* Turret Name Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Turret:</label>
            <Select value={selectedTurretName} onValueChange={setSelectedTurretName}>
              <SelectTrigger className="w-full lg:w-[140px]">
                <SelectValue placeholder="Select turret" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Turrets</SelectItem>
                {turretNames.map(turret => (
                  <SelectItem key={turret} value={turret}>{turret}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Turret Type Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Turret Type:</label>
            <Select value={selectedTurretType} onValueChange={setSelectedTurretType}>
              <SelectTrigger className="w-full lg:w-[140px]">
                <SelectValue placeholder="Select turret type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Turret Types</SelectItem>
                {turretTypes.map(type => (
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
              <SelectTrigger className="w-full lg:w-[140px]">
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
        <div className="flex flex-col gap-1 w-full lg:w-auto">
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
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap w-auto min-w-[120px] max-w-[200px]">Name</TableHead>
                  <TableHead className="whitespace-nowrap w-[120px] min-w-[120px] max-w-[150px]">Gears</TableHead>
                  <TableHead className="whitespace-nowrap w-[120px] min-w-[120px] max-w-[150px]">Turrets</TableHead>
                  <TableHead className="whitespace-nowrap w-[120px] min-w-[120px] max-w-[150px]">Boost Type</TableHead>
                  {rarities.map(rarity => (
                    visibleColumns[rarity] && (
                      <TableHead key={rarity} className="whitespace-nowrap text-center">
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
                    <TableCell className="font-medium whitespace-nowrap w-auto min-w-[120px] max-w-[250px]">
                      <div className="flex items-center gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" className="flex items-center gap-1 p-0 h-auto">
                              {chip.name}
                              <InfoIcon className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80 p-3 ml-4">
                            <p className="text-sm">{chip.description}</p>
                          </PopoverContent>
                        </Popover>
                        {chip.valuable && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span>
                                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Valuable Chip</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        {user && (
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
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {/* Display actual gear tags */}
                        {chip.compatibleGears.map(gear => (
                          <Badge key={gear} className="bg-gray-100 text-gray-800">
                            {gear.charAt(0).toUpperCase()}
                          </Badge>
                        ))}
                        
                        {/* Add placeholder badges if needed to ensure minimum 2 tags */}
                        {chip.compatibleGears.length === 0 && (
                          <>
                            <Badge className="bg-gray-100 text-gray-800">-</Badge>
                            <Badge className="bg-gray-100 text-gray-800">-</Badge>
                          </>
                        )}
                        {chip.compatibleGears.length === 1 && (
                          <Badge className="bg-gray-100 text-gray-800">-</Badge>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {chip.affectedTurrets.map(turret => (
                          <Popover key={turret}>
                            <PopoverTrigger asChild>
                              <div className="inline-block">
                                <Badge className={`${getTurretTypeColor(turret)} cursor-pointer`}>
                                  {getTurretNickname(turret as TurretName)}
                                </Badge>
                              </div>
                            </PopoverTrigger>
                            <PopoverContent className="p-2">
                              <p>{turret}</p>
                            </PopoverContent>
                          </Popover>
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
                                "font-medium align-middle whitespace-nowrap overflow-hidden text-ellipsis",
                                rarity === "Ultimate" && "text-primary"
                              )} title={chip.values[rarity]}>
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
