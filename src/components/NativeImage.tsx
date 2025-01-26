import { useEffect, useState } from 'react';
import { apiService } from '../services/api';

interface NativeImageProps {
  src: string;
  alt?: string;
  className?: string;
}

export const NativeImage: React.FC<NativeImageProps> = ({ src, alt = '', className = '' }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const imageData = await apiService.fetchImage(src);
        const blob = new Blob([imageData], { type: 'image/jpeg' }); // or appropriate mime type
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
      } catch (err) {
        setError('Failed to load image');
        console.error('Failed to load image:', err);
      }
    };

    loadImage();

    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [src]);

  if (error) {
    return <div className="text-red-500 text-sm">{error}</div>;
  }

  if (!imageUrl) {
    return <div className="animate-pulse bg-gray-200 h-32 w-full rounded"></div>;
  }

  return <img src={imageUrl} alt={alt} className={className} />;
};
