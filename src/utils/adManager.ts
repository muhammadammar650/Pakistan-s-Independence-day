/**
 * Adsterra Ad Manager Utility
 * Handles Social Bar script loading with a 10-second delay.
 */

let isSocialBarInjected = false;

export function loadSocialBarScript(delayMs: number = 10000): void {
  const SCRIPT_URL = 'https://crayondrunkcontend.com/f3/6f/3a/f36f3a833fca32c9ec628b790b6207a7.js';

  if (isSocialBarInjected || document.querySelector(`script[src="${SCRIPT_URL}"]`)) {
    isSocialBarInjected = true;
    return;
  }

  const inject = () => {
    if (isSocialBarInjected || document.querySelector(`script[src="${SCRIPT_URL}"]`)) return;
    try {
      const socialScript = document.createElement('script');
      socialScript.type = 'text/javascript';
      socialScript.src = SCRIPT_URL;
      socialScript.async = true;
      socialScript.onload = () => {
        isSocialBarInjected = true;
      };
      document.body.appendChild(socialScript);
    } catch (e) {
      console.error('[ADSTERRA_ERR] Social bar injection failed:', e);
    }
  };

  if (delayMs <= 0) {
    inject();
  } else {
    setTimeout(inject, delayMs);
  }
}
