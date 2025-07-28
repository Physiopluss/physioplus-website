// src/pages/home/HomePhysios.jsx
import React, { useState, useEffect } from "react";
import PromoBannerSwiper from "../../components/homecare/PromoBannerSwiper";
import PhysioCard from "../../components/homecare/PhysioCard";
import { getPhysios } from "../../api/homecare";

export default function HomePhysios() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("default");
  const [physios, setPhysios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showLocationPopup, setShowLocationPopup] = useState(true); // Show popup on load

  const fetchPhysios = async () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (filter !== "default") params.filter = filter;

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          params.lat = lat;
          params.lng = lng;

          try {
            const data = await getPhysios(params);
            setPhysios(data);
          } catch (error) {
            console.error("Error fetching physios:", error);
            setPhysios([]);
          } finally {
            setShowLocationPopup(false);
            setLoading(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setShowLocationPopup(true);
          setLoading(false);
        }
      );
    } else {
      setShowLocationPopup(true);
      setLoading(false);
    }
  };

  // Run fetchPhysios when filters or search change,
  // but only if location is already allowed (popup hidden)
  useEffect(() => {
    if (!showLocationPopup) {
      fetchPhysios();
    }
  }, [search, filter]);

  const handleSeeAll = () => {
    setSearch("");
    setFilter("default");
    fetchPhysios();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-16 relative">
      {/* Location Permission Popup */}
      {showLocationPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-sm text-center">
            <h2 className="text-lg font-bold mb-2 text-red-700">
              Location Required
            </h2>
            <p className="text-gray-700 text-sm mb-4">
              To find nearby physiotherapists, we need access to your location.
              <br />
              Please click “Allow Location” and accept permission in your
              browser popup.
            </p>
            <button
              className="bg-green hover:bg-[#15692c] text-white px-4 py-2 rounded-lg text-sm font-medium"
              onClick={() => {
                fetchPhysios(); // User-triggered → prompts browser
              }}
            >
              Allow Location
            </button>
          </div>
        </div>
      )}

      {/* Promo Banner */}
      <div className="my-6 w-[320px] sm:w-full mx-auto">
        <PromoBannerSwiper />
      </div>

      {/* Greeting + Search */}
      <div className="flex flex-col gap-3 bg-[#d9fddd] text-green-900 p-4 rounded-md sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm sm:text-base">Hello Patient 👋</h3>
          <p className="text-md sm:text-lg font-semibold">
            How is your health today?
          </p>
        </div>
        <div className="w-full sm:w-1/2">
          <input
            type="text"
            placeholder='Search for "Dr. Name"'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mt-4 mb-6">
        {["price", "rating", "mpt"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-md text-sm ${
              filter === f
                ? "bg-green text-white"
                : "bg-[#e5f7ec] text-green border-gray-300"
            }`}
          >
            {f === "price" && "Sort by Price"}
            {f === "rating" && "Rating"}
            {f === "mpt" && "MPT Physio"}
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between m-4">
        <p className="font-semibold">Nearby Physio's</p>
        <button className="text-green text-sm" onClick={handleSeeAll}>
          See All
        </button>
      </div>

      {/* Physio Cards */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-500 text-sm">Loading...</p>
        ) : physios.length > 0 ? (
          physios.map((physio) => (
            <PhysioCard key={physio._id} physio={physio} />
          ))
        ) : (
          <p className="text-gray-600 text-sm">No physiotherapists found.</p>
        )}
      </div>
    </div>
  );
}
