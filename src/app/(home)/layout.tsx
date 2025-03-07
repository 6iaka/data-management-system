import AIModal from "~/components/AIModal";
import AppSidebar from "~/components/app-sidebar";
import TooltipWrapper from "~/components/TooltipWrapper";
import { Input } from "~/components/ui/input";
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";

export default function HomeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <AIModal />

      <main className="flex min-h-svh w-full flex-col">
        <header className="flex w-full gap-4 border-b p-4">
          <TooltipWrapper label="Toggle Sidebar">
            <SidebarTrigger className="size-9 shrink-0" />
          </TooltipWrapper>

          <Input placeholder="Search" className="flex-1" />
        </header>

        <div className="flex flex-1 flex-col">{children}</div>
      </main>
    </SidebarProvider>
  );
}
