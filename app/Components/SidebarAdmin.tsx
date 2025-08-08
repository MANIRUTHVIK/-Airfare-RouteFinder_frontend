// "use client";
// import Cookies from "js-cookie";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { Edit, ArrowRightLeft, LogOut } from "lucide-react";
// import toast, { Toaster } from "react-hot-toast";

// // A client-side function to call the server action and handle redirection
// async function handleLogout(router) {
//   toast.success("You have been logged out!");
//   Cookies.remove("access_token"); // Remove the token cookie
//   router.push("/admin/login");
//   router.refresh(); // Ensure the page state is cleared
// }
// export default function AdminSidebar() {
//   const pathname = usePathname();
//   const router = useRouter();

//   const navItems = [
//     { href: "/admin/dashboard/cities", label: "Manage Cities", icon: Edit },
//     {
//       href: "/admin/dashboard/connections",
//       label: "Manage Connections",
//       icon: ArrowRightLeft,
//     },
//   ];

//   return (
//     <aside className="bg-gray-100 border-r border-gray-200 flex flex-col w-64 h-screen flex-shrink-0">
//       <div className="flex items-center justify-center h-20 border-b border-gray-200 flex-shrink-0">
//         <h1 className="text-2xl font-bold text-indigo-600">Admin Panel</h1>
//       </div>
//       <nav className="flex-1 p-4 space-y-2">
//         {navItems.map((item) => {
//           const isActive = pathname.startsWith(item.href);
//           return (
//             <Link
//               key={item.href}
//               href={item.href}
//               className={`flex items-center w-full px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
//                 isActive
//                   ? "bg-indigo-600 text-white shadow-md"
//                   : "text-gray-600 hover:bg-gray-200 hover:text-gray-800"
//               }`}
//             >
//               <item.icon size={20} />
//               <span className="ml-3 font-medium">{item.label}</span>
//             </Link>
//           );
//         })}
//       </nav>
//       <div className="p-4 border-t border-gray-200">
//         <button
//           onClick={() => handleLogout(router)}
//           className="flex items-center w-full px-4 py-3 text-left rounded-lg transition-colors duration-200 text-red-600 hover:bg-red-100"
//         >
//           <LogOut size={20} />
//           <Toaster position="top-right" />
//           <span className="ml-3 font-medium">Logout</span>
//         </button>
//       </div>
//     </aside>
//   );
// }

"use client";
import Cookies from "js-cookie";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Building2, ArrowRightLeft, LogOut, ShieldCheck } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

async function handleLogout(router: any) {
  toast.success("You have been logged out!");
  Cookies.remove("access_token");
  router.push("/admin/login");
  router.refresh();
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      href: "/admin/dashboard/cities",
      label: "Manage Cities",
      icon: Building2,
    },
    {
      href: "/admin/dashboard/connections",
      label: "Manage Connections",
      icon: ArrowRightLeft,
    },
  ];

  return (
    // Fixed sidebar with glassmorphism effect: semi-transparent bg, backdrop blur, and subtle border
    <aside className="fixed top-0 left-0 w-64 h-screen bg-black/30 backdrop-blur-lg border-r border-white/10 flex flex-col z-40">
      <Toaster
        position="top-right"
        toastOptions={{ style: { background: "#334155", color: "#fff" } }}
      />
      <div className="flex items-center justify-center h-20 border-b border-white/10 flex-shrink-0">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="text-blue-400" />
          Admin Panel
        </h1>
      </div>

      <div className="flex flex-col flex-grow justify-between">
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center w-full px-4 py-3 text-left rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-blue-500/30 text-white font-semibold"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon size={20} />
                <span className="ml-3 font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => handleLogout(router)}
            className="flex items-center w-full px-4 py-3 text-left rounded-lg transition-colors duration-300 text-red-400 hover:bg-red-500/20 hover:text-red-300"
          >
            <LogOut size={20} />
            <span className="ml-3 font-medium">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
