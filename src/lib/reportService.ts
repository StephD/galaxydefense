import { supabase } from './supabase';
import { Report, ReportType } from '@/types/report';
import { safeQuery } from './supabase';

// Create a new report
export const createReport = async (
  title: string,
  description: string,
  type: ReportType,
  user_id: string
): Promise<Report> => {
  // Validate required fields
  if (!title || !description || !type || !user_id) {
    throw new Error('All fields are required');
  }

  // Create report object with all required fields
  const newReport: Omit<Report, 'id' | 'created_at'> = {
    title,
    description,
    type,
    user_id,
    updated_at: new Date().toISOString()
  };

  return safeQuery<Report>(() => 
    supabase
      .from('reports')
      .insert([newReport])
      .select()
      .single()
  );
};

// Get all reports (admin only)
export const getAllReports = async (): Promise<Report[]> => {
  return safeQuery<Report[]>(() => 
    supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false })
  );
};

// Get reports by user ID
export const getReportsByUserId = async (userId: string): Promise<Report[]> => {
  return safeQuery<Report[]>(() => 
    supabase
      .from('reports')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
  );
};

// Get a single report by ID
export const getReportById = async (reportId: string): Promise<Report> => {
  const result = await safeQuery<Report>(() => 
    supabase
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .single()
  );
  
  if (!result) {
    throw new Error(`Report with ID ${reportId} not found`);
  }
  
  return result;
};

// Update an existing report
export const updateReport = async (
  reportId: string,
  updates: Partial<Omit<Report, 'id' | 'created_at'>>
): Promise<Report> => {
  if (!reportId) {
    throw new Error('Report ID is required');
  }
  
  // Add updated_at timestamp
  const updatedData = {
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  return safeQuery<Report>(() => 
    supabase
      .from('reports')
      .update(updatedData)
      .eq('id', reportId)
      .select()
      .single()
  );
};

// Delete a report
export const deleteReport = async (reportId: string): Promise<void> => {
  if (!reportId) {
    throw new Error('Report ID is required');
  }
  
  await safeQuery<null>(() => 
    supabase
      .from('reports')
      .delete()
      .eq('id', reportId)
  );
  
  return;
};

// Admin-related functions have been moved to userService.ts
