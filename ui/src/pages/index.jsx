import { useEffect, useState } from "react";
import DesktopApp from "@/components/desktop/DesktopApp";
import MobileApp from "@/components/mobile/MobileApp";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile ? <MobileApp /> : <DesktopApp />;
}
