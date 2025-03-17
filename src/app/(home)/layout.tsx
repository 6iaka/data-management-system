import AppSidebar from "~/components/AppSidebar";
import TooltipWrapper from "~/components/TooltipWrapper";
import { Input } from "~/components/ui/input";
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";

export default function HomeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="flex min-h-svh w-full flex-col">
        <header className="flex w-full gap-4 border-b p-4">
          <TooltipWrapper label="Toggle Sidebar">
            <SidebarTrigger className="size-9 shrink-0" />
          </TooltipWrapper>

          <form action="/search" className="flex-1">
            <Input
              placeholder="Search"
              className="flex-1"
              name="query"
              minLength={1}
              required
              min={1}
            />
          </form>
        </header>

        <div className="flex flex-1 flex-col">{children}</div>
      </main>
    </SidebarProvider>
  );
}
