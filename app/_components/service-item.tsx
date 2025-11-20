"use client";

import Image from "next/image";
import { BarberService, Barber } from "@/generated/prisma";
import { Button } from "./ui/button";
import { Sheet, SheetTrigger } from "./ui/sheet";
import { useState } from "react";
import AppointmentSheet from "./appointment-sheet";

interface ServiceItemProps {
  service: BarberService & {
    barber: Barber;
  };
}

export function ServiceItem({ service }: ServiceItemProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const priceInReais = (service.priceInCents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <div className="border-border bg-card flex items-center justify-center gap-3 rounded-2xl border border-solid p-3">
        <div className="relative size-[110px] shrink-0 overflow-hidden rounded-[10px]">
          <Image
            src={service.imageUrl}
            alt={service.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex grow basis-0 flex-row items-center self-stretch">
          <div className="relative flex h-full min-h-0 min-w-0 grow basis-0 flex-col items-start justify-between">
            <div className="flex h-[67.5px] w-full flex-col items-start gap-1 text-sm leading-[1.4]">
              <p className="text-card-foreground w-full font-bold">
                {service.name}
              </p>
              <p className="text-muted-foreground w-full font-normal">
                {service.description}
              </p>
            </div>

            <div className="flex w-full items-center justify-between">
              <p className="text-card-foreground text-sm leading-[1.4] font-bold whitespace-pre">
                {priceInReais}
              </p>
              <SheetTrigger asChild>
                <Button className="rounded-full px-4 py-2">Reservar</Button>
              </SheetTrigger>
            </div>
          </div>
        </div>
      </div>
      <AppointmentSheet setSheetOpen={setSheetOpen} service={service} />
    </Sheet>
  );
}
