
import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useCardsData, useTowersData } from "@/hooks/useCardsData";
import { Skeleton } from "@/components/ui/skeleton";
import { MultiSelect, Option } from "@/components/ui/multi-select";

type CardType = "Normal" | "Chain" | "Combo" | "Elite";
type Tier = "T1" | "T2" | "T3";

const CardDatabase = () => {
  const { data: cards = [], isLoading: cardsLoading, error: cardsError } = useCardsData();
  const { data: towers = [], isLoading: towersLoading } = useTowersData();
  
  const [selectedTowers, setSelectedTowers] = useState<string[]>([]);
  const [selectedCardType, setSelectedCardType] = useState<string>("all");
  const [selectedTier, setSelectedTier] = useState<string>("all");

  const cardTypes: CardType[] = ["Normal", "Chain", "Combo", "Elite"];
  const tiers: Tier[] = ["T1", "T2", "T3"];

  const filteredCards = useMemo(() => {
    return cards.filter(card => {
      // Tower filter
      const towerMatch = selectedTowers.length === 0 || 
        selectedTowers.includes(card.tower.name);
      
      // Card type filter
      const typeMatch = selectedCardType === "all" || card.type === selectedCardType;
      
      // Tier filter
      const tierMatch = selectedTier === "all" || card.tier === selectedTier;
      
      return towerMatch && typeMatch && tierMatch;
    });
  }, [cards, selectedTowers, selectedCardType, selectedTier]);



  const getCardTypeColor = (type: CardType) => {
    switch (type) {
      case "Normal": return "bg-cyan-200 text-black";
      case "Chain": return "bg-cyan-400 text-black";
      case "Combo": return "bg-cyan-600 text-white";
      case "Elite": return "bg-purple-500 text-white";
      default: return "bg-muted";
    }
  };

  const getTierColor = (tier: Tier) => {
    switch (tier) {
      case "T1": return "text-muted-foreground";
      case "T2": return "text-primary";
      case "T3": return "text-black";
      default: return "text-foreground";
    }
  };

  if (cardsLoading || towersLoading) {
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
        {/* Tower Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Filter by Tower</label>
          <MultiSelect
            options={towers ? towers.map(tower => ({ label: tower.name, value: tower.name })) : []}
            selected={selectedTowers}
            onChange={setSelectedTowers}
            placeholder="Select towers..."
          />
          {selectedTowers.length > 0 && (
            <div className="flex justify-end">
              <button 
                onClick={() => setSelectedTowers([])} 
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
                      <Badge variant="outline">{card.tower.name}</Badge>
                      {card.parent_card && (
                        <Badge variant="secondary" className="text-xs">
                          Chain: {card.parent_card.name}
                        </Badge>
                      )}
                      {card.combo_tower && (
                        <Badge variant="secondary" className="text-xs">
                          Combo: {card.combo_tower.name}
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
