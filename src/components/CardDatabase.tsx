
import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

// Types for our game data
type Tower = "Archer" | "Cannon" | "Lightning" | "Ice" | "Fire" | "Poison" | "Magic";
type CardType = "Normal" | "Chain" | "Combo" | "Elite";
type Tier = "T1" | "T2" | "T3";

interface GameCard {
  id: number;
  name: string;
  type: CardType;
  towers: Tower[];
  tier: Tier;
  description: string;
}

// Sample card data
const gameCards: GameCard[] = [
  { id: 1, name: "Swift Arrow", type: "Normal", towers: ["Archer"], tier: "T1", description: "Increases archer attack speed" },
  { id: 2, name: "Explosive Shot", type: "Chain", towers: ["Cannon"], tier: "T2", description: "Cannon shots create chain explosions" },
  { id: 3, name: "Frost Storm", type: "Combo", towers: ["Ice", "Lightning"], tier: "T3", description: "Combines ice and lightning for devastating effect" },
  { id: 4, name: "Blazing Arrows", type: "Elite", towers: ["Archer"], tier: "T3", description: "Elite archer enhancement with fire damage" },
  { id: 5, name: "Thunder Bolt", type: "Normal", towers: ["Lightning"], tier: "T1", description: "Basic lightning tower boost" },
  { id: 6, name: "Poison Cloud", type: "Chain", towers: ["Poison"], tier: "T2", description: "Creates spreading poison clouds" },
  { id: 7, name: "Arcane Blast", type: "Normal", towers: ["Magic"], tier: "T2", description: "Enhances magic tower power" },
  { id: 8, name: "Frozen Cannon", type: "Combo", towers: ["Ice", "Cannon"], tier: "T3", description: "Combines ice and cannon for area control" },
  { id: 9, name: "Fire Rain", type: "Elite", towers: ["Fire"], tier: "T3", description: "Elite fire tower creates burning rain" },
  { id: 10, name: "Basic Shield", type: "Normal", towers: ["Magic"], tier: "T1", description: "Simple magical protection" },
];

const towers: Tower[] = ["Archer", "Cannon", "Lightning", "Ice", "Fire", "Poison", "Magic"];
const cardTypes: CardType[] = ["Normal", "Chain", "Combo", "Elite"];
const tiers: Tier[] = ["T1", "T2", "T3"];

const CardDatabase = () => {
  const [selectedTowers, setSelectedTowers] = useState<Tower[]>([]);
  const [selectedCardType, setSelectedCardType] = useState<string>("all");
  const [selectedTier, setSelectedTier] = useState<string>("all");

  const filteredCards = useMemo(() => {
    return gameCards.filter(card => {
      // Tower filter
      const towerMatch = selectedTowers.length === 0 || 
        card.towers.some(tower => selectedTowers.includes(tower));
      
      // Card type filter
      const typeMatch = selectedCardType === "all" || card.type === selectedCardType;
      
      // Tier filter
      const tierMatch = selectedTier === "all" || card.tier === selectedTier;
      
      return towerMatch && typeMatch && tierMatch;
    });
  }, [selectedTowers, selectedCardType, selectedTier]);

  const handleTowerToggle = (tower: Tower) => {
    setSelectedTowers(prev => 
      prev.includes(tower) 
        ? prev.filter(t => t !== tower)
        : [...prev, tower]
    );
  };

  const getCardTypeColor = (type: CardType) => {
    switch (type) {
      case "Normal": return "bg-secondary";
      case "Chain": return "bg-primary";
      case "Combo": return "bg-destructive";
      case "Elite": return "bg-accent";
      default: return "bg-muted";
    }
  };

  const getTierColor = (tier: Tier) => {
    switch (tier) {
      case "T1": return "text-muted-foreground";
      case "T2": return "text-primary";
      case "T3": return "text-destructive";
      default: return "text-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-secondary/20 rounded-lg">
        {/* Tower Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Filter by Tower</label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="show-all-towers"
                checked={selectedTowers.length === 0}
                onCheckedChange={() => setSelectedTowers([])}
              />
              <label htmlFor="show-all-towers" className="text-sm">Show All</label>
            </div>
            {towers.map(tower => (
              <div key={tower} className="flex items-center space-x-2">
                <Checkbox 
                  id={tower}
                  checked={selectedTowers.includes(tower)}
                  onCheckedChange={() => handleTowerToggle(tower)}
                />
                <label htmlFor={tower} className="text-sm">{tower}</label>
              </div>
            ))}
          </div>
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
        Showing {filteredCards.length} of {gameCards.length} cards
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCards.map(card => (
          <Card key={card.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{card.name}</CardTitle>
                <span className={`font-bold ${getTierColor(card.tier)}`}>{card.tier}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                <Badge className={getCardTypeColor(card.type)}>{card.type}</Badge>
                {card.towers.map(tower => (
                  <Badge key={tower} variant="outline">{tower}</Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>{card.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCards.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No cards match your current filters.
        </div>
      )}
    </div>
  );
};

export default CardDatabase;
