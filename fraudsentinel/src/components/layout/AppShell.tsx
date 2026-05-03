import type { ReactNode } from "react";
import { AnimatedBackground } from "./AnimatedBackground";
import { Navbar } from "./Navbar";
import { StatusBar } from "./StatusBar";

interface Props {
  children: ReactNode;
}

export function AppShell({ children }: Props) {
  return (
    <div className="relative flex min-h-screen flex-col text-ink">
      <AnimatedBackground />
      <Navbar />
      <main className="mx-auto w-full max-w-[1240px] flex-1 px-5 pb-20 pt-6 md:px-7">
        {children}
      </main>
      <StatusBar />
    </div>
  );
}
