import Image from 'next/image';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center">
      <Image
        src="/icons/logo.png"
        width={50}
        height={50}
        alt="Logo MicroRota"
        priority
      />
      <p className="font-bold text-inherit">MicroRota</p>
    </Link>
  );
}
