import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col px-10 py-14 md:px-32">
        <div className="rounded-md border-2 p-4 shadow-sm">
          <h1 className="text-lg font-bold">Home</h1>
        </div>
      </main>
    </HydrateClient>
  );
}
