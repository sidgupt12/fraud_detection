import { useEffect, useState } from "react";
import { AppShell } from "./components/layout/AppShell";
import { Preloader } from "./components/layout/Preloader";
import { Home } from "./components/pages/Home";

const PRELOADER_FLAG = "fraudsentinel.preloader.seen";

export default function App() {
  const [showPreloader, setShowPreloader] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return sessionStorage.getItem(PRELOADER_FLAG) !== "1";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (!showPreloader) return;
    try {
      sessionStorage.setItem(PRELOADER_FLAG, "1");
    } catch {
      /* private mode / disabled storage — fine, just show it again next time */
    }
  }, [showPreloader]);

  return (
    <>
      <AppShell>
        <Home />
      </AppShell>
      {showPreloader && <Preloader onDone={() => setShowPreloader(false)} />}
    </>
  );
}
