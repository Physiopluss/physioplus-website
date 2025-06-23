import { useState, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { GoogleMap, Autocomplete, Marker } from "@react-google-maps/api";
import {
  getFormattedAddressFromLatLng,
  getLatLngFromAddress,
} from "../api/google";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 26.9124,
  lng: 75.7873,
};

const LocationPicker = ({ onSelect, onClose }) => {
  const [mapRef, setMapRef] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const inputRef = useRef(null);

  const onMapClick = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPosition({ lat, lng });
  }, []);

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      const location = place.geometry?.location;
      if (location) {
        const lat = location.lat();
        const lng = location.lng();
        setMarkerPosition({ lat, lng });
        mapRef?.panTo({ lat, lng });
      }
    }
  };

  const handleConfirm = async () => {
    if (!markerPosition) return;

    const formattedAddress = await getFormattedAddressFromLatLng(
      markerPosition.lat,
      markerPosition.lng
    );

    const fullAddress = `${formattedAddress} (Lat: ${markerPosition.lat.toFixed(
      6
    )}, Lng: ${markerPosition.lng.toFixed(6)})`;

    onSelect(fullAddress);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-auto p-4 rounded shadow-lg flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Select Location</h2>

        <Autocomplete
          onLoad={(ac) => setAutocomplete(ac)}
          onPlaceChanged={onPlaceChanged}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter address"
            className="w-full px-3 py-2 border rounded"
            onKeyDown={async (e) => {
              if (e.key === "Enter" && inputRef.current?.value) {
                e.preventDefault();
                try {
                  const coords = await getLatLngFromAddress(
                    inputRef.current.value
                  );
                  if (coords) {
                    setMarkerPosition(coords);
                    mapRef?.panTo(coords);
                  }
                } catch {
                  alert("Could not find location");
                }
              }
            }}
          />
        </Autocomplete>

        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={markerPosition || defaultCenter}
          zoom={14}
          onClick={onMapClick}
          onLoad={(map) => setMapRef(map)}
        >
          {markerPosition && <Marker position={markerPosition} />}
        </GoogleMap>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-green text-white rounded"
          >
            Confirm Address
          </button>
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
