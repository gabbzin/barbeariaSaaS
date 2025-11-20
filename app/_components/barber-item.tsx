import Image from "next/image";
import { Barber } from "@/generated/prisma";
import Link from "next/link";

interface BarberItemProps {
  barber: Barber;
}

const BarberItem = ({ barber }: BarberItemProps) => {
  return (
    <Link
      href={`/barbershops/${barber.id}`}
      className="relative min-h-[200px] min-w-[290px] rounded-xl"
    >
      <div className="absolute top-0 left-0 z-10 h-full w-full rounded-lg bg-linear-to-t from-black to-transparent"></div>
      <Image
        src={barber.imageUrl}
        alt={barber.name}
        fill // Usamos fill para a imagem ocupar todo o espaço do container pai quando este tiver position relative
        className="rounded-xl object-cover"
      />
      <div className="absolute right-0 bottom-0 left-0 z-20 p-4">
        <h3 className="text-background text-lg font-bold">{barber.name}</h3>
      </div>
    </Link>
  );
};

export default BarberItem;
