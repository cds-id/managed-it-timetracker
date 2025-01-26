import { useEffect, useRef } from 'react';
import { NativeImage } from './NativeImage';
import * as ReactDOM from 'react-dom/client';

interface RichContentProps {
  html: string;
  className?: string;
}

const replaceImageTags = (html: string): string => {
  return html.replace(
    /<img[^>]+src="\/api\/uploads\/([^"]+)"[^>]*>/g,
    (_, src) => {
      return `<native-img data-src="/api/uploads/${src}"></native-img>`;
    }
  );
};

export const RichContent: React.FC<RichContentProps> = ({ html, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const nativeImgElements = container.getElementsByTagName('native-img');

    Array.from(nativeImgElements).forEach((element) => {
      const src = element.getAttribute('data-src');
      if (!src) return;

      const imageComponent = document.createElement('div');
      const root = ReactDOM.createRoot(imageComponent);
      root.render(<NativeImage src={src} className="max-w-full h-auto" />);

      element.parentNode?.replaceChild(imageComponent, element);
    });

    return () => {
      // Cleanup if needed
    };
  }, [html]);

  return (
    <div
      ref={containerRef}
      className={className}
      dangerouslySetInnerHTML={{ __html: replaceImageTags(html) }}
    />
  );
};
