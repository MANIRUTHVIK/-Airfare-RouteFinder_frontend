// "use client";

// import { useEffect, useState, FormEvent } from "react";
// import Cookies from "js-cookie";
// import toast, { Toaster } from "react-hot-toast";
// import { Plus, X } from "lucide-react";
// import {
//   Edit,
//   Trash2,
//   Plane,
//   FilePenLine,
//   IndianRupee,
//   Clock,
//   ArrowRight,
//   MapPin,
// } from "lucide-react";

// const Connections = () => {
//   const [cities, setCities] = useState([]);
//   const [connections, setConnections] = useState([]);
//   const [selectedFromCity, setSelectedFromCity] = useState("");
//   const [selectedToCity, setSelectedToCity] = useState("");
//   const [airfare, setAirfare] = useState("");
//   const [duration, setDuration] = useState("");
//   const [editingId, setEditingId] = useState<number | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const token = Cookies.get("access_token");

//   const CurvedArrow = () => (
//     <svg
//       className="w-full h-auto"
//       viewBox="0 0 200 50"
//       xmlns="http://www.w3.org/2000/svg"
//       preserveAspectRatio="none"
//     >
//       <defs>
//         <marker
//           id="arrowhead"
//           markerWidth="6"
//           markerHeight="4"
//           refX="3"
//           refY="2"
//           orient="auto"
//         >
//           <polygon points="0 0, 6 2, 0 4" fill="currentColor" />
//         </marker>
//       </defs>
//       <path
//         d="M 10 40 Q 100 0 190 40"
//         stroke="currentColor"
//         fill="transparent"
//         strokeWidth="2"
//         markerEnd="url(#arrowhead)"
//       />
//     </svg>
//   );

//   const fetchCities = async () => {
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/cities`);
//       const data = await res.json();
//       setCities(data);
//     } catch {
//       toast.error("Failed to load cities");
//     }
//   };

//   const fetchConnections = async () => {
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_API}/connections`
//       );
//       const data = await res.json();
//       setConnections(data);
//     } catch {
//       toast.error("Failed to load connections");
//     }
//   };

//   useEffect(() => {
//     fetchCities();
//     fetchConnections();
//   }, []);

//   const resetForm = () => {
//     setSelectedFromCity("");
//     setSelectedToCity("");
//     setAirfare("");
//     setDuration("");
//     setEditingId(null);
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();

//     if (!selectedFromCity || !selectedToCity || !airfare || !duration) {
//       toast.error("All fields are required");
//       return;
//     }

//     if (selectedFromCity === selectedToCity) {
//       toast.error("From and To cities cannot be the same");
//       return;
//     }

//     setLoading(true);

//     let payload: Record<string, any> = {};

//     if (editingId) {
//       if (selectedFromCity) payload.fromCity = selectedFromCity;
//       if (selectedToCity) payload.toCity = selectedToCity;
//       if (airfare) payload.airfare = parseFloat(airfare);
//       if (duration) payload.duration = parseFloat(duration);
//     } else {
//       payload = {
//         fromCity: selectedFromCity,
//         toCity: selectedToCity,
//         airfare: parseFloat(airfare),
//         duration: parseFloat(duration),
//       };
//     }

//     const endpoint = editingId
//       ? `${process.env.NEXT_PUBLIC_BACKEND_API}/connections/${editingId}`
//       : `${process.env.NEXT_PUBLIC_BACKEND_API}/connections`;
//     const method = editingId ? "PATCH" : "POST";

//     try {
//       const res = await fetch(endpoint, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const error = await res.json();
//         throw new Error(error.message || "Something went wrong");
//       }

//       toast.success(
//         `Connection ${editingId ? "updated" : "added"} successfully`
//       );
//       fetchConnections();
//       resetForm();
//       setIsModalOpen(false);
//     } catch (err: any) {
//       toast.error(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (conn: any) => {
//     setSelectedFromCity(conn.fromCity);
//     setSelectedToCity(conn.toCity);
//     setAirfare(conn.airfare.toString());
//     setDuration(conn.duration.toString());
//     setEditingId(conn.id);
//     setIsModalOpen(true);
//   };

