// "use client";

// import { useEffect, useState, ChangeEvent, FormEvent } from "react";
// import { Edit, Plus, Trash2, X } from "lucide-react";
// import Image from "next/image";
// import Cookies from "js-cookie";
// import { useRouter } from "next/navigation";
// import { City as CityType } from "../lib/types/respnse.types";
// import { toast, Toaster } from "react-hot-toast";
// import LoadingTest from "./LoadingTest";

// const City = () => {
//   const router = useRouter();
//   const [cities, setCities] = useState<CityType[]>([]);
//   const [showModal, setShowModal] = useState(false);
//   const [newCityName, setNewCityName] = useState("");
//   const [newCityImage, setNewCityImage] = useState<File | null>(null);
//   const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
//   const [editCityId, setEditCityId] = useState<number | null>(null);
//   const [cityToDelete, setCityToDelete] = useState<CityType | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);

//   const cookie_token = Cookies.get("access_token");

//   useEffect(() => {
//     if (!cookie_token) {
//       router.push("/admin/login");
//       return;
//     }
//     fetchCities();
//   }, [cookie_token, router]);

//   const fetchCities = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/cities`, {
//         headers: { Authorization: `Bearer ${cookie_token}` },
//         cache: "no-store",
//       });
//       if (!res.ok) throw new Error("Failed to fetch cities");
//       const data = await res.json();
//       setCities(data);
//     } catch (err) {
//       toast.error(
//         err instanceof Error ? err.message : "Failed to fetch cities"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddCity = async (e: FormEvent) => {
//     e.preventDefault();
//     if (!newCityName.trim() || !newCityImage) {
//       toast.error("Both city name and image are required.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("name", newCityName.trim());
//     formData.append("image", newCityImage);

//     try {
//       setSubmitting(true);
//       const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/cities`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${cookie_token}` },
//         body: formData,
//       });
//       if (!res.ok) {
//         console.log(res);
//         throw new Error("Failed to add city.");
//       }
//       toast.success("City added successfully!");
//       closeModal();
//       await fetchCities();
//     } catch (err) {
//       toast.error(err instanceof Error ? err.message : "Add operation failed");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleUpdateCity = async (e: FormEvent) => {
//     e.preventDefault();
//     if (!editCityId) {
//       toast.error("No city selected for update.");
//       return;
//     }

//     const formData = new FormData();
//     if (newCityName.trim()) formData.append("name", newCityName.trim());
//     if (newCityImage) formData.append("image", newCityImage);

//     try {
//       setSubmitting(true);
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_API}/cities/${editCityId}`,
//         {
//           method: "PATCH",
//           headers: { Authorization: `Bearer ${cookie_token}` },
//           body: formData,
//         }
//       );
//       if (!res.ok) throw new Error("Failed to update city.");
//       toast.success("City updated successfully!");
//       closeModal();
//       await fetchCities();
//     } catch (err) {
//       toast.error(
//         err instanceof Error ? err.message : "Update operation failed"
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const confirmDeleteCity = async () => {
//     if (!cityToDelete) return;
//     try {
//       setSubmitting(true);
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_API}/cities/${cityToDelete.id}`,
//         {
//           method: "DELETE",
//           headers: { Authorization: `Bearer ${cookie_token}` },
//         }
//       );
//       if (!res.ok) throw new Error("Delete failed");
//       toast.success("City deleted successfully!");

//       setCityToDelete(null);
//       await fetchCities();
//     } catch (err) {
//       toast.error(err instanceof Error ? err.message : "Failed to delete city");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const openEditModal = (city: CityType) => {
//     setEditCityId(city.id);
//     setNewCityName(city.name);
//     setNewCityImage(null);
//     setImagePreviewUrl(city.imageUrl);
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setEditCityId(null);
//     setNewCityName("");
//     setNewCityImage(null);
//     setImagePreviewUrl(null);
//   };

//   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       setNewCityImage(file);
//       setImagePreviewUrl(URL.createObjectURL(file));
//     }
//   };

//   if (loading) return <LoadingTest />;
//   // if (loading) toast.loading("Loading cities...");

//   return (
//     <div className="p-4">
//       <Toaster position="top-right" reverseOrder={false} />

//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold">Cities</h1>
//         <button
//           onClick={() => setShowModal(true)}
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           <Plus className="inline mr-1" /> Add City
//         </button>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {cities.map((city) => (
//           <div
//             key={city.id}
//             className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
//           >
//             <Image
//               src={city.imageUrl}
//               alt={city.name}
//               width={400}
//               height={200}
//               className="w-full h-48 object-cover"
//             />
//             <div className="p-4 flex flex-col flex-grow justify-between">
//               <h2 className="text-lg font-semibold mb-2">{city.name}</h2>
//               <div className="flex justify-end space-x-4 mt-auto">
//                 <Edit
//                   onClick={() => openEditModal(city)}
//                   className="text-blue-600 cursor-pointer hover:text-blue-800"
//                 />
//                 <Trash2
//                   onClick={() => setCityToDelete(city)}
//                   className="text-red-600 cursor-pointer hover:text-red-800"
//                 />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {showModal && (
//         <div className="fixed bg-transparent backdrop-blur-md backdrop-brightness-90 border border-white/20 rounded-lg p-6 shadow-lg inset-0 bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
//             <button
//               onClick={closeModal}
//               className="absolute top-4 right-4 text-gray-500 hover:text-black"
//             >
//               <X size={20} />
//             </button>

