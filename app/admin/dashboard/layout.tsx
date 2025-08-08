import AdminSidebar from "../../Components/SidebarAdmin"; // Adjust path if needed

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Main container with gradient background to enhance the glassmorphism effect
    <div className="bg-gradient-to-br from-gray-900 via-slate-900 to-black min-h-screen text-slate-100 flex">
      <AdminSidebar />
      {/* Main content area with its own scrollbar, offset by the sidebar's width */}
      <main className="flex-1 ml-64 h-screen overflow-y-auto scroll-smooth">
        {/* Generous padding for a spacious feel */}
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
