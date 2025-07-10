import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface Booster {
  id: string;
  discord_name: string;
  discord_nickname?: string;
  ig_id: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const useBoosters = () => {
  return useQuery({
    queryKey: ['boosters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('boosters')
        .select('*')
        .order('active', { ascending: false })
        .order('discord_name', { ascending: false });

      if (error) {
        console.error('Error fetching boosters:', error);
        throw error;
      }

      return data as Booster[];
    }
  });
};

export interface CreateBoosterData {
  discord_name: string;
  discord_nickname?: string;
  ig_id: string;
  active?: boolean;
}

export interface UpdateBoosterData {
  discord_name: string;
  updates: Partial<Booster>;
}

// Hook for creating a new booster
export const addBooster = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (boosterData: CreateBoosterData) => {
      const { data, error } = await supabase
        .from('boosters')
        .insert([{
          discord_name: boosterData.discord_name,
          discord_nickname: boosterData.discord_nickname,
          ig_id: boosterData.ig_id,
          active: boosterData.active !== undefined ? boosterData.active : true
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating booster:', error);
        throw error;
      }
      
      return data as Booster;
    },
    onSuccess: () => {
      // Invalidate and refetch boosters list
      queryClient.invalidateQueries({ queryKey: ['boosters'] });
    }
  });
};

// Hook for updating a booster
export const editBooster = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ discord_name, updates }: UpdateBoosterData) => {
      const { data, error } = await supabase
        .from('boosters')
        .update(updates)
        .eq('discord_name', discord_name)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating booster:', error);
        throw error;
      }
      
      return data as Booster;
    },
    onSuccess: () => {
      // Invalidate and refetch boosters list
      queryClient.invalidateQueries({ queryKey: ['boosters'] });
    }
  });
};

// Interface for bulk update data
export interface BulkBoosterData {
  boosterList: string; // Format: "discord_name1:discord_name2:discord_name3..."
}

/**
 * Downloads a list of active boosters with their game IDs
 * @param boosters - The list of boosters to filter
 */
export const downloadActiveBoostersList = (boosters: Booster[]) => {
  // Filter only active boosters
  const activeBoosters = boosters.filter(booster => booster.active);
  
  // Create content for download (just ig_id values, one per line)
  const content = activeBoosters
    .map(booster => booster.ig_id)
    .filter(id => id && id.trim() !== '') // Filter out empty IDs
    .join('\n');
  
  // Create a Blob with the content
  const blob = new Blob([content], { type: 'text/plain' });
  
  // Create a download link and trigger it
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `active-boosters-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
};

// Hook for bulk updating boosters
export const bulkUpdateBoosters = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ boosterList }: BulkBoosterData) => {
      // First, get all existing boosters
      const { data: existingBoosters, error: fetchError } = await supabase
        .from('boosters')
        .select('*');
      
      if (fetchError) {
        console.error('Error fetching existing boosters:', fetchError);
        throw fetchError;
      }
      
      // Parse the input string into discord names
      // Format is discord_name1:discord_name2:discord_name3
      const discordNames = boosterList
        .split(':') // Split by colon
        .map(name => name.trim())
        .filter(name => name.length > 0);
      
      // Create a map of discord_name to existing boosters
      const existingBoosterMap = new Map(
        (existingBoosters as Booster[]).map(booster => [booster.discord_name, booster])
      );
      
      // Identify boosters to add (not in existing map)
      const boostersToAdd = discordNames.filter(
        name => !existingBoosterMap.has(name)
      ).map(name => ({
        discord_name: name,
        discord_nickname: '', // Empty nickname by default
        ig_id: '' // Empty game ID by default
      }));
      
      // Identify boosters to update (in existing map but might need status change)
      const boostersToUpdate = [];
      const discordNamesInNewList = new Set(discordNames);
      
      for (const booster of existingBoosters as Booster[]) {
        // If in new list, ensure it's active
        if (discordNamesInNewList.has(booster.discord_name) && !booster.active) {
          boostersToUpdate.push({
            discord_name: booster.discord_name,
            active: true
          });
        }
        // If not in new list, ensure it's inactive
        else if (!discordNamesInNewList.has(booster.discord_name) && booster.active) {
          boostersToUpdate.push({
            discord_name: booster.discord_name,
            active: false
          });
        }
      }
      
      // Perform the updates in a transaction if possible
      const results = { added: 0, updated: 0, errors: [] };
      
      // Add new boosters
      if (boostersToAdd.length > 0) {
        const { data, error } = await supabase
          .from('boosters')
          .insert(boostersToAdd.map(entry => ({
            discord_name: entry.discord_name,
            ig_id:'', // Use discord name as ig_id
            active: true
          })));
        
        if (error) {
          console.error('Error adding new boosters:', error);
          results.errors.push(`Error adding boosters: ${error.message}`);
        } else {
          results.added = boostersToAdd.length;
        }
      }
      
      // Update existing boosters
      for (const update of boostersToUpdate) {
        const { error } = await supabase
          .from('boosters')
          .update({ active: update.active })
          .eq('discord_name', update.discord_name);
        
        if (error) {
          console.error(`Error updating booster ${update.discord_name}:`, error);
          results.errors.push(`Error updating booster: ${error.message}`);
        } else {
          results.updated++;
        }
      }
      
      return results;
    },
    onSuccess: () => {
      // Invalidate and refetch boosters list
      queryClient.invalidateQueries({ queryKey: ['boosters'] });
    }
  });
};
