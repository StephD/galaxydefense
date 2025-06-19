import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type TowerType = "Physical" | "Energy" | "Electric" | "Fire" | "Force-field";
export const TOWER_TYPES = ["Physical", "Energy", "Electric", "Fire", "Force-field"];
export const TOWER_TYPES_COLOR = {
  "Physical": "bg-sky-200 text-sky-800",
  "Energy": "bg-green-300 text-green-800",
  "Electric": "bg-purple-300 text-purple-800",
  "Fire": "bg-amber-300 text-amber-800",
  "Force-field": "bg-indigo-300 text-indigo-800"
};
export const TOWER_NAMES_COLOR = {
  "Railgun": "bg-sky-200 text-sky-800",
  "Guardian": "bg-green-300 text-green-800",
  "Aeroblast": "bg-purple-300 text-purple-800",
  "Laser": "bg-amber-300 text-amber-800",
  "Beam": "bg-indigo-300 text-indigo-800",
  "Thunderbolt": "bg-sky-200 text-sky-800",
  "Teslacoil": "bg-green-300 text-green-800",
  "Sky Guard": "bg-purple-300 text-purple-800",
  "Firewheel Drone": "bg-amber-300 text-amber-800",
  "Gravity Vortex Gun": "bg-indigo-300 text-indigo-800",
  "Disruption Drone": "bg-sky-200 text-sky-800",
  "Hive": "bg-green-300 text-green-800",
  "All": "bg-purple-300 text-purple-800"
};

// Actual Tower Names
export type TowerName = 
  | "Railgun" 
  | "Guardian" 
  | "Aeroblast" 
  | "Laser" 
  | "Beam" 
  | "Thunderbolt" 
  | "Teslacoil" 
  | "Sky Guard" 
  | "Firewheel Drone" 
  | "Gravity Vortex Gun" 
  | "Disruption Drone" 
  | "Hive" 
  | "All";

// Tower Type to Tower Name mapping
export const TowerTypeNames: Record<TowerType, TowerName[]> = {
  "Physical": ["Railgun", "Guardian", "Aeroblast"],
  "Energy": ["Laser", "Beam"],
  "Electric": ["Thunderbolt", "Teslacoil"],
  "Fire": ["Sky Guard", "Firewheel Drone"],
  "Force-field": ["Gravity Vortex Gun", "Disruption Drone", "Hive"]
};

interface Tower {
  id: string;
  name: string;
  description: string | null;
}

interface Card {
  id: string;
  name: string;
  type: 'Normal' | 'Chain' | 'Combo' | 'Elite';
  tier: 'T1' | 'T2' | 'T3';
  description: string | null;
  tower: Tower;
  combo_tower?: Tower;
  parent_card?: Card;
}

export const getTowerTypeColor = (towerName: TowerName) => {
  // Physical towers (sky-blue)
  if (["Railgun", "Guardian", "Aeroblast"].includes(towerName)) {
    return "bg-sky-200 text-sky-800";
  }
  // Energy towers (green)
  else if (["Laser", "Beam"].includes(towerName)) {
    return "bg-green-300 text-green-800";
  }
  // Electric towers (purple)
  else if (["Thunderbolt", "Teslacoil"].includes(towerName)) {
    return "bg-purple-300 text-purple-800";
  }
  // Fire towers (blue)
  else if (["Sky Guard", "Firewheel Drone"].includes(towerName)) {
    return "bg-blue-300 text-blue-800";
  }

  // Force-field towers (Grey-white)
  else if (["Gravity Vortex Gun", "Disruption Drone", "Hive"].includes(towerName)) {
    return "bg-slate-300 text-slate-800";
  }
  // Default
  return "";
};

export const useCardsData = () => {
  return useQuery({
    queryKey: ['cards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cards')
        .select(`
          id,
          name,
          type,
          tier,
          description,
          combo_tower_id,
          parent_card_id,
          tower:towers!tower_id(id, name, description)
        `)
        .order('tier', { ascending: true })
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching cards:', error);
        throw error;
      }

      if (!data) return [];

      // Fetch combo and parent cards separately
      const cardIds = data.map(card => card.id);
      const comboTowerIds = data.map(card => card.combo_tower_id).filter(Boolean);
      const parentCardIds = data.map(card => card.parent_card_id).filter(Boolean);
      
      const relatedCardIds = [...new Set([...comboTowerIds, ...parentCardIds])];
      
      let relatedCards: any[] = [];
      if (relatedCardIds.length > 0) {
        const { data: relatedCardsData } = await supabase
          .from('cards')
          .select('id, name, type')
          .in('id', relatedCardIds);
        
        relatedCards = relatedCardsData || [];
      }

      // Fetch combo towers separately
      let comboTowers: any[] = [];
      if (comboTowerIds.length > 0) {
        const { data: comboTowersData } = await supabase
          .from('towers')
          .select('id, name, description')
          .in('id', comboTowerIds);
        
        comboTowers = comboTowersData || [];
      }

      // Transform the data to include related cards and towers
      const transformedData = data.map(card => ({
        ...card,
        combo_tower: card.combo_tower_id 
          ? comboTowers.find(t => t.id === card.combo_tower_id) 
          : undefined,
        parent_card: card.parent_card_id 
          ? relatedCards.find(c => c.id === card.parent_card_id) 
          : undefined
      }));

      return transformedData as unknown as Card[];
    }
  });
};

export const useTowersData = () => {
  return useQuery({
    queryKey: ['towers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('towers')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching towers:', error);
        throw error;
      }

      return data as Tower[];
    }
  });
};

// Hook to get tower types (categories)
export const useTowerTypes = () => {
  return useQuery({
    queryKey: ["towerTypes"],
    queryFn: async () => {
      // Return the keys of TowerTypeNames
      return Object.keys(TowerTypeNames) as TowerType[];
    },
    staleTime: 60 * 60 * 1000 // 1 hour
  });
};

// Hook to get tower names
export const useTowerNames = () => {
  return useQuery({
    queryKey: ["towerNames"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('towers')
          .select('name');
          
        if (error) {
          throw error;
        }
        
        // Filter out any tower names that aren't in our TowerName type
        const validTowerNames = data?.map(item => item.name)
          .filter(name => Object.values(TowerTypeNames).flat().includes(name as TowerName)) || [];
        
        return validTowerNames as TowerName[];
      } catch (error) {
        console.error('Error fetching tower names:', error);
        // Fallback data - return all tower names from our mapping
        return Object.values(TowerTypeNames).flat() as TowerName[];
      }
    },
    staleTime: 60 * 60 * 1000 // 1 hour
  });
};