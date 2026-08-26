"use client";

import { UserButton } from "@clerk/nextjs";
import {
  Clock,
  FileText,
  Layers,
  Menu,
  MessageCircle,
  ShieldCheck,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

const NAV = [
  { href: "/dashboard/timeline", label: "Timeline", icon: Clock },
  { href: "/dashboard", label: "Care Threads", icon: Layers },
  { href: "/dashboard/ai-summary", label: "AI Summary", icon: FileText },
  { href: "/dashboard/emergency-qr", label: "Emergency QR", icon: ShieldCheck },
  { href: "/dashboard/ask", label: "Ask ApnaSehat", icon: MessageCircle },
] as const;

export type SidebarUser = {
  fullName: string;
  imageUrl?: string;
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Avatar({ user }: { user: SidebarUser }) {
  if (user.imageUrl) {
    return (
      // Clerk-hosted avatar; next/image domains are not configured.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.imageUrl}
        alt={user.fullName}
        className="h-11 w-11 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2f5c52] text-xs font-semibold text-white">
      {initials(user.fullName) || "P"}
    </div>
  );
}

function SidebarBody({
  user,
  onNavigate,
}: {
  user: SidebarUser;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <Link
        href="/"
        onClick={onNavigate}
        className="flex items-center gap-3 px-1"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[20px] font-semibold leading-none text-[#163c34]">
          a
        </div>
        <div>
          <div className="text-[17px] font-semibold tracking-[-0.02em] text-white">
            ApnaSehat
          </div>
          <div className="text-[12px] text-[#9db5ad]">Your health memory</div>
        </div>
      </Link>

      <div className="my-6 h-px bg-white/10" />

      <div className="mb-8 flex items-center gap-3 px-1">
        <Avatar user={user} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[15px] font-semibold text-white">
            {user.fullName}
          </div>
          <div className="text-[12px] text-[#9db5ad]">Patient workspace</div>
        </div>
      </div>

      <nav className="flex flex-col gap-1.5">
        {NAV.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-[15px] transition ${
                active
                  ? "bg-[#2f5c52] font-medium text-white"
                  : "text-[#d7e4df] hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-white/10 pt-5">
        <div className="flex items-center gap-3 px-1">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-9 w-9",
              },
            }}
          />
          <div className="text-[12px] text-[#9db5ad]">
            <div className="font-medium text-white">Account</div>
            Manage profile and sign out
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardShell({
  user,
  children,
}: {
  user: SidebarUser;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const current = NAV.find((item) => isActive(pathname, item.href));

  return (
    <div className="min-h-screen bg-[#eef3f1] text-[#123c32]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[280px] bg-[#163c34] px-5 py-6 lg:flex lg:flex-col">
        <SidebarBody user={user} />
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <aside className="relative h-full w-[280px] bg-[#163c34] px-5 py-6">
            <button
              type="button"
              aria-label="Close sidebar"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-5 text-white/80"
            >
              <X size={20} />
            </button>
            <SidebarBody user={user} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div className="lg:pl-[280px]">
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-[#dce9e4] bg-[#eef3f1]/90 px-4 py-3 backdrop-blur-xl lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d5e4df] bg-white text-[#163c34]"
            aria-label="Open sidebar"
          >
            <Menu size={18} />
          </button>
          <span className="text-sm font-semibold">
            {current?.label ?? "ApnaSehat"}
          </span>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-9 w-9",
              },
            }}
          />
        </div>
        {children}
      </div>
    </div>
  );
}