//             <h2 className="text-xl font-semibold mb-4">
//               {editCityId ? "Update City" : "Add City"}
//             </h2>
//             <form onSubmit={editCityId ? handleUpdateCity : handleAddCity}>
//               <input
//                 type="text"
//                 value={newCityName}
//                 onChange={(e) => setNewCityName(e.target.value)}
//                 placeholder="City Name"
//                 className="border w-full mb-3 p-2 rounded"
//                 disabled={submitting}
//               />

//               <div className="flex items-center justify-center w-full mb-3">
//                 <label
//                   htmlFor="dropzone-file"
//                   className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
//                 >
//                   <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                     <svg
//                       className="w-8 h-8 mb-4 text-gray-500"
//                       aria-hidden="true"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 20 16"
//                     >
//                       <path
//                         stroke="currentColor"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
//                       />
//                     </svg>
//                     <p className="mb-2 text-sm text-gray-500">
//                       <span className="font-semibold">Click to upload</span> or
//                       drag and drop
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       SVG, PNG, JPG or GIF (MAX. 800x400px)
//                     </p>
//                   </div>
//                   <input
//                     id="dropzone-file"
//                     type="file"
//                     accept="image/*"
//                     className="hidden"
//                     onChange={handleImageChange}
//                     disabled={submitting}
//                   />
//                 </label>
//               </div>

//               {imagePreviewUrl && (
//                 <div className="mb-3">
//                   <p className="text-sm text-gray-600 mb-1">Preview:</p>
//                   <Image
//                     src={imagePreviewUrl}
//                     alt="Preview"
//                     width={150}
//                     height={150}
//                     className="rounded shadow border"
//                   />
//                 </div>
//               )}

//               <div className="flex justify-end space-x-2">
//                 <button
//                   type="submit"
//                   disabled={submitting}
//                   className="bg-green-600 text-white px-4 py-2 rounded"
//                 >
//                   {submitting ? "Saving..." : editCityId ? "Update" : "Add"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {cityToDelete && (
//         <div className="fixed inset-0 bg-transparent backdrop-blur-md backdrop-brightness-90 border border-white/20 rounded-lg p-6 shadow-lg bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm text-center">
//             <h2 className="text-xl font-semibold mb-4 text-red-600">
//               Delete City?
//             </h2>
//             <p className="mb-6">
//               Are you sure you want to delete{" "}
//               <strong>{cityToDelete.name}</strong>?
//             </p>
//             <div className="flex justify-center space-x-4">
//               <button
//                 onClick={() => setCityToDelete(null)}
//                 className="px-4 py-2 border rounded"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmDeleteCity}
//                 className="bg-red-600 text-white px-4 py-2 rounded"
//                 disabled={submitting}
//               >
//                 {submitting ? "Deleting..." : "Delete"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default City;

"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Edit, Plus, Trash2, X, UploadCloud, Loader2 } from "lucide-react";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import LoadingTest from "./LoadingTest"; // Adjust path if needed

// Define the CityType interface locally if it's not in a shared file
interface CityType {
  id: number;
  name: string;
  imageUrl: string;
}

