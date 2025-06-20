
import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useCardsData, useTurretsData } from "@/hooks/useCardsData";
import { Skeleton } from "@/components/ui/skeleton";
import { MultiSelectNoSearch, Option } from "@/components/ui/multi-select-no-search";

type CardType = "Normal" | "Chain" | "Combo" | "Elite";
type Tier = "T1" | "T2" | "T3";

const CardDatabase = () => {
  const { data: cards = [], isLoading: cardsLoading, error: cardsError } = useCardsData();
  const { data: turrets = [], isLoading: turretsLoading } = useTurretsData();
  
  const [selectedTurrets, setSelectedTurrets] = useState<string[]>([]);
  const [selectedCardType, setSelectedCardType] = useState<string>("all");
  const [selectedTier, setSelectedTier] = useState<string>("all");

  // Define turret order for sorting
  const turretOrder = [
    "Sky Guard",
    "Laser",
    "Disruption Drone",
    "Aeroblast",
    "Thunderbolt",
    "Beam",
    "Firewheel Drone",
    "Hive",
    "Railgun",
    "Teslacoil",
    "Gravity Vortex Gun"
  ];
  
  // Sort turrets based on predefined order
  const sortedTurrets = useMemo(() => {
    return [...turrets].sort((a, b) => {
      const indexA = turretOrder.indexOf(a.name);
      const indexB = turretOrder.indexOf(b.name);
      
      // If both turrets are in our order list, sort by that order
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      
      // If only one turret is in our order list, prioritize it
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      
      // If neither turret is in our list, sort alphabetically
      return a.name.localeCompare(b.name);
    });
  }, [turrets]);

  const cardTypes: CardType[] = ["Normal", "Chain", "Combo", "Elite"];
  const tiers: Tier[] = ["T1", "T2", "T3"];

  const filteredCards = useMemo(() => {
    // First filter the cards
    const filtered = cards.filter(card => {
      // Turret filter
      const turretMatch = selectedTurrets.length === 0 || 
        selectedTurrets.includes(card.turret.name);
      
      // Card type filter
      const typeMatch = selectedCardType === "all" || card.type === selectedCardType;
      
      // Tier filter
      const tierMatch = selectedTier === "all" || card.tier === selectedTier;
      
      return turretMatch && typeMatch && tierMatch;
    });
    
    // Then sort them by turret order, then by tier, then by type
    return filtered.sort((a, b) => {
      // First sort by turret order
      const turretIndexA = turretOrder.indexOf(a.turret.name);
      const turretIndexB = turretOrder.indexOf(b.turret.name);
      
      if (turretIndexA !== turretIndexB) {
        // If both turrets are in our order list, sort by that order
        if (turretIndexA !== -1 && turretIndexB !== -1) {
          return turretIndexA - turretIndexB;
        }
        
        // If only one turret is in our order list, prioritize it
        if (turretIndexA !== -1) return -1;
        if (turretIndexB !== -1) return 1;
      }
      
      // If same turret or neither in order list, sort by tier
      const tierOrder = { T1: 0, T2: 1, T3: 2 };
      const tierCompare = tierOrder[a.tier as Tier] - tierOrder[b.tier as Tier];
      if (tierCompare !== 0) return tierCompare;
      
      // If same tier, sort by card type
      const typeOrder = { Normal: 0, Chain: 1, Combo: 2, Elite: 3 };
      return typeOrder[a.type as CardType] - typeOrder[b.type as CardType];
    });
  }, [cards, selectedTurrets, selectedCardType, selectedTier, turretOrder]);



  const getCardTypeColor = (type: CardType) => {
    switch (type) {
      case "Normal": return "bg-cyan-200 text-black";
      case "Chain": return "bg-cyan-400 text-black";
      case "Combo": return "bg-cyan-600 text-white";
      case "Elite": return "bg-purple-500 text-white";
      default: return "bg-muted";
    }
  };

  const getTurretTypeColor = (turretName: string) => {
    // Physical turrets (sky-blue)
    if (["Railgun", "Guardian", "Aeroblast"].includes(turretName)) {
      return "bg-sky-200 text-sky-800";
    }
    // Energy turrets (green)
    else if (["Laser", "Beam"].includes(turretName)) {
      return "bg-green-300 text-green-800";
    }
    // Electric turrets (purple)
    else if (["Thunderbolt", "Teslacoil"].includes(turretName)) {
      return "bg-purple-300 text-purple-800";
    }
    // Fire turrets (blue)
    else if (["Sky Guard", "Firewheel Drone"].includes(turretName)) {
      return "bg-blue-300 text-blue-800";
    }

    // Force-field turrets (Grey-white)
    else if (["Gravity Vortex Gun", "Disruption Drone", "Hive"].includes(turretName)) {
      return "bg-slate-300 text-slate-800";
    }
    // Default
    return "";
  };

  const getTierColor = (tier: Tier) => {
    switch (tier) {
      case "T1": return "text-muted-foreground";
      case "T2": return "text-primary";
      case "T3": return "text-black";
      default: return "text-foreground";
    }
  };

  if (cardsLoading || turretsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-secondary/20 rounded-lg">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (cardsError) {
    return (
      <div className="text-center py-8 text-destructive">
        Error loading cards data. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-secondary/20 rounded-lg">
        {/* Turret Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Filter by Turret</label>
          <MultiSelectNoSearch
            options={sortedTurrets ? sortedTurrets.map(turret => ({ label: turret.name, value: turret.name })) : []}
            selected={selectedTurrets}
            onChange={setSelectedTurrets}
            placeholder="Select turrets..."
          />
          {selectedTurrets.length > 0 && (
            <div className="flex justify-end">
              <button 
                onClick={() => setSelectedTurrets([])} 
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear selection
              </button>
            </div>
          )}
        </div>

        {/* Card Type Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Filter by Card Type</label>
          <Select value={selectedCardType} onValueChange={setSelectedCardType}>
            <SelectTrigger>
              <SelectValue placeholder="Select card type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {cardTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tier Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Filter by Tier</label>
          <Select value={selectedTier} onValueChange={setSelectedTier}>
            <SelectTrigger>
              <SelectValue placeholder="Select tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tiers</SelectItem>
              {tiers.map(tier => (
                <SelectItem key={tier} value={tier}>{tier}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredCards.length} of {cards.length} cards
      </div>

      {/* Group cards by tier */}
      {['T1', 'T2', 'T3'].map((tierGroup) => {
        const tierCards = filteredCards.filter(card => card.tier === tierGroup);
        if (tierCards.length === 0) return null;
        
        // Sort cards by type in the order: Normal, Chain, Combo, Elite
        const sortedCards = [...tierCards].sort((a, b) => {
          const typeOrder = { 'Normal': 1, 'Chain': 2, 'Combo': 3, 'Elite': 4 };
          return typeOrder[a.type] - typeOrder[b.type];
        });
        
        return (
          <div key={tierGroup} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <h3 className={`text-lg font-bold ${getTierColor(tierGroup as Tier)}`}>Tier {tierGroup.replace('T', '')}</h3>
              <div className="h-px bg-border flex-grow"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedCards.map(card => (
                <Card key={card.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{card.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${getTierColor(card.tier)}`}>{card.tier}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <Badge className={getCardTypeColor(card.type)}>{card.type}</Badge>
                      <Badge className={getTurretTypeColor(card.turret.name)}>{card.turret.name}</Badge>
                      {card.parent_card && (
                        <Badge variant="secondary" className="text-xs">
                          Chain: {card.parent_card.name}
                        </Badge>
                      )}
                      {card.combo_turret && (
                        <Badge className={`text-xs ${getTurretTypeColor(card.combo_turret.name)}`}>
                          Combo: {card.combo_turret.name}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{card.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
      

      {filteredCards.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No cards match your current filters.
        </div>
      )}
    </div>
  );
};

export default CardDatabase;
