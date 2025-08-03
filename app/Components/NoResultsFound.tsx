import { SearchX } from "lucide-react";
import React from "react";

const NoResultsFound = () => (
  <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
    <SearchX className="mx-auto h-16 w-16 text-gray-400 mb-4" />
    <h2 className="text-2xl font-bold text-gray-800">No Flights Found</h2>
    <p className="text-gray-500 mt-2">
      We couldn't find any direct flights for this route. Please try a different
      combination.
    </p>
  </div>
);

export default NoResultsFound;
