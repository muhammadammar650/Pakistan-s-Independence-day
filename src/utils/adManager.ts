export function injectAdScript(forceRetry = false): void {
  const SCRIPT_URL = 'https://nap5k.com/tag.min.js';
  const ZONE_ID = '11552420';

  if (forceRetry) {
    const staleScripts = document.querySelectorAll(`script[src="${SCRIPT_URL}"], script[data-zone="${ZONE_ID}"]`);
    staleScripts.forEach((el) => el.remove());
    console.log('[AD_MANAGER_STATUS: FORCE_RETRY_CLEANUP] Removed existing stale script tags for re-injection.');
  } else {
    // Check if script is already present in document
    const existingScript = 
      document.querySelector(`script[src="${SCRIPT_URL}"]`) ||
      document.querySelector(`script[data-zone="${ZONE_ID}"]`);

    if (existingScript) {
      console.log('[AD_MANAGER_STATUS: 208_ALREADY_EXISTS] Ad script is already present in document.');
      return;
    }
  }

  try {
    const s = document.createElement('script');
    s.dataset.zone = ZONE_ID;
    s.src = SCRIPT_URL;
    s.async = true;

    s.onload = () => {
      console.log('[AD_MANAGER_STATUS: 200_LOADED_SUCCESS] Ad script loaded and executed successfully.');
    };

    s.onerror = (e) => {
      console.error('[AD_MANAGER_STATUS: ERR_403_OR_BLOCKED] Failed to load ad script. Request was blocked by ad-blocker or network error.', e);
    };

    // Explicitly target document.head
    const targetHead = document.head || document.getElementsByTagName('head')[0] || document.documentElement;

    if (targetHead) {
      targetHead.appendChild(s);
      console.log('[AD_MANAGER_STATUS: 100_INJECTED_TO_HEAD] Ad script tag appended to document.head.');

      // Verification check 1: immediate presence in head
      const isPresentInHead = targetHead.contains(s) || Boolean(document.head.querySelector(`script[src="${SCRIPT_URL}"]`));
      if (isPresentInHead) {
        console.log('[AD_MANAGER_STATUS: 200_VERIFIED_IN_HEAD] Verified script presence in document.head.');
      } else {
        console.warn('[AD_MANAGER_STATUS: ERR_BLOCKED_REMOVED_FROM_HEAD] Script tag was immediately removed from document.head (Ad-Blocker detected).');
      }

      // Verification check 2: delayed check for DOM sanitizer / ad-blocker removal
      setTimeout(() => {
        const stillInDom = Boolean(
          document.querySelector(`script[src="${SCRIPT_URL}"]`) ||
          document.querySelector(`script[data-zone="${ZONE_ID}"]`)
        );
        if (!stillInDom) {
          console.warn('[AD_MANAGER_STATUS: ERR_DOM_CLEANED] Script tag was sanitized/removed from DOM after injection.');
          schedule10SecFallback();
        } else {
          console.log('[AD_MANAGER_STATUS: 200_DOM_PRESENCE_CONFIRMED] Script tag confirmed active in DOM.');
        }
      }, 300);
    } else {
      console.error('[AD_MANAGER_STATUS: ERR_NO_HEAD_FOUND] Could not locate document.head or target container for injection.');
      schedule10SecFallback();
    }
  } catch (e) {
    console.error('[AD_MANAGER_STATUS: ERR_EXCEPTION] Exception occurred during ad script injection:', e);
    schedule10SecFallback();
  }
}

let fallbackTimer: ReturnType<typeof setTimeout> | null = null;

function schedule10SecFallback(): void {
  if (fallbackTimer) return;
  console.log('[AD_MANAGER_STATUS: 10S_FALLBACK_SCHEDULED] Verification failed. Scheduling fallback script re-injection attempt in 10 seconds...');
  fallbackTimer = setTimeout(() => {
    fallbackTimer = null;
    console.log('[AD_MANAGER_STATUS: 10S_FALLBACK_EXECUTING] Attempting re-injection after 10-second delay due to verification failure...');
    injectAdScript(true);
  }, 10000);
}


