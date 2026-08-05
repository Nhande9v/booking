import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { deleteUploadedImage, uploadImage } from "@/lib/cloudinaryUpload";

const MAX_PHOTOS = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const Step4Photos = ({ data, update, back, submit, loading }) => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFilesChange = async (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    event.target.value = "";

    if (!selectedFiles.length) return;

    const remainingSlots =
      MAX_PHOTOS - (data.photos?.length || 0);

    if (remainingSlots <= 0) {
      toast.error(`You can upload up to ${MAX_PHOTOS} photos.`);
      return;
    }

    const files = selectedFiles.slice(0, remainingSlots);
    const invalidFile = files.find(
      (file) =>
        !ALLOWED_TYPES.includes(file.type) ||
        file.size > MAX_FILE_SIZE
    );

    if (invalidFile) {
      toast.error(
        "Use JPG, PNG, or WebP files up to 5 MB each."
      );
      return;
    }

    setIsUploading(true);

    try {
      const uploadedImages = [];

      for (const file of files) {
        const image = await uploadImage(file);
        uploadedImages.push(image);
      }

      const nextPhotos = [
        ...(data.photos || []),
        ...uploadedImages,
      ];

      update({
        photos: nextPhotos,
        coverPhoto: data.coverPhoto || nextPhotos[0] || null,
      });

      toast.success("Photos uploaded successfully.");
    } catch (error) {
      console.error("Upload photos failed:", error);
      toast.error(error.message || "Photo upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const setCoverPhoto = (image) => {
    update({ coverPhoto: image });
  };

  const removePhoto = async (photoIndex) => {
    const currentPhotos = data.photos || [];
    const removedImage = currentPhotos[photoIndex];

    try {
      await deleteUploadedImage(removedImage);

      const nextPhotos = currentPhotos.filter(
        (_, index) => index !== photoIndex
      );

      update({
        photos: nextPhotos,
        coverPhoto:
          data.coverPhoto?.storageKey === removedImage?.storageKey
            ? nextPhotos[0] || null
            : data.coverPhoto,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to delete this photo."
      );
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">
          Photos
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Choose photos from your computer to show the property clearly.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50">
        <div className="flex gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleFilesChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={openFilePicker}
            disabled={isUploading}
            className="w-full rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50 px-5 py-10 text-center text-sm font-bold text-blue-600 transition hover:border-blue-400 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUploading ? "Uploading photos..." : "Add photos"}
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {(data.photos || []).map((photo, index) => {
            const isCover =
              data.coverPhoto?.storageKey === photo.storageKey;

            return (
              <div
                key={photo.storageKey || `${photo.url}-${index}`}
                className="overflow-hidden rounded-2xl border border-slate-200"
              >
                <div className="relative">
                  <img
                    src={photo.url}
                    alt={`Property preview ${index + 1}`}
                    className="h-40 w-full object-cover"
                  />

                  {isCover && (
                    <span className="absolute left-3 top-3 rounded-md bg-blue-600 px-2 py-1 text-xs font-bold text-white">
                      Cover
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setCoverPhoto(photo)}
                    disabled={isCover}
                    className="px-3 py-3 text-sm font-bold text-blue-600 transition hover:bg-blue-50 disabled:cursor-default disabled:text-slate-400 disabled:hover:bg-white"
                  >
                    {isCover ? "Selected" : "Set as cover"}
                  </button>

                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="border-l border-slate-200 px-3 py-3 text-sm font-bold text-red-500 transition hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={back}
          className="rounded-2xl border border-slate-200 px-8 py-3.5 font-semibold text-slate-500 transition hover:bg-slate-50"
        >
          Back
        </button>

        <button
          type="button"
          onClick={submit}
          disabled={
            loading ||
            isUploading ||
            !data.coverPhoto ||
            !data.photos?.length
          }
          className="rounded-2xl bg-blue-600 px-10 py-3.5 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:bg-slate-300"
        >
          {loading
            ? "Publishing..."
            : isUploading
              ? "Uploading..."
              : "Save and add rooms"}
        </button>
      </div>
    </div>
  );
};

export default Step4Photos;
