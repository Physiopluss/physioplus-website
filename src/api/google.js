const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_KEY;

const parseAddressComponents = (addressComponents) => {
  const components = {};
  
  addressComponents?.forEach(component => {
    const type = component.types[0];
    switch (type) {
      case 'postal_code':
        components.pincode = component.long_name;
        break;
      case 'locality':
        components.city = component.long_name;
        break;
      case 'administrative_area_level_1':
        components.state = component.long_name;
        break;
      case 'country':
        components.country = component.long_name;
        break;
      default:
        break;
    }
  });
  
  return components;
};

export const getLatLngFromAddress = async (address) => {
  if (!address) throw new Error("Address is required");
  if (!GOOGLE_API_KEY) throw new Error("Google API key is missing");

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${GOOGLE_API_KEY}`
    );

    const data = await response.json();

    if (data.status === "OK" && data.results.length > 0) {
      const result = data.results[0];
      const location = result.geometry.location;
      const addressComponents = parseAddressComponents(result.address_components);
      
      return {
        lat: location.lat,
        lng: location.lng,
        formattedAddress: result.formatted_address,
        ...addressComponents
      };
    }

    throw new Error(data.error_message || "Location not found");
  } catch (error) {
    console.error("Error getting coordinates:", error);
    throw error;
  }
};

export const getFormattedAddressFromLatLng = async (lat, lng) => {
  if (!lat || !lng) throw new Error("Latitude and Longitude are required");
  if (!GOOGLE_API_KEY) throw new Error("Google API key is missing");

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
    );

    const data = await response.json();

    if (data.status === "OK" && data.results.length > 0) {
      const result = data.results[0];
      const addressComponents = parseAddressComponents(result.address_components);
      
      return {
        formattedAddress: result.formatted_address,
        ...addressComponents
      };
    }

    return { formattedAddress: "Unknown location" };
  } catch (error) {
    console.error("Error getting address:", error);
    return { formattedAddress: "Error fetching location" };
  }
};

export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
};
