import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export type ReportType = 'suggestions' | 'translation' | 'optimisation' | 'other';
export type ModName = 'Steph' | 'Goat' | 'Reaper' | 'Kj' | 'SnowMiku' | 'Other';

export interface Report {
  id: string;
  title: string;
  description: string;
  type: ReportType;
  user_id: string;
  mod_id?: string; // Name of the mod who reported it
  created_at: string;
  created_at: string;
  votes?: number; // Optional for backward compatibility
}

// Get all reports (admin only)
const getAllReports = async (): Promise<Report[]> => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching all reports:', error);
      throw error;
    }

    console.log('All reports:', data);
    
    return data || [];
  } catch (error) {
    console.error('Error in getAllReports:', error);
    return [];
  }
};

// Get reports by user ID
const getReportsByUserId = async (userId: string): Promise<Report[]> => {
  if (!userId) return [];
  
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching user reports:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error(`Error fetching reports for user ${userId}:`, error);
    return [];
  }
};

// Get a single report by ID
const getReportById = async (reportId: string): Promise<Report | null> => {
  if (!reportId) return null;
  
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .single();
      
    if (error) {
      console.error(`Error fetching report with ID ${reportId}:`, error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error(`Error in getReportById for ${reportId}:`, error);
    return null;
  }
};

// Create a new report
const createReport = async (report: {
  title: string;
  description: string;
  type: ReportType;
  user_id: string;
  mod_id?: string;
}): Promise<Report> => {
  const { title, description, type, user_id, mod_id } = report;
  
  if (!title || !description || !type || !user_id) {
    throw new Error('Missing required fields for report creation');
  }
  
  // Add timestamps
  const now = new Date().toISOString();
  
  // Create report with all fields including timestamps
  const reportData = {
    title: title,
    description: description,
    type: type,
    user_id: user_id,
    mod_id: mod_id,
    votes: 0, // Initialize votes to 0
    created_at: now,
    created_at: now
  };

  const { data, error } = await supabase
    .from('reports')
    .insert([reportData])
    .select()
    .single();
    
  if (error) {
    console.error('Error creating report:', error);
    throw new Error(`Failed to create report: ${error.message}`);
  }
  
  if (!data) {
    throw new Error('No data returned after creating report');
  }
  
  return data;
};

// Update an existing report
const updateReport = async (
  reportId: string,
  updates: Partial<Omit<Report, 'id' | 'created_at'>>
): Promise<Report> => {
  if (!reportId) {
    throw new Error('Report ID is required');
  }
  
  // Add created_at timestamp
  const updatedData = {
    ...updates,
    created_at: new Date().toISOString()
  };
  
  const { data, error } = await supabase
    .from('reports')
    .update(updatedData)
    .eq('id', reportId)
    .select()
    .single();
    
  if (error) {
    console.error(`Error updating report ${reportId}:`, error);
    throw new Error(`Failed to update report: ${error.message}`);
  }
  
  if (!data) {
    throw new Error(`Report with ID ${reportId} not found or could not be updated`);
  }
  
  return data;
};

// Delete a report
const deleteReport = async (reportId: string): Promise<void> => {
  if (!reportId) {
    throw new Error('Report ID is required');
  }
  
  const { error } = await supabase
    .from('reports')
    .delete()
    .eq('id', reportId);
    
  if (error) {
    console.error(`Error deleting report ${reportId}:`, error);
    throw new Error(`Failed to delete report: ${error.message}`);
  }
};

// Hook to fetch all reports (admin only)
export const useAllReports = () => {
  return useQuery({
    queryKey: ["reports", "all"],
    queryFn: getAllReports,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  });
};

// Hook to fetch reports by user ID
export const useUserReports = (userId: string) => {
  return useQuery({
    queryKey: ["reports", "user", userId],
    queryFn: () => getReportsByUserId(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    enabled: !!userId // Only run the query if userId is provided
  });
};

// Hook to fetch a single report by ID
export const useReport = (reportId: string) => {
  return useQuery({
    queryKey: ["reports", "single", reportId],
    queryFn: () => getReportById(reportId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    enabled: !!reportId // Only run the query if reportId is provided
  });
};

// Hook to create a new report
export const useCreateReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createReport,
    onSuccess: () => {
      // Invalidate relevant queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    }
  });
};

// Hook to update an existing report
export const useUpdateReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ reportId, updates }: { reportId: string; updates: Partial<Omit<Report, 'id' | 'created_at'>> }) => 
      updateReport(reportId, updates),
    onSuccess: () => {
      // Invalidate relevant queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    }
  });
};

// Hook to delete a report
export const useDeleteReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteReport,
    onSuccess: () => {
      // Invalidate relevant queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    }
  });
};

// Vote up a report
const voteUpReport = async (reportId: string): Promise<Report> => {
  if (!reportId) {
    throw new Error('Report ID is required');
  }
  
  // First get the current report to get the current vote count
  const { data: currentReport, error: fetchError } = await supabase
    .from('reports')
    .select('votes')
    .eq('id', reportId)
    .single();
    
  if (fetchError) {
    console.error(`Error fetching report ${reportId}:`, fetchError);
    throw new Error(`Failed to fetch report: ${fetchError.message}`);
  }
  
  if (!currentReport) {
    throw new Error(`Report with ID ${reportId} not found`);
  }
  
  // Increment the vote count
  const currentVotes = currentReport.votes || 0;
  const newVotes = currentVotes + 1;
  
  // Update the report with the new vote count
  const { data, error } = await supabase
    .from('reports')
    .update({ votes: newVotes, created_at: new Date().toISOString() })
    .eq('id', reportId)
    .select()
    .single();
    
  if (error) {
    console.error(`Error voting up report ${reportId}:`, error);
    throw new Error(`Failed to vote up report: ${error.message}`);
  }
  
  if (!data) {
    throw new Error(`Report with ID ${reportId} not found or could not be updated`);
  }
  
  return data;
};

// Hook to vote up a report
export const useVoteUpReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: voteUpReport,
    onSuccess: () => {
      // Invalidate relevant queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    }
  });
};
