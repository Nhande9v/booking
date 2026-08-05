//Sử dụng Nominatim API của OpenStreetMap để geocode(địa chỉ xong gọi openstreetmap API để lấy tọa độ) địa chỉ thành tọa độ (latitude, longitude)

const GEOCODING_ENDPOINT = "https://nominatim.openstreetmap.org/search";

const removeAccents = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");

const normalizeLocation = (value = "") =>
  removeAccents(value).toLowerCase().replace(/\s+/g, " ").trim();

const wait = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const searchAddress = async (query) => {
  const params = new URLSearchParams({
    q: query,
    format: "jsonv2",
    limit: "5",
    countrycodes: "vn",
    addressdetails: "1",
  });

  const response = await fetch(`${GEOCODING_ENDPOINT}?${params}`, {
    headers: {
      Accept: "application/json",
      "User-Agent": process.env.GEOCODING_USER_AGENT || "ALauraBooking/1.0",
    },
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    throw new Error(`Geocoding service returned ${response.status}.`);
  }

  return response.json();
};

const belongsToCity = (result, city) => {
  const expectedCity = normalizeLocation(city);
  const resultLocation = normalizeLocation([
    result.display_name,
    result.address?.city,
    result.address?.municipality,
    result.address?.state,
  ].filter(Boolean).join(", "));

  return Boolean(expectedCity) && resultLocation.includes(expectedCity);
};

export const geocodeAddress = async ({ address, district, city }) => {
  const query = [address, district, city, "Vietnam"].filter(Boolean).join(", ");
  if (!query) return null;

  const normalizedQuery = removeAccents(query);
  const streetAddress = address?.split(",")[0]?.trim();
  const simplifiedQuery = removeAccents(
    [streetAddress, district, city, "Vietnam"].filter(Boolean).join(", ")
  );
  const candidates = [...new Set([query, normalizedQuery, simplifiedQuery])];

  let result = null;
  for (let index = 0; index < candidates.length && !result; index += 1) {
    if (index > 0) await wait(1100);
    const results = await searchAddress(candidates[index]);
    result = results.find((candidate) => belongsToCity(candidate, city)) || null;
  }

  if (!result) return null;

  const lat = Number(result.lat);
  const lng = Number(result.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  return { lat, lng };
};
