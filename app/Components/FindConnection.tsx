"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Plane,
  Search,
  Clock,
  IndianRupee,
  WifiOff,
  SearchX,
  X,
} from "lucide-react";
import NoResultsFound from "./NoResultsFound";
import ResultsSkeleton from "./ResultsSkeleton";
import SearchError from "./SearchError";
import {
  ApiResponse,
  City,
  FindConnectionProps,
  NoConnectionResponse,
} from "../lib/types/respnse.types";

const FindConnection: React.FC<FindConnectionProps> = ({
  initialCities,
  initialFromCity,
  initialToCity,
}) => {
  // --- State Management ---
  const [cities, setCities] = useState<City[]>(initialCities || []);
  // --- FIX: Initialize state directly from props to prevent hydration mismatch ---
  const [fromCity, setFromCity] = useState<string>(initialFromCity || "");
  const [toCity, setToCity] = useState<string>(initialToCity || "");
  const [filterBy, setFilterBy] = useState<string>("Fastest");
  const [data, setData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [noResults, setNoResults] = useState<boolean>(false);

  // The useEffect to set initial cities is no longer needed.

  // --- Search Logic (Client-Side) ---
  const handleSearch = useCallback(async () => {
    setData(null);
    setNoResults(false);
    setSearchError(null);
    if (!fromCity || !toCity) {
      setSearchError("Please select both departure and destination cities.");
      return;
    }
    if (fromCity === toCity) {
      setSearchError("Departure and destination cities cannot be the same.");
      return;
    }

    setIsLoading(true);
    try {
      const apiUrl = `https://airfareandroutefinder.onrender.com/user-search/search?fromCity=${fromCity}&toCity=${toCity}&fliterBy=${filterBy}`;
      const response = await fetch(apiUrl);
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const result: ApiResponse | NoConnectionResponse = await response.json();
      if (
        "message" in result ||
        ("connections" in result && result.connections.length === 0)
      ) {
        setNoResults(true);
      } else if ("connections" in result) {
        setData(result);
      }
    } catch (err) {
      setSearchError(
        err instanceof Error
          ? `Failed to fetch flight data: ${err.message}`
          : "An unknown error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  }, [fromCity, toCity, filterBy]);

  // --- Render Logic ---
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg mb-8 border border-gray-200">
          <div className="flex items-center mb-6">
            <div className="bg-blue-600 p-3 rounded-full mr-4">
              <Plane className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Find Your Flight
              </h1>
              <p className="text-gray-600">
                Select your route and preference to find the best connection.
              </p>
            </div>
          </div>

          {searchError && (
            <SearchError
              message={searchError}
              onClose={() => setSearchError(null)}
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
            <div className="lg:col-span-4">
              <label
                htmlFor="fromCity"
                className="block text-sm font-medium text-gray-700 mb-1"
                suppressHydrationWarning
              >
                From
              </label>
              <select
                id="fromCity"
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                suppressHydrationWarning
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition"
              >
                {cities.map((city) => (
                  <option key={`from-${city.id}`} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="lg:col-span-4">
              <label
                htmlFor="toCity"
                className="block text-sm font-medium text-gray-700 mb-1"
                suppressHydrationWarning
              >
                To
              </label>
              <select
                id="toCity"
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                suppressHydrationWarning
              >
                {cities.map((city) => (
                  <option key={`to-${city.id}`} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="lg:col-span-2">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                suppressHydrationWarning
              >
                Filter by
              </label>
              <div className="flex items-center space-x-4 bg-gray-100 p-2 rounded-lg">
                <label
                  suppressHydrationWarning
                  className={`flex-1 text-center cursor-pointer p-1 rounded-md text-sm transition ${
                    filterBy === "Fastest"
                      ? "bg-white shadow-sm text-blue-600 font-semibold"
                      : "text-gray-500"
                  }`}
                >
                  <input
                    type="radio"
                    name="filter"
                    value="Fastest"
                    checked={filterBy === "Fastest"}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className="sr-only"
                  />{" "}
                  Fastest
                </label>
                <label
                  suppressHydrationWarning
                  className={`flex-1 text-center cursor-pointer p-1 rounded-md text-sm transition ${
                    filterBy === "Cheapest"
                      ? "bg-white shadow-sm text-blue-600 font-semibold"
                      : "text-gray-500"
                  }`}
                >
                  <input
                    type="radio"
                    name="filter"
                    value="Cheapest"
                    checked={filterBy === "Cheapest"}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className="sr-only"
                  />{" "}
                  Cheapest
                </label>
              </div>
            </div>
            <div className="lg:col-span-2">
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="w-full flex items-center justify-center bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Search className="w-5 h-5 mr-2" />{" "}
                {isLoading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
        </div>

        {isLoading && <ResultsSkeleton />}
        {noResults && <NoResultsFound />}

        {data && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative rounded-lg overflow-hidden group">
                  <img
                    src={data.fromCityImage}
                    alt={`Image of ${fromCity}`}
                    className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placehold.co/600x400/e2e8f0/4a5568?text=Image+Not+Found";
                    }}
                  />
                  <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent text-white p-4 w-full">
                    <p className="text-sm">From</p>
                    <h3 className="font-bold text-xl">
                      {data.connections[0].fromCity}
                    </h3>
                  </div>
                </div>
                <div className="relative rounded-lg overflow-hidden group">
                  <img
                    src={data.toCityImage}
                    alt={`Image of ${toCity}`}
                    className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placehold.co/600x400/e2e8f0/4a5568?text=Image+Not+Found";
                    }}
                  />
                  <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent text-white p-4 w-full">
                    <p className="text-sm">To</p>
                    <h3 className="font-bold text-xl">
                      {data.connections[0].toCity}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-700">
              Available Flights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.connections.map((conn) => (
                <div
                  key={conn.id}
                  className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-xl hover:border-blue-500 transition-all duration-300 flex flex-col"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-lg text-gray-800">
                      {conn.fromCity}
                    </span>
                    <div className="flex items-center text-gray-500">
                      <div className="w-12 h-px bg-gray-300"></div>
                      <Plane className="w-5 h-5 mx-2" />
                      <div className="w-12 h-px bg-gray-300"></div>
                    </div>
                    <span className="font-bold text-lg text-gray-800">
                      {conn.toCity}
                    </span>
                  </div>
                  <div className="flex-grow space-y-3 mb-5">
                    <div className="flex items-center justify-between text-gray-600 bg-gray-50 p-2 rounded-lg">
                      <span className="flex items-center font-medium">
                        <Clock className="w-4 h-4 mr-2 text-blue-500" />{" "}
                        Duration:
                      </span>
                      <span className="font-semibold text-gray-800">
                        {conn.duration} hours
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-gray-600 bg-gray-50 p-2 rounded-lg">
                      <span className="flex items-center font-medium">
                        <IndianRupee className="w-4 h-4 mr-2 text-green-500" />{" "}
                        Airfare:
                      </span>
                      <span className="font-semibold text-gray-800">
                        {conn.airfare.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                  {/* <button className="mt-auto w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 transition-transform transform hover:scale-105">
                    Book Now
                  </button> */}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindConnection;
