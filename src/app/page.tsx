// 'use client'

import { authClient } from "@/lib/auth-client";
import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";

export default  async function Home() {
  const session = await requireAuth();
  const data = await caller.getUsers()
  // const users  = await caller.getUsers();
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1>hello world</h1>
      {JSON.stringify(data)}
      {/* <button
        onClick={() => authClient.signOut()}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Logout
      </button> */}
    </div>
  );
}
