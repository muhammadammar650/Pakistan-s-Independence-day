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
 * Injects Monetag ad scripts safely with defer attributes
 */
export function injectMonetagScripts(): void {
  if (typeof window === 'undefined' || isInjectorInitialized) return;
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

      script.onerror = () => {
        console.log(`[AdInjector] Monetag script loading info for zone ${zone}`);
      };

      document.head.appendChild(script);
    } catch (e) {
      console.warn(`[AdInjector] Script load notice:`, e);
    }
  });
}
