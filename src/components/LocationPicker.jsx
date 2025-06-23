import {
  useMapEvents,
  MapContainer,
  Marker,
  TileLayer,
  useMap,
} from "react-leaflet";
import { useState, useRef } from "react";
import L from "leaflet";
import PropTypes from "prop-types";
import { GoogleMap, LoadScript, Autocomplete } from "@react-google-maps/api";
import {
  getFormattedAddressFromLatLng,
  getLatLngFromAddress,
} from "../api/google"; // Fixed import

const LocationPicker = ({ onSelect, onClose }) => {
  const [position, setPosition] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const inputRef = useRef(null);

  const apiKey = import.meta.env.VITE_GOOGLE_KEY;

  const LocationMarker = () => {
    const map = useMap();

    useMapEvents({
      click(e) {
        setPosition(e.latlng);
      },
    });

    if (position) {
      map.flyTo(position, 15);
    }

    return position ? (
      <Marker
        position={position}
        icon={L.icon({
          iconUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        })}
      />
    ) : null;
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      const location = place.geometry?.location;
      if (location) {
        setPosition({
          lat: location.lat(),
          lng: location.lng(),
        });
      }
    } else {
      alert("Autocomplete is not loaded yet!");
    }
  };

  const handleConfirm = async () => {
    if (!position) return;

    const formattedAddress = await getFormattedAddressFromLatLng(
      position.lat,
      position.lng
    );

    const fullAddress = `${formattedAddress} (Lat: ${position.lat.toFixed(
      6
    )}, Lng: ${position.lng.toFixed(6)})`;

    onSelect(fullAddress);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-auto p-4 rounded shadow-lg flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Select Location</h2>

        {/* Load Google Autocomplete */}
        <LoadScript googleMapsApiKey={apiKey} libraries={["places"]}>
          <Autocomplete
            onLoad={(autoC) => setAutocomplete(autoC)}
            onPlaceChanged={onPlaceChanged}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Enter address"
              className="w-full px-3 py-2 border rounded"
              onKeyDown={async (e) => {
                if (e.key === "Enter" && !autocomplete?.getPlace()) {
                  e.preventDefault();
                  try {
                    const coords = await getLatLngFromAddress(
                      inputRef.current.value
                    );
                    if (coords) setPosition(coords);
                  } catch (error) {
                    alert("Could not fetch location from text");
                  }
                }
              }}
            />
          </Autocomplete>
        </LoadScript>

        {/* Map */}
        <MapContainer
          key={position ? `${position.lat}-${position.lng}` : "default"}
          center={position || [26.9124, 75.7873]}
          zoom={13}
          className="h-96 rounded"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker />
        </MapContainer>

        {/* Actions */}
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
