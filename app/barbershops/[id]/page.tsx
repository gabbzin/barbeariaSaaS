import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ServiceItem } from "@/app/_components/service-item";
import { Button } from "@/app/_components/ui/button";
import { Separator } from "@/app/_components/ui/separator";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { PhoneItem } from "@/app/_components/phone-item";
import Footer from "@/app/_components/footer";

const BarberPage = async (props: PageProps<"/barbershops/[id]">) => {
  const { id } = await props.params;

  const barber = await prisma.barber.findUnique({
    where: {
      id,
    },
    include: {
      services: true,
    },
  });

  if (!barber) {
    return notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header com Banner */}
      <div className="relative h-[297px] w-full">
        <Image
          src={barber.imageUrl}
          alt={barber.name}
          fill
          className="object-cover"
          priority
        />

        {/* Botão Voltar */}
        <div className="absolute top-6 left-5">
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full"
            asChild
          >
            <Link href="/">
              <ChevronLeft className="size-5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Container Principal */}
      <div className="bg-background relative -mt-6 flex flex-col gap-6 rounded-t-3xl">
        {/* Informações da Barbearia */}
        <div className="px-5 pt-6">
          <div className="mb-1 flex items-center gap-2">
            <div className="relative size-[30px] overflow-hidden rounded-full">
              <Image
                src={barber.imageUrl}
                alt={barber.name}
                fill
                className="object-cover"
              />
            </div>
            <h1 className="text-foreground text-xl font-bold">{barber.name}</h1>
          </div>
          {/* <p className="text-muted-foreground text-sm">{barber.address}</p> */}
        </div>

        <Separator />

        {/* Sobre Nós */}
        {/* <div className="space-y-3 px-5">
          <h2 className="text-foreground text-xs font-bold uppercase">
            Sobre Nós
          </h2>
          <p className="text-foreground text-sm leading-relaxed">
            {barber.description}
          </p>
        </div> */}

        <Separator />

        {/* Serviços */}
        <div className="space-y-3 px-5">
          <h2 className="text-foreground text-xs font-bold uppercase">
            Serviços
          </h2>
          <div className="space-y-3">
            {barber.services.map((service) => (
              <ServiceItem
                key={service.id}
                service={{ ...service, barbershop: barber }}
              />
            ))}
          </div>
        </div>

        <Separator />

        {/* Contato */}
        <div className="space-y-3 px-5">
          <h2 className="text-foreground text-xs font-bold uppercase">
            Contato
          </h2>
          <div className="space-y-3">
            {barber.phone.map((phone, index) => (
              <div
                key={index}
                className="flex w-full flex-col items-center justify-between"
              >
                <PhoneItem phone={phone} />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default BarberPage;
