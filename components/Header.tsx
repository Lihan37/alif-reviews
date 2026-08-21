import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/src/config/site";

export function Header() {
  return <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
    <Link href="/" className="flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burgundy">
      <Image src={siteConfig.logoPath} alt="" width={44} height={44} priority />
      <span><strong className="block font-serif text-xl leading-5">{siteConfig.restaurantName}</strong><small className="text-xs tracking-[0.16em] text-stone-500 uppercase">Guest feedback</small></span>
    </Link>
  </header>;
}
