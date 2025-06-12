
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
  unlock_level: number | null;
  tower: Tower;
  combo_card?: Card;
  parent_card?: Card;
}

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
          unlock_level,
          tower:towers(id, name, description),
          combo_card:cards!cards_combo_card_id_fkey(id, name, type),
          parent_card:cards!cards_parent_card_id_fkey(id, name, type)
        `)
        .order('tier', { ascending: true })
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching cards:', error);
        throw error;
      }

      // Transform the data to handle the array responses from Supabase
      const transformedData = data?.map(card => ({
        ...card,
        combo_card: Array.isArray(card.combo_card) && card.combo_card.length > 0 
          ? card.combo_card[0] as any 
          : undefined,
        parent_card: Array.isArray(card.parent_card) && card.parent_card.length > 0 
          ? card.parent_card[0] as any 
          : undefined
      })) || [];

      return transformedData as Card[];
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
