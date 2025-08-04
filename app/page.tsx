import FindConnection from "./Components/FindConnection"; // Adjust path as needed
import Navbar from "./Components/Navbar"; // Assuming you have a Navbar component

// Define the City type here as well, or in a shared types file
interface City {
  id: number;
  name: string;
  imageUrl: string;
}

async function getCities() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/cities`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 60 }, // Cache data for 1 minute
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch city list.");
    }
    const citiesData: City[] = await response.json();
    return { cities: citiesData, error: null };
  } catch (err) {
    return {
      cities: [],
      error: err instanceof Error ? err.message : "An unknown error occurred.",
    };
  }
}

export default async function Home() {
  const { cities, error } = await getCities();

  // --- FIX: Determine initial city values on the server ---
  // This ensures the server knows which <option> should be selected.
  let initialFromCity = "";
  let initialToCity = "";

  if (cities && cities.length >= 2) {
    initialFromCity =
      cities.find((c) => c.name === "Bengaluru")?.name || cities[0].name;
    initialToCity =
      cities.find((c) => c.name === "Delhi")?.name || cities[1].name;
  } else if (cities && cities.length > 0) {
    initialFromCity = cities[0].name;
  }

  return (
    <div>
      <Navbar />
      {error ? (
        <div className="text-center p-8 bg-red-50 rounded-2xl shadow-lg border border-red-200 max-w-5xl mx-auto mt-8">
          <h2 className="text-2xl font-bold text-red-800">
            Could Not Load Page
          </h2>
          <p className="text-red-600 mt-2">{error}</p>
        </div>
      ) : (
        // --- FIX: Pass all required props to the client component ---
        // This includes the initial values for the dropdowns.
        <FindConnection
          initialCities={cities}
          initialFromCity={initialFromCity}
          initialToCity={initialToCity}
        />
      )}
    </div>
  );
}
