"use client"

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [env, setEnv] = useState<{ secret: string; password: string } | null>(null);

  useEffect(() => {
    fetch(`/api/test-env`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setEnv(data))
      .catch(() => setEnv({ secret: "ERROR_FETCHING", password: "ERROR_FETCHING" }));
  }, []);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 mt-12 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Public Environment
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            {`NEXT_PUBLIC_BRANCH=${process.env.NEXT_PUBLIC_BRANCH}`}
          </p>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            {`NEXT_PUBLIC_USERNAME=${process.env.NEXT_PUBLIC_USERNAME}`}
          </p>
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Private Environment
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            {`SECRET_STRING=${env?.secret ?? "loading..."}`}
          </p>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            {`PASSWORD=${env?.password ?? "loading..."}`}
          </p>
        </div>
      </main>
    </div>
  );
}
