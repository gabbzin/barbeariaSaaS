"use client";

import Image from "next/image";
import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { cancelBooking } from "@/app/_actions/cancel-booking";
import { PhoneItem } from "./phone-item";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";
import { Avatar, AvatarImage } from "./ui/avatar";

interface CancelBookingProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: {
    id: string;
    date: Date;
    service: {
      name: string;
      priceInCents: number;
    };
    barbershop: {
      name: string;
      address: string;
      imageUrl: string;
      phones: string[];
    };
  };
  status: "confirmed" | "finished";
}

export function CancelBooking({
  open,
  onOpenChange,
  booking,
  status,
}: CancelBookingProps) {
  const [isLoading, setIsLoading] = useState(false);

  const { execute: executeCancelBooking } = useAction(cancelBooking, {
    onSuccess: () => {
      toast.success("Reserva cancelada com sucesso!");
      onOpenChange(false);
      window.location.reload();
    },
    onError: () => {
      toast.error("Erro ao cancelar reserva.");
      setIsLoading(false);
    },
  });

  const handleCancelBooking = () => {
    setIsLoading(true);
    executeCancelBooking({ bookingId: booking.id });
  };

  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(booking.service.priceInCents / 100);

  const formattedDate = booking.date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
  });

  const formattedTime = booking.date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[90%] max-w-[370px] overflow-y-auto p-0">
        <SheetHeader className="px-5 py-6 text-left">
          <SheetTitle>Informações da Reserva</SheetTitle>
          <SheetDescription className="sr-only">
            Detalhes da sua reserva
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 px-5 py-6">
          {/* Imagem do Mapa e Card da Barbearia */}
          <div className="relative h-[180px] w-full overflow-hidden rounded-lg">
            <Image
              src="/map.png"
              alt="Mapa"
              fill
              className="object-cover"
              quality={100}
            />
            <Card className="absolute bottom-5 left-1/2 flex w-[calc(100%-40px)] -translate-x-1/2 items-center gap-3 p-5">
              <Avatar className="size-12">
                <AvatarImage src={booking.barbershop.imageUrl} />
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <h3 className="truncate font-bold">
                  {booking.barbershop.name}
                </h3>
                <p className="truncate text-xs">{booking.barbershop.address}</p>
              </div>
            </Card>
          </div>

          {/* Badge de Status */}
          <Badge
            variant={status === "confirmed" ? "default" : "secondary"}
            className="w-fit text-xs font-semibold tracking-tight uppercase"
          >
            {status === "confirmed" ? "Confirmado" : "Finalizado"}
          </Badge>

          {/* Card de Informações do Agendamento */}
          <Card className="flex flex-col gap-3 p-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">{booking.service.name}</h3>
              <p className="text-sm font-bold">{formattedPrice}</p>
            </div>
            <div className="text-muted-foreground flex items-center justify-between text-sm">
              <p>Data</p>
              <p className="text-right">{formattedDate}</p>
            </div>
            <div className="text-muted-foreground flex items-center justify-between text-sm">
              <p>Horário</p>
              <p className="text-right">{formattedTime}</p>
            </div>
            <div className="text-muted-foreground flex items-center justify-between text-sm">
              <p>Barbearia</p>
              <p className="text-right">{booking.barbershop.name}</p>
            </div>
          </Card>

          {/* Telefones */}
          <div className="flex flex-col gap-3">
            {booking.barbershop.phones.map((phone) => (
              <PhoneItem key={phone} phone={phone} />
            ))}
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-3 px-5 py-6">
          <Button
            variant="outline"
            className="flex-1 rounded-full"
            onClick={() => onOpenChange(false)}
          >
            Voltar
          </Button>
          {status === "confirmed" && (
            <Button
              variant="destructive"
              className="flex-1 rounded-full"
              onClick={handleCancelBooking}
              disabled={isLoading}
            >
              {isLoading ? "Cancelando..." : "Cancelar Reserva"}
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
