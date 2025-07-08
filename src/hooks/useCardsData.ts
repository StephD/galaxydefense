import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export type TurretType = "Physical" | "Energy" | "Electric" | "Fire" | "Force-field";
export const TOWER_TYPES = ["Physical", "Energy", "Electric", "Fire", "Force-field"];
export const TOWER_TYPES_COLOR = {
  "Physical": "bg-sky-200 text-sky-800",
  "Energy": "bg-green-300 text-green-800",
  "Electric": "bg-purple-300 text-purple-800",
  "Fire": "bg-amber-300 text-amber-800",
  "Force-field": "bg-indigo-300 text-indigo-800"
};

// Actual Turret Names
export type TurretName = 
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

export type TurretNickname = "Railgun" | "Guardian" | "AeroB" | "Laser" | "Beam" | "Thunder" | "Tesla" | "SkyG" | "FireW" | "Gravity" | "DisruptD" | "Hive" |  "All";

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

// Turret Type to Turret Name mapping
export const TurretTypeNames: Record<TurretType, TurretName[]> = {
  "Physical": ["Railgun", "Guardian", "Aeroblast"],
  "Energy": ["Laser", "Beam"],
  "Electric": ["Thunderbolt", "Teslacoil"],
  "Fire": ["Sky Guard", "Firewheel Drone"],
  "Force-field": ["Gravity Vortex Gun", "Disruption Drone", "Hive"]
};

interface Turret {
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
  turret: Turret;
  combo_turret?: Turret;
  parent_card?: Card;
}

export const getTurretTypeColor = (turretName: TurretName) => {
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
          combo_turret_id,
          parent_card_id,
          turret:turrets!turret_id(id, name, description)
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
      const comboTurretIds = data.map(card => card.combo_turret_id).filter(Boolean);
      const parentCardIds = data.map(card => card.parent_card_id).filter(Boolean);
      
      const relatedCardIds = [...new Set([...comboTurretIds, ...parentCardIds])];
      
      let relatedCards: any[] = [];
      if (relatedCardIds.length > 0) {
        const { data: relatedCardsData } = await supabase
          .from('cards')
          .select('id, name, type')
          .in('id', relatedCardIds);
        
        relatedCards = relatedCardsData || [];
      }

      // Fetch combo turrets separately
      let comboTurrets: any[] = [];
      if (comboTurretIds.length > 0) {
        const { data: comboTurretsData } = await supabase
          .from('turrets')
          .select('id, name, description')
          .in('id', comboTurretIds);
        
        comboTurrets = comboTurretsData || [];
      }

      // Transform the data to include related cards and turrets
      const transformedData = data.map(card => ({
        ...card,
        combo_turret: card.combo_turret_id 
          ? comboTurrets.find(t => t.id === card.combo_turret_id) 
          : undefined,
        parent_card: card.parent_card_id 
          ? relatedCards.find(c => c.id === card.parent_card_id) 
          : undefined
      }));

      return transformedData as unknown as Card[];
    }
  });
};

export const useTurretsData = () => {
  return useQuery({
    queryKey: ['turrets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('turrets')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching turrets:', error);
        throw error;
      }

      return data as Turret[];
    }
  });
};

// Hook to get turret types (categories)
export const useTurretTypes = () => {
  return useQuery({
    queryKey: ["turretTypes"],
    queryFn: async () => {
      // Return the keys of TurretTypeNames
      return Object.keys(TurretTypeNames) as TurretType[];
    },
    staleTime: 60 * 60 * 1000 // 1 hour
  });
};

// Hook to get turret names
export const useTurretNames = () => {
  return useQuery({
    queryKey: ["turretNames"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('turrets')
          .select('name');
          
        if (error) {
          throw error;
        }
        
        // Filter out any turret names that aren't in our TurretName type
        const validTurretNames = data?.map(item => item.name)
          .filter(name => Object.values(TurretTypeNames).flat().includes(name as TurretName)) || [];
        
        return validTurretNames as TurretName[];
      } catch (error) {
        console.error('Error fetching turret names:', error);
        // Fallback data - return all turret names from our mapping
        return Object.values(TurretTypeNames).flat() as TurretName[];
      }
    },
    staleTime: 60 * 60 * 1000 // 1 hour
  });
};