import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

const ImageLightbox = ({ images, currentIndex, onChange, onClose }) => {
  const hasMultipleImages = images.length > 1;

  const showPrevious = () => {
    onChange((currentIndex - 1 + images.length) % images.length);
  };

  const showNext = () => {
    onChange((currentIndex + 1) % images.length);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft" && hasMultipleImages) showPrevious();
      if (event.key === "ArrowRight" && hasMultipleImages) showNext();
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  });

  if (!images.length) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 px-4 py-16"
      role="dialog"
      aria-modal="true"
      aria-label="Property photo viewer"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white sm:right-8 sm:top-6"
        aria-label="Close photo viewer"
        title="Close"
      >
        <X size={24} />
      </button>

      <div className="absolute left-1/2 top-5 -translate-x-1/2 text-sm font-semibold text-white">
        {currentIndex + 1} / {images.length}
      </div>

      {hasMultipleImages && (
        <button
          type="button"
          onClick={showPrevious}
          className="absolute left-3 grid h-11 w-11 place-items-center rounded-full bg-white text-slate-900 shadow-lg transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-white sm:left-8"
          aria-label="Previous photo"
          title="Previous photo"
        >
          <ChevronLeft size={28} />
        </button>
      )}

      <img
        src={images[currentIndex]}
        alt={`Property photo ${currentIndex + 1} of ${images.length}`}
        className="max-h-full max-w-full select-none object-contain"
      />

      {hasMultipleImages && (
        <button
          type="button"
          onClick={showNext}
          className="absolute right-3 grid h-11 w-11 place-items-center rounded-full bg-white text-slate-900 shadow-lg transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-white sm:right-8"
          aria-label="Next photo"
          title="Next photo"
        >
          <ChevronRight size={28} />
        </button>
      )}
    </div>,
    document.body,
  );
};

export default ImageLightbox;
