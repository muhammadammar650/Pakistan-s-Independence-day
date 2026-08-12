// Unified Monetag Ad Script Injector with Aggressive Vignette Load Strategy

export interface AdScriptConfig {
  zone: string;
  src: string;
  defer?: boolean;
}

export const VIGNETTE_ZONE = '11552282';
export const VIGNETTE_SRC = 'https://n6wxm.com/vignette.min.js';

const MONETAG_SCRIPTS: AdScriptConfig[] = [
  { zone: '11552420', src: 'https://nap5k.com/tag.min.js', defer: true },
  { zone: '268834', src: 'https://quge5.com/88/tag.min.js', defer: true },
  { zone: VIGNETTE_ZONE, src: VIGNETTE_SRC, defer: true }
];

let isInjectorInitialized = false;

/**
 * Aggressive Vignette-Only Load Strategy
 * Forces script checking and re-injection into the DOM every 500ms for 3 seconds (6 attempts) if it fails,
 * ensuring the vignette ad appears exactly when the 5-second reward modal opens.
 */
export function injectVignetteOnly(onLoaded?: () => void, onError?: () => void): void {
  if (typeof window === 'undefined') return;

  let attempts = 0;
  const maxAttempts = 6; // 6 attempts * 500ms = 3000ms (3 seconds)

  const checkAndInject = () => {
    attempts++;
    const container = document.head || document.body || document.documentElement;

    if (!container) {
      if (attempts < maxAttempts) {
        setTimeout(checkAndInject, 500);
      } else {
        onError?.();
      }
      return;
    }

    const existingScript = document.querySelector(`script[data-zone="${VIGNETTE_ZONE}"], script[src*="${VIGNETTE_SRC}"]`);

    if (existingScript) {
      onLoaded?.();
      return;
    }

    try {
      const script = document.createElement('script');
      script.src = VIGNETTE_SRC;
      script.dataset.zone = VIGNETTE_ZONE;
      script.async = true;
      (script as any).setAttribute('data-cfasync', 'false');

      script.onload = () => {
        onLoaded?.();
      };

      script.onerror = () => {
        console.warn(`[AdInjector] Vignette load failed on attempt ${attempts}/${maxAttempts}`);
        if (attempts < maxAttempts) {
          setTimeout(checkAndInject, 500);
        } else {
          onError?.();
        }
      };

      container.appendChild(script);
      onLoaded?.();
    } catch (err) {
      console.warn(`[AdInjector] Vignette injection error:`, err);
      if (attempts < maxAttempts) {
        setTimeout(checkAndInject, 500);
      } else {
        onError?.();
      }
    }
  };

  checkAndInject();
}

/**
 * Checks for document readiness and injects Monetag ad scripts safely.
 */
export function injectMonetagScripts(maxRetries: number = 6, retryIntervalMs: number = 500): void {
  if (typeof window === 'undefined' || isInjectorInitialized) return;
  isInjectorInitialized = true;

  // Run aggressive vignette load strategy
  injectVignetteOnly();

  // Also inject background tag scripts
  MONETAG_SCRIPTS.forEach(({ zone, src, defer }) => {
    if (zone === VIGNETTE_ZONE) return; // handled by vignette strategy
    const container = document.head || document.body || document.documentElement;
    if (!container) return;

    if (document.querySelector(`script[data-zone="${zone}"], script[src*="${zone}"]`)) return;

    try {
      const script = document.createElement('script');
      script.src = src;
      script.dataset.zone = zone;
      if (defer) script.defer = true;
      script.async = true;
      (script as any).setAttribute('data-cfasync', 'false');
      container.appendChild(script);
    } catch (e) {
      console.warn(`[AdInjector] Tag script load notice for zone ${zone}`, e);
    }
  });
}


