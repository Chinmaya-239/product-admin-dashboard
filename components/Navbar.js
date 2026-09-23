"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <header className="border-b border-line bg-surface">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/products" className="flex items-center gap-2 font-semibold">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-accent text-white text-sm">
            P
          </span>
          Product Admin
        </Link>
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-muted hover:text-ink"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
