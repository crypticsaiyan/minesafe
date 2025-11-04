import {SidebarTrigger} from "@/components/ui/sidebar";
export const Navigation = () => {
  return (
    <nav className="border-b w-full border-[var(--foreground)]/10">
      <div className="flex container h-16 px-4 items-center">
        <SidebarTrigger />
        <div className="text-xl font-bold ml-4">MineSafe</div>
        <div className="text-sm text-gray-600 ml-2">Mining Safety Platform</div>
        <div className="flex gap-2 ml-auto"></div>
      </div>
    </nav>
  );
};
