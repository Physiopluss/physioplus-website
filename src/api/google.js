const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_KEY;

// Get lat/lng from typed address
export const getLatLngFromAddress = async (address) => {
  if (!address) throw new Error("Address is required");
  if (!GOOGLE_API_KEY) throw new Error("Google API key is missing");

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${GOOGLE_API_KEY}`
  );

  const data = await response.json();

  if (data.status === "OK" && data.results.length > 0) {
    const location = data.results[0].geometry.location;
    return {
      lat: location.lat,
      lng: location.lng,
    };
  }

  throw new Error(data.error_message || "Location not found");
};

// Get formatted address from lat/lng
export const getFormattedAddressFromLatLng = async (lat, lng) => {
  if (!lat || !lng) throw new Error("Latitude and Longitude are required");
  if (!GOOGLE_API_KEY) throw new Error("Google API key is missing");

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
  );

  const data = await response.json();

  if (data.status === "OK" && data.results.length > 0) {
    return data.results[0].formatted_address;
  }

  return "Unknown location";
};
