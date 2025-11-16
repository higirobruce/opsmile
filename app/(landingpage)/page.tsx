import { NavigationMenu } from "@/components/ui/navigation-menu";
import Image from "next/image";
import Hero from "../componets/hero";

export default function Home() {
  return (
    <div className="z-99999 relative min-h-screen w-full font-[family-name:var(--font-geist-sans)]">
      <main>
        <Hero/>
      </main>
    </div>
  );
}
