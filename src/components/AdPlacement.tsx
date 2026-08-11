import React, { useEffect, useRef, useState } from 'react';
import { injectAdScript } from '../utils/adManager';

interface AdPlacementProps {
  type: 'native' | 'rewarded';
  onLoaded?: () => void;
}

export const AdPlacement: React.FC<AdPlacementProps> = ({ type, onLoaded }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const hasTriggeredLoad = useRef(false);

  // Hook to periodically check every 30s if ad container is empty and force re-inject
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      const hasContent = Boolean(
        container.querySelector('iframe') ||
        container.querySelector('ins') ||
        container.children.length > 2
      );

      if (!hasContent && !hasTriggeredLoad.current) {
        console.warn('[AD_PLACEMENT_STATUS: 30S_CONTAINER_EMPTY] Ad container remains empty after 30s. Removing stale script tags and re-injecting...');
        injectAdScript(true);
      } else if (hasContent && !hasTriggeredLoad.current) {
        hasTriggeredLoad.current = true;
        setIsLoaded(true);
        if (onLoaded) {
          onLoaded();
        }
      }
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [onLoaded]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Inject the script using adManager
    injectAdScript();

    const checkLoaded = () => {
      if (hasTriggeredLoad.current) return;
      if (
        container.querySelector('iframe') || 
        container.querySelector('ins') || 
        container.children.length > 2 // Includes Loading/Sponsored + Ad script elements
      ) {
        hasTriggeredLoad.current = true;
        setIsLoaded(true);
        if (onLoaded) {
          onLoaded();
        }
      }
    };

    const observer = new MutationObserver(() => {
      checkLoaded();
    });
    observer.observe(container, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, [onLoaded]);

  if (type === 'rewarded') {
    return (
      <div className="w-full flex justify-center my-6">
        <div 
          ref={containerRef}
          id="rewarded-ad-container" 
          className={`native-ad-container w-[300px] h-[250px] relative flex items-center justify-center transition-all duration-500 overflow-hidden rounded-xl ${
            isLoaded ? 'bg-black/40 border border-green-500/30 shadow-xl' : 'bg-transparent'
          }`}
        >
          {!isLoaded && (
            <div className="text-white/40 text-sm flex items-center gap-2">
              <span className="animate-pulse">Loading Ad...</span>
            </div>
          )}
          <div className={`absolute top-0 left-0 bg-black/60 text-[9px] text-white/50 px-2 py-0.5 rounded-br-lg z-10 pointer-events-none transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            Sponsored
          </div>
        </div>
      </div>
    );
  }

  // Native Banner Placement
  return (
    <div className="w-full flex justify-center my-6">
      <div 
        ref={containerRef}
        id="native-ad-container" 
        className={`native-ad-container w-[320px] h-[50px] sm:w-[728px] sm:h-[90px] relative flex items-center justify-center transition-all duration-500 overflow-hidden rounded-lg ${
          isLoaded ? 'bg-black/20 border border-green-500/30' : 'bg-transparent'
        }`}
      >
        {!isLoaded && (
          <div className="text-white/40 text-sm flex items-center gap-2">
            <span className="animate-pulse">Loading Ad...</span>
          </div>
        )}
        <div className={`absolute top-0 left-0 bg-black/60 text-[9px] text-white/50 px-2 py-0.5 rounded-br-lg z-10 pointer-events-none transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          Advertisement
        </div>
      </div>
    </div>
  );
};
