// Unified Monetag Ad Script Injector
export interface AdScriptConfig {
  zone: string;
  src: string;
  defer?: boolean;
}

const MONETAG_SCRIPTS: AdScriptConfig[] = [
  { zone: '11552420', src: 'https://nap5k.com/tag.min.js', defer: true },
  { zone: '268834', src: 'https://quge5.com/88/tag.min.js', defer: true },
  { zone: '11552282', src: 'https://n6wxm.com/vignette.min.js', defer: true }
];

let isInjectorInitialized = false;

/**
 * Checks for document readiness and injects Monetag ad scripts safely
 * with a retry mechanism for slow 4G connections.
 */
export function injectMonetagScripts(maxRetries: number = 10, retryIntervalMs: number = 500): void {
  if (typeof window === 'undefined' || isInjectorInitialized) return;

  const attemptInjection = (attemptsLeft: number) => {
    // Ensure DOM container (head or body) is ready
    const targetContainer = document.head || document.body || document.documentElement;

    if (!targetContainer || (document.readyState === 'loading' && !document.body)) {
      if (attemptsLeft > 0) {
        setTimeout(() => attemptInjection(attemptsLeft - 1), retryIntervalMs);
      } else {
        // Fallback listener if DOMContentLoaded hasn't fired yet
        if (document.readyState === 'loading') {
          window.addEventListener('DOMContentLoaded', () => attemptInjection(1), { once: true });
        }
      }
      return;
    }

    isInjectorInitialized = true;

    MONETAG_SCRIPTS.forEach(({ zone, src, defer }) => {
      const existingScript = document.querySelector(`script[data-zone="${zone}"], script[src*="${zone}"]`);
      if (existingScript) return;

      try {
        const script = document.createElement('script');
        script.src = src;
        script.dataset.zone = zone;
        if (defer) script.defer = true;
        script.async = true;
        (script as any).setAttribute('data-cfasync', 'false');

        // Retry mechanism for slow network loading (e.g., 4G network stalls)
        let scriptRetries = 2;
        script.onerror = () => {
          console.log(`[AdInjector] Monetag script loading notice for zone ${zone}. Retrying...`);
          if (scriptRetries > 0) {
            scriptRetries--;
            setTimeout(() => {
              if (!document.querySelector(`script[data-zone="${zone}"]`)) {
                const retryScript = script.cloneNode() as HTMLScriptElement;
                targetContainer.appendChild(retryScript);
              }
            }, 2000);
          }
        };

        targetContainer.appendChild(script);
      } catch (e) {
        console.warn(`[AdInjector] Script load notice:`, e);
      }
    });
  };

  attemptInjection(maxRetries);
}

