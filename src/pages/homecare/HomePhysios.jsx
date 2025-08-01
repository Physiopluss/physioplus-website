import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { FaChevronDown, FaTimes } from "react-icons/fa";
import PromoBannerSwiper from "../../components/homecare/PromoBannerSwiper";
import PhysioCard from "../../components/homecare/PhysioCard";
import { getPhysios } from "../../api/homecare";

export default function HomePhysios() {
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [filter, setFilter] = useState("default");
  const [priceOption, setPriceOption] = useState("");
  const [ratingOption, setRatingOption] = useState("");
  const [physios, setPhysios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [latLng, setLatLng] = useState({ lat: null, lng: null });
  const [useLocation, setUseLocation] = useState(true);
  const [locationReady, setLocationReady] = useState(false);
  const [city, setCity] = useState("");

  // Fetch user's location and city
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLatLng({ lat, lng });
        setLocationReady(true);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
          );
          const data = await res.json();
          const cityName =
            data?.address?.city ||
            data?.address?.town ||
            data?.address?.village ||
            data?.address?.county ||
            "";
          setCity(cityName);
        } catch (err) {
          console.error("Failed to fetch city name:", err);
        }
      },
      (err) => {
        console.error("Location error:", err);
        setUseLocation(false);
        setLocationReady(true);
      }
    );
  }, []);

  const fetchPhysiosWithFilters = async () => {
    setLoading(true);
    const params = {
      ...(search && { search }),
      ...(filter === "mpt" && { filter }),
      ...(filter === "price" && priceOption && { priceSort: priceOption }),
      ...(filter === "rating" && ratingOption && { rating: ratingOption }),
      ...(useLocation && latLng.lat && { lat: latLng.lat, lng: latLng.lng }),
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

  // Trigger fetch when dependencies change
  useEffect(() => {
    if (locationReady) {
      fetchPhysiosWithFilters();
    }
  }, [locationReady, search, filter, priceOption, ratingOption, useLocation]);

  // Clear search when input is empty
  useEffect(() => {
    if (searchInput.trim() === "") {
      setSearch("");
    }
  }, [searchInput]);

  const handleSearchClick = () => {
    const trimmed = searchInput.trim();
    setSearch(trimmed);
  };

  const handleFilterSelect = (type) => {
    setFilter(type);
    setPriceOption("");
    setRatingOption("");
  };

  const clearPriceFilter = () => {
    setPriceOption("");
    if (filter === "price") setFilter("default");
  };

  const clearRatingFilter = () => {
    setRatingOption("");
    if (filter === "rating") setFilter("default");
  };

  const handleSeeAllToggle = () => {
    setUseLocation((prev) => !prev);
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
        <div className="w-full sm:w-1/2 flex gap-2">
          <input
            type="text"
            placeholder='Search for "Dr. Name"'
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleSearchClick}
            className="px-3 py-2 rounded-lg bg-green text-white flex items-center gap-1"
          >
            <FiSearch />
            Search
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between m-4">
        <p className="font-semibold">
          {useLocation
            ? `Nearby Physio's${city ? ` in ${city}` : ""}`
            : "All Physio's in India"}
        </p>
        <button
          className={`text-sm font-medium px-3 py-1 rounded-md ${
            useLocation
              ? "bg-[#e5f7ec] text-green border"
              : "bg-green text-white"
          }`}
          onClick={handleSeeAllToggle}
        >
          {useLocation ? "See All" : "See Nearby"}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mt-4 mb-6">
        {/* Price Filter */}
        <div className="relative">
          <button
            onClick={() => handleFilterSelect("price")}
            className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 ${
              filter === "price" && priceOption
                ? "bg-green text-white"
                : "bg-[#e5f7ec] text-green border"
            }`}
          >
            {priceOption
              ? priceOption === "lowToHigh"
                ? "Low to High"
                : "High to Low"
              : "Sort by Price"}
            {priceOption && (
              <FaTimes
                className="text-xs ml-1 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  clearPriceFilter();
                }}
              />
            )}
            {!priceOption && <FaChevronDown className="text-xs" />}
          </button>
          {filter === "price" && !priceOption && (
            <div className="absolute z-10 bg-white border mt-1 rounded shadow-md text-sm w-40">
              <button
                onClick={() => setPriceOption("lowToHigh")}
                className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
              >
                Low to High
              </button>
              <button
                onClick={() => setPriceOption("highToLow")}
                className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
              >
                High to Low
              </button>
            </div>
          )}
        </div>

        {/* Rating Filter */}
        <div className="relative">
          <button
            onClick={() => handleFilterSelect("rating")}
            className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 ${
              filter === "rating" && ratingOption
                ? "bg-green text-white"
                : "bg-[#e5f7ec] text-green border"
            }`}
          >
            {ratingOption ? `${ratingOption} Star Physio` : "Rating"}
            {ratingOption && (
              <FaTimes
                className="text-xs ml-1 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  clearRatingFilter();
                }}
              />
            )}
            {!ratingOption && <FaChevronDown className="text-xs" />}
          </button>
          {filter === "rating" && !ratingOption && (
            <div className="absolute z-10 bg-white border mt-1 rounded shadow-md text-sm w-44">
              {[5, 4, 3, 2, 1].map((star) => (
                <button
                  key={star}
                  onClick={() => setRatingOption(String(star))}
                  className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                >
                  {star} Star Physio
                </button>
              ))}
            </div>
          )}
        </div>

        {/* MPT Filter */}
        <button
          onClick={() =>
            filter === "mpt" ? setFilter("default") : handleFilterSelect("mpt")
          }
          className={`px-3 py-1 rounded-md text-sm ${
            filter === "mpt"
              ? "bg-green text-white"
              : "bg-[#e5f7ec] text-green border"
          }`}
        >
          MPT Physio
        </button>
      </div>

      {/* Physio Results */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-500 text-sm">Loading physiotherapists...</p>
        ) : physios?.length > 0 ? (
          physios.map((physio) => (
            <PhysioCard key={physio?._id} physio={physio} />
          ))
        ) : (
          <p className="text-gray-600 text-sm">No physiotherapists found.</p>
        )}
      </div>
    </div>
  );
}
