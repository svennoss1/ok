import { supabase } from '../lib/supabase';

export async function query(sql: string, params: any[] = []) {
  try {
    const { data, error } = await supabase.rpc('execute_query', {
      query_text: sql,
      query_params: params
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Database query failed:', error);
    throw error;
  }
}

export async function getConnection() {
  // This is a no-op as we're using Supabase
  return null;
}

export async function closeConnection() {
  // This is a no-op as we're using Supabase
  return;
} 