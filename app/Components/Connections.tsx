"use client";
import { useRouter } from "next/navigation";
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
  const [connectionToDelete, setConnectionToDelete] =
    useState<Connection | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const token = Cookies.get("access_token");
  useEffect(() => {
    if (!token) {
      router.push("/admin/login");
      return;
    }
    fetchCities();
  }, [token, router]);
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

  const handleDelete = async () => {
    if (!connectionToDelete) return;

    setDeleting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/connections/${connectionToDelete.id}`,
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
      setConnectionToDelete(null);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="animate-fade-in-up">
      <Toaster
        position="top-right"
        toastOptions={{ style: { background: "#334155", color: "#fff" } }}
      />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
          Flight Connections
        </h1>
        <button
          onClick={openAddModal}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold rounded-lg px-4 sm:px-5 py-2.5 sm:py-3 hover:bg-blue-500 transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-blue-500/40"
        >
          <Plus size={18} className="sm:w-5 sm:h-5" /> Add Connection
        </button>
      </div>

      {connections.length === 0 ? (
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-lg p-8 sm:p-12 text-center flex flex-col items-center">
          <Plane className="w-12 h-12 sm:w-16 sm:h-16 text-slate-500 mb-3 sm:mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
            No Connections Found
          </h3>
          <p className="text-slate-400 text-sm sm:text-base">
            Click 'Add Connection' to create the first flight route.
          </p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {connections.map((conn, index) => (
            <div
              key={conn.id}
              className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-500/20 hover:border-white/30 animate-fade-in-up"
              style={{
                animationDelay: `${index * 50}ms`,
                willChange: "transform",
              }}
            >
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-3">
                  <div className="font-mono text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded">
                    ID: #{conn.id}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(conn)}
                      className="text-gray-400 hover:text-blue-400 hover:bg-white/10 rounded-full p-2 transition-all"
                      title="Edit Connection"
                    >
                      <Edit size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </button>
                    <button
                      onClick={() => setConnectionToDelete(conn)}
                      className="text-gray-400 hover:text-red-400 hover:bg-white/10 rounded-full p-2 transition-all"
                      title="Delete Connection"
                    >
                      <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-slate-400">From</p>
                    <p className="text-lg sm:text-2xl font-bold text-white truncate">
                      {conn.fromCity}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-blue-400 rotate-90 sm:rotate-0">
                    <Plane size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <div className="text-center flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-slate-400">To</p>
                    <p className="text-lg sm:text-2xl font-bold text-white truncate">
                      {conn.toCity}
                    </p>
                  </div>
                </div>

                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/10 grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-slate-400">
                        Duration
                      </p>
                      <p className="font-semibold text-white text-sm sm:text-base truncate">
                        {conn.duration} hours
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-slate-400">
                        Airfare
                      </p>
                      <p className="font-semibold text-white text-sm sm:text-base truncate">
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
          <div className="bg-slate-800/80 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="sticky top-3 right-3 sm:top-4 sm:right-4 float-right text-gray-400 hover:text-white transition-colors z-10 bg-slate-700/50 rounded-full p-1"
            >
              <X size={20} className="sm:w-6 sm:h-6" />
            </button>
            <form onSubmit={handleSubmit} className="p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 pr-8">
                {editingId ? "Update Connection" : "Add New Connection"}
              </h2>
              <div className="space-y-3 sm:space-y-4">
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
                    className="w-full bg-slate-900/70 border border-slate-700 text-white rounded-lg p-2.5 sm:p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm sm:text-base"
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
                    className="w-full bg-slate-900/70 border border-slate-700 text-white rounded-lg p-2.5 sm:p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm sm:text-base"
                    placeholder="e.g., Delhi"
                  />
                </div>
                <datalist id="city-options">
                  {cities.map((city) => (
                    <option key={city.id} value={city.name} />
                  ))}
                </datalist>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
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
                      className="w-full bg-slate-900/70 border border-slate-700 text-white rounded-lg p-2.5 sm:p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm sm:text-base"
                      placeholder="5000"
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
                      className="w-full bg-slate-900/70 border border-slate-700 text-white rounded-lg p-2.5 sm:p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm sm:text-base"
                      placeholder="2.5"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-3 sm:pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white font-semibold rounded-lg px-4 sm:px-5 py-2.5 sm:py-3 hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 text-sm sm:text-base"
                  >
                    {loading && <Loader2 className="animate-spin" size={18} />}
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

      {/* Delete Confirmation Modal */}
      {connectionToDelete && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up"
          style={{ animationDuration: "0.3s" }}
        >
          <div className="bg-slate-800/80 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl w-full max-w-xs sm:max-w-sm text-center p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-red-400">
              Delete Connection?
            </h2>
            <p className="mb-4 sm:mb-6 text-slate-300 text-sm sm:text-base">
              Are you sure you want to delete the connection from{" "}
              <strong className="text-white">
                {connectionToDelete.fromCity}
              </strong>{" "}
              to{" "}
              <strong className="text-white">
                {connectionToDelete.toCity}
              </strong>
              ? This action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => setConnectionToDelete(null)}
                className="w-full px-4 py-2 bg-slate-600/50 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors text-sm sm:text-base"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-colors disabled:bg-red-800 text-sm sm:text-base"
                disabled={deleting}
              >
                {deleting && <Loader2 className="animate-spin" size={18} />}
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionsPage;
