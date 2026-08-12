// State-Driven Vignette & Ad Manager
// Manages Vignette ads smoothly without annoying popunder spam or navigation loops

type AdCallback = () => void;

class VignetteManagerClass {
  private isAdLoading: boolean = false;
  private lastTriggerTime: number = 0;
  private cooldownMs: number = 25000; // 25 seconds cooldown to prevent user frustration

  /**
   * Passive click recorder (no auto-popunder on micro clicks)
   */
  public registerClick(): void {
    // Intentionally no-op to prevent frustrating popunders on typing/tapping
  }

  /**
   * Safely trigger Vignette Banner Ad without redirecting current page away
   */
  public triggerVignette(context: string = 'general', onComplete?: AdCallback): void {
    const now = Date.now();

    if (this.isAdLoading || (now - this.lastTriggerTime < this.cooldownMs)) {
      if (onComplete) onComplete();
      return;
    }

    this.isAdLoading = true;
    this.lastTriggerTime = now;

    setTimeout(() => {
      try {
        if (typeof window !== 'undefined') {
          const win = window as any;
          if (typeof win.show_11552282 === 'function') {
            win.show_11552282();
          } else if (typeof win.showVignette === 'function') {
            win.showVignette();
          } else if (typeof win.show_268834 === 'function') {
            win.show_268834();
          } else if (typeof win.show_11552420 === 'function') {
            win.show_11552420();
          }
        }
      } catch (err) {
        console.warn(`[AdManager] Ad call notice:`, err);
      } finally {
        setTimeout(() => {
          this.isAdLoading = false;
          if (onComplete) onComplete();
        }, 1200);
      }
    }, 10);
  }
}

export const VignetteManager = new VignetteManagerClass();

