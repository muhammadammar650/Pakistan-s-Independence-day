import React, { useEffect, useRef, useCallback, useState } from 'react';

interface AdsterraBannerProps {
  type: 'middle_320x50' | 'bottom_468x60' | 'modal_320x50';
}

export const AdsterraBanner: React.FC<AdsterraBannerProps> = ({ type }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const renderAttemptsRef = useRef<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(type === 'modal_320x50');

  useEffect(() => {
    if (type === 'modal_320x50') {
      setIsVisible(true);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '150px' }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [type]);

  const renderBanner = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';

    const iframe: HTMLIFrameElement = document.createElement('iframe');
    const is320x50 = type === 'middle_320x50' || type === 'modal_320x50';
    const width = is320x50 ? 320 : 468;
    const height = is320x50 ? 50 : 60;
    const key = is320x50 ? '96f1666ec4a0c41473c0ee7fb517df80' : '2fe919ff850807563442cb456296848e';

    iframe.width = `${width}`;
    iframe.height = `${height}`;
    iframe.style.border = '0';
    iframe.style.margin = '0';
    iframe.style.padding = '0';
    iframe.style.maxWidth = '100%';
    iframe.style.display = 'block';
    iframe.scrolling = 'no';
    iframe.title = 'Ad Container';

    container.appendChild(iframe);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            html, body {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              background: transparent;
            }
          </style>
        </head>
        <body>
          <script type="text/javascript">
            atOptions = {
              'key' : '${key}',
              'format' : 'iframe',
              'height' : ${height},
              'width' : ${width},
              'params' : {}
            };
          </script>
          <script type="text/javascript" src="https://crayondrunkcontend.com/${key}/invoke.js"></script>
        </body>
      </html>
    `;

    try {
      const frameEl = iframe as HTMLIFrameElement;
      frameEl.srcdoc = htmlContent;
      setTimeout(() => {
        try {
          const doc = frameEl.contentWindow?.document || frameEl.contentDocument;
          if (doc && (!doc.body || doc.body.children.length === 0)) {
            doc.open();
            doc.write(htmlContent);
            doc.close();
          }
        } catch {
          // ignore iframe restrictions if loaded
        }
      }, 500);
    } catch (e) {
      console.error('[ADSTERRA_BANNER_ERR]', e);
    }
  }, [type]);

  useEffect(() => {
    if (!isVisible) return;

    renderBanner();

    const container = containerRef.current;
    if (!container) return;

    const observer = new MutationObserver(() => {
      if (container.children.length === 0 && renderAttemptsRef.current < 3) {
        renderAttemptsRef.current += 1;
        renderBanner();
      }
    });

    observer.observe(container, { childList: true, subtree: true });

    const verifyTimer = setTimeout(() => {
      if ((!container.hasChildNodes() || container.children.length === 0) && renderAttemptsRef.current < 3) {
        renderAttemptsRef.current += 1;
        renderBanner();
      }
    }, 2500);

    return () => {
      clearTimeout(verifyTimer);
      observer.disconnect();
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [isVisible, renderBanner]);

  const is320 = type === 'middle_320x50' || type === 'modal_320x50';
  const containerWrapperClass =
    type === 'middle_320x50'
      ? 'my-5 flex flex-col items-center justify-center w-full min-h-[60px]'
      : type === 'bottom_468x60'
      ? 'mt-6 mb-3 flex flex-col items-center justify-center w-full min-h-[70px]'
      : 'my-2 flex flex-col items-center justify-center w-full min-h-[60px]';

  return (
    <div className={containerWrapperClass}>
      <p className="text-[10px] text-gray-400 font-mono font-bold tracking-widest uppercase mb-1">
        ADVERTISING
      </p>
      <div 
        ref={containerRef} 
        className={`flex items-center justify-center bg-black/30 border border-white/20 rounded-xl shadow-xl relative ${
          is320 ? 'w-[320px] max-w-full h-[50px]' : 'w-[468px] max-w-full h-[60px]'
        }`}
      />
    </div>
  );
};
