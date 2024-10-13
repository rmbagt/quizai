import { getServerAuthSession } from "~/server/auth";
import Navbar from "./navbar";
import Sidebar from "./sidebar";

export default async function Dashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  return (
    <main className={`flex h-dvh w-full flex-col`}>
      <Navbar session={session} />
      <div className="relative flex h-full w-full overflow-auto">
        <Sidebar />
        <div className="w-full overflow-auto">{children}</div>
      </div>
    </main>
  );
}
