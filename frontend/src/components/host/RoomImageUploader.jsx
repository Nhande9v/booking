import React, { useRef, useState } from "react";
import { ImagePlus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteUploadedImage, uploadImage } from "@/lib/cloudinaryUpload";

const MAX_PHOTOS = 8;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const RoomImageUploader = ({ photos, coverPhoto, onChange, disabled }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    event.target.value = "";
    if (!selectedFiles.length) return;

    const remaining = MAX_PHOTOS - photos.length;
    if (remaining <= 0) {
      toast.error(`Each room type can have up to ${MAX_PHOTOS} photos.`);
      return;
    }

    const files = selectedFiles.slice(0, remaining);
    const invalid = files.find(
      (file) =>
        !ALLOWED_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE
    );
    if (invalid) {
      toast.error("Use JPG, PNG, or WebP files up to 5 MB each.");
      return;
    }

    setUploading(true);
    try {
      const uploaded = [];
      for (const file of files) uploaded.push(await uploadImage(file));
      const nextPhotos = [...photos, ...uploaded];
      onChange({
        photos: nextPhotos,
        coverPhoto: coverPhoto || nextPhotos[0] || null,
      });
      toast.success("Room photos uploaded successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = async (index) => {
    const image = photos[index];
    try {
      await deleteUploadedImage(image);
      const nextPhotos = photos.filter((_, photoIndex) => photoIndex !== index);
      onChange({
        photos: nextPhotos,
        coverPhoto:
          coverPhoto?.storageKey === image.storageKey
            ? nextPhotos[0] || null
            : coverPhoto,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete this room photo.");
    }
  };

  return (
    <div className="space-y-5">
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFiles}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled || uploading}
        className="group flex min-h-32 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-blue-200 bg-blue-50/70 px-5 text-center transition hover:border-blue-400 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-blue-600 shadow-sm ring-1 ring-blue-100 transition group-hover:-translate-y-0.5 group-hover:shadow-md">
          <ImagePlus size={21} />
        </span>
        <span className="text-sm font-bold text-slate-900">
          {uploading ? "Uploading photos..." : "Add room photos"}
        </span>
        <span className="text-xs font-medium text-slate-500">
          JPG, PNG or WebP · Up to 5 MB · {photos.length}/{MAX_PHOTOS} photos
        </span>
      </button>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,320px))] gap-4">
        {photos.map((photo, index) => {
          const isCover = coverPhoto?.storageKey === photo.storageKey;
          return (
            <div
              key={photo.storageKey}
              className={`group overflow-hidden rounded-lg border bg-white transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                isCover
                  ? "border-blue-300 shadow-sm"
                  : "border-slate-200 shadow-sm"
              }`}
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={photo.url}
                  alt={`Room ${index + 1}`}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="grid grid-cols-2 border-t border-slate-200 bg-white">
                <button
                  type="button"
                  title="Set as cover"
                  onClick={() => onChange({ coverPhoto: photo, photos })}
                  disabled={isCover || disabled}
                  className="flex min-h-11 items-center justify-center gap-2 px-3 text-xs font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-600 disabled:cursor-default disabled:bg-blue-50/60 disabled:text-blue-600"
                >
                  <Star size={16} fill={isCover ? "currentColor" : "none"} />
                  <span>{isCover ? "Selected" : "Set cover"}</span>
                </button>
                <button
                  type="button"
                  title="Delete photo"
                  onClick={() => removePhoto(index)}
                  disabled={disabled}
                  className="flex min-h-11 items-center justify-center gap-2 border-l border-slate-200 px-3 text-xs font-bold text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Trash2 size={16} />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoomImageUploader;