const CityPage = () => {
  const router = useRouter();
  const [cities, setCities] = useState<CityType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newCityName, setNewCityName] = useState("");
  const [newCityImage, setNewCityImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [editCityId, setEditCityId] = useState<number | null>(null);
  const [cityToDelete, setCityToDelete] = useState<CityType | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const cookie_token = Cookies.get("access_token");

  useEffect(() => {
    if (!cookie_token) {
      router.push("/admin/login");
      return;
    }
    fetchCities();
  }, [cookie_token, router]);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/cities`, {
        headers: { Authorization: `Bearer ${cookie_token}` },
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch cities");
      const data = await res.json();
      setCities(data);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to fetch cities"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddCity = async (e: FormEvent) => {
    e.preventDefault();
    if (!newCityName.trim() || !newCityImage) {
      toast.error("Both city name and image are required.");
      return;
    }
    const formData = new FormData();
    formData.append("name", newCityName.trim());
    formData.append("image", newCityImage);
    try {
      setSubmitting(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/cities`, {
        method: "POST",
        headers: { Authorization: `Bearer ${cookie_token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to add city.");
      toast.success("City added successfully!");
      closeModal();
      await fetchCities();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Add operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateCity = async (e: FormEvent) => {
    e.preventDefault();
    if (!editCityId) {
      toast.error("No city selected for update.");
      return;
    }
    const formData = new FormData();
    if (newCityName.trim()) formData.append("name", newCityName.trim());
    if (newCityImage) formData.append("image", newCityImage);
    try {
      setSubmitting(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/cities/${editCityId}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${cookie_token}` },
          body: formData,
        }
      );
      if (!res.ok) throw new Error("Failed to update city.");
      toast.success("City updated successfully!");
      closeModal();
      await fetchCities();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Update operation failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDeleteCity = async () => {
    if (!cityToDelete) return;
    try {
      setSubmitting(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/cities/${cityToDelete.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${cookie_token}` },
        }
      );
      if (!res.ok) throw new Error("Delete failed");
      toast.success("City deleted successfully!");
      setCityToDelete(null);
      await fetchCities();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete city");
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (city: CityType) => {
    setEditCityId(city.id);
    setNewCityName(city.name);
    setNewCityImage(null);
    setImagePreviewUrl(city.imageUrl);
    setShowModal(true);
  };

  const openAddModal = () => {
    closeModal(); // Reset form state before opening
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditCityId(null);
    setNewCityName("");
    setNewCityImage(null);
    setImagePreviewUrl(null);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewCityImage(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  if (loading) return <LoadingTest />;

  return (
    <div className="animate-fade-in-up">
      <Toaster
        position="top-right"
        toastOptions={{ style: { background: "#334155", color: "#fff" } }}
      />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white">Manage Cities</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 text-white font-semibold rounded-lg px-5 py-3 hover:bg-blue-500 transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-blue-500/40"
        >
          <Plus size={20} /> Add City
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cities.map((city, index) => (
          // Glassmorphism card with hover effect and staggered animation
          <div
            key={city.id}
            className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-lg flex flex-col group animate-fade-in-up transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-500/20 hover:border-white/30"
            style={{
              animationDelay: `${index * 50}ms`,
              willChange: "transform",
            }}
          >
            <div className="relative w-full h-48 overflow-hidden rounded-t-xl">
              <Image
                src={city.imageUrl}
                alt={city.name}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="p-4 flex flex-col flex-grow justify-between">
              <h2 className="text-xl font-semibold text-white mb-4 truncate">
                {city.name}
              </h2>
              <div className="flex justify-end space-x-2 mt-auto">
                {/* Minimalist icon buttons */}
                <button
                  onClick={() => openEditModal(city)}
                  className="text-gray-400 hover:text-blue-400 hover:bg-white/10 rounded-full p-2 transition-all"
                  title="Edit City"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => setCityToDelete(city)}
                  className="text-gray-400 hover:text-red-400 hover:bg-white/10 rounded-full p-2 transition-all"
                  title="Delete City"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal with glassmorphism effect */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up"
          style={{ animationDuration: "0.3s" }}
        >
          <div className="bg-slate-800/80 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl w-full max-w-md relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
            >
              <X size={24} />
            </button>
            <form
              onSubmit={editCityId ? handleUpdateCity : handleAddCity}
              className="p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                {editCityId ? "Update City" : "Add New City"}
              </h2>
              <div className="space-y-6">
                <input
                  type="text"
                  value={newCityName}
                  onChange={(e) => setNewCityName(e.target.value)}
                  placeholder="Enter city name"
                  className="w-full bg-slate-900/70 border border-slate-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  disabled={submitting}
                />
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-56 border-2 border-slate-700 border-dashed rounded-lg cursor-pointer bg-slate-900/50 hover:bg-slate-900/80 transition-colors"
                >
                  {imagePreviewUrl ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={imagePreviewUrl}
                        alt="Preview"
                        layout="fill"
                        objectFit="contain"
                        className="rounded-lg p-2"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <UploadCloud className="w-10 h-10 mb-4" />
                      <p className="mb-2 text-sm">
                        <span className="font-semibold text-blue-400">
                          Click to upload
                        </span>{" "}
                        or drag & drop
                      </p>
                      <p className="text-xs text-slate-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  )}
                  <input
                    id="dropzone-file"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                    disabled={submitting}
                  />
                </label>
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white font-semibold rounded-lg px-5 py-3 hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {submitting && (
                      <Loader2 className="animate-spin" size={20} />
                    )}
                    {submitting
                      ? "Saving..."
                      : editCityId
                      ? "Update City"
                      : "Add City"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {cityToDelete && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up"
          style={{ animationDuration: "0.3s" }}
        >
          <div className="bg-slate-800/80 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl w-full max-w-sm text-center p-8">
            <h2 className="text-2xl font-bold mb-4 text-red-400">
              Delete City?
            </h2>
            <p className="mb-6 text-slate-300">
              Are you sure you want to delete{" "}
              <strong className="text-white">{cityToDelete.name}</strong>? This
              action cannot be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setCityToDelete(null)}
                className="w-full px-4 py-2 bg-slate-600/50 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteCity}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-colors disabled:bg-red-800"
                disabled={submitting}
              >
                {submitting && <Loader2 className="animate-spin" size={20} />}
                {submitting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CityPage;
