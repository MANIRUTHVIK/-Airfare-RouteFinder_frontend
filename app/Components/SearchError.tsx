import React from "react";
import { X } from "lucide-react";
const SearchError = ({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) => (
  <div className="relative flex items-center justify-between p-4 mb-4 bg-red-100 border-l-4 border-red-500 rounded-r-lg shadow-md animate-fade-in">
    <p className="text-red-800 font-medium">{message}</p>
    <button
      onClick={onClose}
      className="p-1 text-red-600 rounded-full hover:bg-red-200 hover:text-red-800 transition-colors"
    >
      <X className="w-5 h-5" />
    </button>
  </div>
);

export default SearchError;
