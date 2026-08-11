import { GreetingData } from '../types';

/**
 * Encodes a name and optional preset index into a short query-friendly ID.
 */
export function encodeGreeting(name: string, presetIndex: number = 0): string {
  const trimmed = name.trim();
  if (!trimmed) return '';
  return `n=${encodeURIComponent(trimmed)}&p=${presetIndex}`;
}

/**
 * Decodes a payload string or query string into a GreetingData object
 */
export function decodeGreeting(idOrName: string): GreetingData | null {
  if (!idOrName) return null;
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

  // 1. Check direct query parameters (Short, beautiful link)
  // Example: ?n=Ammar&p=1
  const queryName = searchParams.get('n') || searchParams.get('name');
  if (queryName) {
    const presetStr = searchParams.get('p');
    const presetIndex = presetStr ? parseInt(presetStr, 10) : 0;
    return {
      id: queryName,
      senderName: queryName,
      customMsgIndex: isNaN(presetIndex) ? 0 : presetIndex,
    };
  }

  // 2. Backwards compatibility for /g/:id routes (Base64 encoded or plain text)
  const match = pathname.match(/\/g\/([^/]+)/);
  if (match && match[1]) {
    const routeId = match[1];
    
    // Attempt to decode as base64 first (old format with | )
    try {
      let base64 = routeId.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4 !== 0) {
        base64 += '=';
      }
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const decodedStr = new TextDecoder().decode(bytes);
      
      const lastPipe = decodedStr.lastIndexOf('|');
      if (lastPipe >= 0) {
        const senderName = decodedStr.substring(0, lastPipe);
        const presetIndexStr = decodedStr.substring(lastPipe + 1);
        const presetIndex = parseInt(presetIndexStr, 10);
        return {
          id: routeId,
          senderName: senderName,
          customMsgIndex: isNaN(presetIndex) ? 0 : presetIndex,
        };
      }
    } catch {
      // Not a valid base64 string or failed to parse, fallback to raw string
    }
    
    return decodeGreeting(routeId);
  }

  return null;
}

/**
 * Constructs a full shareable URL matching the current host/domain
 */
export function buildShareUrl(encodedId: string): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  // If it's our new query string format
  if (encodedId.includes('n=')) {
    return `${origin}/?${encodedId}`;
  }
  // Fallback for legacy
  return `${origin}/g/${encodedId}`;
}
