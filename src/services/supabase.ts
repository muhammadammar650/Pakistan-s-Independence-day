import { GreetingData } from '../types';

/**
 * Minimal Supabase / Local Storage service layer
 * Provides seamless client-side base64 store with optional Supabase Cloud Sync
 */

const SUPABASE_URL = (import.meta as unknown as { env: Record<string, string> }).env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = (import.meta as unknown as { env: Record<string, string> }).env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export async function saveGreetingToDatabase(greeting: GreetingData): Promise<string> {
  if (isSupabaseConfigured) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/greetings`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY!,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({
          id: greeting.id,
          sender_name: greeting.senderName,
          custom_msg_index: greeting.customMsgIndex || 0,
          created_at: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data[0] && data[0].id) {
          return data[0].id;
        }
      }
    } catch (e) {
      console.warn('Supabase save error, falling back to instant client URL:', e);
    }
  }

  // Local Storage Cache fallback
  try {
    const key = `pak_greeting_${greeting.id}`;
    localStorage.setItem(key, JSON.stringify(greeting));
  } catch {
    // Ignore storage quota
  }

  return greeting.id;
}

export async function fetchGreetingFromDatabase(id: string): Promise<GreetingData | null> {
  // Check local cache first
  try {
    const cached = localStorage.getItem(`pak_greeting_${id}`);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch {
    // Ignore
  }

  if (isSupabaseConfigured) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/greetings?id=eq.${id}&select=*`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY!,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });

      if (response.ok) {
        const rows = await response.json();
        if (rows && rows.length > 0) {
          const row = rows[0];
          return {
            id: row.id,
            senderName: row.sender_name,
            customMsgIndex: row.custom_msg_index,
            createdAt: row.created_at,
          };
        }
      }
    } catch (e) {
      console.warn('Supabase fetch error:', e);
    }
  }

  return null;
}
