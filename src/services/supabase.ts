import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';
import { encodeGreeting } from '../utils/encoder';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function createGreeting(name: string, presetIndex: number): Promise<string> {
  if (!supabase) {
    console.warn('Supabase not configured, using URL fallback');
    return encodeGreeting(name, presetIndex);
  }

  let id = nanoid(8);
  try {
    const { error } = await supabase
      .from('greetings')
      .insert([{ id, name, preset_index: presetIndex }]);
      
    if (error) {
      if (error.code === '23505') { // unique violation
        id = nanoid(9); // try again
        const retry = await supabase.from('greetings').insert([{ id, name, preset_index: presetIndex }]);
        if (retry.error) throw retry.error;
      } else {
        throw error;
      }
    }
    return id;
  } catch (e) {
    console.warn('Supabase save failed, falling back to local/URL state', e);
    return encodeGreeting(name, presetIndex);
  }
}

export async function getGreeting(id: string): Promise<{ name: string, presetIndex: number } | null> {
  if (!supabase) return null;
  
  try {
    const { data, error } = await supabase
      .from('greetings')
      .select('name, preset_index')
      .eq('id', id)
      .single();
      
    if (error || !data) return null;
    return { name: data.name, presetIndex: data.preset_index };
  } catch (e) {
    return null;
  }
}
