import { supabase } from "../integrations/supabase/client";
import { gameData as originalGameData } from '../api/data';

export interface TurretData {
  id: string;
  name: string;
  type: string;
  description: string;
  tier?: string;
  stats?: {
    power: number;
    defense: number;
    range: number;
    fireRate: number;
  };
  abilities?: string[];
}

// Convert API data to match our interface (mainly converting id from number to string)
const gameData: TurretData[] = originalGameData.map(turret => ({
  ...turret,
  id: String(turret.id) // Convert number id to string
}));

/**
 * Fetch all turrets from the database or fallback to hardcoded data
 */
export async function getAllTurrets(): Promise<TurretData[]> {
  console.log('Fetching turrets from Supabase');
  try {
    const { data, error } = await supabase
      .from('turrets')
      .select('*')
      .order('name', { ascending: true });
    
    console.log(data);

    if (error) {
      console.error('Error fetching turrets:', error);
      // Fallback to hardcoded data on error
      console.log('Falling back to hardcoded data due to error');
      return gameData;
    }

    // If no data returned, use fallback
    if (!data || data.length === 0) {
      console.log('No data from Supabase, using fallback data');
      return gameData;
    }

    return data;
  } catch (err) {
    console.error('Error in getAllTurrets:', err);
    // Fallback to hardcoded data on exception
    console.log('Falling back to hardcoded data due to exception');
    return gameData;
  }
}

/**
 * Fetch a turret by name or fallback to hardcoded data
 */
export async function getTurretByName(name: string): Promise<TurretData | null> {

  try {
    const { data, error } = await supabase
      .from('turrets')
      .select('*')
      .eq('name', name)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // PGRST116 is the error code for "no rows returned"
        // Try fallback data
        console.log(`Turret ${name} not found in Supabase, checking fallback data`);
        const turret = gameData.find(t => t.name.toLowerCase() === name.toLowerCase());
        return turret || null;
      }
      console.error(`Error fetching turret with name ${name}:`, error);
      // Fallback to hardcoded data on error
      console.log('Falling back to hardcoded data due to error');
      const turret = gameData.find(t => t.name.toLowerCase() === name.toLowerCase());
      return turret || null;
    }

    return data;
  } catch (err) {
    console.error(`Error in getTurretByName for ${name}:`, err);
    // Fallback to hardcoded data on exception
    console.log('Falling back to hardcoded data due to exception');
    const turret = gameData.find(t => t.name.toLowerCase() === name.toLowerCase());
    return turret || null;
  }
}
