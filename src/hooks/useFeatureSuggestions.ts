import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

// Types
export type FeatureStatus = "planned" | "in-progress" | "considering";

export interface FeatureSuggestion {
  id: string;
  title: string;
  description: string;
  votes: number;
  status: FeatureStatus;
  created_at?: string;
}

// SQL query to fetch feature suggestions from Supabase
const getFeatureSuggestions = async (): Promise<FeatureSuggestion[]> => {
  try {
    const { data, error } = await supabase
      .from('upcoming_features')
      .select('*')
      .order('votes', { ascending: false });
      
    if (error) {
      console.error('Error fetching feature suggestions:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching feature suggestions:', error);
    return [];
  }
};

// Hook to fetch feature suggestions
export const useFeatureSuggestions = () => {
  return useQuery({
    queryKey: ['featureSuggestions'],
    queryFn: getFeatureSuggestions,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Function to upvote a feature suggestion
export const upvoteFeature = async (featureId: string): Promise<FeatureSuggestion | null> => {
  try {
    // First get the current feature to get its vote count
    const { data: feature, error: fetchError } = await supabase
      .from('upcoming_features')
      .select('votes')
      .eq('id', featureId)
      .single();
    
    if (fetchError) {
      console.error('Error fetching feature for upvote:', fetchError);
      return null;
    }
    
    // Then update with incremented vote count
    const { data, error } = await supabase
      .from('upcoming_features')
      .update({ votes: (feature.votes || 0) + 1 })
      .eq('id', featureId)
      .select()
      .single();
    
    if (error) {
      console.error('Error upvoting feature:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Unexpected error upvoting feature:', error);
    return null;
  }
};

// Hook to upvote a feature suggestion
export const useUpvoteFeature = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: upvoteFeature,
    onSuccess: () => {
      // Invalidate the feature suggestions query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['featureSuggestions'] });
    },
  });
};

// Function to add a new feature suggestion
export const addFeatureSuggestion = async (feature: Omit<FeatureSuggestion, 'id' | 'votes'>): Promise<FeatureSuggestion | null> => {
  try {
    const { data, error } = await supabase
      .from('upcoming_features')
      .insert({ ...feature, votes: 0 })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding feature suggestion:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Unexpected error adding feature suggestion:', error);
    return null;
  }
};

// Hook to add a new feature suggestion
export const useAddFeatureSuggestion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: addFeatureSuggestion,
    onSuccess: () => {
      // Invalidate the feature suggestions query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['featureSuggestions'] });
    },
  });
};
