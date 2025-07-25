import { X } from "lucide-react";
import React, { useRef, useEffect, useState } from "react";

export default function LocationPickerModal({
  isOpen,
  onClose,
  onLocationSelect,
}) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const geocoderRef = useRef(null);

  const [address, setAddress] = useState("");
  const [nearby, setNearby] = useState("");
  const [pincode, setPincode] = useState("");

  useEffect(() => {
    if (!isOpen || !window.google || !mapRef.current) return;

    const loadMap = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          const map = new window.google.maps.Map(mapRef.current, {
            center,
            zoom: 16,
          });

          const marker = new window.google.maps.Marker({
            map,
            position: center,
            draggable: true,
          });

          markerRef.current = marker;
          geocoderRef.current = new window.google.maps.Geocoder();

          fetchAddress(center);

          marker.addListener("dragend", () => {
            const newPos = marker.getPosition();
            fetchAddress({ lat: newPos.lat(), lng: newPos.lng() });
          });

          // Optional: Click on map sets pin
          map.addListener("click", (e) => {
            const clicked = { lat: e.latLng.lat(), lng: e.latLng.lng() };
            marker.setPosition(clicked);
            fetchAddress(clicked);
          });
        },
        () => {
          alert("Location permission denied.");
        }
      );
    };

    loadMap();
  }, [isOpen]);

  const fetchAddress = (latLng) => {
    if (!geocoderRef.current) return;

    geocoderRef.current.geocode({ location: latLng }, (results, status) => {
      if (status === "OK" && results[0]) {
        const result = results[0];
        const components = result.address_components;

        const fullAddress = result.formatted_address;
        const pincodeMatch = fullAddress.match(/\b\d{6}\b/);
        const extractedPincode = pincodeMatch ? pincodeMatch[0] : "";

        const nearbyComponent = components.find((c) =>
          ["sublocality", "neighborhood", "locality"].some((t) =>
            c.types.includes(t)
          )
        );
        const extractedNearby = nearbyComponent?.long_name || "";

        setAddress(fullAddress);
        setNearby(extractedNearby);
        setPincode(extractedPincode);
      }
    });
  };

  const handleConfirm = () => {
    if (!address) {
      alert("Please wait for address to load...");
      return;
    }

    onLocationSelect({
      address,
      nearby,
      pincode,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl p-4 w-[95%] max-w-2xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Pin Your Location</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Map */}
        <div ref={mapRef} className="flex-1 border rounded mb-3" />

        {/* Live Preview */}
        <div className="text-sm text-gray-700 space-y-1 mb-2">
          <div>
            <strong>Address:</strong> {address || "Fetching..."}
          </div>
          {nearby && (
            <div>
              <strong>Nearby:</strong> {nearby}
            </div>
          )}
          {pincode && (
            <div>
              <strong>Pincode:</strong> {pincode}
            </div>
          )}
        </div>

        {/* Confirm Button */}
        <button
          className="mt-1 w-full bg-green hover:bg-[#15692c] text-white py-2 rounded-md text-sm"
          onClick={handleConfirm}
        >
          Confirm Location
        </button>
      </div>
    </div>
  );
}