//   const handleDelete = async (id: number) => {
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_API}/connections/${id}`,
//         {
//           method: "DELETE",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!res.ok) throw new Error("Delete failed");

//       toast.success("Connection deleted");
//       fetchConnections();
//     } catch (err: any) {
//       toast.error(err.message);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="container mx-auto px-4 py-8">
//         {/* Header Section */}
//         <div className="mb-8">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <div className="space-y-1">
//               <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
//                 <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
//                   <Plane className="w-5 h-5 text-white" />
//                 </div>
//                 Flight Connections
//               </h1>
//               <p className="text-gray-600">
//                 Manage your flight routes and connections
//               </p>
//             </div>
//             <button
//               className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors duration-200 flex items-center gap-2"
//               onClick={() => {
//                 resetForm();
//                 setIsModalOpen(true);
//               }}
//             >
//               <Plus className="w-4 h-4" />
//               Add Connection
//             </button>
//           </div>
//         </div>

//         {/* Connections Grid */}
//         {connections.length === 0 ? (
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
//             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Plane className="w-8 h-8 text-gray-400" />
//             </div>
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">
//               No connections found
//             </h3>
//             <p className="text-gray-500">
//               Start by adding your first flight connection
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {connections.map((conn: any) => (
//               <div
//                 key={conn.id}
//                 className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
//               >
//                 <div className="p-6">
//                   {/* Action Buttons */}
//                   <div className="flex justify-end gap-2 mb-4">
//                     <button
//                       onClick={() => handleEdit(conn)}
//                       className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md transition-colors duration-200"
//                       title="Edit Connection"
//                     >
//                       <Edit className="w-4 h-4" />
//                     </button>
//                     <button
//                       onClick={() => handleDelete(conn.id)}
//                       className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md transition-colors duration-200"
//                       title="Delete Connection"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </div>

//                   {/* Route Section */}
//                   <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
//                     {/* From City */}
//                     <div className="md:col-span-2">
//                       <div className="flex items-center gap-4">
//                         <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
//                           <MapPin className="w-6 h-6 text-emerald-600" />
//                         </div>
//                         <div>
//                           <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
//                             From
//                           </div>
//                           <div className="text-xl font-bold text-gray-900">
//                             {conn.fromCity}
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Arrow */}
//                     <div className="flex justify-center">
//                       <ArrowRight className="w-6 h-6 text-gray-400" />
//                     </div>

//                     {/* To City */}
//                     <div className="md:col-span-2">
//                       <div className="flex items-center gap-4">
//                         <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
//                           <MapPin className="w-6 h-6 text-purple-600" />
//                         </div>
//                         <div>
//                           <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
//                             To
//                           </div>
//                           <div className="text-xl font-bold text-gray-900">
//                             {conn.toCity}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Details Section */}
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
//                     {/* Connection ID */}
//                     <div className="bg-gray-50 p-4 rounded-lg">
//                       <div className="text-sm font-medium text-gray-500">
//                         Connection ID
//                       </div>
//                       <div className="text-lg font-semibold text-gray-900">
//                         #{conn.id}
//                       </div>
//                     </div>

//                     {/* Duration */}
//                     <div className="bg-blue-50 p-4 rounded-lg">
//                       <div className="flex items-center gap-2 mb-1">
//                         <Clock className="w-4 h-4 text-blue-600" />
//                         <div className="text-sm font-medium text-blue-600">
//                           Duration
//                         </div>
//                       </div>
//                       <div className="text-lg font-semibold text-gray-900">
//                         {conn.duration} hours
//                       </div>
//                     </div>

//                     {/* Price */}
//                     <div className="bg-emerald-50 p-4 rounded-lg">
//                       <div className="flex items-center gap-2 mb-1">
//                         <IndianRupee className="w-4 h-4 text-emerald-600" />
//                         <div className="text-sm font-medium text-emerald-600">
//                           Airfare
//                         </div>
//                       </div>
//                       <div className="text-lg font-semibold text-gray-900">
//                         ₹{conn.airfare?.toLocaleString("en-IN")}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Modal */}
//         {isModalOpen && (
//           <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
//               {/* Modal Header */}
//               <div className="bg-indigo-600 px-6 py-4 rounded-t-lg">
//                 <div className="flex items-center justify-between">
//                   <h2 className="text-lg font-semibold text-white flex items-center gap-2">
//                     <FilePenLine className="w-5 h-5" />
//                     {editingId ? "Edit Connection" : "Add New Connection"}
//                   </h2>
//                   <button
//                     onClick={() => {
//                       resetForm();
//                       setIsModalOpen(false);
//                     }}
//                     className="text-indigo-100 hover:text-white transition-colors duration-200"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>

//               {/* Modal Body */}
//               <div className="p-6">
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                   {/* From City */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       From City
//                     </label>
//                     <input
//                       type="text"
//                       placeholder="Enter departure city"
//                       className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                       value={selectedFromCity}
//                       onChange={(e) => setSelectedFromCity(e.target.value)}
//                       list="city-options"
//                       required={!editingId}
//                     />
//                   </div>

//                   {/* To City */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       To City
//                     </label>
//                     <input
//                       type="text"
//                       placeholder="Enter arrival city"
//                       className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                       value={selectedToCity}
//                       onChange={(e) => setSelectedToCity(e.target.value)}
//                       list="city-options"
//                       required={!editingId}
//                     />
//                   </div>

//                   <datalist id="city-options">
//                     {cities.map((city: any) => (
//                       <option key={city.name} value={city.name} />
//                     ))}
//                   </datalist>

//                   {/* Airfare and Duration Row */}
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Airfare (₹)
//                       </label>
//                       <input
//                         type="number"
//                         placeholder="0"
//                         className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                         value={airfare}
//                         onChange={(e) => setAirfare(e.target.value)}
//                         step="100"
//                         required={!editingId}
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Duration (hrs)
//                       </label>
//                       <input
//                         type="number"
//                         placeholder="0"
//                         className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                         value={duration}
//                         onChange={(e) => setDuration(e.target.value)}
//                         step="1"
//                         required={!editingId}
//                       />
//                     </div>
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex gap-3 pt-4">
//                     <button
//                       type="submit"
//                       className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                       disabled={loading}
//                     >
//                       {loading ? (
//                         <div className="flex items-center justify-center gap-2">
//                           <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                           Saving...
//                         </div>
//                       ) : editingId ? (
//                         "Update Connection"
//                       ) : (
//                         "Add Connection"
//                       )}
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => {
//                         resetForm();
//                         setIsModalOpen(false);
//                       }}
//                       className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-md transition-colors duration-200"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Connections;

"use client";

import { useEffect, useState, FormEvent } from "react";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import {
  Plus,
  X,
  Edit,
  Trash2,
  Plane,
  IndianRupee,
  Clock,
  ArrowRight,
  Loader2,
} from "lucide-react";

// Define local types for clarity
interface City {
  id: number;
  name: string;
}
interface Connection {
  id: number;
  fromCity: string;
  toCity: string;
  airfare: number;
  duration: number;
}

const ConnectionsPage = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedFromCity, setSelectedFromCity] = useState("");
  const [selectedToCity, setSelectedToCity] = useState("");
  const [airfare, setAirfare] = useState("");
  const [duration, setDuration] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const token = Cookies.get("access_token");

  const fetchCities = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/cities`);
      const data = await res.json();
      setCities(data);
    } catch {
      toast.error("Failed to load cities");
    }
  };

  const fetchConnections = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/connections`
      );
      const data = await res.json();
      setConnections(data);
    } catch {
      toast.error("Failed to load connections");
    }
  };

  useEffect(() => {
    fetchCities();
    fetchConnections();
  }, []);

  const resetForm = () => {
    setSelectedFromCity("");
    setSelectedToCity("");
    setAirfare("");
    setDuration("");
    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedFromCity || !selectedToCity || !airfare || !duration) {
      toast.error("All fields are required");
      return;
    }
    if (selectedFromCity === selectedToCity) {
      toast.error("From and To cities cannot be the same");
      return;
    }
    setLoading(true);

    let payload: Record<string, any> = {};
    if (editingId) {
      if (selectedFromCity) payload.fromCity = selectedFromCity;
      if (selectedToCity) payload.toCity = selectedToCity;
      if (airfare) payload.airfare = parseFloat(airfare);
      if (duration) payload.duration = parseFloat(duration);
    } else {
      payload = {
        fromCity: selectedFromCity,
        toCity: selectedToCity,
        airfare: parseFloat(airfare),
        duration: parseFloat(duration),
      };
    }

    const endpoint = editingId
      ? `${process.env.NEXT_PUBLIC_BACKEND_API}/connections/${editingId}`
      : `${process.env.NEXT_PUBLIC_BACKEND_API}/connections`;
    const method = editingId ? "PATCH" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Something went wrong");
      }
      toast.success(
        `Connection ${editingId ? "updated" : "added"} successfully`
      );
      fetchConnections();
      resetForm();
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (conn: Connection) => {
    setSelectedFromCity(conn.fromCity);
    setSelectedToCity(conn.toCity);
    setAirfare(conn.airfare.toString());
    setDuration(conn.duration.toString());
    setEditingId(conn.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    // You might want a confirmation modal here for better UX
    if (!window.confirm("Are you sure you want to delete this connection?"))
      return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/connections/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Connection deleted");
      fetchConnections();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="animate-fade-in-up">
      <Toaster
        position="top-right"
        toastOptions={{ style: { background: "#334155", color: "#fff" } }}
      />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white">Flight Connections</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 text-white font-semibold rounded-lg px-5 py-3 hover:bg-blue-500 transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-blue-500/40"
        >
          <Plus size={20} /> Add Connection
        </button>
      </div>

      {connections.length === 0 ? (
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-lg p-12 text-center flex flex-col items-center">
          <Plane className="w-16 h-16 text-slate-500 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No Connections Found
          </h3>
          <p className="text-slate-400">
            Click 'Add Connection' to create the first flight route.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {connections.map((conn, index) => (
            <div
              key={conn.id}
              className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-500/20 hover:border-white/30 animate-fade-in-up"
              style={{
                animationDelay: `${index * 50}ms`,
                willChange: "transform",
              }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="font-mono text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded">
                    ID: #{conn.id}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(conn)}
                      className="text-gray-400 hover:text-blue-400 hover:bg-white/10 rounded-full p-2 transition-all"
                      title="Edit Connection"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(conn.id)}
                      className="text-gray-400 hover:text-red-400 hover:bg-white/10 rounded-full p-2 transition-all"
                      title="Delete Connection"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="text-center flex-1">
                    <p className="text-sm text-slate-400">From</p>
                    <p className="text-2xl font-bold text-white truncate">
                      {conn.fromCity}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-blue-400">
                    <Plane size={24} />
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-sm text-slate-400">To</p>
                    <p className="text-2xl font-bold text-white truncate">
                      {conn.toCity}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-400">Duration</p>
                      <p className="font-semibold text-white">
                        {conn.duration} hours
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <IndianRupee className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-400">Airfare</p>
                      <p className="font-semibold text-white">
                        ₹{conn.airfare.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up"
          style={{ animationDuration: "0.3s" }}
        >
          <div className="bg-slate-800/80 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl w-full max-w-md relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
            >
              <X size={24} />
            </button>
            <form onSubmit={handleSubmit} className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                {editingId ? "Update Connection" : "Add New Connection"}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    From City
                  </label>
                  <input
                    type="text"
                    value={selectedFromCity}
                    onChange={(e) => setSelectedFromCity(e.target.value)}
                    list="city-options"
                    required={!editingId}
                    className="w-full bg-slate-900/70 border border-slate-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="e.g., Hyderabad"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    To City
                  </label>
                  <input
                    type="text"
                    value={selectedToCity}
                    onChange={(e) => setSelectedToCity(e.target.value)}
                    list="city-options"
                    required={!editingId}
                    className="w-full bg-slate-900/70 border border-slate-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="e.g., Delhi"
                  />
                </div>
                <datalist id="city-options">
                  {cities.map((city) => (
                    <option key={city.id} value={city.name} />
                  ))}
                </datalist>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Airfare (₹)
                    </label>
                    <input
                      type="number"
                      value={airfare}
                      onChange={(e) => setAirfare(e.target.value)}
                      step="100"
                      required={!editingId}
                      className="w-full bg-slate-900/70 border border-slate-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="e.g., 5000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Duration (hrs)
                    </label>
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      step="0.5"
                      required={!editingId}
                      className="w-full bg-slate-900/70 border border-slate-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="e.g., 2.5"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white font-semibold rounded-lg px-5 py-3 hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {loading && <Loader2 className="animate-spin" size={20} />}
                    {loading
                      ? "Saving..."
                      : editingId
                      ? "Update Connection"
                      : "Add Connection"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionsPage;
