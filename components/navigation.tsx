import {SidebarTrigger} from "@/components/ui/sidebar";
export const Navigation = () => {
  return (
    <nav className="border-b w-full border-[var(--foreground)]/10">
      <div className="flex container h-16 px-4">
        <SidebarTrigger />
        <div className="text-xl font-semiold">HellowBot</div>
        <div className="flex gap-2"></div>
      </div>
    </nav>
  );
};
