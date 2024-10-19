import "~/styles/globals.css";

import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/layout/app-sidebar";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/app");
  }

  return (
    <SidebarProvider>
      <AppSidebar session={session} props={{}} />
      <main className="w-full">
        <SidebarTrigger className="absolute m-4" />
        {children}
      </main>
    </SidebarProvider>
  );
}
