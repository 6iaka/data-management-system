import AppSidebar from "~/components/AppSidebar";
import TooltipWrapper from "~/components/TooltipWrapper";
import { Input } from "~/components/ui/input";
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { getAllTags } from "~/server/actions/tag_action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export default async function HomeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const tags = await getAllTags();

  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="flex min-h-svh w-full flex-col">
        <header className="flex w-full flex-col gap-4 border-b p-4 sm:flex-row">
          <TooltipWrapper label="Toggle Sidebar">
            <SidebarTrigger className="size-9 shrink-0" />
          </TooltipWrapper>

          <form action="/search" className="flex w-full flex-1 flex-wrap gap-2">
            <Input
              placeholder="Search"
              className="min-w-[180px] flex-1 py-2 text-sm"
              name="query"
              minLength={1}
              required
              min={1}
            />

            <Select name="tag">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tag" />
              </SelectTrigger>
              <SelectContent>
                {tags.map((item) => (
                  <SelectItem key={item.id} value={item.name}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </form>
        </header>

        <div className="flex flex-1 flex-col">{children}</div>
      </main>
    </SidebarProvider>
  );
}
