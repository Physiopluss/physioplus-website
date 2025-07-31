import React, { useState, useEffect } from "react";
import PromoBannerSwiper from "../../components/homecare/PromoBannerSwiper";
import PhysioCard from "../../components/homecare/PhysioCard";
import { getPhysios } from "../../api/homecare";

export default function HomePhysios() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("default");
  const [physios, setPhysios] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPhysiosWithCoords = async (lat, lng) => {
    setLoading(true);
    const params = {
      ...(search && { search }),
      ...(filter !== "default" && { filter }),
      lat,
      lng,
    };

    try {
      const data = await getPhysios(params);
      setPhysios(data);
    } catch (error) {
      console.error("Error fetching physios:", error);
      setPhysios([]);
    } finally {
      setLoading(false);
    }
  };

  // Get location on initial load
  useEffect(() => {
    setLoading(true); // Show loader on page load
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchPhysiosWithCoords(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      (error) => {
        console.error("Location access denied:", error);
        setLoading(false); // Stop loader even if error
      }
    );
  }, []);

  // Re-fetch on filter/search change
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchPhysiosWithCoords(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      (error) => {
        console.error("Location error on update:", error);
      }
    );
  }, [search, filter]);

  const handleSeeAll = () => {
    setSearch("");
    setFilter("default");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchPhysiosWithCoords(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      () => {}
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-16 relative">
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

      {/* Loader or Physio Cards */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-500 text-sm">
            Loading nearby physiotherapists...
          </p>
        ) : physios?.length > 0 ? (
          physios?.map((physio) => (
            <PhysioCard key={physio?._id} physio={physio} />
          ))
        ) : (
          <p className="text-gray-600 text-sm">No physiotherapists found.</p>
        )}
      </div>
    </div>
  );
}
