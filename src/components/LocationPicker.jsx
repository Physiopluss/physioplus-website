import { useState, useRef, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { GoogleMap, Autocomplete, Marker } from "@react-google-maps/api";
import { FaMapMarkerAlt, FaCrosshairs, FaTimes, FaCheck, FaSearch } from "react-icons/fa";
import { getFormattedAddressFromLatLng, getLatLngFromAddress, getCurrentPosition } from "../api/google";

const mapContainerStyle = {
  width: "100%",
  height: "40vh",
  borderRadius: "0.5rem",
};

const defaultCenter = {
  lat: 26.9124,
  lng: 75.7873,
};

const LocationPicker = ({ onSelect, onClose }) => {
  const [mapRef, setMapRef] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [addressDetails, setAddressDetails] = useState({
    pincode: "",
    city: "",
    state: "",
    country: "",
    formattedAddress: "",
  });
  const inputRef = useRef(null);

  // Handle map click
  const onMapClick = useCallback(async (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPosition({ lat, lng });
    await updateAddressFromCoordinates(lat, lng);
  }, []);

  // Update address details from coordinates
  const updateAddressFromCoordinates = async (lat, lng) => {
    try {
      setIsLoading(true);
      setError("");
      const result = await getFormattedAddressFromLatLng(lat, lng);
      setAddressDetails(prev => ({
        ...prev,
        ...result,
        formattedAddress: result.formattedAddress || ""
      }));
      setAddress(result.formattedAddress || "");
    } catch (err) {
      console.error("Error updating address:", err);
      setError("Failed to get address details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle place selection from autocomplete
  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      const location = place.geometry?.location;
      if (location) {
        const lat = location.lat();
        const lng = location.lng();
        setMarkerPosition({ lat, lng });
        mapRef?.panTo({ lat, lng });
        updateAddressFromCoordinates(lat, lng);
      }
    }
  };

  // Handle search button click
  const handleSearch = async () => {
    if (!inputRef.current?.value) return;
    
    try {
      setIsLoading(true);
      setError("");
      const result = await getLatLngFromAddress(inputRef.current.value);
      setMarkerPosition({ lat: result.lat, lng: result.lng });
      mapRef?.panTo({ lat: result.lat, lng: result.lng });
      setAddressDetails(prev => ({
        ...prev,
        ...result,
        formattedAddress: result.formattedAddress || ""
      }));
    } catch (err) {
      console.error("Search error:", err);
      setError("Could not find the location. Please try a different address.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle current location button click
  const handleCurrentLocation = async () => {
    try {
      setIsLoading(true);
      setError("");
      const position = await getCurrentPosition();
      setMarkerPosition(position);
      mapRef?.panTo(position);
      await updateAddressFromCoordinates(position.lat, position.lng);
    } catch (err) {
      console.error("Geolocation error:", err);
      setError("Unable to get your current location. Please enable location services or search manually.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle confirm button click
  const handleConfirm = () => {
    if (!markerPosition) return;
    
    onSelect({
      ...markerPosition,
      ...addressDetails,
      fullAddress: addressDetails.formattedAddress || "Selected Location"
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-auto rounded-xl shadow-xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Select Location</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4">
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <Autocomplete
                onLoad={(ac) => setAutocomplete(ac)}
                onPlaceChanged={onPlaceChanged}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Search for an address"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green focus:border-transparent transition-all"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </Autocomplete>
            </div>
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="px-4 py-2 bg-green text-white rounded-lg hover:bg-green focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-green disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
          
          <button
            onClick={handleCurrentLocation}
            disabled={isLoading}
            className="mt-3 flex items-center text-sm text-green-600 hover:text-green-800 transition-colors"
          >
            <FaCrosshairs className="mr-1" /> Use my current location
          </button>
          
          {error && (
            <div className="mt-2 text-sm text-red-600">{error}</div>
          )}
        </div>

        {/* Map */}
        <div className="px-4">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={markerPosition || defaultCenter}
            zoom={markerPosition ? 16 : 12}
            onClick={onMapClick}
            onLoad={(map) => setMapRef(map)}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
          >
            {markerPosition && (
              <Marker 
                position={markerPosition}
                icon={{
                  url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                  scaledSize: new window.google.maps.Size(40, 40),
                }}
              />
            )}
          </GoogleMap>
        </div>

        {/* Address Details */}
        <div className="p-4 border-t">
          <div className="mb-4">
            <h3 className="font-medium text-gray-700 mb-2">Selected Location</h3>
            <div className="bg-gray-50 p-3 rounded-lg">
              {addressDetails.formattedAddress ? (
                <div>
                  <p className="text-gray-800">{addressDetails.formattedAddress}</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-600">
                    {addressDetails.pincode && (
                      <div>Pincode: {addressDetails.pincode}</div>
                    )}
                    {addressDetails.city && (
                      <div>City: {addressDetails.city}</div>
                    )}
                    {addressDetails.state && (
                      <div>State: {addressDetails.state}</div>
                    )}
                    {addressDetails.country && (
                      <div>Country: {addressDetails.country}</div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic">Click on the map or search for a location</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!markerPosition || isLoading}
              className="px-4 py-2 bg-green text-white rounded-lg hover:bg-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green disabled:opacity-50 transition-colors flex items-center"
            >
              <FaCheck className="mr-2" />
              Confirm Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

LocationPicker.propTypes = {
  onSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default LocationPicker;
