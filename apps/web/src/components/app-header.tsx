import { ModeToggle } from "./mode-toggle";
import { SidebarTrigger } from "./ui/sidebar";

export function AppHeader() {
  return (
    <header className="flex justify-between items-center h-14 shrink-0  gap-2 border-b  bg-background px-4">
      <SidebarTrigger />
      <ModeToggle />
    </header>
  );
}
