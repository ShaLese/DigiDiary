import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  videos: string[];
}

export default function ImageGallery({ images, videos }: ImageGalleryProps) {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((img, i) => (
          <div 
            key={`img-${i}`}
            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setSelectedMedia(img)}
          >
            <img 
              src={img} 
              alt={`Image ${i + 1}`} 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {videos.map((video, i) => (
          <div 
            key={`video-${i}`}
            className="relative aspect-square rounded-lg overflow-hidden"
          >
            <video 
              src={video} 
              className="w-full h-full object-cover" 
              controls
            />
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedMedia && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedMedia}
              alt="Selected media"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
}
