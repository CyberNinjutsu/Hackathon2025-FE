import Image from "next/image";
import Link from "next/link";
import images from "@/assets/iconheader.png";

const Logo = () => (
  <Link href="/" className="flex items-center gap-2">
    <Image src={images} alt="Logo" className="h-7 w-7 text-primary" />
    <span className="text-xl hidden xl:block font-bold text-foreground">
      Cryptix
    </span>
  </Link>
);

export default Logo;
