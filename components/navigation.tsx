import {SidebarTrigger} from "@/components/ui/sidebar";
import Link from "next/link";

export const Navigation = () => {
  return (
    <nav className="border-b w-full border-[var(--foreground)]/10">
      <div className="flex container h-16 px-4 items-center">
        <SidebarTrigger />
        <Link href="/" className="text-xl font-bold ml-4 hover:opacity-80 transition-opacity cursor-pointer">
          MineSafe
        </Link>
        <div className="flex gap-2 ml-auto"></div>
      </div>
    </nav>
  );
};
