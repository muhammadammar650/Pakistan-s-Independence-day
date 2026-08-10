import { GreetingData } from '../types';

/**
 * Encodes a name and optional preset index into a safe URL slug or base64 string
 * Supports Unicode, Urdu script, Arabic, spaces, emojis (e.g. 🇵🇰)
 */
export function encodeGreeting(name: string, presetIndex: number = 0): string {
  const trimmed = name.trim();
  if (!trimmed) return '';

  const payload = JSON.stringify({
    n: trimmed,
    p: presetIndex,
    t: Date.now(),
  });

  try {
    // UTF-8 safe base64 encoding
    const utf8Bytes = new TextEncoder().encode(payload);
    let binary = '';
    for (let i = 0; i < utf8Bytes.length; i++) {
      binary += String.fromCharCode(utf8Bytes[i]);
    }
    const b64 = btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    return b64;
  } catch (e) {
    console.error('Encoding error:', e);
    return encodeURIComponent(trimmed);
  }
}

/**
 * Decodes a payload string or query string into a GreetingData object
 */
export function decodeGreeting(idOrName: string): GreetingData | null {
  if (!idOrName) return null;

  // Try decoding Base64 JSON
  try {
    let base64 = idOrName.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const jsonStr = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(jsonStr);

    if (parsed && typeof parsed.n === 'string') {
      return {
        id: idOrName,
        senderName: parsed.n,
        customMsgIndex: typeof parsed.p === 'number' ? parsed.p : 0,
      };
    }
  } catch {
    // If not valid base64 JSON, treat raw string as plain name
  }

  // Fallback: decode URI component (e.g., raw name in path or query)
  try {
    const decodedName = decodeURIComponent(idOrName).trim();
    if (decodedName) {
      return {
        id: idOrName,
        senderName: decodedName,
        customMsgIndex: 0,
      };
    }
  } catch {
    // Ignore error
  }

  return null;
}

/**
 * Extracts greeting details from the current browser window location
 */
export function parseCurrentLocation(): GreetingData | null {
  if (typeof window === 'undefined') return null;

  const pathname = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);

  // Check query parameter fallback "?n=Name" or "?name=Name"
  const queryName = searchParams.get('n') || searchParams.get('name') || searchParams.get('g');
  if (queryName) {
    const decoded = decodeGreeting(queryName);
    if (decoded) return decoded;
  }

  // Check path route "/g/:id"
  const match = pathname.match(/\/g\/([^/]+)/);
  if (match && match[1]) {
    const routeId = match[1];
    const decoded = decodeGreeting(routeId);
    if (decoded) return decoded;
  }

  return null;
}

/**
 * Constructs a full shareable URL matching the current host/domain
 */
export function buildShareUrl(encodedId: string): string {
  return `https://independenceday.netlify.app/g/${encodedId}`;
}
