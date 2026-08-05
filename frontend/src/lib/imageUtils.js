export const getImageUrl = (image) => {
  if (typeof image === "string") return image;
  return image?.url || "";
};

export const getPropertyCoverUrl = (property) => {
  return (
    getImageUrl(property?.coverPhoto) ||
    getImageUrl(property?.photos?.[0]) ||
    getImageUrl(property?.photo?.[0]) ||
    "/hotel.jpg"
  );
};

export const getPropertyGalleryUrls = (property) => {
  const source = property?.photos?.length
    ? property.photos
    : property?.photo || [];

  const coverUrl = getPropertyCoverUrl(property);

  return source
    .map(getImageUrl)
    .filter((url) => url && url !== coverUrl);
};

export const getRoomCoverUrl = (room) => {
  return (
    getImageUrl(room?.coverPhoto) ||
    getImageUrl(room?.photos?.[0]) ||
    getImageUrl(room?.photo?.[0]) ||
    "/hotel.jpg"
  );
};

export const getRoomGalleryUrls = (room) => {
  const source = room?.photos?.length ? room.photos : room?.photo || [];
  const coverUrl = getRoomCoverUrl(room);
  return source.map(getImageUrl).filter((url) => url && url !== coverUrl);
};
