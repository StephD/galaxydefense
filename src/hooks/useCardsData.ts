
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
          combo_card_id,
          parent_card_id,
          tower:towers(id, name, description)
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
      const comboCardIds = data.map(card => card.combo_card_id).filter(Boolean);
      const parentCardIds = data.map(card => card.parent_card_id).filter(Boolean);
      
      const relatedCardIds = [...new Set([...comboCardIds, ...parentCardIds])];
      
      let relatedCards: any[] = [];
      if (relatedCardIds.length > 0) {
        const { data: relatedCardsData } = await supabase
          .from('cards')
          .select('id, name, type')
          .in('id', relatedCardIds);
        
        relatedCards = relatedCardsData || [];
      }

      // Transform the data to include related cards
      const transformedData = data.map(card => ({
        ...card,
        combo_card: card.combo_card_id 
          ? relatedCards.find(c => c.id === card.combo_card_id) 
          : undefined,
        parent_card: card.parent_card_id 
          ? relatedCards.find(c => c.id === card.parent_card_id) 
          : undefined
      }));

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
