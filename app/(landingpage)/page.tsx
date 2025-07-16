import { NavigationMenu } from "@/components/ui/navigation-menu";
import Image from "next/image";
import Hero from "../componets/hero";

export default function Home() {
  return (
    <div className="min-h-screen px-5 pb-20 font-[family-name:var(--font-geist-sans)]">
      <main>
        <Hero/>
      </main>
    </div>
  );
}
