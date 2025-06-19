import { useQuery } from "@tanstack/react-query";
import { supabase, safeQuery } from "@/lib/supabase";
import { TowerType, TowerName } from "./useCardsData";

// Types
export type GearType = "Armor" | "Helmet" | "Energy Core" | "Boots" | "Shield" | "Weapon";
export const GEAR_TYPES = ["Armor", "Helmet", "Energy Core", "Boots", "Shield", "Weapon"];
export type ChipRarity = "Common" | "Fine" | "Rare" | "Epic" | "Legendary" | "Supreme" | "Ultimate";
export const CHIP_RARITIES = ["Common", "Fine", "Rare", "Epic", "Legendary", "Supreme", "Ultimate"];

export interface ChipBase {
  id: string;
  name: string;
  description: string;
  compatibleGears: GearType[];
  affectedTowers: TowerName[];
  boostType: string;
  values: {
    Common?: string;
    Fine?: string;
    Rare?: string;
    Epic?: string;
    Legendary?: string;
    Supreme?: string;
    Ultimate?: string;
  };
}

export interface ChipInstance {
  id: string;
  baseChipId: string;
  rarity: ChipRarity;
  value: string;
}

// SQL query to fetch chip data from Supabase
const getChipData = async (): Promise<ChipBase[]> => {
  try {
    const { data, error } = await supabase
      .from('chips')
      .select();
      
    if (error) {
      console.error('Error fetching chip data:', error);
      return [];
    }
    
    // Transform the database columns into the expected format
    const transformedData = data.map(chip => {
      const values: Record<ChipRarity, string | undefined> = {
        Common: chip.value_common || undefined,
        Fine: chip.value_fine || undefined,
        Rare: chip.value_rare || undefined,
        Epic: chip.value_epic || undefined,
        Legendary: chip.value_legendary || undefined,
        Supreme: chip.value_supreme || undefined,
        Ultimate: chip.value_ultimate || undefined
      };
      
      return {
        id: chip.id,
        name: chip.name,
        description: chip.description,
        compatibleGears: chip.compatible_gears,
        affectedTowers: chip.affected_towers,
        boostType: chip.boost_type,
        values
      } as ChipBase;
    });
    
    return transformedData;
  } catch (error) {
    console.error('Error fetching chip data:', error);
    // Return fallback data if the query fails
    return [];
  }
};

// Hook to fetch chips data
export const useChipsData = () => {
  return useQuery({
    queryKey: ["chips"],
    queryFn: getChipData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  });
};

// Function to add a new chip to the database
export const addChip = async (chip: Omit<ChipBase, 'id'>): Promise<ChipBase> => {
  try {
    // Transform the chip values into separate columns
    const chipData = {
      name: chip.name,
      description: chip.description,
      compatible_gears: chip.compatibleGears,
      affected_towers: chip.affectedTowers,
      boost_type: chip.boostType,
      value_common: chip.values.Common,
      value_fine: chip.values.Fine,
      value_rare: chip.values.Rare,
      value_epic: chip.values.Epic,
      value_legendary: chip.values.Legendary,
      value_supreme: chip.values.Supreme,
      value_ultimate: chip.values.Ultimate
    };
    
    const { data, error } = await supabase
      .from('chips')
      .insert([chipData])
      .select()
      .single();
      
    if (error) throw error;
    
    // Transform the response back to the ChipBase format
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      compatibleGears: data.compatible_gears,
      affectedTowers: data.affected_towers,
      boostType: data.boost_type,
      values: {
        Common: data.value_common || undefined,
        Fine: data.value_fine || undefined,
        Rare: data.value_rare || undefined,
        Epic: data.value_epic || undefined,
        Legendary: data.value_legendary || undefined,
        Supreme: data.value_supreme || undefined,
        Ultimate: data.value_ultimate || undefined
      }
    };
  } catch (error) {
    console.error('Error adding chip:', error);
    throw error;
  }
};

// Hook to get gear types
export const useGearTypes = () => {
  return useQuery({
    queryKey: ["gearTypes"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('gear_types')
          .select('name');
          
        if (error) {
          throw error;
        }
        
        return (data?.map(item => item.name as GearType) || []) as GearType[];
      } catch (error) {
        console.error('Error fetching gear types:', error);
        // Fallback data - hardcoded list of gear types
        return ["Armor", "Helmet", "Energy Core", "Boots", "Shield", "Weapon"] as GearType[];
      }
    },
    staleTime: 60 * 60 * 1000 // 1 hour
  });
};
